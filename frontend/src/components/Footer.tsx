import React from 'react';
import { ShieldAlert, AlertTriangle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Safety Disclaimer Banner */}
        <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 flex-shrink-0 mt-0.5">
            <AlertTriangle size={22} />
          </div>
          <div className="space-y-1 text-slate-300">
            <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
              <span>Prototype / Research Demonstration Disclaimer</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exposure values shown by this application are estimates generated from colorimetric computer vision image analysis and calibration regression modeling. This prototype is not a certified real-world gas detector, medical device, or replacement for approved industrial H₂S monitoring and personal protective safety procedures.
            </p>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <ShieldAlert size={20} className="text-brand-500" />
              <span>H₂S DoseVision Monitoring</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Software/computer-vision framework for wearable passive H₂S exposure wristbands utilizing copper-based colorimetry and CIE Lab Delta E calibration.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Core Application</h5>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="hover:text-white transition">Worker Dashboard</Link></li>
              <li><Link to="/scan" className="hover:text-white transition">Camera Scanner</Link></li>
              <li><Link to="/history" className="hover:text-white transition">Exposure Log & Export</Link></li>
              <li><Link to="/analytics" className="hover:text-white transition">Safety Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">System & AI</h5>
            <ul className="space-y-2">
              <li><Link to="/calibration" className="hover:text-white transition">Calibration & Regression</Link></li>
              <li><Link to="/wristband" className="hover:text-white transition">Cartridge Management</Link></li>
              <li><Link to="/settings" className="hover:text-white transition">Camera Test Mode</Link></li>
              <li><Link to="/alerts" className="hover:text-white transition">Safety Alerts</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Documentation</h5>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-white transition">CuS Colorimetric Science</Link></li>
              <li><a href="#ptfe" className="hover:text-white transition flex items-center gap-1">PTFE Membrane Specs <ExternalLink size={12} /></a></li>
              <li><a href="#lab" className="hover:text-white transition flex items-center gap-1">CIE Lab ΔE Equation <ExternalLink size={12} /></a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-slate-800/60 text-center text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 H₂S DoseVision System — Smart India Hackathon Research Prototype.</p>
          <p className="text-[11px] text-slate-400">Built with React, TypeScript, OpenCV, FastAPI & scikit-learn</p>
        </div>

      </div>
    </footer>
  );
};
