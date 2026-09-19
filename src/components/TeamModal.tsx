import React, { useEffect } from 'react';
import { X, Shield, Database, Globe, Sparkles } from 'lucide-react';
import { Language, translations } from '../data/translations';

interface TeamModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const TeamModal: React.FC<TeamModalProps> = ({ language, isOpen, onClose }) => {
  const t = translations[language];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90"
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-dossier-title"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden border-b border-slate-800">
          <img 
            src="/team_photo.jpg" 
            alt="Team Terra Harmonia Lead" 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 transition focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/terra_harmonia_logo.jpg" 
                alt="Terra Harmonia Emblem" 
                className="w-12 h-12 rounded-lg object-cover border border-amber-500/80"
              />
              <div>
                <h2 id="team-dossier-title" className="text-xl font-bold tracking-wide text-white">
                  {t.appName}
                </h2>
                <p className="text-xs text-amber-300 font-mono">
                  {language === 'id' ? 'Intelijen dan Harmonisasi Kebakaran Hutan' : 'Wildfire Intelligence and Harmonization'}
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-mono">
              {t.soloParticipant}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1 text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.projectBackground}</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              {t.teamPhilosophy}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5">
              <Database className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 block text-xs">{t.spatialBinningTitle}</strong>
                <span className="text-slate-300 text-xs">
                  {t.spatialBinningDesc}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 block text-xs">{t.frpNormTitle}</strong>
                <span className="text-slate-300 text-xs">
                  {t.frpNormDesc}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3">
            <div className="font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>{t.openDataSources}</span>
            </div>
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-slate-300">NASA FIRMS</span>
              <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-slate-300">MODIS (Terra, Aqua)</span>
              <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-slate-300">VIIRS (Suomi-NPP, NOAA-20)</span>
              <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-cyan-300">React + TypeScript</span>
              <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-cyan-300">Leaflet Geospatial</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">NASA Space Apps Challenge 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-2 min-h-[44px] rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
