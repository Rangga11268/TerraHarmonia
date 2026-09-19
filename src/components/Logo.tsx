import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'badge';
  withGlow?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  withGlow = false,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 26, text: 'text-sm', sub: 'text-[10px]', gap: 'gap-2' },
    md: { icon: 34, text: 'text-base', sub: 'text-[11px]', gap: 'gap-2.5' },
    lg: { icon: 44, text: 'text-lg', sub: 'text-xs', gap: 'gap-3' },
    xl: { icon: 56, text: 'text-2xl', sub: 'text-sm', gap: 'gap-3.5' },
  };

  const { icon, text, sub, gap } = sizeMap[size];

  // Precision Vector SVG Emblem (Transparent background, NASA Orbital Ring + Earth-Thermal Core)
  const VectorEmblem = (
    <div
      className={`relative flex items-center justify-center shrink-0 ${withGlow ? 'drop-shadow-[0_0_12px_rgba(245,158,11,0.35)]' : ''}`}
      style={{ width: icon, height: icon }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Deep space base circle */}
        <circle cx="50" cy="50" r="46" className="fill-slate-950" />
        
        {/* Subtle grid latitude lines (NASA Earth Observation motif) */}
        <ellipse cx="50" cy="50" rx="42" ry="18" stroke="#334155" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
        <ellipse cx="50" cy="50" rx="42" ry="32" stroke="#334155" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.4" />
        <line x1="50" y1="4" x2="50" y2="96" stroke="#334155" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.5" />

        {/* Orbit Path (VIIRS / MODIS Sun-synchronous orbit) */}
        <ellipse
          cx="50"
          cy="50"
          rx="44"
          ry="20"
          transform="rotate(-28 50 50)"
          stroke="url(#orbitGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Active Satellite Nodes */}
        <circle cx="20" cy="34" r="3.5" fill="#38bdf8" />
        <circle cx="80" cy="66" r="3" fill="#f59e0b" />

        {/* Inner Peatland / Thermal Flame Core */}
        <defs>
          <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>

          <linearGradient id="coreFireGradient" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="40%" stopColor="#ea580c" />
            <stop offset="80%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
        </defs>

        {/* Harmonized Flame Shape */}
        <path
          d="M50 22 C55 33 66 42 66 56 C66 68 58 76 50 76 C42 76 34 68 34 56 C34 46 41 38 46 30 Z"
          fill="url(#coreFireGradient)"
        />
        
        {/* Inner Flame Glow */}
        <path
          d="M50 40 C52 46 58 52 58 60 C58 66 54 70 50 70 C46 70 42 66 42 60 C42 54 46 48 50 40 Z"
          fill="#fef08a"
          opacity="0.9"
        />
      </svg>
    </div>
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center ${className}`}>{VectorEmblem}</div>;
  }

  return (
    <div className={`inline-flex items-center ${gap} ${className}`}>
      {VectorEmblem}
      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight text-slate-900 ${text}`}>
            TERRA
          </span>
          <span className={`font-light tracking-widest text-amber-600 ${text}`}>
            HARMONIA
          </span>
        </div>
        <span className={`text-zinc-400 font-medium tracking-tight uppercase mt-0.5 hidden sm:block ${sub}`}>
          NASA Space Apps 2026
        </span>
      </div>
    </div>
  );
};
