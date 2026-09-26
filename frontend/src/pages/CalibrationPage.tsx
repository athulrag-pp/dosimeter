import React, { useEffect, useState } from 'react';
import {
  Sliders, Cpu, Upload, Save, CheckCircle2, AlertTriangle,
  LineChart as LineChartIcon, FileSpreadsheet, RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { fetchCalibrationInfo } from '../services/api';
import { CalibrationInfo } from '../types';
import { DemoDataTag } from '../components/DemoDataTag';

export const CalibrationPage: React.FC = () => {
  const [calib, setCalib] = useState<CalibrationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModelType, setSelectedModelType] = useState('Linear Regression');
  const [training, setTraining] = useState(false);

  const loadCalibration = async () => {
    setLoading(true);
    const data = await fetchCalibrationInfo();
    setCalib(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCalibration();
  }, []);

  const handleTrainModel = () => {
    setTraining(true);
    setTimeout(() => {
      if (calib) {
        setCalib({
          ...calib,
          model_name: selectedModelType,
          version: `custom-${selectedModelType.toLowerCase().replace(' ', '-')}-v102`,
          is_active_trained: true,
          r2_score: selectedModelType === 'Random Forest' ? 0.992 : 0.985,
          mae: 0.28,
          rmse: 0.41
        });
      }
      setTraining(false);
      alert(`Model successfully trained using ${selectedModelType}! Metrics updated.`);
    }, 800);
  };

  if (loading || !calib) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 font-semibold text-sm">
        Loading Calibration Engine & Reference Patches...
      </div>
    );
  }

  // Calibration Curve Plot data
  const curveData = calib.reference_points.map((pt) => ({
    delta_e: pt.delta_e,
    ppm: pt.target_ppm,
    name: pt.patch_name
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              AI Calibration & Regression System
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-mono font-bold border border-brand-200">
              {calib.version}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Map CIE Lab Delta E color differences to quantitative H₂S concentration via ML regression.
          </p>
        </div>

        <DemoDataTag label="Demo Calibration Model" />
      </div>

      {/* Model Performance Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Model Type</span>
          <div className="text-lg font-black text-slate-900">{calib.model_name}</div>
          <span className="text-[11px] text-slate-500 block">scikit-learn regressor</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">R² Score (Goodness of Fit)</span>
          <div className="text-2xl font-black text-emerald-600">{calib.r2_score}</div>
          <span className="text-[11px] text-slate-500 block">High correlation</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">MAE (Mean Abs Error)</span>
          <div className="text-2xl font-black text-brand-600">±{calib.mae} ppm</div>
          <span className="text-[11px] text-slate-500 block">Average prediction error</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">RMSE</span>
          <div className="text-2xl font-black text-slate-800">{calib.rmse}</div>
          <span className="text-[11px] text-slate-500 block">Root mean square error</span>
        </div>
      </div>

      {/* Calibration Curve Graph & Training Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Graph */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-black text-slate-900">Calibration Response Curve</h3>
              <p className="text-xs text-slate-500">CIE Lab Delta E (ΔE) vs Target H₂S Concentration (ppm)</p>
            </div>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
              Linear/Polynomial Fit
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={curveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="delta_e" name="Delta E" stroke="#94a3b8" fontSize={10} label={{ value: 'Delta E (ΔE)', position: 'insideBottom', offset: -5 }} />
                <YAxis dataKey="ppm" name="H2S ppm" stroke="#94a3b8" fontSize={10} label={{ value: 'H2S (ppm)', angle: -90, position: 'insideLeft' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="ppm" stroke="#2563eb" strokeWidth={3} dot={{ r: 6, fill: '#1d4ed8' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Training Control Form */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900">Model Training Controls</h3>
          <p className="text-xs text-slate-500">
            Select regression algorithm to train calibration models on uploaded dataset.
          </p>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">Algorithm</label>
            <select
              value={selectedModelType}
              onChange={(e) => setSelectedModelType(e.target.value)}
              className="w-full p-2.5 text-xs font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="Linear Regression">Linear Regression</option>
              <option value="Random Forest">Random Forest Regressor</option>
              <option value="Gradient Boosting">Gradient Boosting Regressor</option>
            </select>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleTrainModel}
                disabled={training}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition"
              >
                <Cpu size={16} />
                <span>{training ? 'Training Model...' : 'Train Calibration Model'}</span>
              </button>

              <button
                onClick={() => alert('Select CSV file containing [delta_e, L, a, b, target_ppm] columns.')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Upload size={16} />
                <span>Upload Calibration CSV</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Reference Color Patches Table (Section 9 Requirements) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-black text-slate-900">Reference Color Calibration Patches</h3>
        <p className="text-xs text-slate-500">Standardized baseline chemical exposure samples for colorimetry validation.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <th className="p-3.5">Patch Sample</th>
                <th className="p-3.5">Target H₂S (ppm)</th>
                <th className="p-3.5">Color Hex</th>
                <th className="p-3.5">Captured RGB</th>
                <th className="p-3.5">Captured Lab (L*, a*, b*)</th>
                <th className="p-3.5">Delta E (ΔE)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {calib.reference_points.map((pt, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 font-bold text-slate-800">{pt.patch_name}</td>
                  <td className="p-3.5 font-black text-slate-900">{pt.target_ppm} ppm</td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md border border-slate-300 shadow-xs" style={{ backgroundColor: pt.color_hex }}></span>
                      <span className="font-mono text-slate-600">{pt.color_hex}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-slate-600">{pt.r}, {pt.g}, {pt.b}</td>
                  <td className="p-3.5 font-mono text-slate-600">{pt.l_val}, {pt.a_val}, {pt.b_val}</td>
                  <td className="p-3.5 font-mono font-bold text-brand-600">{pt.delta_e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
