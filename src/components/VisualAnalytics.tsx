import React, { useState, useMemo } from 'react';
import { AOIRegion, HarmonizedWeekData } from '../engine/harmonizer';
import { Language, translations } from '../data/translations';
import {
  TrendingUp,
  BarChart3,
  Flame,
  Layers,
  Info,
  Calendar,
  Wind,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';

interface VisualAnalyticsProps {
  language: Language;
  selectedAOI: AOIRegion;
  calendarMatrix: Record<string, HarmonizedWeekData>;
  rawMode: boolean;
}

type ChartTab = 'trend' | 'seasonality' | 'provincial' | 'physics';

export const VisualAnalytics: React.FC<VisualAnalyticsProps> = ({
  language,
  selectedAOI,
  calendarMatrix,
  rawMode,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<ChartTab>('trend');
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [overlayYear, setOverlayYear] = useState<number>(2015);

  const MONTHS = language === 'id'
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // 1. 26-Year Trend Aggregation (2000-2026)
  const yearlyTrendData = useMemo(() => {
    const list: Array<{
      year: number;
      rawCount: number;
      modisCount: number;
      viirsCount: number;
      harmonizedCount: number;
      totalFRP: number;
      co2eTons: number;
      isElNino: boolean;
      sensorEra: 'MODIS' | 'DUAL';
    }> = [];

    for (let yr = 2000; yr <= 2026; yr++) {
      let rawCount = 0;
      let modisCount = 0;
      let viirsCount = 0;
      let harmonizedCount = 0;
      let totalFRP = 0;

      for (let w = 1; w <= 52; w++) {
        const item = calendarMatrix[`${yr}-${w}`];
        if (item) {
          rawCount += item.rawTotalCount;
          modisCount += item.rawModisCount;
          viirsCount += item.rawViirsCount;
          harmonizedCount += item.harmonizedClusterCount;
          totalFRP += item.totalFrpCalibrated;
        }
      }

      list.push({
        year: yr,
        rawCount,
        modisCount,
        viirsCount,
        harmonizedCount,
        totalFRP,
        co2eTons: Math.round(totalFRP * 14.8),
        isElNino: yr === 2006 || yr === 2015 || yr === 2019 || yr === 2023,
        sensorEra: yr >= 2012 ? 'DUAL' : 'MODIS',
      });
    }

    return list;
  }, [calendarMatrix]);

  // Max values for scale
  const maxRaw = useMemo(() => Math.max(...yearlyTrendData.map((d) => d.rawCount), 100), [yearlyTrendData]);
  const maxHarmonized = useMemo(() => Math.max(...yearlyTrendData.map((d) => d.harmonizedCount), 50), [yearlyTrendData]);
  const maxFRP = useMemo(() => Math.max(...yearlyTrendData.map((d) => d.totalFRP), 1000), [yearlyTrendData]);

  // 2. Monthly Climatological Seasonality Aggregation (Jan - Dec)
  const monthlySeasonalityData = useMemo(() => {
    const list: Array<{
      month: number;
      monthName: string;
      climatologyAvg: number;
      overlayYearValue: number;
      isPeakDry: boolean;
      isSecondaryPeak: boolean;
    }> = [];

    for (let m = 1; m <= 12; m++) {
      let sumHarmonized = 0;
      let count = 0;
      let overlaySum = 0;

      for (let yr = 2000; yr <= 2026; yr++) {
        for (let w = 1; w <= 52; w++) {
          const item = calendarMatrix[`${yr}-${w}`];
          if (item && item.month === m) {
            sumHarmonized += item.harmonizedClusterCount;
            count++;
            if (yr === overlayYear) {
              overlaySum += item.harmonizedClusterCount;
            }
          }
        }
      }

      const avg = count > 0 ? Math.round(sumHarmonized / 27) : 0;

      list.push({
        month: m,
        monthName: MONTHS[m - 1],
        climatologyAvg: avg,
        overlayYearValue: overlaySum,
        isPeakDry: m >= 8 && m <= 10,
        isSecondaryPeak: m === 2 || m === 3,
      });
    }

    return list;
  }, [calendarMatrix, overlayYear, MONTHS]);

  const maxMonthlyVal = useMemo(
    () => Math.max(...monthlySeasonalityData.map((d) => Math.max(d.climatologyAvg, d.overlayYearValue)), 50),
    [monthlySeasonalityData]
  );

  // 3. Provincial Peatland Carbon & Fire Energy Comparison
  const provincialRankings = useMemo(() => {
    return [
      { name: 'Kalimantan Tengah (Sebangau/PLG)', island: 'Kalimantan', frpMW: 48200, co2eMt: 71.3, khgDepthCm: 68, riskLevel: 'Kritis' },
      { name: 'Riau (Kampar/Siak/Pelalawan)', island: 'Sumatera', frpMW: 42100, co2eMt: 62.3, khgDepthCm: 62, riskLevel: 'Kritis' },
      { name: 'Sumatera Selatan (Kubah OKI)', island: 'Sumatera', frpMW: 36800, co2eMt: 54.5, khgDepthCm: 59, riskLevel: 'Tinggi' },
      { name: 'Kalimantan Barat (Ketapang/Rasau)', island: 'Kalimantan', frpMW: 29500, co2eMt: 43.7, khgDepthCm: 54, riskLevel: 'Tinggi' },
      { name: 'Papua Selatan (Merauke/Mappi)', island: 'Papua', frpMW: 24100, co2eMt: 35.6, khgDepthCm: 48, riskLevel: 'Waspada' },
      { name: 'Kalimantan Selatan (Banjar/Barito)', island: 'Kalimantan', frpMW: 18900, co2eMt: 28.0, khgDepthCm: 45, riskLevel: 'Waspada' },
      { name: 'Jambi (Berbak/Tanjab)', island: 'Sumatera', frpMW: 15400, co2eMt: 22.8, khgDepthCm: 42, riskLevel: 'Waspada' },
      { name: 'Kalimantan Timur (Kutai/Berau)', island: 'Kalimantan', frpMW: 12800, co2eMt: 18.9, khgDepthCm: 38, riskLevel: 'Sedang' },
    ];
  }, []);

  return (
    <div className="bg-white border border-[#e5e5e7] rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
      
      {/* Header & Question Being Answered */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#e5e5e7]">
        <div>
          <div className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
            {language === 'id' ? 'Visualisasi Data & Analitik Ilmiah' : 'Visual Analytics & Scientific Intelligence'}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#1d1d1f] tracking-tight mt-0.5">
            {activeTab === 'trend'
              ? (language === 'id' ? 'Apakah Lonjakan Titik Api Pasca-2012 Nyata atau Efek Resolusi Sensor?' : 'Is the Post-2012 Fire Surge Real or a Sensor Footprint Artifact?')
              : activeTab === 'seasonality'
              ? (language === 'id' ? 'Kapan Puncak Musiman Kebakaran Terjadi & Kapan Patroli Harus Siaga?' : 'When is the Seasonal Peat Fire Peak & When Should Patrols Deploy?')
              : activeTab === 'provincial'
              ? (language === 'id' ? 'Provinsi Mana Penyumbang Emisi Karbon Gambut (CO₂e) Terbesar?' : 'Which Provinces Emit the Highest Peatland CO₂e Carbon?')
              : (language === 'id' ? 'Fisika Resolusi Piksel Satelit: MODIS 1km vs VIIRS 375m' : 'Pixel Resolution Physics: MODIS 1km vs VIIRS 375m')}
          </h2>
          <p className="text-xs text-[#6e6e73] mt-1 leading-relaxed">
            {activeTab === 'trend'
              ? (language === 'id' ? 'Membandingkan jumlah deteksi mentah satelit dengan klaster terharmonisasi 5.5 km NASA selama 26 tahun observasi (2000–2026).' : 'Comparing raw multi-satellite detections against NASA 5.5 km harmonized clusters across 26 years (2000–2026).')
              : activeTab === 'seasonality'
              ? (language === 'id' ? 'Kurva siklus musiman bulanan lahan gambut Indonesia dengan pita kemarau utama (Agustus–Oktober) dan puncak Riau (Februari–Maret).' : 'Monthly climatology seasonality curve with primary dry season (Aug–Oct) and early Sumatra peak (Feb–Mar).')
              : activeTab === 'provincial'
              ? (language === 'id' ? 'Peringkat pelepasan energi termal radiatif (FRP Megawatt) dan estimasi emisi karbon gambut per kawasan prioritas BRGM.' : 'Ranked thermal radiative energy (FRP MW) and estimated peat carbon release across Indonesian priority zones.')
              : (language === 'id' ? 'Pemodelan geometri tumpang-tindih footprint sensor satelit Terra/Aqua (1000m) dan Suomi-NPP (375m).' : 'Geometric footprint modeling of MODIS (1000m) vs VIIRS (375m) satellite co-detections.')}
          </p>
        </div>

        {/* Tab Navigator */}
        <div className="flex items-center bg-[#f5f5f7] rounded-xl p-0.5 text-xs font-medium border border-[#e5e5e7] shrink-0 overflow-x-auto">
          {[
            { id: 'trend' as ChartTab, label: language === 'id' ? 'Tren 26 Tahun' : '26-Year Trend', icon: TrendingUp },
            { id: 'seasonality' as ChartTab, label: language === 'id' ? 'Siklus Musiman' : 'Seasonality', icon: Calendar },
            { id: 'provincial' as ChartTab, label: language === 'id' ? 'Emisi per Provinsi' : 'Provincial Carbon', icon: BarChart3 },
            { id: 'physics' as ChartTab, label: language === 'id' ? 'Fisika Sensor' : 'Sensor Physics', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isSel
                    ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: 26-Year Sensor Shift & Calibration Line Chart */}
      {activeTab === 'trend' && (
        <div className="space-y-4">
          
          {/* SVG Multi-Line Chart Canvas */}
          <div className="relative border border-[#e5e5e7] rounded-xl bg-[#fafafa] p-4 sm:p-5 overflow-hidden">
            
            {/* Chart Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-3">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 bg-[#86868b] border-t border-dashed border-[#1d1d1f]" />
                  <span className="text-[#6e6e73]">Deteksi Mentah Satelit (*Raw Spike*)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-1 bg-[#0071e3] rounded-full" />
                  <span className="font-semibold text-[#1d1d1f]">Klaster Terharmonisasi (NASA 5.5 km)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-red-100 border border-red-200 rounded-xs" />
                  <span className="text-red-700 font-medium">Anomali El Niño</span>
                </div>
              </div>
              <span className="text-[11px] text-[#86868b]">Arahkan kursor ke titik tahun untuk detail</span>
            </div>

            {/* Responsive SVG Chart */}
            <div className="w-full h-64 sm:h-72">
              <svg viewBox="0 0 1000 300" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="harmonizedAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0071e3" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0071e3" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 75, 150, 225].map((y) => (
                  <line key={y} x1="40" y1={y + 30} x2="980" y2={y + 30} stroke="#e5e5e7" strokeWidth="1" strokeDasharray="4 4" />
                ))}

                {/* 2012 Sensor Transition Vertical Divider */}
                <line x1="477" y1="20" x2="477" y2="265" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.8" />
                <text x="482" y="32" fill="#ea580c" fontSize="11" fontWeight="700">Peluncuran VIIRS (2012)</text>

                {/* El Niño Reference Shaded Columns */}
                {yearlyTrendData.map((d, i) => {
                  if (!d.isElNino) return null;
                  const x = 50 + (i / 26) * 920;
                  return (
                    <rect
                      key={d.year}
                      x={x - 14}
                      y="20"
                      width="28"
                      height="245"
                      fill="#fee2e2"
                      fillOpacity="0.5"
                      rx="4"
                    />
                  );
                })}

                {/* Harmonized Area Fill */}
                <path
                  d={`M ${yearlyTrendData
                    .map((d, i) => {
                      const x = 50 + (i / 26) * 920;
                      const y = 265 - (d.harmonizedCount / maxHarmonized) * 220;
                      return `${x},${y}`;
                    })
                    .join(' L ')} L 970,265 L 50,265 Z`}
                  fill="url(#harmonizedAreaGrad)"
                />

                {/* Raw Curve Path (Gray/Black Dashed Line) */}
                <path
                  d={`M ${yearlyTrendData
                    .map((d, i) => {
                      const x = 50 + (i / 26) * 920;
                      const y = 265 - (d.rawCount / maxRaw) * 220;
                      return `${x},${y}`;
                    })
                    .join(' L ')}`}
                  fill="none"
                  stroke="#475569"
                  strokeWidth="2.2"
                  strokeDasharray="5 3"
                />

                {/* Harmonized Line (Solid Blue NASA line) */}
                <path
                  d={`M ${yearlyTrendData
                    .map((d, i) => {
                      const x = 50 + (i / 26) * 920;
                      const y = 265 - (d.harmonizedCount / maxHarmonized) * 220;
                      return `${x},${y}`;
                    })
                    .join(' L ')}`}
                  fill="none"
                  stroke="#0071e3"
                  strokeWidth="3.5"
                />

                {/* Interactive Points & Tooltip Triggers */}
                {yearlyTrendData.map((d, i) => {
                  const x = 50 + (i / 26) * 920;
                  const yHarm = 265 - (d.harmonizedCount / maxHarmonized) * 220;
                  const yRaw = 265 - (d.rawCount / maxRaw) * 220;
                  const isHover = hoveredYear === d.year;

                  return (
                    <g key={d.year} className="cursor-pointer" onMouseEnter={() => setHoveredYear(d.year)} onMouseLeave={() => setHoveredYear(null)}>
                      {/* Interactive hit area */}
                      <rect x={x - 16} y="0" width="32" height="280" fill="transparent" />

                      {/* Raw node */}
                      <circle cx={x} cy={yRaw} r={isHover ? 5 : 3} fill="#475569" stroke="#ffffff" strokeWidth="1.5" />

                      {/* Harmonized node */}
                      <circle cx={x} cy={yHarm} r={isHover ? 7 : 4.5} fill="#0071e3" stroke="#ffffff" strokeWidth="2" />

                      {/* Year label on x-axis */}
                      <text
                        x={x}
                        y="285"
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight={d.year % 5 === 0 || isHover ? '700' : '400'}
                        fill={isHover ? '#0071e3' : '#64748b'}
                      >
                        {d.year % 4 === 0 || d.year === 2026 ? d.year : ''}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Hover / Selected Year Insight Card */}
          {(() => {
            const yrData = yearlyTrendData.find((d) => d.year === (hoveredYear || 2015)) || yearlyTrendData[15];
            const inflationFactor = yrData.rawCount > 0 && yrData.harmonizedCount > 0 ? (yrData.rawCount / yrData.harmonizedCount).toFixed(1) : '1.0';

            return (
              <div className="p-4 bg-[#f5f5f7] border border-[#e5e5e7] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-sm text-[#1d1d1f] flex items-center gap-2">
                    <span>Tahun {yrData.year}</span>
                    <span className="font-semibold text-xs px-2 py-0.5 rounded bg-white border border-[#e5e5e7] text-[#6e6e73]">
                      Era {yrData.sensorEra === 'DUAL' ? 'VIIRS 375m + MODIS 1km' : 'MODIS 1km Tunggal'}
                    </span>
                    {yrData.isElNino && (
                      <span className="font-bold text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">
                        Anomali El Niño
                      </span>
                    )}
                  </div>
                  <div className="text-[#6e6e73] space-x-3">
                    <span>Deteksi Mentah: <strong className="text-[#1d1d1f] num">{yrData.rawCount.toLocaleString()} titik</strong></span>
                    <span>&bull;</span>
                    <span>Klaster Terharmonisasi: <strong className="text-[#0071e3] num">{yrData.harmonizedCount.toLocaleString()} klaster</strong></span>
                    <span>&bull;</span>
                    <span>Faktor Inflasi Sensor: <strong className="text-amber-700 num">{inflationFactor}x</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[#86868b] sm:border-l sm:border-[#e5e5e7] sm:pl-4 shrink-0">
                  <div>
                    <span className="text-[10px] block">Daya Termal (FRP)</span>
                    <span className="font-bold text-[#1d1d1f] num text-sm">{yrData.totalFRP.toLocaleString()} MW</span>
                  </div>
                  <div>
                    <span className="text-[10px] block">Estimasi Emisi Gambut</span>
                    <span className="font-bold text-[#1d1d1f] num text-sm">{yrData.co2eTons.toLocaleString()} Ton CO₂e</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 2: Monthly Climatological Seasonality Wave */}
      {activeTab === 'seasonality' && (
        <div className="space-y-4">
          
          {/* Year Overlay Selector */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-[#86868b] font-medium">Bandingkan Siklus Rata-rata 26 Tahun dengan Tahun:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[2015, 2019, 2021, 2023, 2026].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setOverlayYear(yr)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    overlayYear === yr
                      ? 'bg-[#1d1d1f] text-white font-bold shadow-xs'
                      : 'bg-[#f5f5f7] text-[#6e6e73] hover:text-[#1d1d1f]'
                  }`}
                >
                  Tahun {yr}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Seasonality Wave Canvas */}
          <div className="border border-[#e5e5e7] rounded-xl bg-[#fafafa] p-4 sm:p-5">
            <div className="w-full h-64 sm:h-72">
              <svg viewBox="0 0 1000 300" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                
                {/* Dry Season Peak Background Banner (Aug - Oct) */}
                <rect x="580" y="20" width="260" height="245" fill="#fee2e2" fillOpacity="0.4" rx="6" />
                <text x="710" y="35" textAnchor="middle" fill="#dc2626" fontSize="11" fontWeight="700">
                  Puncak Kemarau Utama (Agustus – Oktober)
                </text>

                {/* Secondary Riau Peak Banner (Feb - Mar) */}
                <rect x="120" y="20" width="160" height="245" fill="#fef3c7" fillOpacity="0.3" rx="6" />
                <text x="200" y="35" textAnchor="middle" fill="#d97706" fontSize="10" fontWeight="600">
                  Puncak Riau / Sumut (Feb–Mar)
                </text>

                {/* Climatology Area Baseline Wave */}
                <path
                  d={`M ${monthlySeasonalityData
                    .map((d, i) => {
                      const x = 50 + (i / 11) * 900;
                      const y = 265 - (d.climatologyAvg / maxMonthlyVal) * 220;
                      return `${x},${y}`;
                    })
                    .join(' L ')} L 950,265 L 50,265 Z`}
                  fill="#94a3b8"
                  fillOpacity="0.2"
                />

                {/* Climatology Line (Gray Solid) */}
                <path
                  d={`M ${monthlySeasonalityData
                    .map((d, i) => {
                      const x = 50 + (i / 11) * 900;
                      const y = 265 - (d.climatologyAvg / maxMonthlyVal) * 220;
                      return `${x},${y}`;
                    })
                    .join(' L ')}`}
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />

                {/* Overlay Year Line (Vibrant Coral / Red) */}
                <path
                  d={`M ${monthlySeasonalityData
                    .map((d, i) => {
                      const x = 50 + (i / 11) * 900;
                      const y = 265 - (d.overlayYearValue / maxMonthlyVal) * 220;
                      return `${x},${y}`;
                    })
                    .join(' L ')}`}
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="3.5"
                />

                {/* Month Nodes */}
                {monthlySeasonalityData.map((d, i) => {
                  const x = 50 + (i / 11) * 900;
                  const yOver = 265 - (d.overlayYearValue / maxMonthlyVal) * 220;
                  const yAvg = 265 - (d.climatologyAvg / maxMonthlyVal) * 220;

                  return (
                    <g key={d.month} className="cursor-pointer" onMouseEnter={() => setHoveredMonth(d.month)} onMouseLeave={() => setHoveredMonth(null)}>
                      <circle cx={x} cy={yAvg} r="3" fill="#64748b" />
                      <circle cx={x} cy={yOver} r="5" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
                      <text x={x} y="285" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1d1d1f">
                        {d.monthName}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Seasonality Legend */}
          <div className="flex items-center justify-between text-xs text-[#6e6e73] px-1">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-0.5 bg-[#64748b] border-t border-dashed" />
                <span>Rata-rata Klimatologi 26 Tahun</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 bg-[#dc2626] rounded-full" />
                <span className="font-bold text-[#1d1d1f]">Aktivitas Tahun {overlayYear}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Provincial Peatland Carbon & Fire Energy Rankings */}
      {activeTab === 'provincial' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2.5">
            {provincialRankings.map((p, idx) => {
              const maxMW = 50000;
              const pct = (p.frpMW / maxMW) * 100;

              return (
                <div key={p.name} className="p-3.5 bg-[#fafafa] border border-[#e5e5e7] rounded-xl space-y-2 hover:border-[#1d1d1f]/30 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1d1d1f] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-sm text-[#1d1d1f]">{p.name}</span>
                      <span className="text-[11px] text-[#86868b]">({p.island})</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-semibold">
                      <span className="text-[#0071e3] num">{p.frpMW.toLocaleString()} MW</span>
                      <span className="text-[#86868b]">&bull;</span>
                      <span className="text-amber-700 num">{p.co2eMt} Juta Ton CO₂e</span>
                    </div>
                  </div>

                  {/* Horizontal Bar Gauge */}
                  <div className="w-full h-2.5 bg-[#e5e5ea] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: Sensor Resolution Physics & Overlap Breakdown */}
      {activeTab === 'physics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-4 bg-[#fafafa] border border-[#e5e5e7] rounded-xl space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#86868b]">MODIS Instrument</div>
            <div className="text-xl font-extrabold text-[#1d1d1f]">1.0 km Footprint</div>
            <p className="text-[#6e6e73] leading-relaxed text-[11px]">
              Sensor MODIS (satelit Terra & Aqua) beroperasi sejak tahun 2000. Satu piksel merekam area 1.000m x 1.000m (100 Hektar), mendeteksi front kebakaran skala bentang lahan.
            </p>
          </div>

          <div className="p-4 bg-[#fafafa] border border-[#e5e5e7] rounded-xl space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#86868b]">VIIRS Instrument</div>
            <div className="text-xl font-extrabold text-amber-700">375 m Footprint</div>
            <p className="text-[#6e6e73] leading-relaxed text-[11px]">
              Sensor VIIRS (satelit Suomi-NPP & NOAA-20) beroperasi sejak 2012. Dengan resolusi 7x lebih rapat (14 Hektar per piksel), satu kebakaran menghasilkan 3–5 titik deteksi terpisah.
            </p>
          </div>

          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-900">Solusi Harmonisasi NASA</div>
            <div className="text-xl font-extrabold text-[#0071e3]">Grid Spasial 5.5 km</div>
            <p className="text-blue-900 leading-relaxed text-[11px]">
              Terra Harmonia mengagregasi deteksi dari kedua sensor ke dalam sel grid 5.5 km sehingga perbandingan tren kebakaran 26 tahun (2000–2026) kembali valid secara ilmiah.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
