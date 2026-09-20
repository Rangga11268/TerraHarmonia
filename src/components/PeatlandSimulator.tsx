import React, { useState, useMemo, useEffect } from 'react';
import { AOIRegion } from '../engine/harmonizer';
import { Language, translations } from '../data/translations';
import {
  Sliders,
  Flame,
  Droplets,
  Wind,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { LiveWeatherData } from '../services/weatherApi';

interface PeatlandSimulatorProps {
  language: Language;
  selectedAOI: AOIRegion;
  liveWeather?: LiveWeatherData | null;
}

const REGION_TMAG: Record<string, number> = {
  riau: -48,
  kalteng: -55,
  sumsel: -52,
  kalsel: -38,
  kaltim: -30,
  indonesia: -45,
};

export const PeatlandSimulator: React.FC<PeatlandSimulatorProps> = ({
  language,
  selectedAOI,
  liveWeather,
}) => {
  const t = translations[language];

  // Parameters
  const [tmagDepthCm, setTmagDepthCm] = useState<number>(() => REGION_TMAG[selectedAOI.id] || -50);
  const [daysWithoutRain, setDaysWithoutRain] = useState<number>(12); // 0 to 30 days
  const [windSpeedKnots, setWindSpeedKnots] = useState<number>(12); // 0 to 30 knots
  const [peatDrainageStatus, setPeatDrainageStatus] = useState<'degraded' | 'natural' | 'canal_blocked'>('canal_blocked');
  const [installedCanalBlocks, setInstalledCanalBlocks] = useState<number>(120);
  const [useLiveSync, setUseLiveSync] = useState<boolean>(true);

  // Auto-sync parameters when AOI or liveWeather changes if useLiveSync is true
  useEffect(() => {
    if (REGION_TMAG[selectedAOI.id]) {
      const baseTmag = REGION_TMAG[selectedAOI.id];
      setTmagDepthCm(baseTmag);
    }
  }, [selectedAOI]);

  useEffect(() => {
    if (useLiveSync && liveWeather) {
      setWindSpeedKnots(liveWeather.windSpeedKnots || 10);
      setDaysWithoutRain(liveWeather.dryDaysCount || 8);
    }
  }, [useLiveSync, liveWeather]);

  // Physics calculation
  const simResults = useMemo(() => {
    // Canal block impact: Every 25 canal blocks in degraded land elevates water table by ~2.5 cm
    const canalBoost = peatDrainageStatus === 'canal_blocked' ? Math.min(25, Math.round(installedCanalBlocks * 0.1)) : 0;
    const effectiveTmag = Math.min(0, tmagDepthCm + canalBoost);

    // Critical threshold by BRGM is -40 cm
    const isCritical = effectiveTmag <= -40;
    const drynessFactor = Math.min(1.0, Math.max(0.1, (Math.abs(effectiveTmag) / 80) * (1 + daysWithoutRain / 20)));

    // Peat moisture content (Kadar Air Gambut %): Natural is >300%, degraded can drop to 90%
    const moisturePct = Math.round(
      peatDrainageStatus === 'natural'
        ? Math.max(180, 350 - Math.abs(effectiveTmag) * 2 - daysWithoutRain * 3)
        : peatDrainageStatus === 'canal_blocked'
        ? Math.max(140, 280 - Math.abs(effectiveTmag) * 2.2 - daysWithoutRain * 3.5 + canalBoost * 2)
        : Math.max(75, 220 - Math.abs(effectiveTmag) * 3 - daysWithoutRain * 5)
    );

    // Underground fire spread rate (meter per hour)
    const surfaceSpreadMph = ((windSpeedKnots * 0.15 + 0.2) * (300 / Math.max(80, moisturePct))).toFixed(1);
    const undergroundSpreadCmDay = Math.round((Math.abs(effectiveTmag) * 0.35) * (1 + daysWithoutRain / 16));

    // Burn depth in peat layer (cm)
    const burnDepthCm = Math.round(Math.min(Math.abs(effectiveTmag) * 0.7, 15 + (Math.abs(effectiveTmag) - 20) * 0.6));

    // Carbon emissions per hectare (Tons CO2e per Ha)
    // 1 cm peat burn depth ~ 18.5 tons CO2e/Ha
    const co2eTonsPerHa = Math.round(burnDepthCm * 18.5);

    // Potential carbon prevented by canal blocking (Tons CO2e across 1,000 Ha target dome)
    const carbonPrevented1000Ha = canalBoost > 0 ? Math.round(canalBoost * 18.5 * 1000) : 0;

    // Water discharge needed to extinguish 1 hectare of deep smoldering peat (Liters)
    const waterNeededM3PerHa = Math.round(burnDepthCm * 85);

    // Emergency Status
    const threatKey: 'safe' | 'alert' | 'critical' | 'emergency' =
      moisturePct < 100 || (effectiveTmag <= -60 && daysWithoutRain >= 14)
        ? 'emergency'
        : effectiveTmag <= -40 || daysWithoutRain >= 10
        ? 'critical'
        : effectiveTmag <= -25
        ? 'alert'
        : 'safe';

    const threatLabel = {
      safe: t.statusSafe,
      alert: t.statusAlert,
      critical: t.statusCritical,
      emergency: t.statusEmergency,
    }[threatKey];

    return {
      effectiveTmag,
      canalBoost,
      isCritical,
      drynessFactor,
      moisturePct,
      surfaceSpreadMph,
      undergroundSpreadCmDay,
      burnDepthCm,
      co2eTonsPerHa,
      carbonPrevented1000Ha,
      waterNeededM3PerHa,
      threatKey,
      threatLabel,
    };
  }, [tmagDepthCm, daysWithoutRain, windSpeedKnots, peatDrainageStatus, installedCanalBlocks, t]);

  return (
    <div className="bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-2xl p-4 sm:p-6 shadow-xs space-y-5 transition-all">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-[#e5e5e7] dark:border-[#1f2937]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#86868b] dark:text-[#9ca3af] uppercase tracking-wider">
              {t.simTitle}
            </span>
            {liveWeather?.isLive && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>OPEN-METEO LIVE</span>
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#1d1d1f] dark:text-white tracking-tight mt-0.5">
            {t.simSubtitle}
          </h2>
          <p className="text-xs text-[#6e6e73] dark:text-[#9ca3af] mt-1 leading-relaxed max-w-3xl">
            {t.simDescription}
          </p>
        </div>

        {/* Threat Level Badge */}
        <div className={`px-4 py-2 rounded-2xl border text-center shrink-0 ${
          simResults.threatKey === 'emergency'
            ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300'
            : simResults.threatKey === 'critical'
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300'
            : simResults.threatKey === 'alert'
            ? 'bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-900 text-yellow-800 dark:text-yellow-300'
            : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300'
        }`}>
          <div className="text-[10px] uppercase tracking-wider font-semibold">{t.threatLevel}</div>
          <div className="text-base font-extrabold">{simResults.threatLabel}</div>
        </div>
      </div>

      {/* Simulator Controls & Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Interactive Sliders (5 Cols) */}
        <div className="lg:col-span-5 bg-[#fafafa] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs sm:text-sm text-[#1d1d1f] dark:text-white">
              {language === 'id' ? 'Parameter Kondisi Gambut' : 'Peat Condition Parameters'}
            </h3>
            
            {/* Live Auto-Fill Switch */}
            <button
              onClick={() => setUseLiveSync(!useLiveSync)}
              className={`px-2 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                useLiveSync
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] text-[#6e6e73] dark:text-[#9ca3af]'
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>{useLiveSync ? 'Live Sync' : 'Manual'}</span>
            </button>
          </div>

          {/* Control 1: TMAG Groundwater Depth */}
          <div className="space-y-2 bg-white dark:bg-[#111827] p-3.5 rounded-xl border border-[#e5e5e7] dark:border-[#1f2937]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1d1d1f] dark:text-[#e5e5e7]">{t.tmagDepth}</span>
              <div className="flex items-center gap-1.5">
                <span className={`font-bold text-sm num ${simResults.isCritical ? 'text-red-600 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                  {simResults.effectiveTmag} cm
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  simResults.isCritical 
                    ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300' 
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                }`}>
                  {simResults.isCritical ? t.tmagCriticalBadge : t.tmagSafeBadge}
                </span>
              </div>
            </div>

            {/* Stepper + Presets */}
            <div className="flex items-center gap-1.5">
              <div className="grid grid-cols-4 gap-1 flex-1">
                {[
                  { val: -15, label: language === 'id' ? 'Alami (-15)' : 'Natural (-15)' },
                  { val: -35, label: language === 'id' ? 'Waspada (-35)' : 'Caution (-35)' },
                  { val: -45, label: language === 'id' ? 'Kritis (-45)' : 'Critical (-45)' },
                  { val: -65, label: language === 'id' ? 'Darurat (-65)' : 'Severe (-65)' },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setTmagDepthCm(preset.val)}
                    className={`py-1 px-1.5 rounded-lg text-[10.5px] font-medium transition-all text-center cursor-pointer ${
                      tmagDepthCm === preset.val
                        ? 'bg-[#1d1d1f] text-white dark:bg-emerald-600 dark:text-white font-bold shadow-xs'
                        : 'bg-[#f5f5f7] dark:bg-[#1a2333] text-[#6e6e73] dark:text-[#9ca3af] hover:bg-[#e5e5ea] dark:hover:bg-[#253248]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setTmagDepthCm(Math.max(-80, tmagDepthCm - 5))}
                  className="w-7 h-7 rounded-lg bg-[#f5f5f7] dark:bg-[#1a2333] text-[#1d1d1f] dark:text-white hover:bg-[#e5e5ea] dark:hover:bg-[#253248] text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
                  title="-5 cm"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => setTmagDepthCm(Math.min(0, tmagDepthCm + 5))}
                  className="w-7 h-7 rounded-lg bg-[#f5f5f7] dark:bg-[#1a2333] text-[#1d1d1f] dark:text-white hover:bg-[#e5e5ea] dark:hover:bg-[#253248] text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
                  title="+5 cm"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Visual Level Gauge (Non-slider) */}
            <div className="space-y-1 pt-1">
              <div className="w-full h-2 bg-[#e5e5ea] dark:bg-[#1f2937] rounded-full overflow-hidden relative">
                {/* 40cm critical mark */}
                <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-red-500 z-10" title={t.brgmLimit} />
                {/* Water level fill */}
                <div
                  className={`h-full transition-all duration-300 ${
                    simResults.isCritical ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, (1 - Math.abs(simResults.effectiveTmag) / 80) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-[9.5px] text-[#86868b] dark:text-[#9ca3af]">
                <span>-80 cm ({language === 'id' ? 'Kering' : 'Dry'})</span>
                <span className="font-semibold text-red-500 dark:text-red-400">| {t.brgmLimit} (-40 cm)</span>
                <span>0 cm ({language === 'id' ? 'Basah' : 'Wet'})</span>
              </div>
            </div>
          </div>

          {/* Control 2: Days without Rain (HTH) */}
          <div className="space-y-2 bg-white dark:bg-[#111827] p-3.5 rounded-xl border border-[#e5e5e7] dark:border-[#1f2937]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1d1d1f] dark:text-[#e5e5e7]">{t.dryDaysLabel}</span>
              <span className="font-bold text-sm text-[#1d1d1f] dark:text-white num">
                {daysWithoutRain} {language === 'id' ? 'Hari' : 'Days'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="grid grid-cols-4 gap-1 flex-1">
                {[
                  { val: 0, label: language === 'id' ? 'Hujan (0)' : 'Rain (0)' },
                  { val: 5, label: language === 'id' ? 'Normal (5)' : 'Normal (5)' },
                  { val: 12, label: language === 'id' ? 'Kering (12)' : 'Dry (12)' },
                  { val: 20, label: language === 'id' ? 'Kemarau (20)' : 'Drought (20)' },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => {
                      setDaysWithoutRain(preset.val);
                      setUseLiveSync(false);
                    }}
                    className={`py-1 px-1.5 rounded-lg text-[10.5px] font-medium transition-all text-center cursor-pointer ${
                      daysWithoutRain === preset.val
                        ? 'bg-[#1d1d1f] text-white dark:bg-emerald-600 dark:text-white font-bold shadow-xs'
                        : 'bg-[#f5f5f7] dark:bg-[#1a2333] text-[#6e6e73] dark:text-[#9ca3af] hover:bg-[#e5e5ea] dark:hover:bg-[#253248]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setDaysWithoutRain(Math.max(0, daysWithoutRain - 1));
                    setUseLiveSync(false);
                  }}
                  className="w-7 h-7 rounded-lg bg-[#f5f5f7] dark:bg-[#1a2333] text-[#1d1d1f] dark:text-white hover:bg-[#e5e5ea] dark:hover:bg-[#253248] text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDaysWithoutRain(Math.min(30, daysWithoutRain + 1));
                    setUseLiveSync(false);
                  }}
                  className="w-7 h-7 rounded-lg bg-[#f5f5f7] dark:bg-[#1a2333] text-[#1d1d1f] dark:text-white hover:bg-[#e5e5ea] dark:hover:bg-[#253248] text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
                >
                  +1
                </button>
              </div>
            </div>
          </div>

          {/* Control 3: Wind Speed */}
          <div className="space-y-2 bg-white dark:bg-[#111827] p-3.5 rounded-xl border border-[#e5e5e7] dark:border-[#1f2937]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1d1d1f] dark:text-[#e5e5e7]">{t.windSpeedLabel}</span>
              <span className="font-bold text-sm text-[#1d1d1f] dark:text-white num">
                {windSpeedKnots} Knots ({Math.round(windSpeedKnots * 1.852)} km/h)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="grid grid-cols-4 gap-1 flex-1">
                {[
                  { val: 5, label: language === 'id' ? 'Tenang (5)' : 'Light (5)' },
                  { val: 12, label: language === 'id' ? 'Sedang (12)' : 'Mod (12)' },
                  { val: 20, label: language === 'id' ? 'Kencang (20)' : 'High (20)' },
                  { val: 28, label: language === 'id' ? 'Ekstrem (28)' : 'Gale (28)' },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => {
                      setWindSpeedKnots(preset.val);
                      setUseLiveSync(false);
                    }}
                    className={`py-1 px-1.5 rounded-lg text-[10.5px] font-medium transition-all text-center cursor-pointer ${
                      windSpeedKnots === preset.val
                        ? 'bg-[#1d1d1f] text-white dark:bg-emerald-600 dark:text-white font-bold shadow-xs'
                        : 'bg-[#f5f5f7] dark:bg-[#1a2333] text-[#6e6e73] dark:text-[#9ca3af] hover:bg-[#e5e5ea] dark:hover:bg-[#253248]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setWindSpeedKnots(Math.max(0, windSpeedKnots - 2));
                    setUseLiveSync(false);
                  }}
                  className="w-7 h-7 rounded-lg bg-[#f5f5f7] dark:bg-[#1a2333] text-[#1d1d1f] dark:text-white hover:bg-[#e5e5ea] dark:hover:bg-[#253248] text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
                >
                  -2
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWindSpeedKnots(Math.min(40, windSpeedKnots + 2));
                    setUseLiveSync(false);
                  }}
                  className="w-7 h-7 rounded-lg bg-[#f5f5f7] dark:bg-[#1a2333] text-[#1d1d1f] dark:text-white hover:bg-[#e5e5ea] dark:hover:bg-[#253248] text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
                >
                  +2
                </button>
              </div>
            </div>
          </div>

          {/* Drainage Condition Mode */}
          <div className="space-y-1.5 pt-2 border-t border-[#e5e5e7] dark:border-[#1f2937]">
            <span className="text-[11px] font-semibold text-[#86868b] dark:text-[#9ca3af] uppercase tracking-wider block">
              {t.drainageGovLabel}
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'degraded', label: t.drainageOpen },
                { id: 'canal_blocked', label: t.drainageBlocked },
                { id: 'natural', label: t.drainageNatural },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setPeatDrainageStatus(st.id as any)}
                  className={`p-2 rounded-xl text-[11px] font-medium transition-all text-center cursor-pointer min-h-[36px] ${
                    peatDrainageStatus === st.id
                      ? 'bg-[#1d1d1f] dark:bg-emerald-600 text-white font-bold shadow-xs'
                      : 'bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Canal Block Counter (if canal_blocked is active) */}
          {peatDrainageStatus === 'canal_blocked' && (
            <div className="space-y-2 bg-white dark:bg-[#111827] p-3 rounded-xl border border-[#e5e5e7] dark:border-[#1f2937]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#1d1d1f] dark:text-[#e5e5e7]">
                  {language === 'id' ? 'Jumlah Sekat Kanal:' : 'Canal Blocks:'}
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 num">
                  {installedCanalBlocks} Unit (+{simResults.canalBoost} cm TMA)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="grid grid-cols-4 gap-1 flex-1">
                  {[0, 50, 120, 200].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setInstalledCanalBlocks(val)}
                      className={`py-1 px-1.5 rounded-lg text-[10.5px] font-medium transition-all text-center cursor-pointer ${
                        installedCanalBlocks === val
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'bg-[#f5f5f7] dark:bg-[#1a2333] text-[#6e6e73] dark:text-[#9ca3af] hover:bg-[#e5e5ea] dark:hover:bg-[#253248]'
                      }`}
                    >
                      {val} {language === 'id' ? 'Unit' : 'Units'}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setInstalledCanalBlocks(Math.max(0, installedCanalBlocks - 10))}
                    className="w-7 h-7 rounded-lg bg-[#f5f5f7] dark:bg-[#1a2333] text-[#1d1d1f] dark:text-white hover:bg-[#e5e5ea] dark:hover:bg-[#253248] text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
                  >
                    -10
                  </button>
                  <button
                    type="button"
                    onClick={() => setInstalledCanalBlocks(Math.min(300, installedCanalBlocks + 10))}
                    className="w-7 h-7 rounded-lg bg-[#f5f5f7] dark:bg-[#1a2333] text-[#1d1d1f] dark:text-white hover:bg-[#e5e5ea] dark:hover:bg-[#253248] text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
                  >
                    +10
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Computed Physics Results (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Key Physics Metrics 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3">
            
            <div className="p-4 rounded-2xl border border-[#e5e5e7] dark:border-[#1f2937] bg-white dark:bg-[#151d2f] shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#86868b] dark:text-[#9ca3af] uppercase tracking-wider font-semibold">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span>{t.burnDepthLabel}</span>
              </div>
              <div className="text-2xl font-black text-[#1d1d1f] dark:text-white num">
                {simResults.burnDepthCm} cm
              </div>
              <p className="text-[11px] text-[#6e6e73] dark:text-[#9ca3af]">{t.burnDepthDesc}</p>
            </div>

            <div className="p-4 rounded-2xl border border-[#e5e5e7] dark:border-[#1f2937] bg-white dark:bg-[#151d2f] shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#86868b] dark:text-[#9ca3af] uppercase tracking-wider font-semibold">
                <Droplets className="w-3.5 h-3.5 text-[#0071e3] dark:text-[#38bdf8]" />
                <span>{t.moistureLabel}</span>
              </div>
              <div className={`text-2xl font-black num ${simResults.moisturePct < 100 ? 'text-red-600 dark:text-red-400' : 'text-[#0071e3] dark:text-[#38bdf8]'}`}>
                {simResults.moisturePct}%
              </div>
              <p className="text-[11px] text-[#6e6e73] dark:text-[#9ca3af]">{t.moistureDesc}</p>
            </div>

            <div className="p-4 rounded-2xl border border-[#e5e5e7] dark:border-[#1f2937] bg-white dark:bg-[#151d2f] shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#86868b] dark:text-[#9ca3af] uppercase tracking-wider font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.co2eLabel}</span>
              </div>
              <div className="text-2xl font-black text-[#1d1d1f] dark:text-white num">
                {simResults.co2eTonsPerHa} Ton
              </div>
              <p className="text-[11px] text-[#6e6e73] dark:text-[#9ca3af]">{t.co2eDesc}</p>
            </div>

            <div className="p-4 rounded-2xl border border-[#e5e5e7] dark:border-[#1f2937] bg-white dark:bg-[#151d2f] shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#86868b] dark:text-[#9ca3af] uppercase tracking-wider font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.waterNeededLabel}</span>
              </div>
              <div className="text-2xl font-black text-[#1d1d1f] dark:text-white num">
                {simResults.waterNeededM3PerHa} m³
              </div>
              <p className="text-[11px] text-[#6e6e73] dark:text-[#9ca3af]">{t.waterNeededDesc}</p>
            </div>

          </div>

          {/* Action Callout based on TMAG */}
          <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
            simResults.isCritical
              ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
          }`}>
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block text-sm font-bold">
                {simResults.isCritical
                  ? (language === 'id' ? 'Peringatan Mitigasi Lapangan Manggala Agni / BPBD:' : 'Field Mitigation Action Directive:')
                  : (language === 'id' ? 'Status Gambut Terkendali Aman:' : 'Peatland Hydrology Within Safe Range:')}
              </strong>
              <p className="leading-relaxed">
                {simResults.isCritical
                  ? (language === 'id'
                    ? `Tinggi Muka Air Tanah (${simResults.effectiveTmag} cm) telah melewati batas aman BRGM (-40 cm). Lakukan penutupan sekat kanal segera dan siagakan pompa air untuk re-wetting sebelum bara bawah tanah (smoldering) meluas.`
                    : `Groundwater depth (${simResults.effectiveTmag} cm) has fallen below the -40 cm critical threshold. Engage canal gates immediately and mobilize high-pressure pumps for subsurface re-wetting to halt smoldering.`)
                  : (language === 'id'
                    ? `Tinggi Muka Air Tanah (${simResults.effectiveTmag} cm) berada dalam batas aman. Pertahankan pintu sekat kanal tertutup untuk menjaga retensi air menjelang puncak musim kemarau.`
                    : `Groundwater depth (${simResults.effectiveTmag} cm) is within safe ecological parameters. Keep canal blocks active to retain hydrology ahead of peak dry season.`)}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
