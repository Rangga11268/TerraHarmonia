import React, { useEffect } from 'react';
import { X, Shield, Database, Globe, Star } from 'lucide-react';
import { Language, translations } from '../data/translations';

interface TeamModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const TeamModal: React.FC<TeamModalProps> = ({ language, isOpen, onClose }) => {
  const t = translations[language];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-dossier-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
        {/* Photo header */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden">
          <img
            src="/team_photo.jpg"
            alt="Team Terra Harmonia"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-slate-700 border border-slate-200 transition focus-visible:ring-2 focus-visible:ring-orange-400"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/terra_harmonia_logo.jpg"
                alt="Terra Harmonia"
                className="w-12 h-12 rounded-xl object-cover border-2 border-orange-400"
              />
              <div>
                <h2 id="team-dossier-title" className="text-xl font-bold text-white">{t.appName}</h2>
                <p className="text-xs text-orange-300 font-mono">
                  {language === 'id' ? 'Intelijen Kebakaran Hutan berbasis Satelit' : 'Satellite-based Wildfire Intelligence'}
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 text-xs font-mono">
              {t.soloParticipant}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
            <div className="flex items-center gap-2 text-orange-700 font-semibold mb-1.5 text-sm">
              <Star className="w-4 h-4" />
              {t.projectBackground}
            </div>
            <p className="text-slate-700 leading-relaxed">{t.teamPhilosophy}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <Database className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block text-xs">{t.spatialBinningTitle}</strong>
                <span className="text-slate-600 text-xs">{t.spatialBinningDesc}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block text-xs">{t.frpNormTitle}</strong>
                <span className="text-slate-600 text-xs">{t.frpNormDesc}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <div className="font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-500" />
              {t.openDataSources}
            </div>
            <div className="flex flex-wrap gap-2 font-mono text-[11px]">
              {['NASA FIRMS', 'MODIS (Terra, Aqua)', 'VIIRS (Suomi-NPP, NOAA-20)', 'React + TypeScript', 'Leaflet Geospatial'].map((tag) => (
                <span key={tag} className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-full text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">NASA Space Apps Challenge 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-2 min-h-[44px] rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-semibold transition focus-visible:ring-2 focus-visible:ring-orange-300"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
