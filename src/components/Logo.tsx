import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSubtitle?: boolean;
  showNasaBadge?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className = '',
  showSubtitle = true,
  showNasaBadge = true,
}) => {
  const sizeMap = {
    sm: {
      emblem: 'w-7 h-7',
      nasa: 'w-6 h-6',
      title: 'text-sm font-bold',
      sub: 'text-[9px]',
      cross: 'text-xs',
    },
    md: {
      emblem: 'w-8.5 h-8.5 sm:w-9 sm:h-9',
      nasa: 'w-7.5 h-7.5 sm:w-8 sm:h-8',
      title: 'text-base font-bold',
      sub: 'text-[10px]',
      cross: 'text-xs',
    },
    lg: {
      emblem: 'w-11 h-11',
      nasa: 'w-9.5 h-9.5',
      title: 'text-lg font-extrabold',
      sub: 'text-xs',
      cross: 'text-sm',
    },
  };

  const { emblem, nasa, title, sub, cross } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Dual Logo Lockup: Terra Harmonia Emblem × NASA Meatball */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Terra Harmonia Emblem */}
        <div className={`flex items-center justify-center ${emblem}`}>
          <img
            src="/terra_harmonia_transparent.svg"
            alt="Terra Harmonia Emblem"
            className="w-full h-full object-contain filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
            loading="eager"
          />
        </div>

        {showNasaBadge && (
          <>
            {/* Minimal Cross Divider */}
            <span className={`text-[#86868b] dark:text-[#6b7280] font-medium opacity-60 select-none ${cross}`}>
              ×
            </span>

            {/* Official NASA Insignia */}
            <div className={`flex items-center justify-center ${nasa} rounded-full overflow-hidden shadow-2xs`}>
              <img
                src="/nasa_meatball.svg"
                alt="NASA Insignia"
                className="w-full h-full object-contain hover:scale-105 transition-transform"
                loading="eager"
              />
            </div>
          </>
        )}
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center min-w-0 leading-tight">
        <div className={`tracking-tight text-[#1d1d1f] dark:text-white font-bold flex items-center gap-1.5 ${title}`}>
          <span>Terra Harmonia</span>
        </div>
        {showSubtitle && (
          <span className={`text-[#86868b] dark:text-[#9ca3af] tracking-normal font-medium hidden sm:block ${sub}`}>
            NASA Space Apps Challenge 2026
          </span>
        )}
      </div>
    </div>
  );
};
