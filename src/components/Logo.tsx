import React from 'react';

export type LogoVariant = 'full' | 'icon-only' | 'badge' | 'circle' | 'pill';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
export type LogoStyle = 'default' | 'minimal';

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  styleVariant?: LogoStyle;
  className?: string;
  withGlow?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  styleVariant = 'default',
  className = '',
  withGlow = false,
}) => {
  const logoSrc = styleVariant === 'minimal' 
    ? '/terra_harmonia_minimal_logo.jpg' 
    : '/terra_harmonia_logo.jpg';

  // Sizing map for responsive layouts
  const sizeConfig = {
    sm: {
      img: 'w-7 h-7',
      title: 'text-sm font-extrabold',
      subtitle: 'text-[9px]',
      badge: 'px-2 py-0.5 text-[10px]',
      gap: 'gap-2',
    },
    md: {
      img: 'w-9 h-9 sm:w-10 sm:h-10',
      title: 'text-base sm:text-lg font-extrabold',
      subtitle: 'text-[10px] sm:text-[11px]',
      badge: 'px-2.5 py-1 text-xs',
      gap: 'gap-2.5 sm:gap-3',
    },
    lg: {
      img: 'w-12 h-12 sm:w-14 sm:h-14',
      title: 'text-xl sm:text-2xl font-black',
      subtitle: 'text-xs',
      badge: 'px-3 py-1.5 text-xs',
      gap: 'gap-3.5',
    },
    xl: {
      img: 'w-16 h-16 sm:w-20 sm:h-20',
      title: 'text-2xl sm:text-3xl font-black',
      subtitle: 'text-sm',
      badge: 'px-4 py-2 text-sm',
      gap: 'gap-4',
    },
  }[size];

  // Base Image Element using the original logo with clean Apple-style squircle / circle frame
  const LogoImage = (
    <div
      className={`relative shrink-0 overflow-hidden flex items-center justify-center transition-transform duration-200 ${sizeConfig.img} ${
        variant === 'circle'
          ? 'rounded-full'
          : 'rounded-xl sm:rounded-2xl'
      } ${
        withGlow
          ? 'ring-2 ring-amber-500/50 shadow-[0_0_16px_rgba(245,158,11,0.3)]'
          : 'ring-1 ring-black/10 shadow-xs'
      }`}
    >
      <img
        src={logoSrc}
        alt="Terra Harmonia Original Logo"
        className="w-full h-full object-cover object-center"
        loading="eager"
      />
    </div>
  );

  // Variant 1: Icon Only (Square / Rounded / Circle)
  if (variant === 'icon-only' || variant === 'circle') {
    return <div className={`inline-flex items-center ${className}`}>{LogoImage}</div>;
  }

  // Variant 2: Badge / Pill (Compact embedded badge)
  if (variant === 'badge' || variant === 'pill') {
    return (
      <div
        className={`inline-flex items-center ${sizeConfig.gap} ${sizeConfig.badge} rounded-full bg-zinc-100/90 border border-zinc-200/80 shadow-xs ${className}`}
      >
        <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 ring-1 ring-black/10">
          <img
            src={logoSrc}
            alt="Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-bold text-slate-900 tracking-tight leading-none">
          Terra Harmonia
        </span>
      </div>
    );
  }

  // Variant 3: Full Logo (Original Image + Typography)
  return (
    <div className={`inline-flex items-center ${sizeConfig.gap} ${className}`}>
      {LogoImage}
      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`tracking-tight text-slate-900 font-bold ${sizeConfig.title}`}>
            Terra
          </span>
          <span className={`tracking-tight text-amber-600 font-extrabold ${sizeConfig.title}`}>
            Harmonia
          </span>
        </div>
        <span className={`text-zinc-400 font-medium tracking-tight uppercase mt-0.5 hidden sm:block ${sizeConfig.subtitle}`}>
          NASA Space Apps 2026
        </span>
      </div>
    </div>
  );
};
