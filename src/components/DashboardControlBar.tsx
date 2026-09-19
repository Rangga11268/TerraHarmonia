import React, { useState, useEffect } from 'react';
import { Globe2, Flame, Satellite, Radio, Settings2, RefreshCw } from 'lucide-react';
import { PRESET_AOIS, AOIRegion } from '../engine/harmonizer';
import { Language, translations } from '../data/translations';

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
  onOpenApiKeyModal
}) => {
  const t = translations[language];
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 sm:p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 shadow-md">
      {/* Region Selector */}
      <div className="flex items-center gap-2.5 bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-700/80 flex-1 max-w-md">
        <Globe2 className="w-4 h-4 text-cyan-400 shrink-0" />
        <label htmlFor="aoi-selector" className="text-xs text-slate-300 font-semibold whitespace-nowrap">
          {t.region}:
        </label>
        <select
          id="aoi-selector"
          value={selectedAOI.id}
          onChange={(e) => {
            const aoi = PRESET_AOIS.find((a) => a.id === e.target.value);
            if (aoi) onSelectAOI(aoi);
          }}
          className="bg-transparent text-white font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer text-xs sm:text-sm w-full"
        >
          {PRESET_AOIS.map((aoi) => (
            <option key={aoi.id} value={aoi.id} className="bg-slate-800 text-slate-100">
              {aoi.name} ({aoi.country})
            </option>
          ))}
        </select>
      </div>

      {/* Center/Right Controls: Live Sync, Mode Toggle & UTC Clock */}
      <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2.5">
        {/* Live NASA FIRMS Feed Switch */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-700/80 gap-1">
          <button
            onClick={onToggleLiveSync}
            className={`px-3 py-1.5 min-h-[38px] text-xs rounded font-medium transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              isLiveSync
                ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Switch between Live 24h NASA FIRMS feed and 26-year archive"
          >
            {isLoadingLive ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-300" />
            ) : isLiveSync ? (
              <span className="relative flex h-2.5 w-2.5 mr-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            ) : (
              <Radio className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{isLiveSync ? t.liveSyncActive : t.liveSync}</span>
          </button>

          <button
            onClick={onOpenApiKeyModal}
            className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors"
            title="Configure NASA FIRMS API Key / Connection"
            aria-label="NASA API Settings"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Data Mode Switch */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-700/80">
          <button
            onClick={() => setRawMode(false)}
            className={`px-3 py-1.5 min-h-[38px] text-xs rounded font-medium transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-400 ${
              !rawMode 
                ? 'bg-amber-600 text-white font-semibold shadow-sm' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            {t.harmonized}
          </button>
          <button
            onClick={() => setRawMode(true)}
            className={`px-3 py-1.5 min-h-[38px] text-xs rounded font-medium transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-rose-400 ${
              rawMode 
                ? 'bg-rose-700 text-white font-semibold shadow-sm' 
                : 'text-slate-300 hover:text-white'
            }`}
            title="Show uncalibrated sensor count with resolution bias"
          >
            <Satellite className="w-3.5 h-3.5" />
            {t.rawSensors}
          </button>
        </div>

        {/* Live UTC Clock */}
        <div className="text-xs font-mono text-slate-300 bg-slate-900/90 border border-slate-700/80 px-3 py-2 rounded-lg hidden sm:block whitespace-nowrap">
          {utcTime || 'LIVE UTC'}
        </div>
      </div>
    </div>
  );
};
