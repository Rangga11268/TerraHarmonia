import React from 'react';
import { Award, Languages } from 'lucide-react';
import { Language, translations } from '../data/translations';

interface HeaderProps {
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  onOpenTeam: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  onOpenTeam,
}) => {
  const t = translations[language];

  return (
    <header className="bg-slate-800 border-b border-slate-700 text-slate-100 sticky top-0 z-40 px-4 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Clean Left: Logo & Identity */}
        <div className="flex items-center gap-3">
          <img 
            src="/terra_harmonia_logo.jpg" 
            alt="Terra Harmonia Logo" 
            className="w-8 h-8 rounded object-cover border border-slate-600"
          />
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-base text-white">
              {t.appName}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-700/60 text-slate-200 border border-slate-600 font-mono hidden sm:inline-block">
              {t.appTagline}
            </span>
          </div>
        </div>

        {/* Clean Right: Language Toggle & Team Button */}
        <div className="flex items-center gap-2.5">
          {/* Language Toggle */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-700 text-xs font-mono">
            <button
              onClick={() => onToggleLanguage('en')}
              className={`px-2.5 py-1.5 rounded transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center font-bold ${
                language === 'en' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => onToggleLanguage('id')}
              className={`px-2.5 py-1.5 rounded transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center font-bold ${
                language === 'id' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Bahasa Indonesia"
            >
              ID
            </button>
          </div>

          {/* Team Button */}
          <button
            onClick={onOpenTeam}
            className="flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 text-xs font-medium text-amber-300 transition focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>{t.team}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
