import React, { useEffect, useState } from 'react';
import {
  Download, Search, Filter, Calendar, FileSpreadsheet, FileText,
  History, ArrowUpDown, RefreshCw, ShieldCheck
} from 'lucide-react';
import { fetchReadings } from '../services/api';
import { SensorReading, RiskLevel } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { DemoDataTag } from '../components/DemoDataTag';

export const HistoryPage: React.FC = () => {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    const data = await fetchReadings('WRK-108');
    setReadings(data);
    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filtered = readings.filter((r) => {
    const matchesSearch =
      r.reading_id.toLowerCase().includes(search.toLowerCase()) ||
      r.cartridge_id_str.toLowerCase().includes(search.toLowerCase()) ||
      r.timestamp.includes(search);
    const matchesRisk = riskFilter === 'ALL' || r.risk_level === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const exportCSV = () => {
    const headers = ['Reading ID', 'Worker ID', 'Cartridge ID', 'Timestamp', 'Estimated H2S (ppm)', 'Exposure Contribution (ppm-hr)', 'Cumulative Exposure (ppm-hr)', 'Delta E', 'Risk Level', 'Model Version'];
    const rows = filtered.map(r => [
      r.reading_id,
      r.worker_id_str,
      r.cartridge_id_str,
      r.timestamp,
      r.estimated_h2s_ppm,
      r.exposure_contribution_ppm_hr,
      r.cumulative_exposure_ppm_hr,
      r.delta_e,
      r.risk_level,
      r.model_version
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `h2safe_exposure_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDFReport = () => {
    alert('Generating Industrial H₂S Safety Report PDF...\nSummary included for Worker WRK-108 across ' + filtered.length + ' readings.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header & Export Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Exposure History Log
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold">
              {filtered.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete database audit log of continuous passive H₂S wristband scans.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition"
          >
            <FileSpreadsheet size={16} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={exportPDFReport}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition"
          >
            <FileText size={16} />
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Reading ID, Cartridge, Date..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        {/* Risk Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl w-full sm:w-auto overflow-x-auto">
          {['ALL', 'SAFE', 'ATTENTION', 'HIGH', 'CRITICAL'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setRiskFilter(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                riskFilter === lvl ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-semibold text-sm">Loading exposure history log...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No matching exposure records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                  <th className="p-4">Reading ID</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">H₂S Concentration</th>
                  <th className="p-4">Exposure Contribution</th>
                  <th className="p-4">Cumulative Exposure</th>
                  <th className="p-4">ΔE Baseline</th>
                  <th className="p-4">Cartridge</th>
                  <th className="p-4">Risk Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((r) => (
                  <tr key={r.reading_id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-mono font-bold text-brand-600">{r.reading_id}</td>
                    <td className="p-4 text-slate-500">{r.timestamp}</td>
                    <td className="p-4 font-extrabold text-slate-900">{r.estimated_h2s_ppm} ppm</td>
                    <td className="p-4 text-slate-600">{r.exposure_contribution_ppm_hr} ppm·hr</td>
                    <td className="p-4 font-black text-slate-900">{r.cumulative_exposure_ppm_hr} ppm·hr</td>
                    <td className="p-4 font-mono text-slate-500">{r.delta_e}</td>
                    <td className="p-4 font-mono text-slate-600">{r.cartridge_id_str}</td>
                    <td className="p-4">
                      <RiskBadge level={r.risk_level} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
