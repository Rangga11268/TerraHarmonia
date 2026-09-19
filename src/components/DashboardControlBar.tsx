import React from 'react';
import { Language, translations } from '../data/translations';
import { AOIRegion, PRESET_AOIS } from '../engine/harmonizer';
import { Flame, Radio, RefreshCw, Satellite, Settings2, ChevronDown } from 'lucide-react';

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
    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm">
      <div className="px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

        {/* Region selector — takes most space */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs font-semibold text-zinc-400 shrink-0 uppercase tracking-wider">
            {t.region}
          </span>
          <div className="relative flex-1 min-w-0">
            <select
              value={selectedAOI.id}
              onChange={(e) => {
                const aoi = PRESET_AOIS.find((a) => a.id === e.target.value);
                if (aoi) onSelectAOI(aoi);
              }}
              className="w-full appearance-none bg-zinc-50 border border-zinc-200 rounded-lg pl-3 pr-8 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent cursor-pointer"
            >
              {PRESET_AOIS.map((aoi) => (
                <option key={aoi.id} value={aoi.id}>
                  {aoi.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        <div className="w-px bg-zinc-200 hidden sm:block self-stretch" />

        {/* Controls row */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Data mode toggle */}
          <div className="flex rounded-lg overflow-hidden border border-zinc-200 text-xs font-semibold">
            <button
              onClick={() => setRawMode(false)}
              className={`flex items-center gap-1.5 px-3 py-2 min-h-[36px] transition-colors ${
                !rawMode
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-zinc-500 hover:bg-zinc-50'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              {t.harmonized}
            </button>
            <button
              onClick={() => setRawMode(true)}
              className={`flex items-center gap-1.5 px-3 py-2 min-h-[36px] transition-colors ${
                rawMode
                  ? 'bg-slate-700 text-white'
                  : 'bg-white text-zinc-500 hover:bg-zinc-50'
              }`}
            >
              <Satellite className="w-3.5 h-3.5" />
              {t.rawSensors}
            </button>
          </div>

          {/* Live NASA feed */}
          <div className="flex rounded-lg overflow-hidden border border-zinc-200 text-xs font-semibold">
            <button
              onClick={onToggleLiveSync}
              className={`flex items-center gap-1.5 px-3 py-2 min-h-[36px] transition-colors ${
                isLiveSync
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-zinc-500 hover:bg-zinc-50'
              }`}
              title={isLiveSync ? 'Kembali ke data arsip' : 'Aktifkan data titik api terkini dari NASA'}
            >
              {isLoadingLive ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : isLiveSync ? (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-200" />
                </span>
              ) : (
                <Radio className="w-3.5 h-3.5" />
              )}
              {isLiveSync ? t.liveSyncActive : t.liveSync}
            </button>
            <button
              onClick={onOpenApiKeyModal}
              className="px-2.5 py-2 min-h-[36px] bg-white text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 transition-colors border-l border-zinc-200"
              aria-label="Pengaturan API NASA"
              title="Pengaturan koneksi NASA FIRMS"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Region description strip */}
      <div className="border-t border-zinc-100 px-4 py-2 text-xs text-zinc-400">
        <span className="text-amber-600 font-semibold">{selectedAOI.biome}</span>
        <span className="mx-1.5">·</span>
        {selectedAOI.description}
      </div>
    </div>
  );
};
