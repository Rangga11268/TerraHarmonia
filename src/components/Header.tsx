import React from 'react';
import { Flame } from 'lucide-react';
import { Language, translations } from '../data/translations';

interface HeaderProps {
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  onOpenTeam: () => void;
}

export const Header: React.FC<HeaderProps> = ({ language, onToggleLanguage, onOpenTeam }) => {
  const t = translations[language];

  return (
    <header className="bg-slate-950 text-white sticky top-0 z-40 shadow-md">
      {/* Amber identity stripe at very top */}
      <div className="h-0.5 bg-amber-600 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Wordmark logo: flame icon + text — no image dependency */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="bg-amber-600 rounded-md p-1.5">
              <Flame className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="min-w-0">
            <div className="font-bold text-base tracking-tight text-white leading-none">
              {t.appName}
            </div>
            <div className="text-[11px] text-slate-400 leading-none mt-0.5 hidden sm:block">
              {t.subTagline}
            </div>
          </div>
        </div>

        {/* Right: language + team */}
        <div className="flex items-center gap-2.5 shrink-0">

          {/* Language pill — minimal, not a pill just a flat toggle */}
          <div className="flex items-center rounded-md overflow-hidden border border-slate-700 text-xs font-semibold">
            <button
              onClick={() => onToggleLanguage('en')}
              className={`px-3 py-1.5 min-h-[34px] transition-colors ${
                language === 'en'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              aria-label="English"
            >
              EN
            </button>
            <button
              onClick={() => onToggleLanguage('id')}
              className={`px-3 py-1.5 min-h-[34px] transition-colors ${
                language === 'id'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              aria-label="Bahasa Indonesia"
            >
              ID
            </button>
          </div>

          {/* Team — text button, not a badge */}
          <button
            onClick={onOpenTeam}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors px-2 py-1.5 min-h-[34px] rounded"
          >
            {t.team}
          </button>
        </div>
      </div>
    </header>
  );
};
