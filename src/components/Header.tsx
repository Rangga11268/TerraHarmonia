import React from 'react';
import { Award } from 'lucide-react';
import { Language, translations } from '../data/translations';

interface HeaderProps {
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  onOpenTeam: () => void;
}

export const Header: React.FC<HeaderProps> = ({ language, onToggleLanguage, onOpenTeam }) => {
  const t = translations[language];

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/terra_harmonia_logo.jpg"
            alt="Terra Harmonia"
            className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="font-bold text-sm tracking-wide text-white leading-none">
              {t.appName}
            </div>
            <div className="text-[11px] text-slate-400 leading-none mt-0.5 hidden sm:block">
              {t.subTagline}
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Language toggle */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 text-xs font-semibold border border-slate-700">
            <button
              onClick={() => onToggleLanguage('en')}
              className={`px-2.5 py-1.5 rounded min-h-[32px] min-w-[32px] transition-colors ${
                language === 'en'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label="English"
            >
              EN
            </button>
            <button
              onClick={() => onToggleLanguage('id')}
              className={`px-2.5 py-1.5 rounded min-h-[32px] min-w-[32px] transition-colors ${
                language === 'id'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label="Bahasa Indonesia"
            >
              ID
            </button>
          </div>

          {/* Team button */}
          <button
            onClick={onOpenTeam}
            className="flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-orange-300"
          >
            <Award className="w-3.5 h-3.5" />
            <span>{t.team}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
