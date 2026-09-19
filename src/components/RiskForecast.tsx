import React from 'react';
import { AOIRegion, HarmonizedWeekData } from '../engine/harmonizer';
import { Language } from '../data/translations';

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

  const seasonalRisk = Math.min(100, Math.round(baseline.mean * 1.5));
  const liveFactor = isLiveSync ? Math.min(30, liveHotspotCount * 2) : 0;
  const compositeScore = Math.min(100, Math.max(5, seasonalRisk + liveFactor));

  const riskTier: 'low' | 'moderate' | 'high' | 'extreme' =
    compositeScore >= 70 ? 'extreme'
    : compositeScore >= 45 ? 'high'
    : compositeScore >= 25 ? 'moderate'
    : 'low';

  const riskLabels = {
    low: { label: language === 'id' ? 'Rendah' : 'Low', color: 'text-emerald-700' },
    moderate: { label: language === 'id' ? 'Waspada' : 'Moderate', color: 'text-amber-600' },
    high: { label: language === 'id' ? 'Tinggi' : 'High', color: 'text-orange-600' },
    extreme: { label: language === 'id' ? 'Siaga Darurat' : 'Extreme', color: 'text-red-600' },
  }[riskTier];

  return (
    <div className="bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors">
      <div>
        {/* Clean Header */}
        <div className="flex items-baseline justify-between pb-3 border-b border-[#e5e5e7] dark:border-[#1f2937]">
          <h2 className="font-semibold text-sm text-[#1d1d1f] dark:text-white">
            {language === 'id' ? 'Prognosis Risiko 14 Hari' : '14-Day Fire Risk Forecast'}
          </h2>
          <span className={`text-xs font-bold ${riskLabels.color}`}>
            {riskLabels.label}
          </span>
        </div>

        {/* Risk meter score */}
        <div className="mt-3.5 p-3.5 bg-[#f5f5f7] dark:bg-[#1f2937] rounded-xl border border-[#e5e5e7] dark:border-[#374151]">
          <div className="flex items-center justify-between text-xs text-[#6e6e73] dark:text-[#9ca3af] mb-2">
            <span>{language === 'id' ? 'Indeks Kerentanan Gambut' : 'Peat Vulnerability Index'}</span>
            <span className="font-bold text-[#1d1d1f] dark:text-white num">{compositeScore} / 100</span>
          </div>
          <div className="w-full h-2 bg-[#e5e5ea] dark:bg-[#374151] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1d1d1f] dark:bg-white transition-all duration-300"
              style={{ width: `${compositeScore}%` }}
            />
          </div>
        </div>

        {/* 3-Week outlook cards */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl border border-[#e5e5e7] dark:border-[#374151] bg-white dark:bg-[#1f2937]">
            <span className="text-[10px] text-[#86868b] dark:text-[#9ca3af] block font-medium">
              {language === 'id' ? 'Minggu Ini' : 'This Week'}
            </span>
            <span className="font-bold text-[#1d1d1f] dark:text-white block text-xs mt-0.5 num">
              Wk {safeWeek}
            </span>
            <span className={`text-[10px] font-semibold mt-1 inline-block ${baseline.isCritical ? 'text-red-600 dark:text-red-400' : 'text-[#86868b] dark:text-[#9ca3af]'}`}>
              {baseline.isCritical ? (language === 'id' ? 'Kritis' : 'Critical') : (language === 'id' ? 'Normal' : 'Normal')}
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-[#e5e5e7] dark:border-[#374151] bg-white dark:bg-[#1f2937]">
            <span className="text-[10px] text-[#86868b] dark:text-[#9ca3af] block font-medium">
              +7 {language === 'id' ? 'Hari' : 'Days'}
            </span>
            <span className="font-bold text-[#1d1d1f] dark:text-white block text-xs mt-0.5 num">
              Wk {Math.min(52, safeWeek + 1)}
            </span>
            <span className={`text-[10px] font-semibold mt-1 inline-block ${nextWeekBaseline.isCritical ? 'text-red-600 dark:text-red-400' : 'text-[#86868b] dark:text-[#9ca3af]'}`}>
              {nextWeekBaseline.isCritical ? (language === 'id' ? 'Kritis' : 'Critical') : (language === 'id' ? 'Normal' : 'Normal')}
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-[#e5e5e7] dark:border-[#374151] bg-white dark:bg-[#1f2937]">
            <span className="text-[10px] text-[#86868b] dark:text-[#9ca3af] block font-medium">
              +14 {language === 'id' ? 'Hari' : 'Days'}
            </span>
            <span className="font-bold text-[#1d1d1f] dark:text-white block text-xs mt-0.5 num">
              Wk {Math.min(52, safeWeek + 2)}
            </span>
            <span className={`text-[10px] font-semibold mt-1 inline-block ${weekAfterBaseline.isCritical ? 'text-red-600 dark:text-red-400' : 'text-[#86868b] dark:text-[#9ca3af]'}`}>
              {weekAfterBaseline.isCritical ? (language === 'id' ? 'Kritis' : 'Critical') : (language === 'id' ? 'Normal' : 'Normal')}
            </span>
          </div>
        </div>

        {/* Operational Note */}
        <p className="text-[11px] text-[#6e6e73] dark:text-[#9ca3af] mt-3 leading-relaxed">
          {language === 'id'
            ? `Berdasarkan klimatologi 26 tahun, zona ${selectedAOI.name} memerlukan pemantauan kelembapan gambut secara berkala.`
            : `Synthesized from 26-year baseline and active satellite passes for ${selectedAOI.name}.`}
        </p>
      </div>

      <div className="mt-4 pt-2 border-t border-[#e5e5e7] dark:border-[#1f2937] text-[10px] text-[#86868b] dark:text-[#9ca3af] flex items-center justify-between">
        <span>{language === 'id' ? 'Status Operasional' : 'Operational Status'}</span>
        <span className="font-medium text-[#1d1d1f] dark:text-white">{selectedAOI.name}</span>
      </div>
    </div>
  );
};
