import {
  DashboardData, SensorReading, WristbandData,
  CalibrationInfo, AlertItem, RiskLevel, HealthVitals, NfcData
} from '../types';

const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE = isLocalhost ? `http://${hostname}:8000/api` : `/api`;

// Helper: RGB to Hex
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// Helper: Color State Classifier
export function classifyColorState(deltaE: number, rgb: [number, number, number]): { hex: string; state: string } {
  const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
  if (deltaE < 8.0) {
    return { hex: '#D7AF96', state: 'Unexposed Tan/Copper Baseline — CuS Saturation 2%' };
  } else if (deltaE < 18.0) {
    return { hex: '#AE8B70', state: 'Level 1 Light Darkening — CuS Saturation 18%' };
  } else if (deltaE < 32.0) {
    return { hex: '#8D6D54', state: 'Level 2 Medium Darkening — CuS Saturation 42%' };
  } else if (deltaE < 50.0) {
    return { hex: '#694E39', state: 'Level 3 Dark Brown — CuS Saturation 68%' };
  } else {
    return { hex: '#2A1C12', state: 'Level 4 Charcoal Black — CuS Saturation 95%' };
  }
}

// Default Health Vitals & NFC Profiles
export const MOCK_NFC_DATA: NfcData = {
  nfc_chip_id: 'NFC-77A920B-H2S',
  worker_id: 'WRK-108',
  full_name: 'Alex Mercer',
  blood_group: 'O+',
  emergency_contact: '+1 (555) 019-2834 (Refinery Medical Response)',
  medical_allergies: ['Penicillin', 'Sulfa Drugs'],
  medical_clearance: 'VALIDATED FOR HAZARDOUS UNIT 4',
  shift_start_time: '06:00 AM (Shift A)'
};

export const MOCK_HEALTH_VITALS: HealthVitals = {
  heart_rate_bpm: 74,
  spo2_percent: 98,
  skin_temp_c: 36.6,
  respiration_rate: 16,
  steps_count: 8420,
  hydration_status: 'HYDRATED',
  heat_stress_index: 'NORMAL',
  fitness_for_duty: 'FIT_FOR_SHIFT'
};

// Fallback Mock State for Seamless Offline/Client-Only Demo Mode
let mockReadings: SensorReading[] = [
  {
    id: 1,
    reading_id: 'SCN-88F9A120',
    worker_id_str: 'WRK-108',
    wristband_id_str: 'HB-001',
    cartridge_id_str: 'CART-001',
    timestamp: '2026-09-26 10:42:00',
    estimated_h2s_ppm: 2.8,
    exposure_contribution_ppm_hr: 2.8,
    cumulative_exposure_ppm_hr: 18.4,
    delta_e: 12.6,
    risk_level: 'SAFE',
    confidence: 0.88,
    image_quality: 'GOOD',
    model_version: 'demo-v1.0',
    is_demo: true,
    mean_rgb: [175, 140, 115],
    mean_lab: [62.4, 11.2, 19.5],
    hex_color: '#AF8C73',
    matched_color_state: 'Level 1 Light Darkening — CuS Saturation 18%',
    health_vitals: MOCK_HEALTH_VITALS,
    nfc_data: MOCK_NFC_DATA
  },
  {
    id: 2,
    reading_id: 'SCN-7A4B1902',
    worker_id_str: 'WRK-108',
    wristband_id_str: 'HB-001',
    cartridge_id_str: 'CART-001',
    timestamp: '2026-09-25 15:30:00',
    estimated_h2s_ppm: 5.8,
    exposure_contribution_ppm_hr: 5.8,
    cumulative_exposure_ppm_hr: 15.6,
    delta_e: 21.2,
    risk_level: 'ATTENTION',
    confidence: 0.85,
    image_quality: 'GOOD',
    model_version: 'demo-v1.0',
    is_demo: true,
    mean_rgb: [140, 108, 85],
    mean_lab: [48.5, 9.8, 20.8],
    hex_color: '#8C6C55',
    matched_color_state: 'Level 2 Medium Darkening — CuS Saturation 42%',
    health_vitals: {
      ...MOCK_HEALTH_VITALS,
      heart_rate_bpm: 88,
      skin_temp_c: 37.1,
      hydration_status: 'MILD_DEHYDRATION',
      heat_stress_index: 'MODERATE'
    },
    nfc_data: MOCK_NFC_DATA
  }
];

let mockAlerts: AlertItem[] = [
  {
    id: 1,
    alert_id: 'ALT-9041A',
    worker_id_str: 'WRK-108',
    reading_id_str: 'SCN-7A4B1902',
    level: 'ATTENTION',
    message: 'Exposure level requires attention! Estimated H₂S: 5.8 ppm (ATTENTION)',
    h2s_ppm: 5.8,
    cumulative_ppm_hr: 15.6,
    timestamp: '2026-09-25 15:30:00',
    acknowledged: false
  }
];

export async function fetchDashboard(workerId: string = 'WRK-108'): Promise<DashboardData> {
  try {
    const res = await fetch(`${API_BASE}/dashboard/${workerId}`);
    if (res.ok) {
      const json = await res.json();
      return {
        ...json,
        latest_vitals: MOCK_HEALTH_VITALS,
        latest_nfc: MOCK_NFC_DATA
      };
    }
  } catch (e) {
    console.warn('Backend unavailable, using simulated dashboard state');
  }

  const latest = mockReadings[0];
  const cumExp = mockReadings.reduce((acc, r) => acc + r.exposure_contribution_ppm_hr, 0);

  return {
    worker_id: workerId,
    worker_name: 'Alex Mercer (Demo Worker)',
    current_risk_status: latest ? latest.risk_level : 'SAFE',
    latest_estimated_h2s_ppm: latest ? latest.estimated_h2s_ppm : 2.8,
    cumulative_exposure_ppm_hr: parseFloat(cumExp.toFixed(2)),
    last_scan_time: latest ? latest.timestamp : 'Today, 10:42 AM',
    cartridge_id: 'CART-001',
    cartridge_status: 'ACTIVE',
    cartridge_age_days: 4,
    total_scans: mockReadings.length,
    exposure_today_ppm_hr: 2.8,
    exposure_7d_ppm_hr: parseFloat(cumExp.toFixed(2)),
    exposure_30d_ppm_hr: parseFloat(cumExp.toFixed(2)),
    latest_vitals: MOCK_HEALTH_VITALS,
    latest_nfc: MOCK_NFC_DATA
  };
}

export async function analyzeImage(imageB64: string, workerId: string = 'WRK-108', wristbandId: string = 'HB-001', cartridgeId: string = 'CART-001') {
  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_b64: imageB64,
        worker_id: workerId,
        wristband_id: wristbandId,
        cartridge_id: cartridgeId,
        exposure_duration_hrs: 1.0
      })
    });
    if (res.ok) {
      const serverRes = await res.json();
      const colorAnalysis = classifyColorState(serverRes.delta_e, [175, 140, 115]);
      return {
        ...serverRes,
        hex_color: colorAnalysis.hex,
        matched_color_state: colorAnalysis.state,
        health_vitals: MOCK_HEALTH_VITALS,
        nfc_data: MOCK_NFC_DATA
      };
    }
  } catch (e) {
    console.warn('Backend endpoint unavailable, generating local client analysis');
  }

  // Fallback simulated CV Analysis
  const deltaE = 18.6;
  const estimatedPpm = 2.8;
  const riskLevel: RiskLevel = 'SAFE';
  const meanRgb: [number, number, number] = [170, 135, 110];
  const colorAnalysis = classifyColorState(deltaE, meanRgb);
  
  const newReading: SensorReading = {
    id: mockReadings.length + 1,
    reading_id: `SCN-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    worker_id_str: workerId,
    wristband_id_str: wristbandId,
    cartridge_id_str: cartridgeId,
    timestamp: new Date().toLocaleString(),
    estimated_h2s_ppm: estimatedPpm,
    exposure_contribution_ppm_hr: estimatedPpm,
    cumulative_exposure_ppm_hr: 21.2,
    delta_e: deltaE,
    risk_level: riskLevel,
    confidence: 0.89,
    image_quality: 'GOOD',
    model_version: 'demo-v1.0',
    is_demo: true,
    mean_rgb: meanRgb,
    mean_lab: [60.0, 11.5, 19.8],
    hex_color: colorAnalysis.hex,
    matched_color_state: colorAnalysis.state,
    health_vitals: MOCK_HEALTH_VITALS,
    nfc_data: MOCK_NFC_DATA
  };

  mockReadings.unshift(newReading);

  return {
    reading_id: newReading.reading_id,
    estimated_h2s_ppm: estimatedPpm,
    delta_e: deltaE,
    exposure_ppm_hr: estimatedPpm,
    cumulative_exposure_ppm_hr: 21.2,
    risk_level: riskLevel,
    confidence: 0.89,
    image_quality: 'GOOD',
    model_version: 'demo-v1.0',
    hex_color: colorAnalysis.hex,
    matched_color_state: colorAnalysis.state,
    health_vitals: MOCK_HEALTH_VITALS,
    nfc_data: MOCK_NFC_DATA,
    color_features: {
      mean_rgb: meanRgb,
      median_rgb: [168, 133, 108],
      mean_lab: [60.0, 11.5, 19.8],
      delta_e: deltaE,
      saturation: 28.5,
      brightness: 62.0,
      color_variance: 14.2,
      hex_color: colorAnalysis.hex,
      matched_color_state: colorAnalysis.state
    },
    quality_checks: {
      lighting: 'GOOD',
      focus: 'GOOD',
      alignment: 'GOOD',
      strip_detected: true,
      reference_patches_detected: true,
      overall_valid: true,
      message: 'Optimal image quality for color analysis.'
    },
    timestamp: newReading.timestamp
  };
}

export async function fetchReadings(workerId: string = 'WRK-108'): Promise<SensorReading[]> {
  try {
    const res = await fetch(`${API_BASE}/readings/${workerId}`);
    if (res.ok) {
      const json = await res.json();
      return json.map((r: any) => ({
        ...r,
        hex_color: r.hex_color || '#AF8C73',
        matched_color_state: r.matched_color_state || 'Level 1 Light Darkening — CuS Saturation 18%',
        health_vitals: r.health_vitals || MOCK_HEALTH_VITALS,
        nfc_data: r.nfc_data || MOCK_NFC_DATA
      }));
    }
  } catch (e) {
    console.warn('Backend unavailable, returning local readings');
  }
  return mockReadings;
}

export async function fetchAnalytics(workerId: string = 'WRK-108') {
  try {
    const res = await fetch(`${API_BASE}/analytics/${workerId}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend unavailable, using simulated analytics');
  }

  return {
    timeline: mockReadings.map(r => ({
      date: r.timestamp.split(' ')[0],
      ppm: r.estimated_h2s_ppm,
      cumulative: r.cumulative_exposure_ppm_hr,
      risk: r.risk_level
    })).reverse(),
    risk_distribution: [
      { name: 'SAFE', count: mockReadings.filter(r => r.risk_level === 'SAFE').length },
      { name: 'ATTENTION', count: mockReadings.filter(r => r.risk_level === 'ATTENTION').length },
      { name: 'HIGH', count: 0 },
      { name: 'CRITICAL', count: 0 },
    ],
    total_scans: mockReadings.length,
    calibration_active_model: 'demo-v1.0'
  };
}

export async function fetchWristband(workerId: string = 'WRK-108'): Promise<WristbandData> {
  try {
    const res = await fetch(`${API_BASE}/wristbands/${workerId}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend unavailable, returning mock wristband');
  }

  return {
    wristband_id: 'HB-001',
    worker_id_str: workerId,
    status: 'ACTIVE',
    current_cartridge_id: 'CART-001',
    registered_at: '2026-09-20',
    nfc_chip_id: 'NFC-77A920B-H2S',
    cartridge: {
      cartridge_id: 'CART-001',
      installation_date: '2026-09-20',
      scans_count: mockReadings.length,
      cumulative_exposure_ppm_hr: 18.4,
      status: 'ACTIVE'
    }
  };
}

export async function fetchCalibrationInfo(): Promise<CalibrationInfo> {
  try {
    const res = await fetch(`${API_BASE}/calibration`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend unavailable, returning demo calibration info');
  }

  return {
    model_name: 'Linear Regression (Demo)',
    version: 'demo-v1.0',
    is_active_trained: false,
    r2_score: 0.985,
    mae: 0.42,
    rmse: 0.65,
    reference_points: [
      { patch_name: 'Unexposed Baseline', target_ppm: 0.0, exposure_duration_hrs: 1.0, ppm_hr: 0.0, color_hex: '#D7AF96', r: 215, g: 175, b: 150, l_val: 74.0, a_val: 13.0, b_val: 18.0, delta_e: 0.0 },
      { patch_name: 'Low Exposure Patch A', target_ppm: 1.5, exposure_duration_hrs: 1.0, ppm_hr: 1.5, color_hex: '#C29D82', r: 194, g: 157, b: 130, l_val: 67.2, a_val: 12.1, b_val: 19.5, delta_e: 7.1 },
      { patch_name: 'Low Exposure Patch B', target_ppm: 3.0, exposure_duration_hrs: 1.0, ppm_hr: 3.0, color_hex: '#AE8B70', r: 174, g: 139, b: 112, l_val: 60.5, a_val: 11.5, b_val: 20.8, delta_e: 14.0 },
      { patch_name: 'Medium Exposure Patch A', target_ppm: 7.5, exposure_duration_hrs: 1.0, ppm_hr: 7.5, color_hex: '#8D6D54', r: 141, g: 109, b: 84, l_val: 49.1, a_val: 10.2, b_val: 21.0, delta_e: 25.4 },
      { patch_name: 'Medium Exposure Patch B', target_ppm: 15.0, exposure_duration_hrs: 1.0, ppm_hr: 15.0, color_hex: '#694E39', r: 105, g: 78, b: 57, l_val: 36.2, a_val: 9.1, b_val: 18.5, delta_e: 38.0 },
      { patch_name: 'High Exposure Patch A', target_ppm: 25.0, exposure_duration_hrs: 1.0, ppm_hr: 25.0, color_hex: '#493323', r: 73, g: 51, b: 35, l_val: 24.0, a_val: 7.8, b_val: 14.2, delta_e: 50.3 }
    ]
  };
}

export async function fetchAlerts(workerId: string = 'WRK-108'): Promise<AlertItem[]> {
  try {
    const res = await fetch(`${API_BASE}/alerts/${workerId}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend unavailable, returning local alerts');
  }
  return mockAlerts;
}

export async function acknowledgeAlert(alertId: string) {
  try {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/acknowledge`, { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (e) {}

  const alt = mockAlerts.find(a => a.alert_id === alertId);
  if (alt) {
    alt.acknowledged = true;
    alt.acknowledged_at = new Date().toLocaleString();
  }
  return { message: 'Alert acknowledged' };
}
