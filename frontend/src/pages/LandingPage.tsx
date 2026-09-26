import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Camera, BarChart3, Watch, Cpu, Activity,
  ArrowRight, ShieldAlert, CheckCircle, Zap, Eye, PlayCircle
} from 'lucide-react';
import { DemoDataTag } from '../components/DemoDataTag';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const workflowSteps = [
    { title: 'Physical Wristband', desc: 'Microporous PTFE membrane protects colorimetric sensor strip', icon: Watch, color: 'bg-blue-500' },
    { title: 'Colorimetric Sensor', desc: 'Copper strip reacts with H₂S forming brown/black CuS', icon: Eye, color: 'bg-amber-500' },
    { title: 'Smartphone Camera', desc: 'Captures wristband under guided lighting framework', icon: Camera, color: 'bg-emerald-500' },
    { title: 'Computer Vision', desc: 'OpenCV extracts ROI & normalizes white-balance with reference patches', icon: Cpu, color: 'bg-indigo-500' },
    { title: 'Calibration Model', desc: 'CIE Lab ΔE mapped via ML regression to H₂S concentration', icon: SlidersIcon, color: 'bg-purple-500' },
    { title: 'Exposure Estimation', desc: 'Calculates instantaneous ppm & cumulative ppm·hr', icon: Activity, color: 'bg-orange-500' },
    { title: 'Safety Monitoring', desc: 'Triggers alerts & updates workplace exposure analytics', icon: ShieldCheck, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 rounded-b-[2.5rem] shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,0.15),transparent_50%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-xs font-bold tracking-wide">
                <Zap size={14} className="text-brand-400" />
                <span>SMART INDIA HACKATHON PROTOTYPE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                Smart H₂S Exposure <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-blue-300 to-emerald-400">
                  Monitoring System
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                AI-assisted color analysis for passive, cumulative hydrogen sulfide exposure monitoring. Utilizing computer vision, CIE Lab colorimetry, and calibration regression.
              </p>

              {/* Main CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  to="/scan"
                  className="px-6 py-3.5 bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-brand-500/25 flex items-center gap-2.5 transition active:scale-95"
                >
                  <Camera size={18} />
                  <span>Start Scanning</span>
                </Link>

                <Link
                  to="/dashboard"
                  className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2.5 transition"
                >
                  <BarChart3 size={18} />
                  <span>View Dashboard</span>
                </Link>

                <button
                  onClick={() => navigate('/scan?demo=true')}
                  className="px-5 py-3.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-sm rounded-xl flex items-center gap-2 transition"
                >
                  <PlayCircle size={18} className="text-amber-400" />
                  <span>Launch Demo Mode</span>
                </button>
              </div>

              <div className="pt-2">
                <DemoDataTag label="Research Prototype Demo — Not a Certified Gas Detector" />
              </div>
            </div>

            {/* Right Column Stylized Wristband Illustration */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 border border-slate-700/80 shadow-2xl space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                  <div className="flex items-center gap-2">
                    <Watch size={20} className="text-brand-400" />
                    <span className="font-bold text-sm text-white">H₂S DoseVision Sensor Wristband</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    Cartridge Active
                  </span>
                </div>

                {/* Sensor Strip Mock Display */}
                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                  <div className="text-xs text-slate-400 font-medium flex justify-between">
                    <span>PTFE Membrane Window</span>
                    <span>Cu → CuS Color Reaction</span>
                  </div>

                  {/* Gradient representation of unexposed to exposed copper strip */}
                  <div className="h-16 rounded-xl bg-gradient-to-r from-[#d7af96] via-[#8d6d54] to-[#2a1c12] p-2 flex items-center justify-between border border-slate-700 shadow-inner">
                    <div className="text-[10px] bg-black/60 px-2 py-1 rounded text-white font-bold">Unexposed (0 ppm)</div>
                    <div className="text-[10px] bg-black/60 px-2 py-1 rounded text-white font-bold">High (25 ppm)</div>
                  </div>

                  {/* Reference Patches Preview */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    <div className="h-6 rounded bg-white flex items-center justify-center text-[9px] font-bold text-slate-800">REF W</div>
                    <div className="h-6 rounded bg-slate-400 flex items-center justify-center text-[9px] font-bold text-slate-900">REF G</div>
                    <div className="h-6 rounded bg-slate-800 flex items-center justify-center text-[9px] font-bold text-white border border-slate-700">REF D</div>
                    <div className="h-6 rounded bg-amber-200 flex items-center justify-center text-[9px] font-bold text-amber-900">REF C</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle size={14} className="text-emerald-400" />
                    CIE Lab Delta E Analysis
                  </span>
                  <span className="font-mono text-brand-300 font-bold">ΔE Baseline = 12.6</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Key System Features
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Comprehensive computer-vision framework for continuous industrial workplace exposure safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Passive H₂S Detection',
              desc: 'Employs a copper-based chemical sensing strip protected by a gas-permeable microporous PTFE membrane.',
              icon: Watch,
              color: 'text-blue-600 bg-blue-50 border-blue-200'
            },
            {
              title: 'Camera-Based Color Analysis',
              desc: 'Uses smartphone camera to capture sensing strips and extract CIE Lab color space metrics.',
              icon: Camera,
              color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
            },
            {
              title: 'AI-Assisted Quantitative Reading',
              desc: 'Maps Delta E color difference to H₂S concentration using scikit-learn regression models.',
              icon: Cpu,
              color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
            },
            {
              title: 'Cumulative Exposure Monitoring',
              desc: 'Calculates continuous exposure dosage in ppm·hr over daily, weekly, and monthly shifts.',
              icon: Activity,
              color: 'text-amber-600 bg-amber-50 border-amber-200'
            },
            {
              title: 'Replaceable Sensing Cartridge',
              desc: 'Tracks cartridge age, scan history, and threshold saturation for seamless replacement workflows.',
              icon: ShieldCheck,
              color: 'text-purple-600 bg-purple-50 border-purple-200'
            },
            {
              title: 'Worker Safety Analytics',
              desc: 'Provides automated risk distribution graphs, OSHA/NIOSH threshold compliance, and exportable PDF logs.',
              icon: BarChart3,
              color: 'text-rose-600 bg-rose-50 border-rose-200'
            }
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
                <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center border shadow-xs`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* End-to-End Workflow Pipeline Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              System Architecture Workflow
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
              From physical CuS chemical reaction to computer vision color extraction & AI exposure decision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 flex flex-col items-center text-center space-y-3 relative group hover:border-brand-500 transition">
                  <span className="absolute -top-3 left-4 bg-slate-900 border border-slate-700 text-brand-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Step {idx + 1}
                  </span>
                  <div className={`w-10 h-10 rounded-xl ${step.color} text-white flex items-center justify-center shadow-md mt-1`}>
                    <Icon size={20} />
                  </div>
                  <h4 className="text-xs font-bold text-white">{step.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-r from-brand-900 via-slate-900 to-brand-950 text-white rounded-3xl p-10 shadow-xl border border-brand-800 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black">Ready to Test the H₂S Exposure Scanner?</h2>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Experience the camera scanning workflow, inspect live CIE Lab Delta E metrics, and explore worker safety analytics.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/scan"
            className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-xl shadow-lg flex items-center gap-2 transition"
          >
            <Camera size={18} />
            <span>Open Camera Scanner</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

function SlidersIcon(props: any) {
  return <Cpu {...props} />;
}
