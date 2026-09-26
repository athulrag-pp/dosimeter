from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="worker")
    created_at = Column(DateTime, default=datetime.utcnow)

class WorkerDB(Base):
    __tablename__ = "workers"

    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    organization = Column(String, default="Industrial Safety Corp")
    department = Column(String, default="Chemical Operations")
    workplace = Column(String, default="Refinery Plant A")
    wristband_id = Column(String, nullable=True)
    total_scans = Column(Integer, default=0)
    cumulative_ppm_hr = Column(Float, default=0.0)
    max_h2s_ppm = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    wristbands = relationship("WristbandDB", back_populates="worker", cascade="all, delete-orphan")
    readings = relationship("SensorReadingDB", back_populates="worker", cascade="all, delete-orphan")
    alerts = relationship("AlertDB", back_populates="worker", cascade="all, delete-orphan")

class WristbandDB(Base):
    __tablename__ = "wristbands"

    id = Column(Integer, primary_key=True, index=True)
    wristband_id = Column(String, unique=True, index=True, nullable=False)
    worker_id_str = Column(String, ForeignKey("workers.worker_id"), nullable=False)
    status = Column(String, default="ACTIVE") # ACTIVE, INACTIVE, UNPAIRED
    current_cartridge_id = Column(String, nullable=True)
    registered_at = Column(DateTime, default=datetime.utcnow)

    worker = relationship("WorkerDB", back_populates="wristbands")
    cartridges = relationship("CartridgeDB", back_populates="wristband", cascade="all, delete-orphan")

class CartridgeDB(Base):
    __tablename__ = "cartridges"

    id = Column(Integer, primary_key=True, index=True)
    cartridge_id = Column(String, unique=True, index=True, nullable=False)
    wristband_id_str = Column(String, ForeignKey("wristbands.wristband_id"), nullable=False)
    installation_date = Column(DateTime, default=datetime.utcnow)
    replacement_date = Column(DateTime, nullable=True)
    scans_count = Column(Integer, default=0)
    cumulative_exposure_ppm_hr = Column(Float, default=0.0)
    calibration_version = Column(String, default="demo-v1.0")
    status = Column(String, default="ACTIVE") # ACTIVE, EXPIRED, REPLACED

    wristband = relationship("WristbandDB", back_populates="cartridges")

class SensorReadingDB(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    reading_id = Column(String, unique=True, index=True, nullable=False)
    worker_id_str = Column(String, ForeignKey("workers.worker_id"), nullable=False)
    wristband_id_str = Column(String, nullable=False)
    cartridge_id_str = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Computer vision & color metrics
    mean_r = Column(Float, nullable=False)
    mean_g = Column(Float, nullable=False)
    mean_b = Column(Float, nullable=False)
    mean_l = Column(Float, nullable=False)
    mean_a = Column(Float, nullable=False)
    mean_lab_b = Column(Float, nullable=False) # Lab b* channel
    delta_e = Column(Float, nullable=False)
    saturation = Column(Float, default=0.0)
    brightness = Column(Float, default=0.0)
    color_variance = Column(Float, default=0.0)

    # Exposure Estimation
    estimated_h2s_ppm = Column(Float, nullable=False)
    exposure_duration_hrs = Column(Float, default=1.0)
    exposure_contribution_ppm_hr = Column(Float, nullable=False)
    cumulative_exposure_ppm_hr = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False) # SAFE, ATTENTION, HIGH, CRITICAL
    confidence = Column(Float, default=0.85)
    image_quality = Column(String, default="GOOD") # GOOD, ACCEPTABLE, POOR
    model_version = Column(String, default="demo-v1.0")
    is_demo = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    image_b64 = Column(Text, nullable=True) # Optional stored crop preview

    worker = relationship("WorkerDB", back_populates="readings")

class CalibrationModelDB(Base):
    __tablename__ = "calibration_models"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String, nullable=False)
    version = Column(String, unique=True, nullable=False)
    training_date = Column(DateTime, default=datetime.utcnow)
    model_type = Column(String, default="Linear Regression") # Linear Regression, Random Forest, Gradient Boosting
    r2_score = Column(Float, default=0.95)
    mae = Column(Float, default=0.15)
    rmse = Column(Float, default=0.22)
    is_active = Column(Boolean, default=True)
    parameters_json = Column(Text, nullable=True)

    points = relationship("CalibrationPointDB", back_populates="model", cascade="all, delete-orphan")

class CalibrationPointDB(Base):
    __tablename__ = "calibration_points"

    id = Column(Integer, primary_key=True, index=True)
    model_id = Column(Integer, ForeignKey("calibration_models.id"), nullable=False)
    patch_name = Column(String, nullable=False)
    target_ppm = Column(Float, nullable=False)
    exposure_duration_hrs = Column(Float, default=1.0)
    ppm_hr = Column(Float, nullable=False)
    color_hex = Column(String, nullable=False)
    r = Column(Float, nullable=False)
    g = Column(Float, nullable=False)
    b = Column(Float, nullable=False)
    l_val = Column(Float, nullable=False)
    a_val = Column(Float, nullable=False)
    b_val = Column(Float, nullable=False)
    delta_e = Column(Float, nullable=False)

    model = relationship("CalibrationModelDB", back_populates="points")

class AlertDB(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(String, unique=True, index=True, nullable=False)
    worker_id_str = Column(String, ForeignKey("workers.worker_id"), nullable=False)
    reading_id_str = Column(String, nullable=True)
    level = Column(String, nullable=False) # ATTENTION, HIGH, CRITICAL
    message = Column(String, nullable=False)
    h2s_ppm = Column(Float, nullable=False)
    cumulative_ppm_hr = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    acknowledged = Column(Boolean, default=False)
    acknowledged_at = Column(DateTime, nullable=True)

    worker = relationship("WorkerDB", back_populates="alerts")
