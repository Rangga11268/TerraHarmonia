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
    sm: { img: 'w-6 h-6 rounded-md', title: 'text-sm font-semibold', sub: 'text-[9px]' },
    md: { img: 'w-8 h-8 rounded-lg', title: 'text-base font-semibold', sub: 'text-[10px]' },
    lg: { img: 'w-10 h-10 rounded-xl', title: 'text-lg font-bold', sub: 'text-xs' },
  };

  const { img, title, sub } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div className={`overflow-hidden shrink-0 border border-black/10 shadow-[0_1px_3px_rgba(0,0,0,0.08)] bg-white ${img}`}>
        <img
          src="/terra_harmonia_logo.jpg"
          alt="Terra Harmonia"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
      <div className="flex flex-col justify-center min-w-0 leading-none">
        <div className={`tracking-tight text-[#1d1d1f] ${title}`}>
          Terra Harmonia
        </div>
        {showSubtitle && (
          <span className={`text-[#86868b] tracking-normal mt-0.5 hidden sm:block ${sub}`}>
            NASA Space Apps 2026
          </span>
        )}
      </div>
    </div>
  );
};
