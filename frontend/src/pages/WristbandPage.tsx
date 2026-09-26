import React, { useEffect, useState } from 'react';
import { Watch, Layers, RefreshCw, Plus, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { fetchWristband } from '../services/api';
import { WristbandData } from '../types';

export const WristbandPage: React.FC = () => {
  const [wb, setWb] = useState<WristbandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [newCartId, setNewCartId] = useState('CART-002');

  const loadWb = async () => {
    setLoading(true);
    const res = await fetchWristband('WRK-108');
    setWb(res);
    setLoading(false);
  };

  useEffect(() => {
    loadWb();
  }, []);

  const handleReplace = (e: React.FormEvent) => {
    e.preventDefault();
    if (wb) {
      setWb({
        ...wb,
        current_cartridge_id: newCartId,
        cartridge: {
          cartridge_id: newCartId,
          installation_date: new Date().toISOString().slice(0, 10),
          scans_count: 0,
          cumulative_exposure_ppm_hr: 0.0,
          status: 'ACTIVE'
        }
      });
    }
    setShowReplaceModal(false);
    alert(`Cartridge successfully replaced with new unit: ${newCartId}`);
  };

  if (loading || !wb) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 font-semibold text-sm">
        Loading Wristband & Cartridge Status...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Wristband & Cartridge Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
              {wb.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Physical wearable hardware pair: Wristband <span className="font-bold text-slate-800">{wb.wristband_id}</span>
          </p>
        </div>

        <button
          onClick={() => setShowReplaceModal(true)}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition"
        >
          <RefreshCw size={16} />
          <span>Replace Sensing Cartridge</span>
        </button>
      </div>

      {/* Hardware Card Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Wristband Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-start border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100">
                <Watch size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{wb.wristband_id}</h3>
                <span className="text-xs text-slate-400">Assigned Worker: {wb.worker_id_str}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg">Connected</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Registration Date:</span>
              <span className="font-bold text-slate-800">{wb.registered_at}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Protection Membrane:</span>
              <span className="font-bold text-slate-800">Microporous PTFE (0.2 µm)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Hardware Pairing Status:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={14} /> Active Device Link
              </span>
            </div>
          </div>
        </div>

        {/* Active Cartridge Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-start border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <Layers size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{wb.cartridge?.cartridge_id || 'CART-001'}</h3>
                <span className="text-xs text-slate-400">Copper Colorimetric Strip</span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg">
              {wb.cartridge?.status || 'ACTIVE'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Installation Date:</span>
              <span className="font-bold text-slate-800">{wb.cartridge?.installation_date || '2026-09-20'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Completed Scans:</span>
              <span className="font-bold text-slate-800">{wb.cartridge?.scans_count || 6} Scans</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Cartridge Cumulative Dosage:</span>
              <span className="font-black text-brand-600">{wb.cartridge?.cumulative_exposure_ppm_hr || 18.4} ppm·hr</span>
            </div>
          </div>
        </div>

      </div>

      {/* Cartridge Replacement Modal */}
      {showReplaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900">Replace Sensing Cartridge</h3>
            <p className="text-xs text-slate-500">
              Register a fresh unexposed copper colorimetric strip cartridge for wristband {wb.wristband_id}.
            </p>

            <form onSubmit={handleReplace} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Cartridge Serial ID</label>
                <input
                  type="text"
                  required
                  value={newCartId}
                  onChange={(e) => setNewCartId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="CART-002"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReplaceModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Confirm Replacement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
