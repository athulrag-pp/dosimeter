import React from 'react';
import { RiskLevel } from '../types';
import { ShieldCheck, AlertTriangle, AlertCircle, Flame } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showIcon = true }) => {
  const getBadgeStyle = () => {
    switch (level) {
      case 'SAFE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ATTENTION':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'HIGH':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-200 animate-pulse';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getIcon = () => {
    const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;
    switch (level) {
      case 'SAFE':
        return <ShieldCheck size={iconSize} className="text-emerald-600" />;
      case 'ATTENTION':
        return <AlertTriangle size={iconSize} className="text-amber-600" />;
      case 'HIGH':
        return <AlertCircle size={iconSize} className="text-orange-600" />;
      case 'CRITICAL':
        return <Flame size={iconSize} className="text-red-600" />;
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-3 py-1 text-xs font-bold tracking-wide uppercase',
    lg: 'px-4 py-1.5 text-sm font-extrabold tracking-wide uppercase'
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${getBadgeStyle()} ${sizeClasses}`}>
      {showIcon && getIcon()}
      <span>{level}</span>
    </span>
  );
};
