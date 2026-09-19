import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Flame, CalendarClock, Users, Droplets } from 'lucide-react';
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
  // Current calendar week of the year
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const currentWeek = Math.ceil((((now.getTime() - startOfYear.getTime()) / 86400000) + startOfYear.getDay() + 1) / 7);
  const safeWeek = Math.min(52, Math.max(1, currentWeek));

  const baseline = weeklyBaselines[safeWeek] || { mean: 15, stdDev: 10, isCritical: false };
  const nextWeekBaseline = weeklyBaselines[Math.min(52, safeWeek + 1)] || { mean: 15, stdDev: 10, isCritical: false };
  const weekAfterBaseline = weeklyBaselines[Math.min(52, safeWeek + 2)] || { mean: 15, stdDev: 10, isCritical: false };

  // Calculate composite risk index (0 - 100)
  const seasonalRisk = Math.min(100, Math.round(baseline.mean * 1.5));
  const liveFactor = isLiveSync ? Math.min(30, liveHotspotCount * 2) : 0;
  const compositeScore = Math.min(100, Math.max(5, seasonalRisk + liveFactor));

  // Determine Risk Tier
  const riskTier: 'low' | 'moderate' | 'high' | 'extreme' =
    compositeScore >= 70 ? 'extreme'
    : compositeScore >= 45 ? 'high'
    : compositeScore >= 25 ? 'moderate'
    : 'low';

  const riskBadgeConfig = {
    low: {
      label: language === 'id' ? 'RENDAH' : 'LOW',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      barBg: 'bg-emerald-500',
      icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
      recommendation: language === 'id'
        ? 'Aktivitas pembakaran terkendali terpantau normal. Lakukan pemantauan rutin posko.'
        : 'Controlled burning conditions normal. Standard monitoring patrol advised.',
    },
    moderate: {
      label: language === 'id' ? 'WASPADA' : 'MODERATE',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      barBg: 'bg-amber-500',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      recommendation: language === 'id'
        ? 'Kadar air gambut mulai menurun. Siagakan Masyarakat Peduli Api (MPA) di tingkat desa.'
        : 'Peat moisture declining. Place Community Fire Teams (MPA) on standby.',
    },
    high: {
      label: language === 'id' ? 'TINGGI' : 'HIGH',
      bg: 'bg-orange-50 text-orange-800 border-orange-200',
      barBg: 'bg-orange-500',
      icon: <Flame className="w-4 h-4 text-orange-600" />,
      recommendation: language === 'id'
        ? 'Zona kritis gambut rentan terbakar. Larang pembersihan lahan dengan api & aktifkan sekat kanal.'
        : 'Critical peat vulnerability. Ban open burning & verify canal block saturation.',
    },
    extreme: {
      label: language === 'id' ? 'SIAGA DARURAT' : 'EXTREME / RED ALERT',
      bg: 'bg-red-50 text-red-800 border-red-200',
      barBg: 'bg-red-600',
      icon: <ShieldAlert className="w-4 h-4 text-red-600" />,
      recommendation: language === 'id'
        ? 'Potensi kebakaran gambut bawah tanah hebat. Terjunkan tim Manggala Agni & water bombing.'
        : 'Severe underground smoldering risk. Dispatch rapid patrol & water bombing readiness.',
    },
  }[riskTier];

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="section-title-bar">
            <h3 className="font-bold text-sm text-slate-900">
              {language === 'id' ? 'Prognosis Risiko 14 Hari' : '14-Day Fire Risk Forecast'}
            </h3>
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border flex items-center gap-1.5 ${riskBadgeConfig.bg}`}>
            {riskBadgeConfig.icon}
            {riskBadgeConfig.label}
          </span>
        </div>

        {/* Risk meter score */}
        <div className="mt-3 p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg">
          <div className="flex items-center justify-between text-xs text-zinc-600 mb-1.5 font-medium">
            <span>{language === 'id' ? 'Indeks Kerentanan Gambut' : 'Peat Fire Vulnerability Index'}</span>
            <span className="font-bold text-slate-900 num text-sm">{compositeScore} / 100</span>
          </div>
          <div className="w-full h-2.5 bg-zinc-200 rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-500 ${riskBadgeConfig.barBg}`}
              style={{ width: `${compositeScore}%` }}
            />
          </div>
          <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
            {riskBadgeConfig.recommendation}
          </p>
        </div>

        {/* 3-Week outlook cards */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] text-zinc-400 block font-medium uppercase">
              {language === 'id' ? 'Minggu Ini' : 'This Week'}
            </span>
            <span className="font-bold text-slate-800 block text-xs mt-0.5 num">
              Wk {safeWeek}
            </span>
            <span className={`text-[10px] font-semibold mt-1 inline-block ${baseline.isCritical ? 'text-red-600' : 'text-emerald-700'}`}>
              {baseline.isCritical ? (language === 'id' ? 'Kritis' : 'Critical') : (language === 'id' ? 'Normal' : 'Normal')}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] text-zinc-400 block font-medium uppercase">
              +7 {language === 'id' ? 'Hari' : 'Days'}
            </span>
            <span className="font-bold text-slate-800 block text-xs mt-0.5 num">
              Wk {Math.min(52, safeWeek + 1)}
            </span>
            <span className={`text-[10px] font-semibold mt-1 inline-block ${nextWeekBaseline.isCritical ? 'text-red-600' : 'text-emerald-700'}`}>
              {nextWeekBaseline.isCritical ? (language === 'id' ? 'Kritis' : 'Critical') : (language === 'id' ? 'Normal' : 'Normal')}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] text-zinc-400 block font-medium uppercase">
              +14 {language === 'id' ? 'Hari' : 'Days'}
            </span>
            <span className="font-bold text-slate-800 block text-xs mt-0.5 num">
              Wk {Math.min(52, safeWeek + 2)}
            </span>
            <span className={`text-[10px] font-semibold mt-1 inline-block ${weekAfterBaseline.isCritical ? 'text-red-600' : 'text-emerald-700'}`}>
              {weekAfterBaseline.isCritical ? (language === 'id' ? 'Kritis' : 'Critical') : (language === 'id' ? 'Normal' : 'Normal')}
            </span>
          </div>
        </div>

        {/* Operational directives */}
        <div className="mt-3 p-3 bg-amber-50/60 border border-amber-200/70 rounded-lg text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
            <Users className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'id' ? 'Rekomendasi Lapangan' : 'Field Directives'}</span>
          </div>
          <div className="space-y-1 text-slate-700 text-[11px] leading-snug">
            <div className="flex items-start gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
              <span>
                {language === 'id'
                  ? `Muka air tanah gambut di ${selectedAOI.name} di bawah pengawasan.`
                  : `Peatland groundwater table in ${selectedAOI.name} under close watch.`}
              </span>
            </div>
            <div className="flex items-start gap-1.5">
              <CalendarClock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                {language === 'id'
                  ? 'Kombinasi data iklim historis 26 tahun + deteksi harian satelit aktif.'
                  : 'Synthesized from 26-year historical climatology + active satellite feed.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer provenance */}
      <div className="mt-4 pt-2 border-t border-zinc-100 text-[10px] text-zinc-400 flex items-center justify-between">
        <span>{language === 'id' ? 'Status: Siaga Operasional' : 'Status: Operational Ready'}</span>
        <span className="font-medium text-slate-600">{selectedAOI.name}</span>
      </div>
    </div>
  );
};
