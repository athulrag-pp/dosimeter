import React from 'react';
import { HealthVitals } from '../types';
import { Heart, Activity, Thermometer, Footprints, Droplets, ShieldCheck, Flame } from 'lucide-react';

interface HealthVitalsCardProps {
  vitals?: HealthVitals;
}

export const HealthVitalsCard: React.FC<HealthVitalsCardProps> = ({ vitals }) => {
  if (!vitals) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Heart size={18} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Worker Health & Fitness Telemetry</h3>
            <p className="text-[11px] text-slate-500">Decoded wristband biometrics & shift fitness state</p>
          </div>
        </div>

        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-full border border-emerald-200 uppercase tracking-wide">
          {vitals.fitness_for_duty.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        
        {/* Heart Rate */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <Heart size={14} className="text-rose-500" />
            <span>Heart Rate</span>
          </div>
          <div className="text-xl font-black text-slate-900">
            {vitals.heart_rate_bpm} <span className="text-xs font-semibold text-slate-500">BPM</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 block">Normal Resting Pulse</span>
        </div>

        {/* SpO2 */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <Activity size={14} className="text-blue-500" />
            <span>Blood Oxygen</span>
          </div>
          <div className="text-xl font-black text-slate-900">
            {vitals.spo2_percent}% <span className="text-xs font-semibold text-slate-500">SpO₂</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 block">Optimal Oxygenation</span>
        </div>

        {/* Skin Temp */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <Thermometer size={14} className="text-amber-500" />
            <span>Skin Temperature</span>
          </div>
          <div className="text-xl font-black text-slate-900">
            {vitals.skin_temp_c}°C
          </div>
          <span className="text-[10px] font-bold text-slate-500 block">97.8°F Normal Range</span>
        </div>

        {/* Daily Activity Steps */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <Footprints size={14} className="text-purple-500" />
            <span>Shift Activity</span>
          </div>
          <div className="text-xl font-black text-slate-900">
            {vitals.steps_count.toLocaleString()}
          </div>
          <span className="text-[10px] font-bold text-slate-500 block">Steps Counted</span>
        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
        <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets size={16} className="text-blue-600" />
            <span className="font-bold text-slate-700">Hydration Assessment:</span>
          </div>
          <span className="font-black text-blue-700 uppercase">{vitals.hydration_status}</span>
        </div>

        <div className="bg-amber-50/60 border border-amber-100 p-3 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-amber-600" />
            <span className="font-bold text-slate-700">Heat Stress Index:</span>
          </div>
          <span className="font-black text-amber-800 uppercase">{vitals.heat_stress_index}</span>
        </div>
      </div>
    </div>
  );
};
