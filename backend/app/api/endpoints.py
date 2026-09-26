from datetime import datetime, timedelta
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.session import get_db
from app.models.db_models import (
    UserDB, WorkerDB, WristbandDB, CartridgeDB,
    SensorReadingDB, CalibrationModelDB, CalibrationPointDB, AlertDB
)
from app.schemas.schemas import (
    LoginRequest, SignupRequest, UserResponse,
    AnalyzeRequest, AnalyzeResponse, ReadingSchema,
    DashboardResponse, WristbandSchema, CartridgeSchema,
    WristbandRegisterSchema, CartridgeReplaceSchema,
    CalibrationModelSchema, TrainModelRequest, AlertSchema,
    ImageQualityCheck, ColorFeatures
)
from app.cv.pipeline import process_sensor_image, cv2_to_base64, draw_roi_highlights
from app.ml.calibration import calibration_engine, DEMO_CALIBRATION_POINTS

router = APIRouter(prefix="/api")

# --- AUTH ENDPOINTS ---

@router.post("/auth/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.email == req.email).first()
    if not user:
        # Default fallback demo login support for seamless testing
        if req.email == "demo@h2safe.io" or req.email == "worker@h2safe.io":
            return {
                "token": "demo-jwt-token-h2safe-2026",
                "user": {
                    "id": 1,
                    "email": req.email,
                    "full_name": "Alex Mercer (Demo Worker)",
                    "role": "worker",
                    "worker_id": "WRK-108"
                }
            }
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {
        "token": f"jwt-token-{user.id}",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "worker_id": "WRK-108"
        }
    }

@router.post("/auth/register")
def register(req: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(UserDB).filter(UserDB.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    new_user = UserDB(
        email=req.email,
        password_hash=req.password, # Note: Demo simplicity
        full_name=req.full_name,
        role="worker"
    )
    db.add(new_user)
    
    existing_worker = db.query(WorkerDB).filter(WorkerDB.worker_id == req.worker_id).first()
    if not existing_worker:
        new_worker = WorkerDB(
            worker_id=req.worker_id,
            full_name=req.full_name,
            email=req.email,
            organization=req.organization,
            department=req.department,
            workplace=req.workplace,
            wristband_id="HB-001"
        )
        db.add(new_worker)
        
    db.commit()
    return {"message": "Registration successful", "worker_id": req.worker_id}

# --- DASHBOARD & WORKER ENDPOINTS ---

@router.get("/dashboard/{worker_id}", response_model=DashboardResponse)
def get_dashboard(worker_id: str, db: Session = Depends(get_db)):
    worker = db.query(WorkerDB).filter(WorkerDB.worker_id == worker_id).first()
    if not worker:
        # Fallback worker creation if not found
        worker = WorkerDB(
            worker_id=worker_id,
            full_name="Alex Mercer",
            email="alex.mercer@refinery.io",
            wristband_id="HB-001"
        )
        db.add(worker)
        db.commit()
        db.refresh(worker)

    latest_reading = db.query(SensorReadingDB).filter(
        SensorReadingDB.worker_id_str == worker_id
    ).order_by(desc(SensorReadingDB.timestamp)).first()

    current_risk = worker.readings[-1].risk_level if worker.readings else "SAFE"
    latest_ppm = latest_reading.estimated_h2s_ppm if latest_reading else 0.0
    last_scan_str = latest_reading.timestamp.strftime("%b %d, %Y %I:%M %p") if latest_reading else "No scans yet"

    # Calculate time-window exposures
    now = datetime.utcnow()
    readings = db.query(SensorReadingDB).filter(SensorReadingDB.worker_id_str == worker_id).all()
    
    exp_today = sum(r.exposure_contribution_ppm_hr for r in readings if (now - r.timestamp).days < 1)
    exp_7d = sum(r.exposure_contribution_ppm_hr for r in readings if (now - r.timestamp).days < 7)
    exp_30d = sum(r.exposure_contribution_ppm_hr for r in readings if (now - r.timestamp).days < 30)

    cartridge = db.query(CartridgeDB).filter(
        CartridgeDB.wristband_id_str == (worker.wristband_id or "HB-001"),
        CartridgeDB.status == "ACTIVE"
    ).first()

    cartridge_id = cartridge.cartridge_id if cartridge else "CART-001"
    cartridge_status = cartridge.status if cartridge else "ACTIVE"
    cartridge_age = (now - cartridge.installation_date).days if cartridge else 4

    return DashboardResponse(
        worker_id=worker.worker_id,
        worker_name=worker.full_name,
        current_risk_status=current_risk,
        latest_estimated_h2s_ppm=round(latest_ppm, 2),
        cumulative_exposure_ppm_hr=round(worker.cumulative_ppm_hr, 2),
        last_scan_time=last_scan_str,
        cartridge_id=cartridge_id,
        cartridge_status=cartridge_status,
        cartridge_age_days=cartridge_age,
        total_scans=len(readings),
        exposure_today_ppm_hr=round(exp_today, 2),
        exposure_7d_ppm_hr=round(exp_7d, 2),
        exposure_30d_ppm_hr=round(exp_30d, 2)
    )

# --- SCANNER & COMPUTER VISION ANALYSIS ENDPOINT ---

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_sensor_image(req: AnalyzeRequest, db: Session = Depends(get_db)):
    # 1. Run CV pipeline
    try:
        cv_result = process_sensor_image(req.image_b64)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image processing failed: {str(e)}")

    features: ColorFeatures = cv_result["features"]
    quality: ImageQualityCheck = cv_result["quality_checks"]

    # If image quality is unacceptable, return quality error message
    if not quality.overall_valid and not quality.strip_detected:
        raise HTTPException(status_code=422, detail=quality.message or "Image quality too low for exposure estimation.")

    # 2. Pass color features to ML Calibration Engine
    estimated_ppm, confidence, risk_level, model_ver = calibration_engine.predict(features)
    
    # Calculate exposure contribution: ppm * duration_hrs
    exposure_contrib = round(estimated_ppm * req.exposure_duration_hrs, 2)

    # 3. Retrieve Worker and Update Cumulative Exposure
    worker = db.query(WorkerDB).filter(WorkerDB.worker_id == req.worker_id).first()
    if not worker:
        worker = WorkerDB(worker_id=req.worker_id, full_name="Worker User", email="user@h2safe.io")
        db.add(worker)
        db.commit()
        db.refresh(worker)

    new_cumulative = round(worker.cumulative_ppm_hr + exposure_contrib, 2)
    worker.cumulative_ppm_hr = new_cumulative
    worker.total_scans += 1
    worker.max_h2s_ppm = max(worker.max_h2s_ppm, estimated_ppm)

    # Update Cartridge exposure
    cartridge = db.query(CartridgeDB).filter(
        CartridgeDB.cartridge_id == req.cartridge_id
    ).first()
    if cartridge:
        cartridge.cumulative_exposure_ppm_hr = round(cartridge.cumulative_exposure_ppm_hr + exposure_contrib, 2)
        cartridge.scans_count += 1

    # 4. Generate annotated visualization image
    annotated_bgr = draw_roi_highlights(cv_result["raw_bgr"], cv_result["roi_rect"], features, risk_level)
    processed_b64 = cv2_to_base64(annotated_bgr)

    # 5. Store Reading Record in Database
    reading_id = f"SCN-{uuid.uuid4().hex[:8].upper()}"
    new_reading = SensorReadingDB(
        reading_id=reading_id,
        worker_id_str=req.worker_id,
        wristband_id_str=req.wristband_id,
        cartridge_id_str=req.cartridge_id,
        timestamp=datetime.utcnow(),
        mean_r=features.mean_rgb[0],
        mean_g=features.mean_rgb[1],
        mean_b=features.mean_rgb[2],
        mean_l=features.mean_lab[0],
        mean_a=features.mean_lab[1],
        mean_lab_b=features.mean_lab[2],
        delta_e=features.delta_e,
        saturation=features.saturation,
        brightness=features.brightness,
        color_variance=features.color_variance,
        estimated_h2s_ppm=estimated_ppm,
        exposure_duration_hrs=req.exposure_duration_hrs,
        exposure_contribution_ppm_hr=exposure_contrib,
        cumulative_exposure_ppm_hr=new_cumulative,
        risk_level=risk_level,
        confidence=confidence,
        image_quality=quality.lighting if quality.overall_valid else "POOR",
        model_version=model_ver,
        image_b64=processed_b64
    )
    db.add(new_reading)

    # 6. Generate Alert if risk is ATTENTION, HIGH or CRITICAL
    if risk_level in ["ATTENTION", "HIGH", "CRITICAL"]:
        alert_msg = f"Exposure level requires attention! Estimated H₂S: {estimated_ppm} ppm ({risk_level})"
        if risk_level == "CRITICAL":
            alert_msg = f"CRITICAL HAZARD: H₂S concentration at {estimated_ppm} ppm exceeds safe limits!"
        
        new_alert = AlertDB(
            alert_id=f"ALT-{uuid.uuid4().hex[:6].upper()}",
            worker_id_str=req.worker_id,
            reading_id_str=reading_id,
            level=risk_level,
            message=alert_msg,
            h2s_ppm=estimated_ppm,
            cumulative_ppm_hr=new_cumulative
        )
        db.add(new_alert)

    db.commit()

    return AnalyzeResponse(
        reading_id=reading_id,
        estimated_h2s_ppm=estimated_ppm,
        delta_e=features.delta_e,
        exposure_ppm_hr=exposure_contrib,
        cumulative_exposure_ppm_hr=new_cumulative,
        risk_level=risk_level,
        confidence=confidence,
        image_quality="GOOD" if quality.overall_valid else "ACCEPTABLE",
        model_version=model_ver,
        color_features=features,
        quality_checks=quality,
        processed_image_b64=processed_b64,
        timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    )

# --- EXPOSURE & HISTORY ENDPOINTS ---

@router.get("/readings/{worker_id}")
def get_readings_history(worker_id: str, db: Session = Depends(get_db)):
    readings = db.query(SensorReadingDB).filter(
        SensorReadingDB.worker_id_str == worker_id
    ).order_by(desc(SensorReadingDB.timestamp)).all()

    res = []
    for r in readings:
        res.append({
            "id": r.id,
            "reading_id": r.reading_id,
            "worker_id_str": r.worker_id_str,
            "wristband_id_str": r.wristband_id_str,
            "cartridge_id_str": r.cartridge_id_str,
            "timestamp": r.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "estimated_h2s_ppm": r.estimated_h2s_ppm,
            "exposure_contribution_ppm_hr": r.exposure_contribution_ppm_hr,
            "cumulative_exposure_ppm_hr": r.cumulative_exposure_ppm_hr,
            "delta_e": r.delta_e,
            "risk_level": r.risk_level,
            "confidence": r.confidence,
            "image_quality": r.image_quality,
            "model_version": r.model_version,
            "is_demo": r.is_demo,
            "mean_rgb": [r.mean_r, r.mean_g, r.mean_b],
            "mean_lab": [r.mean_l, r.mean_a, r.mean_lab_b]
        })
    return res

@router.get("/analytics/{worker_id}")
def get_analytics(worker_id: str, db: Session = Depends(get_db)):
    readings = db.query(SensorReadingDB).filter(
        SensorReadingDB.worker_id_str == worker_id
    ).order_by(SensorReadingDB.timestamp).all()

    # Time-series data points
    timeline = []
    for r in readings:
        timeline.append({
            "date": r.timestamp.strftime("%b %d %H:%M"),
            "ppm": r.estimated_h2s_ppm,
            "cumulative": r.cumulative_exposure_ppm_hr,
            "risk": r.risk_level
        })

    # Risk breakdown distribution
    risk_counts = {"SAFE": 0, "ATTENTION": 0, "HIGH": 0, "CRITICAL": 0}
    for r in readings:
        if r.risk_level in risk_counts:
            risk_counts[r.risk_level] += 1

    risk_distribution = [
        {"name": k, "count": v} for k, v in risk_counts.items()
    ]

    return {
        "timeline": timeline,
        "risk_distribution": risk_distribution,
        "total_scans": len(readings),
        "calibration_active_model": calibration_engine.model_version
    }

# --- WRISTBAND & CARTRIDGE MANAGEMENT ---

@router.get("/wristbands/{worker_id}")
def get_worker_wristband(worker_id: str, db: Session = Depends(get_db)):
    wb = db.query(WristbandDB).filter(WristbandDB.worker_id_str == worker_id).first()
    if not wb:
        return {
            "wristband_id": "HB-001",
            "worker_id_str": worker_id,
            "status": "ACTIVE",
            "current_cartridge_id": "CART-001",
            "registered_at": datetime.utcnow().strftime("%Y-%m-%d"),
            "cartridge": {
                "cartridge_id": "CART-001",
                "installation_date": (datetime.utcnow() - timedelta(days=4)).strftime("%Y-%m-%d"),
                "scans_count": 8,
                "cumulative_exposure_ppm_hr": 18.4,
                "status": "ACTIVE"
            }
        }
    
    cartridge = db.query(CartridgeDB).filter(
        CartridgeDB.cartridge_id == wb.current_cartridge_id
    ).first()

    return {
        "id": wb.id,
        "wristband_id": wb.wristband_id,
        "worker_id_str": wb.worker_id_str,
        "status": wb.status,
        "current_cartridge_id": wb.current_cartridge_id,
        "registered_at": wb.registered_at.strftime("%Y-%m-%d"),
        "cartridge": {
            "cartridge_id": cartridge.cartridge_id if cartridge else "CART-001",
            "installation_date": cartridge.installation_date.strftime("%Y-%m-%d") if cartridge else "2026-09-20",
            "scans_count": cartridge.scans_count if cartridge else 0,
            "cumulative_exposure_ppm_hr": cartridge.cumulative_exposure_ppm_hr if cartridge else 0.0,
            "status": cartridge.status if cartridge else "ACTIVE"
        } if cartridge else None
    }

@router.post("/cartridges/replace")
def replace_cartridge(req: CartridgeReplaceSchema, db: Session = Depends(get_db)):
    wb = db.query(WristbandDB).filter(WristbandDB.wristband_id == req.wristband_id).first()
    if wb and wb.current_cartridge_id:
        old_cart = db.query(CartridgeDB).filter(CartridgeDB.cartridge_id == wb.current_cartridge_id).first()
        if old_cart:
            old_cart.status = "REPLACED"
            old_cart.replacement_date = datetime.utcnow()

    new_cart = CartridgeDB(
        cartridge_id=req.new_cartridge_id,
        wristband_id_str=req.wristband_id,
        status="ACTIVE"
    )
    db.add(new_cart)

    if wb:
        wb.current_cartridge_id = req.new_cartridge_id

    db.commit()
    return {"message": "Cartridge replacement registered successfully", "cartridge_id": req.new_cartridge_id}

# --- CALIBRATION ENDPOINTS ---

@router.get("/calibration")
def get_calibration_info(db: Session = Depends(get_db)):
    return {
        "model_name": calibration_engine.model_type,
        "version": calibration_engine.model_version,
        "is_active_trained": calibration_engine.is_active_trained,
        "r2_score": calibration_engine.r2,
        "mae": calibration_engine.mae,
        "rmse": calibration_engine.rmse,
        "reference_points": DEMO_CALIBRATION_POINTS
    }

@router.post("/calibration/train")
def train_calibration_model(req: TrainModelRequest, db: Session = Depends(get_db)):
    res = calibration_engine.train_custom_model(
        points_data=DEMO_CALIBRATION_POINTS,
        model_type=req.model_type
    )
    return {
        "message": f"Successfully trained {req.model_type} model",
        "details": res
    }

# --- ALERTS ENDPOINTS ---

@router.get("/alerts/{worker_id}")
def get_worker_alerts(worker_id: str, db: Session = Depends(get_db)):
    alerts = db.query(AlertDB).filter(
        AlertDB.worker_id_str == worker_id
    ).order_by(desc(AlertDB.timestamp)).all()

    return [{
        "id": a.id,
        "alert_id": a.alert_id,
        "worker_id_str": a.worker_id_str,
        "reading_id_str": a.reading_id_str,
        "level": a.level,
        "message": a.message,
        "h2s_ppm": a.h2s_ppm,
        "cumulative_ppm_hr": a.cumulative_ppm_hr,
        "timestamp": a.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        "acknowledged": a.acknowledged,
        "acknowledged_at": a.acknowledged_at.strftime("%Y-%m-%d %H:%M:%S") if a.acknowledged_at else None
    } for a in alerts]

@router.post("/alerts/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(AlertDB).filter(AlertDB.alert_id == alert_id).first()
    if alert:
        alert.acknowledged = True
        alert.acknowledged_at = datetime.utcnow()
        db.commit()
    return {"message": "Alert acknowledged"}
