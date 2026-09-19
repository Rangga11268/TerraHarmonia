import React from 'react';
import { Language, translations } from '../data/translations';
import { AOIRegion, PRESET_AOIS } from '../engine/harmonizer';
import { Radio, RefreshCw, Settings2, ChevronDown } from 'lucide-react';

interface DashboardControlBarProps {
  language: Language;
  selectedAOI: AOIRegion;
  onSelectAOI: (aoi: AOIRegion) => void;
  rawMode: boolean;
  setRawMode: (val: boolean) => void;
  isLiveSync: boolean;
  onToggleLiveSync: () => void;
  isLoadingLive: boolean;
  onOpenApiKeyModal: () => void;
}

export const DashboardControlBar: React.FC<DashboardControlBarProps> = ({
  language,
  selectedAOI,
  onSelectAOI,
  rawMode,
  setRawMode,
  isLiveSync,
  onToggleLiveSync,
  isLoadingLive,
  onOpenApiKeyModal,
}) => {
  const t = translations[language];

  return (
    <div className="bg-white border border-[#e5e5e7] rounded-2xl shadow-xs overflow-hidden">
      <div className="px-4 sm:px-5 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">

        {/* Region Selector */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <label htmlFor="aoi-select" className="text-xs font-semibold text-[#86868b] uppercase tracking-wider shrink-0">
            {t.region}
          </label>
          <div className="relative flex-1 max-w-sm min-w-0">
            <select
              id="aoi-select"
              value={selectedAOI.id}
              onChange={(e) => {
                const aoi = PRESET_AOIS.find((a) => a.id === e.target.value);
                if (aoi) onSelectAOI(aoi);
              }}
              className="w-full appearance-none bg-[#f5f5f7] border border-[#e5e5e7] rounded-xl pl-3 pr-8 py-2 text-xs sm:text-sm font-semibold text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] cursor-pointer"
            >
              {PRESET_AOIS.map((aoi) => (
                <option key={aoi.id} value={aoi.id}>
                  {aoi.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] pointer-events-none" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Mode Toggle (Apple style segmented switch) */}
          <div className="flex rounded-xl bg-[#e5e5ea] p-0.5 text-xs font-medium">
            <button
              onClick={() => setRawMode(false)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                !rawMode
                  ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              {t.harmonized}
            </button>
            <button
              onClick={() => setRawMode(true)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                rawMode
                  ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              {t.rawSensors}
            </button>
          </div>

          {/* NASA Live Sync Button */}
          <div className="flex rounded-xl border border-[#e5e5e7] overflow-hidden text-xs">
            <button
              onClick={onToggleLiveSync}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium transition-all ${
                isLiveSync
                  ? 'bg-[#1d1d1f] text-white'
                  : 'bg-white text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'
              }`}
            >
              {isLoadingLive ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : isLiveSync ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              ) : (
                <Radio className="w-3.5 h-3.5" />
              )}
              <span>{isLiveSync ? t.liveSyncActive : t.liveSync}</span>
            </button>
            <button
              onClick={onOpenApiKeyModal}
              className="px-2 bg-white text-[#86868b] hover:text-[#1d1d1f] border-l border-[#e5e5e7] transition hover:bg-[#f5f5f7]"
              title="NASA FIRMS API Key Settings"
              aria-label="API Settings"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Region description footnote */}
      <div className="border-t border-[#e5e5e7] px-4 sm:px-5 py-2 bg-[#fbfbfd] text-xs text-[#86868b] flex items-center gap-2">
        <span className="font-semibold text-[#1d1d1f]">{selectedAOI.biome}</span>
        <span>·</span>
        <span className="truncate">{selectedAOI.description}</span>
      </div>
    </div>
  );
};
