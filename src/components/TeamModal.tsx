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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-dossier-title"
    >
      <div className="bg-white border border-[#e5e5e7] rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Photo Header */}
        <div className="relative h-48 w-full overflow-hidden bg-[#1d1d1f]">
          <img
            src="/team_photo.jpg"
            alt="Team Terra Harmonia"
            className="w-full h-full object-cover object-top opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/20 shadow-md">
                <img
                  src="/terra_harmonia_logo.jpg"
                  alt="Terra Harmonia"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 id="team-dossier-title" className="text-lg font-bold text-white leading-tight">
                  Terra Harmonia
                </h2>
                <p className="text-xs text-white/70">
                  {language === 'id' ? 'Intelijen Kebakaran Lahan Berbasis Satelit' : 'Multi-Sensor Peatland Wildfire Record'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          <div className="space-y-1.5">
            <div className="font-semibold text-[#1d1d1f] text-sm">
              {t.projectBackground}
            </div>
            <p className="text-[#6e6e73] leading-relaxed">{t.teamPhilosophy}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl border border-[#e5e5e7] bg-[#fbfbfd]">
              <strong className="text-[#1d1d1f] block text-xs mb-0.5">{t.spatialBinningTitle}</strong>
              <span className="text-[#86868b] leading-relaxed block">{t.spatialBinningDesc}</span>
            </div>

            <div className="p-3.5 rounded-xl border border-[#e5e5e7] bg-[#fbfbfd]">
              <strong className="text-[#1d1d1f] block text-xs mb-0.5">{t.frpNormTitle}</strong>
              <span className="text-[#86868b] leading-relaxed block">{t.frpNormDesc}</span>
            </div>
          </div>

          <div className="border-t border-[#e5e5e7] pt-3">
            <div className="font-semibold text-[#1d1d1f] mb-2">
              {t.openDataSources}
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-[#6e6e73]">
              <span className="px-2 py-0.5 rounded-md bg-[#f5f5f7] border border-[#e5e5e7]">NASA FIRMS (MODIS C6.1)</span>
              <span className="px-2 py-0.5 rounded-md bg-[#f5f5f7] border border-[#e5e5e7]">NASA FIRMS (VIIRS VNP14IMGTDL)</span>
              <span className="px-2 py-0.5 rounded-md bg-[#f5f5f7] border border-[#e5e5e7]">Esri World Imagery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
