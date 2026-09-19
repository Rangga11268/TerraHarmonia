import React, { useState, useMemo } from 'react';
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

export const PeatlandSimulator: React.FC<PeatlandSimulatorProps> = ({
  language,
  selectedAOI,
}) => {
  const t = translations[language];

  // Parameters
  const [tmagDepthCm, setTmagDepthCm] = useState<number>(-55); // Groundwater table depth in cm (-80 to 0)
  const [daysWithoutRain, setDaysWithoutRain] = useState<number>(14); // 0 to 30 days
  const [windSpeedKnots, setWindSpeedKnots] = useState<number>(12); // 0 to 30 knots
  const [peatDrainageStatus, setPeatDrainageStatus] = useState<'degraded' | 'natural' | 'canal_blocked'>('degraded');

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
    const threatLevel: 'Aman' | 'Waspada' | 'Kritis' | 'Darurat' =
      moisturePct < 100 || (tmagDepthCm <= -60 && daysWithoutRain >= 14)
        ? 'Darurat'
        : tmagDepthCm <= -40 || daysWithoutRain >= 10
        ? 'Kritis'
        : tmagDepthCm <= -25
        ? 'Waspada'
        : 'Aman';

    return {
      isCritical,
      drynessFactor,
      moisturePct,
      surfaceSpreadMph,
      undergroundSpreadCmDay,
      burnDepthCm,
      co2eTonsPerHa,
      waterNeededM3PerHa,
      threatLevel,
    };
  }, [tmagDepthCm, daysWithoutRain, windSpeedKnots, peatDrainageStatus]);

  return (
    <div className="bg-white border border-[#e5e5e7] rounded-2xl p-4 sm:p-6 shadow-xs space-y-5 transition-all">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-[#e5e5e7]">
        <div>
          <div className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
            {language === 'id' ? 'Simulator Hidrologi & Perambatan Api Gambut' : 'Peatland Hydrology & Underground Fire Simulator'}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#1d1d1f] tracking-tight mt-0.5">
            {language === 'id'
              ? 'Model Dinamika Muka Air Tanah (TMAG) & Emisi Bawah Permukaan'
              : 'Groundwater Table (TMAG) Dynamics & Smoldering Fire Physics'}
          </h2>
          <p className="text-xs text-[#6e6e73] mt-1 leading-relaxed max-w-3xl">
            {language === 'id'
              ? 'Kebakaran gambut Indonesia membakar lapisan bawah tanah saat Tinggi Muka Air Tanah (TMAG) turun melewati ambang batas kritis BRGM (-40 cm). Simulasikan skenario hidrologi untuk menghitung laju rambat dan kebutuhan air pemadaman.'
              : 'Indonesian peat fires smolder underground when the groundwater table drops below the BRGM statutory critical threshold (-40 cm). Simulate hydrology scenarios to calculate burn depth and quenching water requirements.'}
          </p>
        </div>

        {/* Threat Level Badge */}
        <div className={`px-4 py-2 rounded-2xl border text-center shrink-0 ${
          simResults.threatLevel === 'Darurat'
            ? 'bg-red-50 border-red-200 text-red-700'
            : simResults.threatLevel === 'Kritis'
            ? 'bg-amber-50 border-amber-200 text-amber-700'
            : simResults.threatLevel === 'Waspada'
            ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          <div className="text-[10px] uppercase tracking-wider font-semibold">Status Kerentanan</div>
          <div className="text-base font-extrabold">{simResults.threatLevel}</div>
        </div>
      </div>

      {/* Simulator Controls & Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Interactive Sliders (5 Cols) */}
        <div className="lg:col-span-5 bg-[#fafafa] border border-[#e5e5e7] rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs sm:text-sm text-[#1d1d1f]">Parameter Kondisi Gambut</h3>
            <Sliders className="w-4 h-4 text-[#86868b]" />
          </div>

          {/* Slider 1: TMAG Groundwater Depth */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#1d1d1f]">Kedalaman Muka Air Tanah (TMAG)</span>
              <span className={`font-bold num ${simResults.isCritical ? 'text-red-600' : 'text-emerald-700'}`}>
                {tmagDepthCm} cm {simResults.isCritical ? '(Kritis)' : '(Aman)'}
              </span>
            </div>
            <input
              type="range"
              min="-80"
              max="0"
              step="1"
              value={tmagDepthCm}
              onChange={(e) => setTmagDepthCm(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#e5e5ea] rounded-lg appearance-none cursor-pointer accent-[#1d1d1f]"
            />
            <div className="flex justify-between text-[10px] text-[#86868b]">
              <span>-80 cm (Kering Parah)</span>
              <span className="font-semibold text-red-500">Batas BRGM (-40 cm)</span>
              <span>0 cm (Banjir)</span>
            </div>
          </div>

          {/* Slider 2: Days without Rain (HTH) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#1d1d1f]">Hari Tanpa Hujan (HTH)</span>
              <span className="font-bold text-[#1d1d1f] num">{daysWithoutRain} Hari</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={daysWithoutRain}
              onChange={(e) => setDaysWithoutRain(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#e5e5ea] rounded-lg appearance-none cursor-pointer accent-[#1d1d1f]"
            />
            <div className="flex justify-between text-[10px] text-[#86868b]">
              <span>0 Hari (Hujan)</span>
              <span>15 Hari (Kering)</span>
              <span>30 Hari (Kemarau Ekstrem)</span>
            </div>
          </div>

          {/* Slider 3: Wind Speed */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#1d1d1f]">Kecepatan Angin Permukaan</span>
              <span className="font-bold text-[#1d1d1f] num">{windSpeedKnots} Knot</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={windSpeedKnots}
              onChange={(e) => setWindSpeedKnots(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#e5e5ea] rounded-lg appearance-none cursor-pointer accent-[#1d1d1f]"
            />
          </div>

          {/* Drainage Condition Mode */}
          <div className="space-y-1.5 pt-2 border-t border-[#e5e5e7]">
            <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
              Status Tata Kelola Kanal Gambut:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'degraded', label: 'Terdrainase Terbuka' },
                { id: 'canal_blocked', label: 'Sekat Kanal Aktif' },
                { id: 'natural', label: 'Gambut Alami' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setPeatDrainageStatus(st.id as any)}
                  className={`p-2 rounded-xl text-[11px] font-medium transition-all text-center cursor-pointer ${
                    peatDrainageStatus === st.id
                      ? 'bg-[#1d1d1f] text-white font-bold shadow-xs'
                      : 'bg-white border border-[#e5e5e7] text-[#6e6e73] hover:text-[#1d1d1f]'
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
            
            <div className="p-4 rounded-2xl border border-[#e5e5e7] bg-white shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#86868b] uppercase tracking-wider font-semibold">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span>Kedalaman Bakar Gambut</span>
              </div>
              <div className="text-2xl font-black text-[#1d1d1f] num">
                {simResults.burnDepthCm} cm
              </div>
              <p className="text-[11px] text-[#6e6e73]">Lapisan bahan organik gambut yang terbakar habis</p>
            </div>

            <div className="p-4 rounded-2xl border border-[#e5e5e7] bg-white shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#86868b] uppercase tracking-wider font-semibold">
                <Droplets className="w-3.5 h-3.5 text-[#0071e3]" />
                <span>Kadar Air Gambut (KA)</span>
              </div>
              <div className={`text-2xl font-black num ${simResults.moisturePct < 100 ? 'text-red-600' : 'text-[#0071e3]'}`}>
                {simResults.moisturePct}%
              </div>
              <p className="text-[11px] text-[#6e6e73]">Ambang mudah terbakar: &lt;100%</p>
            </div>

            <div className="p-4 rounded-2xl border border-[#e5e5e7] bg-white shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#86868b] uppercase tracking-wider font-semibold">
                <Wind className="w-3.5 h-3.5 text-amber-500" />
                <span>Emisi Karbon per Hektar</span>
              </div>
              <div className="text-2xl font-black text-[#1d1d1f] num">
                {simResults.co2eTonsPerHa} Ton CO₂e
              </div>
              <p className="text-[11px] text-[#6e6e73]">Gas rumah kaca terlepas ke atmosfer per 1 Ha</p>
            </div>

            <div className="p-4 rounded-2xl border border-[#e5e5e7] bg-white shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#86868b] uppercase tracking-wider font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                <span>Debit Air Pemadaman</span>
              </div>
              <div className="text-2xl font-black text-[#1d1d1f] num">
                {simResults.waterNeededM3PerHa.toLocaleString()} m³/Ha
              </div>
              <p className="text-[11px] text-[#6e6e73]">Volume air untuk pemadaman total bawah tanah</p>
            </div>
          </div>

          {/* Operational Mitigation Directive Box */}
          <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-[#e5e5e7] space-y-2 text-xs">
            <div className="font-bold text-sm text-[#1d1d1f] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#0071e3]" />
              <span>Rekomendasi Rencana Aksi Terpadu ({selectedAOI.name}):</span>
            </div>
            <ul className="space-y-1.5 text-[#6e6e73] list-disc list-inside leading-relaxed text-[11px]">
              {simResults.isCritical ? (
                <>
                  <li className="text-red-700 font-semibold">
                    Tinggi Muka Air Tanah melewati batas kritis BRGM. Tutup segera pintu sekat kanal (canal blocks) untuk membasahi kembali (*rewetting*) kubah gambut.
                  </li>
                  <li>
                    Siagakan regu Manggala Agni dan posko BPBD untuk patroli mandiri dengan radius observasi 5 km dari titik terdeteksi.
                  </li>
                  <li>
                    Siapkan sumur bor darurat dengan kapasitas pompa minimal 500 liter/menit untuk pemadaman asap (*smoldering quenching*).
                  </li>
                </>
              ) : (
                <>
                  <li className="text-emerald-800 font-semibold">
                    Kondisi kelembapan gambut berada pada rentang aman. Lakukan pemantauan tinggi muka air tanah rutin 1x per minggu.
                  </li>
                  <li>
                    Pertahankan elevasi sekat kanal agar air gambut tidak terbuang ke kanal primer.
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
