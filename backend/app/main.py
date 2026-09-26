from datetime import datetime, timedelta
import uuid
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.session import engine, Base, SessionLocal
from app.models.db_models import (
    UserDB, WorkerDB, WristbandDB, CartridgeDB,
    SensorReadingDB, CalibrationModelDB, AlertDB
)
from app.api.endpoints import router as api_router

# Initialize FastAPI App
app = FastAPI(
    title="H2Safe API - AI-Powered Passive H₂S Exposure Monitoring System",
    description="Backend API providing Computer Vision colorimetric analysis, calibration regression modeling, cumulative exposure tracking, and safety alerting for H₂S wristband sensors.",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

def seed_demo_data():
    """Seed initial demo worker, wristband, cartridge, historical readings, and alerts."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Seed Demo User & Worker
        worker = db.query(WorkerDB).filter(WorkerDB.worker_id == "WRK-108").first()
        if not worker:
            worker = WorkerDB(
                worker_id="WRK-108",
                full_name="Alex Mercer",
                email="alex.mercer@refinery.io",
                organization="Industrial Safety Corp",
                department="Chemical Operations & Refining",
                workplace="Petrochemical Complex - Unit 4",
                wristband_id="HB-001",
                total_scans=6,
                cumulative_ppm_hr=18.4,
                max_h2s_ppm=8.5
            )
            db.add(worker)
            db.commit()
            db.refresh(worker)

            user = UserDB(
                email="demo@h2safe.io",
                password_hash="demo123",
                full_name="Alex Mercer",
                role="worker"
            )
            db.add(user)

        # 2. Seed Wristband & Cartridge
        wb = db.query(WristbandDB).filter(WristbandDB.wristband_id == "HB-001").first()
        if not wb:
            wb = WristbandDB(
                wristband_id="HB-001",
                worker_id_str="WRK-108",
                status="ACTIVE",
                current_cartridge_id="CART-001"
            )
            db.add(wb)

        cart = db.query(CartridgeDB).filter(CartridgeDB.cartridge_id == "CART-001").first()
        if not cart:
            cart = CartridgeDB(
                cartridge_id="CART-001",
                wristband_id_str="HB-001",
                installation_date=datetime.utcnow() - timedelta(days=4),
                scans_count=6,
                cumulative_exposure_ppm_hr=18.4,
                status="ACTIVE"
            )
            db.add(cart)

        # 3. Seed Initial Demo Historical Readings if empty
        existing_readings = db.query(SensorReadingDB).filter(SensorReadingDB.worker_id_str == "WRK-108").count()
        if existing_readings == 0:
            sample_readings = [
                {"days_ago": 4, "ppm": 1.2, "delta_e": 5.4, "risk": "SAFE", "cum": 1.2},
                {"days_ago": 3, "ppm": 2.1, "delta_e": 9.2, "risk": "SAFE", "cum": 3.3},
                {"days_ago": 2, "ppm": 3.5, "delta_e": 14.8, "risk": "SAFE", "cum": 6.8},
                {"days_ago": 1, "ppm": 5.8, "delta_e": 21.2, "risk": "ATTENTION", "cum": 12.6},
                {"days_ago": 0, "hours_ago": 5, "ppm": 3.0, "delta_e": 13.5, "risk": "SAFE", "cum": 15.6},
                {"days_ago": 0, "hours_ago": 1, "ppm": 2.8, "delta_e": 12.6, "risk": "SAFE", "cum": 18.4},
            ]

            for sr in sample_readings:
                delta_t = timedelta(days=sr.get("days_ago", 0), hours=sr.get("hours_ago", 0))
                ts = datetime.utcnow() - delta_t
                
                r = SensorReadingDB(
                    reading_id=f"SCN-{uuid.uuid4().hex[:8].upper()}",
                    worker_id_str="WRK-108",
                    wristband_id_str="HB-001",
                    cartridge_id_str="CART-001",
                    timestamp=ts,
                    mean_r=180.0 - (sr["delta_e"] * 2),
                    mean_g=140.0 - (sr["delta_e"] * 1.8),
                    mean_b=110.0 - (sr["delta_e"] * 1.5),
                    mean_l=68.0 - (sr["delta_e"] * 0.8),
                    mean_a=12.0 - (sr["delta_e"] * 0.1),
                    mean_lab_b=18.0 + (sr["delta_e"] * 0.2),
                    delta_e=sr["delta_e"],
                    saturation=25.0,
                    brightness=60.0,
                    color_variance=12.0,
                    estimated_h2s_ppm=sr["ppm"],
                    exposure_duration_hrs=1.0,
                    exposure_contribution_ppm_hr=sr["ppm"],
                    cumulative_exposure_ppm_hr=sr["cum"],
                    risk_level=sr["risk"],
                    confidence=0.88,
                    image_quality="GOOD",
                    model_version="demo-v1.0",
                    is_demo=True
                )
                db.add(r)

            # Seed Demo Alert
            alert = AlertDB(
                alert_id="ALT-DEMO-01",
                worker_id_str="WRK-108",
                level="ATTENTION",
                message="Exposure level requires attention. H₂S concentration at 5.8 ppm recorded yesterday.",
                h2s_ppm=5.8,
                cumulative_ppm_hr=12.6,
                timestamp=datetime.utcnow() - timedelta(days=1),
                acknowledged=False
            )
            db.add(alert)

        db.commit()
    finally:
        db.close()

@app.on_event("startup")
def startup_event():
    seed_demo_data()

@app.get("/")
def root():
    return {
        "system": "H2Safe - AI-Powered Passive H₂S Exposure Monitoring System",
        "status": "OPERATIONAL",
        "mode": "Research & Prototype Demonstration",
        "docs_url": "/docs"
    }
