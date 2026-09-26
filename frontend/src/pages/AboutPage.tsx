import React from 'react';
import { ShieldAlert, BookOpen, AlertTriangle, Cpu, Watch, Atom, Layers } from 'lucide-react';
import { DemoDataTag } from '../components/DemoDataTag';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-blue-500 flex items-center justify-center text-white shadow-md">
            <Atom size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Scientific & Technical Specifications</h1>
            <p className="text-xs text-slate-400">CuS Colorimetric Chemical Kinetics, PTFE Membrane & CIE Lab Computer Vision</p>
          </div>
        </div>
      </div>

      {/* Safety Disclaimer Callout Box (Section 26 Requirements) */}
      <div className="bg-amber-50 border border-amber-300 rounded-3xl p-6 flex flex-col sm:flex-row items-start gap-4 shadow-sm">
        <div className="p-3 bg-amber-500 text-white rounded-2xl flex-shrink-0">
          <AlertTriangle size={24} />
        </div>
        <div className="space-y-1 text-amber-900">
          <h3 className="font-extrabold text-base">Prototype / Research Demonstration Disclaimer</h3>
          <p className="text-xs text-amber-800 leading-relaxed">
            Exposure values shown by this application are estimates generated from colorimetric computer vision image analysis and calibration data. This prototype is not a certified real-world gas detector, medical device, or replacement for approved industrial H₂S monitoring and personal protective safety procedures.
          </p>
        </div>
      </div>

      {/* Science & Principles Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Chemical Mechanism */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-brand-600 font-bold">
            <Atom size={20} />
            <h3 className="text-base font-black text-slate-900">1. CuS Chemical Colorimetry</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            When exposed to airborne hydrogen sulfide (H₂S), the copper-based colorimetric strip undergoes a progressive chemical reaction forming copper sulfide (CuS):
          </p>
          <div className="bg-slate-900 text-brand-300 p-3.5 rounded-2xl font-mono text-center text-xs font-bold border border-slate-800">
            Cu + H₂S → CuS + H₂ (g)
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            This reaction produces a predictable color shift from light tan/copper to dark brown and black. The rate of darkening is directly proportional to cumulative H₂S gas exposure.
          </p>
        </div>

        {/* PTFE Membrane Science */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 font-bold">
            <Layers size={20} />
            <h3 className="text-base font-black text-slate-900">2. Microporous PTFE Membrane</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The physical sensing strip is protected by a gas-permeable expanded polytetrafluoroethylene (ePTFE) microporous membrane.
          </p>
          <div className="bg-slate-900 text-emerald-300 p-3.5 rounded-2xl font-mono text-center text-xs font-bold border border-slate-800">
            Fick's Diffusion: J = -D (dC / dx)
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The 0.2 µm pore structure permits H₂S gas diffusion while repelling liquids, oils, and particulate dust that could otherwise alter optical readings.
          </p>
        </div>

      </div>

      {/* CIE Lab Delta E Math Explanation */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 font-bold">
          <Cpu size={20} />
          <h3 className="text-base font-black text-slate-900">3. CIE Lab Delta E Color Metric Formula</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Captured RGB pixel values are converted into the device-independent CIE L*a*b* color space. The total color difference ΔE between unexposed baseline and current strip is computed using the Euclidean distance:
        </p>
        <div className="bg-slate-900 text-white p-4 rounded-2xl font-mono text-center text-xs sm:text-sm font-bold border border-slate-800">
          ΔE = √[ (L*₂ - L*₁)² + (a*₂ - a*₁)² + (b*₂ - b*₁)² ]
        </div>
      </div>

    </div>
  );
};
