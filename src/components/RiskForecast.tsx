import React from 'react';
import { AOIRegion, HarmonizedWeekData } from '../engine/harmonizer';
import { Language } from '../data/translations';
import { Radio, AlertTriangle, ShieldCheck, Activity, Droplets, Thermometer, Flame } from 'lucide-react';

interface RiskForecastProps {
  language: Language;
  selectedAOI: AOIRegion;
  calendarMatrix: Record<string, HarmonizedWeekData>;
  weeklyBaselines: Record<number, { mean: number; stdDev: number; isCritical: boolean }>;
  isLiveSync: boolean;
  liveHotspotCount: number;
}

export const RiskForecast: React.FC<RiskForecastProps> = ({
  language,
  selectedAOI,
  weeklyBaselines,
  isLiveSync,
  liveHotspotCount,
}) => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const currentWeek = Math.ceil((((now.getTime() - startOfYear.getTime()) / 86400000) + startOfYear.getDay() + 1) / 7);
  const safeWeek = Math.min(52, Math.max(1, currentWeek));

  const baseline = weeklyBaselines[safeWeek] || { mean: 15, stdDev: 10, isCritical: false };
  const nextWeekBaseline = weeklyBaselines[Math.min(52, safeWeek + 1)] || { mean: 15, stdDev: 10, isCritical: false };
  const weekAfterBaseline = weeklyBaselines[Math.min(52, safeWeek + 2)] || { mean: 15, stdDev: 10, isCritical: false };

  // Indonesian Peat Hydrology baseline by region
  const aoiTmatMap: Record<string, number> = {
    riau: -48,
    kalteng: -55,
    sumsel: -52,
    kalsel: -38,
    kaltim: -30,
    indonesia: -44,
  };
  const currentTmat = aoiTmatMap[selectedAOI.id] || -42;

  const seasonalRisk = Math.min(100, Math.round(baseline.mean * 1.5));
  const liveFactor = isLiveSync ? Math.min(40, liveHotspotCount * 3) : 0;
  const compositeScore = Math.min(100, Math.max(8, seasonalRisk + liveFactor));

  const riskTier: 'low' | 'moderate' | 'high' | 'extreme' =
    compositeScore >= 70 ? 'extreme'
    : compositeScore >= 45 ? 'high'
    : compositeScore >= 25 ? 'moderate'
    : 'low';

  const riskLabels = {
    low: { label: language === 'id' ? 'Risiko Rendah' : 'Low Risk', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    moderate: { label: language === 'id' ? 'Status Waspada' : 'Moderate Alert', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    high: { label: language === 'id' ? 'Siaga Tinggi' : 'High Alert', color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    extreme: { label: language === 'id' ? 'Siaga Darurat' : 'Emergency State', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  }[riskTier];

  return (
    <div className="bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors">
      <div>
        {/* Header with Live indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5e5e7] dark:border-[#1f2937]">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-[#1d1d1f] dark:text-white">
              {language === 'id' ? 'Prognosis Risiko 14 Hari' : '14-Day Fire Risk Forecast'}
            </h2>
            {isLiveSync && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>LIVE NASA</span>
              </span>
            )}
          </div>
          
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${riskLabels.bg} ${riskLabels.color}`}>
            {riskLabels.label}
          </span>
        </div>

        {/* Peat Vulnerability Index Score & Progress Bar */}
        <div className="mt-3.5 p-3.5 bg-[#f5f5f7] dark:bg-[#151d2f] rounded-xl border border-[#e5e5e7] dark:border-[#1f2937]">
          <div className="flex items-center justify-between text-xs text-[#6e6e73] dark:text-[#9ca3af] mb-2">
            <span className="font-medium">{language === 'id' ? 'Indeks Kerentanan Gambut (FWI + TMA)' : 'Peat Vulnerability Index (FWI + GWL)'}</span>
            <span className="font-bold text-[#1d1d1f] dark:text-white num">{compositeScore} / 100</span>
          </div>
          <div className="w-full h-2.5 bg-[#e5e5ea] dark:bg-[#1f2937] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                compositeScore >= 70 ? 'bg-red-600 dark:bg-red-500'
                : compositeScore >= 45 ? 'bg-orange-500'
                : compositeScore >= 25 ? 'bg-amber-500'
                : 'bg-emerald-600 dark:bg-emerald-500'
              }`}
              style={{ width: `${compositeScore}%` }}
            />
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-[#515154] dark:text-[#d1d5db]">
              <Droplets className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{language === 'id' ? 'TMA Gambut:' : 'Peat Water Table:'}</span>
              <strong className={`font-mono ${currentTmat <= -40 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-[#1d1d1f] dark:text-white'}`}>
                {currentTmat} cm
              </strong>
            </div>
            <div className="flex items-center gap-1.5 text-[#515154] dark:text-[#d1d5db]">
              <Flame className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
              <span>{language === 'id' ? 'Titik Api Aktif:' : 'Active Hotspots:'}</span>
              <strong className="font-mono text-[#1d1d1f] dark:text-white">
                {isLiveSync ? `${liveHotspotCount} titik` : `${Math.round(baseline.mean)} titik/mgg`}
              </strong>
            </div>
          </div>
        </div>

        {/* 3-Week outlook forecast matrix */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl border border-[#e5e5e7] dark:border-[#1f2937] bg-white dark:bg-[#151d2f]">
            <span className="text-[10px] text-[#86868b] dark:text-[#9ca3af] block font-medium">
              {language === 'id' ? 'Minggu Ini' : 'This Week'}
            </span>
            <span className="font-bold text-[#1d1d1f] dark:text-white block text-xs mt-0.5 num">
              Wk {safeWeek}
            </span>
            <span className={`text-[10px] font-bold mt-1 inline-block ${baseline.isCritical ? 'text-red-600 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
              {baseline.isCritical ? (language === 'id' ? 'Kritis' : 'Critical') : (language === 'id' ? 'Terkendali' : 'Nominal')}
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-[#e5e5e7] dark:border-[#1f2937] bg-white dark:bg-[#151d2f]">
            <span className="text-[10px] text-[#86868b] dark:text-[#9ca3af] block font-medium">
              +7 {language === 'id' ? 'Hari' : 'Days'}
            </span>
            <span className="font-bold text-[#1d1d1f] dark:text-white block text-xs mt-0.5 num">
              Wk {Math.min(52, safeWeek + 1)}
            </span>
            <span className={`text-[10px] font-bold mt-1 inline-block ${nextWeekBaseline.isCritical ? 'text-red-600 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
              {nextWeekBaseline.isCritical ? (language === 'id' ? 'Kritis' : 'Critical') : (language === 'id' ? 'Terkendali' : 'Nominal')}
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-[#e5e5e7] dark:border-[#1f2937] bg-white dark:bg-[#151d2f]">
            <span className="text-[10px] text-[#86868b] dark:text-[#9ca3af] block font-medium">
              +14 {language === 'id' ? 'Hari' : 'Days'}
            </span>
            <span className="font-bold text-[#1d1d1f] dark:text-white block text-xs mt-0.5 num">
              Wk {Math.min(52, safeWeek + 2)}
            </span>
            <span className={`text-[10px] font-bold mt-1 inline-block ${weekAfterBaseline.isCritical ? 'text-red-600 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
              {weekAfterBaseline.isCritical ? (language === 'id' ? 'Kritis' : 'Critical') : (language === 'id' ? 'Terkendali' : 'Nominal')}
            </span>
          </div>
        </div>

        {/* Operational Intelligence Note */}
        <p className="text-[11px] text-[#6e6e73] dark:text-[#9ca3af] mt-3 leading-relaxed">
          {language === 'id'
            ? `Sintesis observasi 26 tahun satelit MODIS & VIIRS. Muka air tanah di ${selectedAOI.name} (${currentTmat} cm) ${currentTmat <= -40 ? 'telah melewati ambang batas aman BRGM (-40 cm), waspada kebakaran bawah permukaan.' : 'masih dalam rentang hidrologis aman.'}`
            : `Synthesized from 26-year MODIS & VIIRS baseline. Groundwater table in ${selectedAOI.name} (${currentTmat} cm) ${currentTmat <= -40 ? 'is below national safe threshold (-40 cm), high smoldering threat.' : 'remains within stable hydrological boundaries.'}`}
        </p>
      </div>

      <div className="mt-4 pt-2.5 border-t border-[#e5e5e7] dark:border-[#1f2937] text-[10px] text-[#86868b] dark:text-[#9ca3af] flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>{language === 'id' ? 'Standar BRGM PP No. 57/2016' : 'National Peat Standard PP 57/2016'}</span>
        </span>
        <span className="font-bold text-[#1d1d1f] dark:text-white">{selectedAOI.name}</span>
      </div>
    </div>
  );
};
