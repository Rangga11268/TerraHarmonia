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
    const tick = () => setUtcTime(new Date().toUTCString().replace('GMT', 'UTC'));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 shadow-sm">
      {/* Region Selector */}
      <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 flex-1 max-w-md">
        <Globe2 className="w-4 h-4 text-orange-500 shrink-0" />
        <label htmlFor="aoi-selector" className="text-xs text-slate-500 font-semibold whitespace-nowrap">
          {t.region}:
        </label>
        <select
          id="aoi-selector"
          value={selectedAOI.id}
          onChange={(e) => {
            const aoi = PRESET_AOIS.find((a) => a.id === e.target.value);
            if (aoi) onSelectAOI(aoi);
          }}
          className="bg-transparent text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-orange-400 cursor-pointer text-xs sm:text-sm w-full"
        >
          {PRESET_AOIS.map((aoi) => (
            <option key={aoi.id} value={aoi.id}>
              {aoi.name} ({aoi.country})
            </option>
          ))}
        </select>
      </div>

      {/* Right Controls */}
      <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2">
        {/* Live NASA Feed */}
        <div className="flex items-center bg-slate-50 p-0.5 rounded-lg border border-slate-200 gap-0.5">
          <button
            onClick={onToggleLiveSync}
            className={`px-3 py-1.5 min-h-[36px] text-xs rounded-md font-semibold transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              isLiveSync
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title={isLiveSync ? 'Klik untuk kembali ke data arsip' : 'Aktifkan data titik api terkini dari NASA'}
          >
            {isLoadingLive ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : isLiveSync ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            ) : (
              <Radio className="w-3.5 h-3.5" />
            )}
            <span>{isLiveSync ? t.liveSyncActive : t.liveSync}</span>
          </button>
          <button
            onClick={onOpenApiKeyModal}
            className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-slate-100 rounded-md transition-colors"
            title="Pengaturan koneksi NASA FIRMS"
            aria-label="Pengaturan API NASA"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Data Mode */}
        <div className="flex items-center bg-slate-50 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setRawMode(false)}
            className={`px-3 py-1.5 min-h-[36px] text-xs rounded-md font-semibold transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-orange-400 ${
              !rawMode
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            {t.harmonized}
          </button>
          <button
            onClick={() => setRawMode(true)}
            className={`px-3 py-1.5 min-h-[36px] text-xs rounded-md font-semibold transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-red-400 ${
              rawMode
                ? 'bg-red-500 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Tampilkan jumlah deteksi asli dari tiap sensor, tanpa koreksi"
          >
            <Satellite className="w-3.5 h-3.5" />
            {t.rawSensors}
          </button>
        </div>

        {/* UTC Clock */}
        <div className="text-[11px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-2 rounded-lg hidden md:block whitespace-nowrap">
          {utcTime || 'UTC'}
        </div>
      </div>
    </div>
  );
};
