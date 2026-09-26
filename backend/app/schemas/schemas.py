from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr
from datetime import datetime

# Auth Schemas
class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    full_name: str
    worker_id: str
    organization: str = "Industrial Safety Corp"
    department: str = "Chemical Operations"
    workplace: str = "Refinery Plant A"
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    worker_id: Optional[str] = None

# Computer Vision & Analysis Schemas
class ImageQualityCheck(BaseModel):
    lighting: str  # GOOD, POOR
    focus: str     # GOOD, POOR
    alignment: str # GOOD, POOR
    strip_detected: bool
    reference_patches_detected: bool
    overall_valid: bool
    message: Optional[str] = None

class ColorFeatures(BaseModel):
    mean_rgb: List[float]
    median_rgb: List[float]
    mean_lab: List[float]  # [L*, a*, b*]
    delta_e: float
    saturation: float
    brightness: float
    color_variance: float

class AnalyzeRequest(BaseModel):
    image_b64: str
    worker_id: str = "WRK-108"
    wristband_id: str = "HB-001"
    cartridge_id: str = "CART-001"
    exposure_duration_hrs: float = 1.0

class AnalyzeResponse(BaseModel):
    reading_id: str
    estimated_h2s_ppm: float
    delta_e: float
    exposure_ppm_hr: float
    cumulative_exposure_ppm_hr: float
    risk_level: str
    confidence: float
    image_quality: str
    model_version: str
    color_features: ColorFeatures
    quality_checks: ImageQualityCheck
    processed_image_b64: Optional[str] = None
    timestamp: str

# Dashboard & Reading Schemas
class ReadingSchema(BaseModel):
    id: int
    reading_id: str
    worker_id_str: str
    wristband_id_str: str
    cartridge_id_str: str
    timestamp: str
    estimated_h2s_ppm: float
    exposure_contribution_ppm_hr: float
    cumulative_exposure_ppm_hr: float
    delta_e: float
    risk_level: str
    confidence: float
    image_quality: str
    model_version: str
    is_demo: bool = False
    mean_rgb: List[float]
    mean_lab: List[float]

class DashboardResponse(BaseModel):
    worker_id: str
    worker_name: str
    current_risk_status: str # SAFE, ATTENTION, HIGH, CRITICAL
    latest_estimated_h2s_ppm: float
    cumulative_exposure_ppm_hr: float
    last_scan_time: str
    cartridge_id: str
    cartridge_status: str
    cartridge_age_days: int
    total_scans: int
    exposure_today_ppm_hr: float
    exposure_7d_ppm_hr: float
    exposure_30d_ppm_hr: float

# Wristband & Cartridge Schemas
class CartridgeSchema(BaseModel):
    id: int
    cartridge_id: str
    wristband_id_str: str
    installation_date: str
    replacement_date: Optional[str] = None
    scans_count: int
    cumulative_exposure_ppm_hr: float
    calibration_version: str
    status: str

class WristbandSchema(BaseModel):
    id: int
    wristband_id: str
    worker_id_str: str
    status: str
    current_cartridge_id: Optional[str]
    registered_at: str
    active_cartridge: Optional[CartridgeSchema] = None

class WristbandRegisterSchema(BaseModel):
    wristband_id: str
    worker_id: str
    cartridge_id: str

class CartridgeReplaceSchema(BaseModel):
    wristband_id: str
    new_cartridge_id: str

# Calibration Schemas
class CalibrationPointSchema(BaseModel):
    patch_name: str
    target_ppm: float
    exposure_duration_hrs: float
    ppm_hr: float
    color_hex: str
    r: float
    g: float
    b: float
    l_val: float
    a_val: float
    b_val: float
    delta_e: float

class CalibrationModelSchema(BaseModel):
    id: int
    model_name: str
    version: str
    training_date: str
    model_type: str
    r2_score: float
    mae: float
    rmse: float
    is_active: bool
    points: List[CalibrationPointSchema] = []

class TrainModelRequest(BaseModel):
    model_name: str
    model_type: str = "Linear Regression" # Linear Regression, Random Forest, Gradient Boosting
    csv_data: Optional[str] = None

# Alert Schemas
class AlertSchema(BaseModel):
    id: int
    alert_id: str
    worker_id_str: str
    reading_id_str: Optional[str]
    level: str
    message: str
    h2s_ppm: float
    cumulative_ppm_hr: float
    timestamp: str
    acknowledged: bool
    acknowledged_at: Optional[str] = None
