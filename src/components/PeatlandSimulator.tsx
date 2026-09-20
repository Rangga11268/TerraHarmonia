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
} from 'lucide-react';

interface PeatlandSimulatorProps {
  language: Language;
  selectedAOI: AOIRegion;
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
}) => {
  const t = translations[language];

  // Parameters
  const [tmagDepthCm, setTmagDepthCm] = useState<number>(() => REGION_TMAG[selectedAOI.id] || -50);
  const [daysWithoutRain, setDaysWithoutRain] = useState<number>(14); // 0 to 30 days
  const [windSpeedKnots, setWindSpeedKnots] = useState<number>(12); // 0 to 30 knots
  const [peatDrainageStatus, setPeatDrainageStatus] = useState<'degraded' | 'natural' | 'canal_blocked'>('canal_blocked');

  // Auto-sync TMAG with AOI
  useEffect(() => {
    if (REGION_TMAG[selectedAOI.id]) {
      setTmagDepthCm(REGION_TMAG[selectedAOI.id]);
    }
  }, [selectedAOI]);

  // Physics calculation
  const simResults = useMemo(() => {
    // Critical threshold by BRGM is -40 cm
    const isCritical = tmagDepthCm <= -40;
    const drynessFactor = Math.min(1.0, Math.max(0.1, (Math.abs(tmagDepthCm) / 80) * (1 + daysWithoutRain / 20)));

    // Peat moisture content (Kadar Air Gambut %): Natural is >300%, degraded can drop to 90%
    const moisturePct = Math.round(
      peatDrainageStatus === 'natural'
        ? Math.max(180, 350 - Math.abs(tmagDepthCm) * 2 - daysWithoutRain * 3)
        : peatDrainageStatus === 'canal_blocked'
        ? Math.max(140, 280 - Math.abs(tmagDepthCm) * 2.5 - daysWithoutRain * 4)
        : Math.max(75, 220 - Math.abs(tmagDepthCm) * 3 - daysWithoutRain * 5)
    );

    // Underground fire spread rate (meter per hour)
    const surfaceSpreadMph = ((windSpeedKnots * 0.15 + 0.2) * (300 / moisturePct)).toFixed(1);
    const undergroundSpreadCmDay = Math.round((Math.abs(tmagDepthCm) * 0.4) * (1 + daysWithoutRain / 15));

    // Burn depth in peat layer (cm)
    const burnDepthCm = Math.round(Math.min(Math.abs(tmagDepthCm) * 0.7, 15 + (Math.abs(tmagDepthCm) - 20) * 0.6));

    // Carbon emissions per hectare (Tons CO2e per Ha)
    // 1 cm peat burn depth ~ 18 tons CO2e/Ha
    const co2eTonsPerHa = Math.round(burnDepthCm * 18.5);

    // Water discharge needed to extinguish 1 hectare of deep smoldering peat (Liters)
    const waterNeededM3PerHa = Math.round(burnDepthCm * 85);

    // Emergency Status
    const threatKey: 'safe' | 'alert' | 'critical' | 'emergency' =
      moisturePct < 100 || (tmagDepthCm <= -60 && daysWithoutRain >= 14)
        ? 'emergency'
        : tmagDepthCm <= -40 || daysWithoutRain >= 10
        ? 'critical'
        : tmagDepthCm <= -25
        ? 'alert'
        : 'safe';

    const threatLabel = {
      safe: t.statusSafe,
      alert: t.statusAlert,
      critical: t.statusCritical,
      emergency: t.statusEmergency,
    }[threatKey];

    return {
      isCritical,
      drynessFactor,
      moisturePct,
      surfaceSpreadMph,
      undergroundSpreadCmDay,
      burnDepthCm,
      co2eTonsPerHa,
      waterNeededM3PerHa,
      threatKey,
      threatLabel,
    };
  }, [tmagDepthCm, daysWithoutRain, windSpeedKnots, peatDrainageStatus, t]);

  return (
    <div className="bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-2xl p-4 sm:p-6 shadow-xs space-y-5 transition-all">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-[#e5e5e7] dark:border-[#1f2937]">
        <div>
          <div className="text-xs font-semibold text-[#86868b] dark:text-[#9ca3af] uppercase tracking-wider">
            {t.simTitle}
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
            <Sliders className="w-4 h-4 text-[#86868b] dark:text-[#9ca3af]" />
          </div>

          {/* Slider 1: TMAG Groundwater Depth */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#1d1d1f] dark:text-[#e5e5e7]">{t.tmagDepth}</span>
              <span className={`font-bold num ${simResults.isCritical ? 'text-red-600 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                {tmagDepthCm} cm {simResults.isCritical ? t.tmagCriticalBadge : t.tmagSafeBadge}
              </span>
            </div>
            <input
              type="range"
              min="-80"
              max="0"
              step="1"
              value={tmagDepthCm}
              onChange={(e) => setTmagDepthCm(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#e5e5ea] dark:bg-[#1f2937] rounded-lg appearance-none cursor-pointer accent-[#1d1d1f] dark:accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-[#86868b] dark:text-[#9ca3af]">
              <span>-80 cm ({language === 'id' ? 'Kering Parah' : 'Severe Dry'})</span>
              <span className="font-semibold text-red-500 dark:text-red-400">{t.brgmLimit}</span>
              <span>0 cm ({language === 'id' ? 'Banjir' : 'Inundated'})</span>
            </div>
          </div>

          {/* Slider 2: Days without Rain (HTH) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#1d1d1f] dark:text-[#e5e5e7]">{t.dryDaysLabel}</span>
              <span className="font-bold text-[#1d1d1f] dark:text-white num">{daysWithoutRain} {language === 'id' ? 'Hari' : 'Days'}</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={daysWithoutRain}
              onChange={(e) => setDaysWithoutRain(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#e5e5ea] dark:bg-[#1f2937] rounded-lg appearance-none cursor-pointer accent-[#1d1d1f] dark:accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-[#86868b] dark:text-[#9ca3af]">
              <span>0 {language === 'id' ? 'Hari (Hujan)' : 'Days (Rain)'}</span>
              <span>15 {language === 'id' ? 'Hari (Kering)' : 'Days (Dry)'}</span>
              <span>30 {language === 'id' ? 'Hari (Kemarau Ekstrem)' : 'Days (Severe Drought)'}</span>
            </div>
          </div>

          {/* Slider 3: Wind Speed */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#1d1d1f] dark:text-[#e5e5e7]">{t.windSpeedLabel}</span>
              <span className="font-bold text-[#1d1d1f] dark:text-white num">{windSpeedKnots} Knots</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={windSpeedKnots}
              onChange={(e) => setWindSpeedKnots(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#e5e5ea] dark:bg-[#1f2937] rounded-lg appearance-none cursor-pointer accent-[#1d1d1f] dark:accent-emerald-400"
            />
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
                    ? `Tinggi Muka Air Tanah (${tmagDepthCm} cm) telah melewati batas aman BRGM (-40 cm). Lakukan penutupan sekat kanal segera dan siagakan pompa air untuk re-wetting sebelum bara bawah tanah (smoldering) meluas.`
                    : `Groundwater depth (${tmagDepthCm} cm) has fallen below the -40 cm critical threshold. Engage canal gates immediately and mobilize high-pressure pumps for subsurface re-wetting to halt smoldering.`)
                  : (language === 'id'
                    ? `Tinggi Muka Air Tanah (${tmagDepthCm} cm) berada dalam batas aman. Pertahankan pintu sekat kanal tertutup untuk menjaga retensi air menjelang puncak musim kemarau.`
                    : `Groundwater depth (${tmagDepthCm} cm) is within safe ecological parameters. Keep canal blocks active to retain hydrology ahead of peak dry season.`)}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
