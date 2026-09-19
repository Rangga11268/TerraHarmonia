import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Language, translations } from '../data/translations';

interface NasaApiKeyModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  currentKey: string;
  onSaveKey: (key: string) => void;
  onRefreshLive: () => void;
  isLoading: boolean;
  sourceStatus?: string;
}

export const NasaApiKeyModal: React.FC<NasaApiKeyModalProps> = ({
  language,
  isOpen,
  onClose,
  currentKey,
  onSaveKey,
  onRefreshLive,
  isLoading,
  sourceStatus
}) => {
  const t = translations[language];
  const [inputKey, setInputKey] = useState(currentKey);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKey(inputKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div
        className="bg-white border border-[#e5e5e7] rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nasa-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#86868b] hover:text-[#1d1d1f] p-1.5 rounded-full hover:bg-[#f5f5f7] transition"
          aria-label={t.close}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-4">
          <h3 id="nasa-modal-title" className="text-base font-bold text-[#1d1d1f]">
            {t.apiKeyModalTitle}
          </h3>
          <p className="text-xs text-[#86868b] mt-0.5">NASA FIRMS Active Fire Satellite Feed</p>
        </div>

        <p className="text-xs text-[#6e6e73] leading-relaxed mb-4">{t.apiKeyDesc}</p>

        {sourceStatus && (
          <div className="mb-4 bg-[#f5f5f7] border border-[#e5e5e7] rounded-xl p-3 text-xs text-[#1d1d1f] font-medium">
            {sourceStatus}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
              NASA FIRMS MAP_KEY ({language === 'id' ? 'Opsional' : 'Optional'}):
            </label>
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="e.g. 1a2b3c4d5e6f7g8h9i0j"
              className="w-full bg-[#f5f5f7] border border-[#e5e5e7] rounded-xl px-3.5 py-2 text-xs font-mono text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:border-[#1d1d1f]"
            />
            <p className="text-[11px] text-[#86868b] mt-1.5">
              {language === 'id'
                ? 'Kosongkan untuk menggunakan feed satelit publik terbuka NASA secara otomatis.'
                : 'Leave blank to automatically connect via the open 24-hour global satellite feed.'}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#e5e5e7]">
            <a
              href="https://firms.modaps.eosdis.nasa.gov/api/map_key/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#0071e3] hover:underline flex items-center gap-1 font-medium"
            >
              <span>{t.getFreeKey}</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { onRefreshLive(); onClose(); }}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] rounded-xl border border-[#e5e5e7] transition font-medium min-h-[36px]"
              >
                {t.usePublicFeed}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-[#1d1d1f] hover:bg-black text-white rounded-xl transition shadow-xs min-h-[36px]"
              >
                {t.applyKey}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
