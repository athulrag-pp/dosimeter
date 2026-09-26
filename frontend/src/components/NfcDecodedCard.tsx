import React from 'react';
import { NfcData } from '../types';
import { Cpu, ShieldCheck, User, Phone, AlertCircle, Clock } from 'lucide-react';

interface NfcDecodedCardProps {
  nfc?: NfcData;
}

export const NfcDecodedCard: React.FC<NfcDecodedCardProps> = ({ nfc }) => {
  if (!nfc) return null;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-600/30 text-brand-300 flex items-center justify-center font-bold border border-brand-500/40">
            <Cpu size={18} />
          </div>
          <div>
            <h3 className="text-base font-black text-white">NFC Chip Memory Decoded</h3>
            <p className="text-[11px] text-slate-400 font-mono">Encoded ID: {nfc.nfc_chip_id}</p>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-brand-500/20 text-brand-300 text-[11px] font-bold rounded-lg border border-brand-500/30">
          NFC READ SUCCESS
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Worker Identity</span>
          <div className="font-bold text-slate-200">{nfc.full_name} ({nfc.worker_id})</div>
        </div>

        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Group & Allergies</span>
          <div className="font-bold text-emerald-400 font-mono">
            {nfc.blood_group} • {nfc.medical_allergies.join(', ')}
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Emergency Medic Contact</span>
          <div className="font-bold text-slate-300">{nfc.emergency_contact}</div>
        </div>

        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Shift Medical Clearance</span>
          <div className="font-bold text-brand-300">{nfc.medical_clearance}</div>
        </div>
      </div>
    </div>
  );
};
