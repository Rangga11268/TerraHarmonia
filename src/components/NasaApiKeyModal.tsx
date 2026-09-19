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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nasa-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label={t.close}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-cyan-50 border border-cyan-200 rounded-xl text-cyan-600">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <h3 id="nasa-modal-title" className="text-base font-bold text-slate-900">
              {t.apiKeyModalTitle}
            </h3>
            <p className="text-xs text-slate-500">NASA FIRMS (Fire Information for Resource Management System)</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">{t.apiKeyDesc}</p>

        {sourceStatus && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-emerald-700">{sourceStatus}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-500" />
              NASA FIRMS MAP_KEY ({language === 'id' ? 'Opsional' : 'Optional'}):
            </label>
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="e.g. 1a2b3c4d5e6f7g8h9i0j"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              {language === 'id'
                ? 'Kosongkan untuk menggunakan feed publik NASA secara otomatis.'
                : 'Leave blank to automatically use the open 24-hour global satellite stream.'}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <a
              href="https://firms.modaps.eosdis.nasa.gov/api/map_key/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-600 hover:text-cyan-700 flex items-center gap-1 hover:underline"
            >
              <span>{t.getFreeKey}</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { onRefreshLive(); onClose(); }}
                disabled={isLoading}
                className="px-3 py-1.5 min-h-[36px] text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                {t.usePublicFeed}
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 min-h-[36px] text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-cyan-400"
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
