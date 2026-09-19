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
    sm: { img: 'w-7 h-7 rounded-lg', title: 'text-sm font-bold', sub: 'text-[9px]' },
    md: { img: 'w-9 h-9 rounded-xl', title: 'text-base font-bold', sub: 'text-[10px]' },
    lg: { img: 'w-11 h-11 rounded-2xl', title: 'text-lg font-extrabold', sub: 'text-xs' },
  };

  const { img, title, sub } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Original Terra Harmonia Logo with Crisp Frame & Enhanced Brightness */}
      <div className={`overflow-hidden shrink-0 shadow-sm ring-1 ring-black/10 bg-white ${img}`}>
        <img
          src="/terra_harmonia_logo.jpg"
          alt="Terra Harmonia"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* Apple-style Typography */}
      <div className="flex flex-col justify-center min-w-0 leading-tight">
        <div className={`tracking-tight text-[#1d1d1f] font-bold ${title}`}>
          Terra Harmonia
        </div>
        {showSubtitle && (
          <span className={`text-[#86868b] tracking-normal font-medium hidden sm:block ${sub}`}>
            NASA Space Apps Challenge 2026
          </span>
        )}
      </div>
    </div>
  );
};
