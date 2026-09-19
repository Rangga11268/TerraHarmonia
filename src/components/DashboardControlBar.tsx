import React, { useState, useEffect } from 'react';
import { Globe2, Flame, Satellite } from 'lucide-react';
import { PRESET_AOIS, AOIRegion } from '../engine/harmonizer';
import { Language, translations } from '../data/translations';

interface DashboardControlBarProps {
  language: Language;
  selectedAOI: AOIRegion;
  onSelectAOI: (aoi: AOIRegion) => void;
  rawMode: boolean;
  setRawMode: (val: boolean) => void;
}

export const DashboardControlBar: React.FC<DashboardControlBarProps> = ({
  language,
  selectedAOI,
  onSelectAOI,
  rawMode,
  setRawMode,
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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
      {/* Region Selector */}
      <div className="flex items-center gap-2.5 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 flex-1 max-w-lg">
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
            <option key={aoi.id} value={aoi.id} className="bg-slate-900 text-slate-100">
              {aoi.name} ({aoi.country})
            </option>
          ))}
        </select>
      </div>

      {/* Right Controls: Mode Toggle & UTC Clock */}
      <div className="flex items-center justify-between md:justify-end gap-3">
        {/* Data Mode Switch */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setRawMode(false)}
            className={`px-3 py-1.5 min-h-[38px] text-xs rounded font-medium transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-400 ${
              !rawMode 
                ? 'bg-amber-600 text-white font-semibold' 
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
                ? 'bg-rose-700 text-white font-semibold' 
                : 'text-slate-300 hover:text-white'
            }`}
            title="Show uncalibrated sensor count with resolution bias"
          >
            <Satellite className="w-3.5 h-3.5" />
            {t.rawSensors}
          </button>
        </div>

        {/* Live UTC Clock */}
        <div className="text-xs font-mono text-slate-300 bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg hidden sm:block whitespace-nowrap">
          {utcTime || 'LIVE UTC'}
        </div>
      </div>
    </div>
  );
};
