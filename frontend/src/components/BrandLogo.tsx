import React from 'react';

interface BrandLogoProps {
  size?: number;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 36, className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform transition-transform hover:scale-105"
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Protective Shield Contour */}
        <path
          d="M50 5 L85 20 V50 C85 72.5 50 93 50 93 C50 93 15 72.5 15 50 V20 L50 5 Z"
          fill="url(#shieldGrad)"
          stroke="#38bdf8"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Inner Tech Ring */}
        <circle cx="50" cy="46" r="26" stroke="#ffffff" strokeWidth="2" strokeDasharray="6 3" opacity="0.4" />

        {/* Vision Eye / Sensor Lens Motif */}
        <path
          d="M26 46 C33 34 67 34 74 46 C67 58 33 58 26 46 Z"
          fill="#0f172a"
          stroke="url(#eyeGrad)"
          strokeWidth="3.5"
          filter="url(#glow)"
        />

        {/* Central Iris Core */}
        <circle cx="50" cy="46" r="10" fill="url(#eyeGrad)" />
        <circle cx="50" cy="46" r="4" fill="#ffffff" />

        {/* H2S Chemical Gas Dot Indicators */}
        <circle cx="34" cy="30" r="3" fill="#fbbf24" />
        <circle cx="66" cy="30" r="3" fill="#fbbf24" />
        <circle cx="50" cy="74" r="3.5" fill="#34d399" />
      </svg>
    </div>
  );
};
