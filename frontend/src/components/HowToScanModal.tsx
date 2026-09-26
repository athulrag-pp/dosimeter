import React from 'react';
import { Camera, CheckCircle2, AlertTriangle, ShieldCheck, X } from 'lucide-react';

interface HowToScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCamera: () => void;
}

export const HowToScanModal: React.FC<HowToScanModalProps> = ({ isOpen, onClose, onStartCamera }) => {
  if (!isOpen) return null;

  const steps = [
    { title: 'Place on Flat Surface', desc: 'Lay the wristband flat under even ambient illumination.' },
    { title: 'Expose Sensing Strip', desc: 'Ensure the microporous PTFE membrane window is clean and uncovered.' },
    { title: 'Avoid Glare & Reflections', desc: 'Position the phone camera to prevent harsh spotlight glare on the sensor strip.' },
    { title: 'Include Reference Patches', desc: 'Ensure all 4 surrounding color reference patches are within the guide frame.' },
    { title: 'Hold Camera Steady', desc: 'Keep your device parallel to the wristband at a distance of 15-25 cm.' },
    { title: 'Align Inside Guide Frame', desc: 'Fit the sensing cartridge squarely inside the central bounding target.' },
    { title: 'Capture Reading', desc: 'Press Capture Reading once all quality indicators show GREEN (GOOD).' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
              <Camera size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">How to Scan Sensing Cartridge</h3>
              <p className="text-xs text-slate-400">Follow these guidelines for optimal CIE Lab accuracy</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition">
            <X size={20} />
          </button>
        </div>

        {/* Steps List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3.5">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-3.5 items-start p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition">
              <span className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-brand-200 shadow-xs">
                {idx + 1}
              </span>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">{step.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}

          {/* Prototype Caution Box */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex gap-2.5 items-start">
            <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Research Demonstration:</strong> Ensure adequate room lighting for accurate CIE Lab white balance color normalization.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onClose();
              onStartCamera();
            }}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl shadow-md flex items-center gap-2 transition active:scale-95"
          >
            <Camera size={18} />
            <span>Start Camera</span>
          </button>
        </div>
      </div>
    </div>
  );
};
