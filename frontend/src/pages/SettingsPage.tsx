import React, { useState, useRef } from 'react';
import { Settings, Camera, Sliders, RefreshCw, Eye, Sun, Contrast, CheckCircle2 } from 'lucide-react';
import { BASELINE_LAB, calculate_delta_e_76 } from '../utils/colorUtils';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'camera_test' | 'general'>('camera_test');
  const [cameraActive, setCameraActive] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);

  // Live computer vision sampler stats
  const [sampledRgb, setSampledRgb] = useState<[number, number, number]>([175, 140, 115]);
  const [sampledLab, setSampledLab] = useState<[number, number, number]>([62.4, 11.2, 19.5]);
  const [sampledDeltaE, setSampledDeltaE] = useState<number>(12.6);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startTestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch (e) {
      alert('Camera access unavailable. Using synthetic camera test mode.');
    }
  };

  const simulateSampling = () => {
    // Generate slight live color variations
    const r = Math.round(150 + Math.random() * 50);
    const g = Math.round(120 + Math.random() * 40);
    const b = Math.round(90 + Math.random() * 30);
    setSampledRgb([r, g, b]);

    const l = 50 + Math.random() * 20;
    const a = 8 + Math.random() * 6;
    const b_val = 15 + Math.random() * 8;
    setSampledLab([parseFloat(l.toFixed(1)), parseFloat(a.toFixed(1)), parseFloat(b_val.toFixed(1))]);
    
    const dE = Math.sqrt(Math.pow(l - 74, 2) + Math.pow(a - 13, 2) + Math.pow(b_val - 18, 2));
    setSampledDeltaE(parseFloat(dE.toFixed(1)));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Settings & Camera Diagnostics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold">
              Prototype Test Suite
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Debug camera sensor frame capture, RGB to CIE Lab conversion & Delta E colorimetry.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('camera_test')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'camera_test' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            Camera Test Mode
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'general' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            System Settings
          </button>
        </div>
      </div>

      {activeTab === 'camera_test' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Live Camera Debug View */}
          <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-2xl text-white space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="font-bold flex items-center gap-1.5 text-brand-400">
                <Camera size={16} /> Live Diagnostics Feed
              </span>
              <span>Filter: Brightness ({brightness}%) Contrast ({contrast}%)</span>
            </div>

            <div className="relative w-full h-72 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
              <video
                ref={videoRef}
                playsInline
                muted
                style={{ filter: `brightness(${brightness}%) contrast(${contrast}%)` }}
                className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
              />

              {!cameraActive && (
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-brand-400 mx-auto">
                    <Camera size={24} />
                  </div>
                  <p className="text-xs text-slate-400">Camera preview unstarted.</p>
                  <button
                    onClick={startTestCamera}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-md"
                  >
                    Start Test Camera
                  </button>
                </div>
              )}

              {/* Debug ROI Bounding Box Overlay */}
              <div className="absolute inset-0 border-2 border-brand-400/50 m-8 rounded-xl pointer-events-none flex items-center justify-center">
                <span className="bg-slate-900/90 text-brand-300 text-[10px] font-mono px-2 py-0.5 rounded border border-brand-500/30">
                  DEBUG ROI SAMPLER
                </span>
              </div>
            </div>

            {/* Brightness & Contrast Adjustment Sliders */}
            <div className="grid grid-cols-2 gap-4 text-xs pt-2">
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="flex items-center gap-1 text-slate-300"><Sun size={14} /> Brightness</span>
                  <span>{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="flex items-center gap-1 text-slate-300"><Contrast size={14} /> Contrast</span>
                  <span>{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live Colorimetry Readout */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Colorimetry Readout</h3>
              <button
                onClick={simulateSampling}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition"
              >
                <RefreshCw size={14} />
                <span>Sample Frame</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Captured RGB</span>
                  <div className="text-lg font-mono font-bold text-slate-900">
                    RGB({sampledRgb.join(', ')})
                  </div>
                </div>
                <div
                  className="w-10 h-10 rounded-xl border border-slate-300 shadow-xs"
                  style={{ backgroundColor: `rgb(${sampledRgb.join(',')})` }}
                ></div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">CIE L*a*b* Standard</span>
                <div className="text-lg font-mono font-bold text-slate-900">
                  L*: {sampledLab[0]}, a*: {sampledLab[1]}, b*: {sampledLab[2]}
                </div>
              </div>

              <div className="bg-brand-50 border border-brand-200 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-brand-800 uppercase">CIE76 Delta E (ΔE) Difference</span>
                <div className="text-3xl font-black text-brand-600 font-mono">
                  ΔE = {sampledDeltaE}
                </div>
                <span className="text-[11px] text-brand-700 block">Against Unexposed Baseline Lab (74.0, 13.0, 18.0)</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 max-w-xl">
          <h3 className="text-base font-black text-slate-900">General Application Settings</h3>
          <p className="text-xs text-slate-500">Manage API backend endpoints, database persistence, and debug logs.</p>
          <div className="pt-2 space-y-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
              <span>FastAPI Backend Endpoint</span>
              <span className="font-mono text-brand-600 font-bold">http://localhost:8000/api</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
              <span>Database Engine</span>
              <span className="font-bold text-slate-800">SQLite Prototype (h2safe.db)</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
