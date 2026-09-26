export type RiskLevel = 'SAFE' | 'ATTENTION' | 'HIGH' | 'CRITICAL';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  worker_id: string;
}

export interface ColorFeatures {
  mean_rgb: [number, number, number];
  median_rgb: [number, number, number];
  mean_lab: [number, number, number];
  delta_e: number;
  saturation: number;
  brightness: number;
  color_variance: number;
}

export interface ImageQualityCheck {
  lighting: 'GOOD' | 'POOR';
  focus: 'GOOD' | 'POOR';
  alignment: 'GOOD' | 'POOR';
  strip_detected: boolean;
  reference_patches_detected: boolean;
  overall_valid: boolean;
  message?: string;
}

export interface SensorReading {
  id: number;
  reading_id: string;
  worker_id_str: string;
  wristband_id_str: string;
  cartridge_id_str: string;
  timestamp: string;
  estimated_h2s_ppm: number;
  exposure_contribution_ppm_hr: number;
  cumulative_exposure_ppm_hr: number;
  delta_e: number;
  risk_level: RiskLevel;
  confidence: number;
  image_quality: string;
  model_version: string;
  is_demo?: boolean;
  mean_rgb: [number, number, number];
  mean_lab: [number, number, number];
  processed_image_b64?: string;
}

export interface DashboardData {
  worker_id: string;
  worker_name: string;
  current_risk_status: RiskLevel;
  latest_estimated_h2s_ppm: number;
  cumulative_exposure_ppm_hr: number;
  last_scan_time: string;
  cartridge_id: string;
  cartridge_status: string;
  cartridge_age_days: number;
  total_scans: number;
  exposure_today_ppm_hr: number;
  exposure_7d_ppm_hr: number;
  exposure_30d_ppm_hr: number;
}

export interface WristbandData {
  id?: number;
  wristband_id: string;
  worker_id_str: string;
  status: string;
  current_cartridge_id?: string;
  registered_at: string;
  cartridge?: {
    cartridge_id: string;
    installation_date: string;
    scans_count: number;
    cumulative_exposure_ppm_hr: number;
    status: string;
  };
}

export interface CalibrationPoint {
  patch_name: string;
  target_ppm: number;
  exposure_duration_hrs: number;
  ppm_hr: number;
  color_hex: string;
  r: number;
  g: number;
  b: number;
  l_val: number;
  a_val: number;
  b_val: number;
  delta_e: number;
}

export interface CalibrationInfo {
  model_name: string;
  version: string;
  is_active_trained: boolean;
  r2_score: number;
  mae: number;
  rmse: number;
  reference_points: CalibrationPoint[];
}

export interface AlertItem {
  id: number;
  alert_id: string;
  worker_id_str: string;
  reading_id_str?: string;
  level: RiskLevel;
  message: string;
  h2s_ppm: number;
  cumulative_ppm_hr: number;
  timestamp: string;
  acknowledged: boolean;
  acknowledged_at?: string;
}
