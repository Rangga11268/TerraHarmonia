import React, { useState } from 'react';
import { X, Key, Satellite, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div
        className="bg-white border border-zinc-200 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nasa-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
          aria-label={t.close}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-700">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <h3 id="nasa-modal-title" className="text-base font-bold text-slate-900">
              {t.apiKeyModalTitle}
            </h3>
            <p className="text-xs text-zinc-500">NASA FIRMS (Fire Information for Resource Management System)</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">{t.apiKeyDesc}</p>

        {sourceStatus && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-emerald-800 font-medium">{sourceStatus}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-teal-600" />
              NASA FIRMS MAP_KEY ({language === 'id' ? 'Opsional' : 'Optional'}):
            </label>
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="e.g. 1a2b3c4d5e6f7g8h9i0j"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              {language === 'id'
                ? 'Kosongkan untuk menggunakan feed satelit publik NASA secara otomatis.'
                : 'Leave blank to automatically use the open 24-hour global satellite stream.'}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
            <a
              href="https://firms.modaps.eosdis.nasa.gov/api/map_key/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-teal-700 hover:text-teal-800 flex items-center gap-1 font-medium hover:underline"
            >
              <span>{t.getFreeKey}</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { onRefreshLive(); onClose(); }}
                disabled={isLoading}
                className="px-3 py-1.5 min-h-[36px] text-xs bg-zinc-50 hover:bg-zinc-100 text-slate-700 rounded-lg border border-zinc-200 transition-colors flex items-center gap-1.5 font-medium"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                {t.usePublicFeed}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 min-h-[36px] text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-amber-400"
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
