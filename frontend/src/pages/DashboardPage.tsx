import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera, Activity, Clock, ShieldCheck, Watch, AlertTriangle,
  ArrowUpRight, RefreshCw, BarChart3, Layers, CheckCircle2
} from 'lucide-react';
import { fetchDashboard, fetchReadings } from '../services/api';
import { DashboardData, SensorReading } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { DemoDataTag } from '../components/DemoDataTag';
import { HealthVitalsCard } from '../components/HealthVitalsCard';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [recentReadings, setRecentReadings] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const dash = await fetchDashboard('WRK-108');
    const readings = await fetchReadings('WRK-108');
    setData(dash);
    setRecentReadings(readings.slice(0, 5));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-500 font-semibold text-sm">Loading Worker Safety Dashboard...</p>
      </div>
    );
  }

  // Circular Meter Percentage calculation (0..100 ppm·hr threshold baseline)
  const maxThreshold = 50.0;
  const progressPercent = Math.min(100, Math.round((data.cumulative_exposure_ppm_hr / maxThreshold) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Safety Dashboard — {data.worker_name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
              {data.worker_id}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chemical Operations & Refining • Petrochemical Complex Unit 4
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title="Refresh Status"
          >
            <RefreshCw size={18} />
          </button>

          <Link
            to="/scan"
            className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-extrabold text-sm rounded-xl shadow-md flex items-center gap-2 transition active:scale-95"
          >
            <Camera size={18} />
            <span>Scan H₂S Strip</span>
          </Link>
        </div>
      </div>

      {/* Main KPI Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: CURRENT STATUS & Large Circular Indicator */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Status</span>
              <div className="mt-1">
                <RiskBadge level={data.current_risk_status} size="lg" />
              </div>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl text-slate-400 border border-slate-100">
              <ShieldCheck size={20} />
            </div>
          </div>

          {/* Large Circular Status Indicator */}
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="40"
                stroke="#e2e8f0" strokeWidth="10" fill="transparent"
              />
              <circle
                cx="50" cy="50" r="40"
                stroke={data.current_risk_status === 'SAFE' ? '#059669' : data.current_risk_status === 'ATTENTION' ? '#d97706' : '#dc2626'}
                strokeWidth="10"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900">{data.latest_estimated_h2s_ppm}</span>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">ppm H₂S</span>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 font-medium bg-slate-50 py-2 rounded-xl border border-slate-100">
            Cumulative Exposure Threshold: <span className="font-bold text-slate-800">{progressPercent}%</span> of 50 ppm·hr limit
          </div>
        </div>

        {/* Card 2: LATEST ESTIMATED H2S & CUMULATIVE EXPOSURE */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-4 border-b border-slate-100 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latest Estimated H₂S</span>
                <h3 className="text-3xl font-black text-slate-900 mt-1">
                  {data.latest_estimated_h2s_ppm} <span className="text-sm font-semibold text-slate-500">ppm</span>
                </h3>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Activity size={20} />
              </div>
            </div>
            <p className="text-xs text-slate-500">Measured via CIE Lab Delta E colorimetric analysis</p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cumulative Exposure (Shift)</span>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-slate-900">
                {data.cumulative_exposure_ppm_hr} <span className="text-sm font-semibold text-slate-500">ppm·hr</span>
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Shift Active
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Today</span>
                <span className="font-bold text-slate-800">{data.exposure_today_ppm_hr}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">7 Days</span>
                <span className="font-bold text-slate-800">{data.exposure_7d_ppm_hr}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">30 Days</span>
                <span className="font-bold text-slate-800">{data.exposure_30d_ppm_hr}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: CARTRIDGE STATUS & AGE */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cartridge Status</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl font-bold text-slate-900">{data.cartridge_id}</span>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full border border-emerald-200">
                    {data.cartridge_status}
                  </span>
                </div>
              </div>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <Watch size={20} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Cartridge Age</span>
                <span className="text-lg font-black text-slate-800">{data.cartridge_age_days} Days</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Total Scans</span>
                <span className="text-lg font-black text-slate-800">{data.total_scans}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Last Scan Time:</span>
              <span className="font-bold text-slate-800">{data.last_scan_time}</span>
            </div>
            <Link
              to="/wristband"
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition"
            >
              <span>Manage Wristband & Cartridge</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

      </div>

      {/* Worker Health Telemetry Card */}
      <HealthVitalsCard vitals={data.latest_vitals} />

      {/* Recent Scans Table & Quick Navigation */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-slate-900">Recent Exposure Scans</h3>
            <p className="text-xs text-slate-500">History of logged computer vision readings for {data.worker_id}</p>
          </div>
          <Link
            to="/history"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition"
          >
            <span>View Full Log History</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <th className="p-3.5 rounded-l-xl">Reading ID</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Estimated H₂S</th>
                <th className="p-3.5">Exposure Contribution</th>
                <th className="p-3.5">Cumulative Exposure</th>
                <th className="p-3.5">ΔE Baseline</th>
                <th className="p-3.5 rounded-r-xl">Risk Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentReadings.map((r) => (
                <tr key={r.reading_id} className="hover:bg-slate-50/80 transition font-medium">
                  <td className="p-3.5 font-mono text-slate-700 font-bold">{r.reading_id}</td>
                  <td className="p-3.5 text-slate-500">{r.timestamp}</td>
                  <td className="p-3.5 text-slate-900 font-bold">{r.estimated_h2s_ppm} ppm</td>
                  <td className="p-3.5 text-slate-600">{r.exposure_contribution_ppm_hr} ppm·hr</td>
                  <td className="p-3.5 text-slate-900 font-black">{r.cumulative_exposure_ppm_hr} ppm·hr</td>
                  <td className="p-3.5 font-mono text-slate-600">{r.delta_e}</td>
                  <td className="p-3.5">
                    <RiskBadge level={r.risk_level} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
