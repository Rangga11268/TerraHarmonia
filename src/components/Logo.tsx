import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className = '',
  showSubtitle = true,
}) => {
  const sizeMap = {
    sm: { img: 'w-7 h-7', title: 'text-sm font-bold', sub: 'text-[9px]' },
    md: { img: 'w-8.5 h-8.5 sm:w-9 sm:h-9', title: 'text-base font-bold', sub: 'text-[10px]' },
    lg: { img: 'w-11 h-11', title: 'text-lg font-extrabold', sub: 'text-xs' },
  };

  const { img, title, sub } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Pure Transparent Logo Emblem (No Background Box) */}
      <div className={`shrink-0 flex items-center justify-center ${img}`}>
        <img
          src="/terra_harmonia_transparent.svg"
          alt="Terra Harmonia Emblem"
          className="w-full h-full object-contain filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
          loading="eager"
        />
      </div>

      {/* Apple-style Clean Typography */}
      <div className="flex flex-col justify-center min-w-0 leading-tight">
        <div className={`tracking-tight text-[#1d1d1f] dark:text-white font-bold ${title}`}>
          Terra Harmonia
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
