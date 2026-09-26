import React from 'react';
import { Info } from 'lucide-react';

export const DemoDataTag: React.FC<{ label?: string }> = ({ label = 'DEMO DATA – PROTOTYPE ESTIMATE' }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-semibold rounded-md shadow-xs">
      <Info size={13} className="text-amber-600 flex-shrink-0" />
      <span>{label}</span>
    </div>
  );
};
