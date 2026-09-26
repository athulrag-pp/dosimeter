import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2, Camera, BarChart3, Save, Eye, Cpu, Activity, Info, Heart
} from 'lucide-react';
import { RiskBadge } from '../components/RiskBadge';
import { DemoDataTag } from '../components/DemoDataTag';
import { HealthVitalsCard } from '../components/HealthVitalsCard';
import { NfcDecodedCard } from '../components/NfcDecodedCard';

export const ScanResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve result data passed from ScannerPage or fallback default
  const res = location.state?.resultData || {
    reading_id: 'SCN-88F9A120',
    estimated_h2s_ppm: 2.8,
    delta_e: 12.6,
    exposure_ppm_hr: 2.8,
    cumulative_exposure_ppm_hr: 18.4,
    risk_level: 'SAFE',
    confidence: 0.88,
    image_quality: 'GOOD',
    model_version: 'demo-v1.0',
    hex_color: '#AF8C73',
    matched_color_state: 'Level 1 Light Darkening — CuS Saturation 18%',
    color_features: {
      mean_rgb: [175, 140, 115],
      mean_lab: [62.4, 11.2, 19.5],
      delta_e: 12.6,
      saturation: 28.5,
      brightness: 62.0
    },
    health_vitals: {
      heart_rate_bpm: 74,
      spo2_percent: 98,
      skin_temp_c: 36.6,
      respiration_rate: 16,
      steps_count: 8420,
      hydration_status: 'HYDRATED',
      heat_stress_index: 'NORMAL',
      fitness_for_duty: 'FIT_FOR_SHIFT'
    },
    nfc_data: {
      nfc_chip_id: 'NFC-77A920B-H2S',
      worker_id: 'WRK-108',
      full_name: 'Alex Mercer',
      blood_group: 'O+',
      emergency_contact: '+1 (555) 019-2834 (Refinery Medical Response)',
      medical_allergies: ['Penicillin', 'Sulfa Drugs'],
      medical_clearance: 'VALIDATED FOR HAZARDOUS UNIT 4',
      shift_start_time: '06:00 AM'
    },
    timestamp: new Date().toLocaleString()
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Wristband Scan Complete</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold">
              {res.reading_id}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Optical colorimetric strip analysis + NFC chip memory + Health telemetry decoded.
          </p>
        </div>

        <RiskBadge level={res.risk_level} size="lg" />
      </div>

      {/* Detected Color State Highlight Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">
              Detected Colorimetry Output
            </span>
            <h3 className="text-lg font-black text-white">{res.matched_color_state || 'Level 1 Light Darkening'}</h3>
            <p className="text-xs text-slate-400">
              CIE Lab Delta E: <strong className="text-emerald-400">{res.delta_e}</strong> | Hex Code: <strong className="text-amber-300 font-mono">{res.hex_color || '#AF8C73'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-16 h-16 rounded-2xl border-2 border-white/80 shadow-lg flex items-center justify-center font-mono text-[10px] font-bold text-white shadow-inner"
              style={{ backgroundColor: res.hex_color || '#AF8C73' }}
            >
              DETECTED
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Crop + Quantitative Gas Results */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Image with Highlighted ROI Bounding Box */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-slate-950 rounded-3xl p-4 border border-slate-800 shadow-xl text-white space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Captured Sensor ROI</span>
              <span className="text-emerald-400 font-bold">Quality: {res.image_quality}</span>
            </div>

            {res.processed_image_b64 ? (
              <img
                src={res.processed_image_b64}
                alt="Detected Sensor ROI"
                className="w-full rounded-2xl border border-slate-800 object-cover max-h-64"
              />
            ) : (
              <div className="w-full h-56 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center justify-center p-4 text-center">
                <div
                  className="w-28 h-20 rounded-xl border-2 border-brand-400 flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: res.hex_color || '#8d6d54' }}
                >
                  <span className="text-[10px] font-bold text-white bg-black/70 px-2 py-0.5 rounded">
                    CuS ROI: {res.hex_color || '#8D6D54'}
                  </span>
                </div>
                <span className="text-xs text-slate-400 mt-3 font-mono">Color Detected & Calibrated</span>
              </div>
            )}

            <div className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between font-mono">
              <span>Confidence: {(res.confidence * 100).toFixed(0)}%</span>
              <span>Model: {res.model_version}</span>
            </div>
          </div>

          <DemoDataTag label="Research Prototype Output" />
        </div>

        {/* Right Column: Quantitative Key Gas Metrics */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase">Estimated H₂S Level</span>
                <div className="text-3xl font-black text-slate-900">
                  {res.estimated_h2s_ppm} <span className="text-sm font-semibold text-slate-500">ppm</span>
                </div>
                <span className="text-[11px] text-slate-500 block">Instantaneous concentration</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase">Cumulative Exposure</span>
                <div className="text-3xl font-black text-slate-900">
                  {res.cumulative_exposure_ppm_hr} <span className="text-sm font-semibold text-slate-500">ppm·hr</span>
                </div>
                <span className="text-[11px] text-slate-500 block">Shift total dosage</span>
              </div>
            </div>

            {/* Extracted Color Features Table */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Extracted Colorimetry Metrics
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl flex justify-between">
                  <span className="text-slate-500">Delta E (ΔE):</span>
                  <span className="font-bold font-mono text-slate-900">{res.delta_e}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl flex justify-between">
                  <span className="text-slate-500">Color Hex:</span>
                  <span className="font-bold font-mono text-brand-600">{res.hex_color || '#AF8C73'}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl flex justify-between">
                  <span className="text-slate-500">CIE L*a*b*:</span>
                  <span className="font-bold font-mono text-slate-900">
                    {res.color_features?.mean_lab ? res.color_features.mean_lab.map((n: number) => n.toFixed(1)).join(', ') : '62.4, 11.2, 19.5'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl flex justify-between">
                  <span className="text-slate-500">Mean RGB:</span>
                  <span className="font-bold font-mono text-slate-900">
                    {res.color_features?.mean_rgb ? res.color_features.mean_rgb.map((n: number) => Math.round(n)).join(', ') : '175, 140, 115'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Decoded Health Vitals Card */}
      <HealthVitalsCard vitals={res.health_vitals} />

      {/* Decoded NFC Wristband Data Card */}
      <NfcDecodedCard nfc={res.nfc_data} />

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition"
        >
          <Save size={18} />
          <span>Save & View Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <Link
            to="/scan"
            className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl flex items-center gap-2 transition"
          >
            <Camera size={18} />
            <span>Scan Again</span>
          </Link>

          <Link
            to="/analytics"
            className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition"
          >
            <BarChart3 size={18} />
            <span>View Analytics</span>
          </Link>
        </div>
      </div>

    </div>
  );
};
