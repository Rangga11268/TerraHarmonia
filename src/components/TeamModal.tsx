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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-dossier-title"
    >
      <div className="bg-white border border-zinc-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Photo header */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-950">
          <img
            src="/team_photo.jpg"
            alt="Team Terra Harmonia"
            className="w-full h-full object-cover object-top opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/terra_harmonia_logo.jpg"
                alt="Terra Harmonia"
                className="w-12 h-12 rounded-xl object-cover border-2 border-amber-500 shadow-md"
              />
              <div>
                <h2 id="team-dossier-title" className="text-xl font-bold text-white leading-tight">{t.appName}</h2>
                <p className="text-xs text-amber-300 font-medium">
                  {language === 'id' ? 'Intelijen Kebakaran Lahan Berbasis Satelit' : 'Peatland Fire Satellite Intelligence'}
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-black/50 text-amber-200 border border-amber-500/30 text-xs font-medium">
              {t.soloParticipant}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <div className="flex items-center gap-2 text-amber-900 font-bold mb-1.5 text-sm">
              <Star className="w-4 h-4 text-amber-600" />
              {t.projectBackground}
            </div>
            <p className="text-slate-700 leading-relaxed">{t.teamPhilosophy}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 flex items-start gap-2.5">
              <Database className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-xs">{t.spatialBinningTitle}</strong>
                <span className="text-zinc-600 text-xs">{t.spatialBinningDesc}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-xs">{t.frpNormTitle}</strong>
                <span className="text-zinc-600 text-xs">{t.frpNormDesc}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-3">
            <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5 text-xs">
              <Globe className="w-4 h-4 text-amber-600" />
              {t.openDataSources}
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2 py-1 rounded bg-zinc-100 text-slate-700 border border-zinc-200 font-medium">NASA FIRMS (MODIS C6.1)</span>
              <span className="px-2 py-1 rounded bg-zinc-100 text-slate-700 border border-zinc-200 font-medium">NASA FIRMS (VIIRS VNP14IMGTDL)</span>
              <span className="px-2 py-1 rounded bg-zinc-100 text-slate-700 border border-zinc-200 font-medium">Esri World Imagery</span>
              <span className="px-2 py-1 rounded bg-zinc-100 text-slate-700 border border-zinc-200 font-medium">KLHK & BNPB Peatland Baselines</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
