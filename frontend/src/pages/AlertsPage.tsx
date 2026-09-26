import React, { useEffect, useState } from 'react';
import {
  Bell, ShieldAlert, CheckCircle2, AlertTriangle, Volume2, Sliders,
  Check, Info
} from 'lucide-react';
import { fetchAlerts, acknowledgeAlert } from '../services/api';
import { AlertItem } from '../types';
import { RiskBadge } from '../components/RiskBadge';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Configurable thresholds
  const [attentionThreshold, setAttentionThreshold] = useState(5.0);
  const [highThreshold, setHighThreshold] = useState(15.0);
  const [criticalThreshold, setCriticalThreshold] = useState(30.0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const loadAlerts = async () => {
    setLoading(true);
    const data = await fetchAlerts('WRK-108');
    setAlerts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleAck = async (id: string) => {
    await acknowledgeAlert(id);
    setAlerts(alerts.map(a => a.alert_id === id ? { ...a, acknowledged: true, acknowledged_at: new Date().toLocaleString() } : a));
  };

  const playTestSound = () => {
    // Web Audio API beep simulation
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 tone
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Safety Alerts & Thresholds
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
              Configurable Safety Limits
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time workplace safety notifications based on exposure limits.
          </p>
        </div>

        <button
          onClick={playTestSound}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
        >
          <Volume2 size={16} />
          <span>Test Sound Alert</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Notification Feed */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-lg font-black text-slate-900">Active Alert Notifications</h3>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs">Loading alerts...</div>
          ) : alerts.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-xs text-slate-500">
              No active safety alerts. All readings within safe threshold limits.
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((a) => (
                <div
                  key={a.alert_id}
                  className={`bg-white rounded-3xl p-5 border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                    a.acknowledged ? 'border-slate-200 opacity-75' : 'border-amber-300 bg-amber-50/30'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <RiskBadge level={a.level} size="sm" />
                      <span className="text-xs font-mono font-bold text-slate-400">{a.alert_id}</span>
                      <span className="text-xs text-slate-400">• {a.timestamp}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{a.message}</p>
                    <p className="text-xs text-slate-500">
                      Est H₂S: <strong className="text-slate-800">{a.h2s_ppm} ppm</strong> | Shift Cumulative: <strong className="text-slate-800">{a.cumulative_ppm_hr} ppm·hr</strong>
                    </p>
                  </div>

                  {!a.acknowledged ? (
                    <button
                      onClick={() => handleAck(a.alert_id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 transition self-start sm:self-auto"
                    >
                      <Check size={14} />
                      <span>Acknowledge</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={14} /> Acknowledged
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Threshold Config Controls (Section 15 Requirements) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders size={20} className="text-brand-600" />
            <h3 className="text-base font-black text-slate-900">Threshold Settings</h3>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-amber-700">ATTENTION Limit</span>
                <span>{attentionThreshold} ppm</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.5"
                value={attentionThreshold}
                onChange={(e) => setAttentionThreshold(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-orange-700">HIGH Risk Limit</span>
                <span>{highThreshold} ppm</span>
              </div>
              <input
                type="range"
                min="10.0"
                max="25.0"
                step="1.0"
                value={highThreshold}
                onChange={(e) => setHighThreshold(parseFloat(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-red-700">CRITICAL Emergency Limit</span>
                <span>{criticalThreshold} ppm</span>
              </div>
              <input
                type="range"
                min="25.0"
                max="50.0"
                step="1.0"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(parseFloat(e.target.value))}
                className="w-full accent-red-600"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Audible Alarm Signal</span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  soundEnabled ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {soundEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
