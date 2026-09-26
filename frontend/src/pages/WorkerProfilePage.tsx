import React, { useEffect, useState } from 'react';
import { User, Building, Briefcase, Key, Watch, Activity, ShieldCheck, Calendar } from 'lucide-react';
import { fetchDashboard } from '../services/api';
import { DashboardData } from '../types';

export const WorkerProfilePage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboard('WRK-108').then(setData);
  }, []);

  if (!data) return <div className="p-12 text-center text-xs text-slate-500">Loading worker profile...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-600 to-blue-500 text-white flex items-center justify-center font-black text-2xl shadow-lg">
          AM
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <h1 className="text-2xl font-black text-slate-900">{data.worker_name}</h1>
          <p className="text-xs text-slate-500 font-mono">Worker ID: {data.worker_id} • Assigned Wristband: HB-001</p>
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
            Active Safety Profile
          </span>
        </div>
      </div>

      {/* Workplace Metadata Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Organization</span>
          <div className="text-sm font-bold text-slate-800">Industrial Safety Corp</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Department</span>
          <div className="text-sm font-bold text-slate-800">Chemical Operations & Refining</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Workplace Station</span>
          <div className="text-sm font-bold text-slate-800">Petrochemical Complex Unit 4</div>
        </div>
      </div>

      {/* Cumulative Exposure Statistics */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900">Shift Exposure Statistics</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Total Scans</span>
            <span className="text-xl font-black text-slate-900">{data.total_scans}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Cumulative Exposure</span>
            <span className="text-xl font-black text-brand-600">{data.cumulative_exposure_ppm_hr} ppm·hr</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Latest H₂S Estimate</span>
            <span className="text-xl font-black text-slate-900">{data.latest_estimated_h2s_ppm} ppm</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Cartridge Age</span>
            <span className="text-xl font-black text-slate-900">{data.cartridge_age_days} Days</span>
          </div>
        </div>
      </div>

    </div>
  );
};
