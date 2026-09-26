import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2, Camera, BarChart3, Save, ArrowLeft, ShieldCheck,
  Cpu, Layers, Eye, Activity, Info
} from 'lucide-react';
import { RiskBadge } from '../components/RiskBadge';
import { DemoDataTag } from '../components/DemoDataTag';

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
    color_features: {
      mean_rgb: [175, 140, 115],
      mean_lab: [62.4, 11.2, 19.5],
      delta_e: 12.6,
      saturation: 28.5,
      brightness: 62.0
    },
    timestamp: new Date().toLocaleString()
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Scan Complete</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold">
              {res.reading_id}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Computer vision colorimetry analysis & calibration inference complete.
          </p>
        </div>

        <RiskBadge level={res.risk_level} size="lg" />
      </div>

      {/* Main Grid: Visual Crop + Results */}
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
                <div className="w-24 h-16 rounded-xl bg-[#8d6d54] border-2 border-brand-400 flex items-center justify-center shadow-lg">
                  <span className="text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded">
                    CuS ROI
                  </span>
                </div>
                <span className="text-xs text-slate-400 mt-3 font-mono">Detected Sensor Strip & Reference Patches</span>
              </div>
            )}

            <div className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between font-mono">
              <span>Confidence: {(res.confidence * 100).toFixed(0)}%</span>
              <span>Model: {res.model_version}</span>
            </div>
          </div>

          <DemoDataTag label="Research Prototype Output" />
        </div>

        {/* Right Column: Quantitative Key Metrics */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase">Estimated H₂S</span>
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

            {/* Metrics Breakdown Table */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Extracted Computer Vision Features
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl flex justify-between">
                  <span className="text-slate-500">Delta E (ΔE):</span>
                  <span className="font-bold font-mono text-slate-900">{res.delta_e}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl flex justify-between">
                  <span className="text-slate-500">Color Change:</span>
                  <span className="font-bold text-slate-900">Moderate Darkening</span>
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

            {/* Step-by-Step Color Transformation Flow */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 border border-slate-800">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider block">
                Analysis Pipeline Transformation
              </span>

              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <div className="text-center">
                  <span className="block text-[10px] text-slate-500">1. RGB</span>
                  <span className="font-bold">Captured</span>
                </div>
                <span className="text-slate-600">→</span>
                <div className="text-center">
                  <span className="block text-[10px] text-slate-500">2. CIE Lab</span>
                  <span className="font-bold">Normalized</span>
                </div>
                <span className="text-slate-600">→</span>
                <div className="text-center">
                  <span className="block text-[10px] text-slate-500">3. ΔE</span>
                  <span className="font-bold">{res.delta_e}</span>
                </div>
                <span className="text-slate-600">→</span>
                <div className="text-center">
                  <span className="block text-[10px] text-slate-500">4. ML Regression</span>
                  <span className="font-bold text-emerald-400">{res.estimated_h2s_ppm} ppm</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

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
