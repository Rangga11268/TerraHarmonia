import React, { useState, useMemo } from 'react';
import { AOIRegion, HarmonizedWeekData } from '../engine/harmonizer';
import { Language, translations } from '../data/translations';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  PieChart as PieIcon,
} from 'lucide-react';

interface VisualAnalyticsProps {
  language: Language;
  selectedAOI: AOIRegion;
  calendarMatrix: Record<string, HarmonizedWeekData>;
  rawMode: boolean;
}

type ChartTab = 'trend' | 'seasonality' | 'provincial' | 'physics';

// Custom Apple-style Frosted Tooltip
const CustomChartTooltip = ({ active, payload, label, unit = '' }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white/95 dark:bg-[#111827]/95 backdrop-blur-xl border border-[#e5e5e7] dark:border-[#1f2937] p-3.5 rounded-2xl shadow-xl text-xs space-y-2 max-w-xs select-none">
      <div className="font-bold text-[#1d1d1f] dark:text-white border-b border-[#e5e5e7] dark:border-[#1f2937] pb-1.5 flex items-center justify-between">
        <span>{label}</span>
      </div>
      <div className="space-y-1.5">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#6e6e73] dark:text-[#9ca3af]">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-bold text-[#1d1d1f] dark:text-white num">
              {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value} {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const VisualAnalytics: React.FC<VisualAnalyticsProps> = ({
  language,
  selectedAOI,
  calendarMatrix,
  rawMode,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<ChartTab>('trend');
  const [overlayYear, setOverlayYear] = useState<number>(2015);

  const MONTHS = language === 'id'
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const harmonizedSeriesName = t.harmonizedClustersLegend;
  const rawSeriesName = t.rawDetectionsLegend;
  const climatologySeriesName = t.climatology26YrAvg;
  const overlaySeriesName = `${t.yearActivityLegend} ${overlayYear}`;

  // 1. 26-Year Trend Aggregation (2000-2026)
  const yearlyTrendData = useMemo(() => {
    const list: Array<{
      year: number;
      [key: string]: string | number | boolean;
    }> = [];

    for (let yr = 2000; yr <= 2026; yr++) {
      let rawCount = 0;
      let harmonizedCount = 0;
      let totalFRP = 0;

      for (let w = 1; w <= 52; w++) {
        const item = calendarMatrix[`${yr}-${w}`];
        if (item) {
          rawCount += item.rawTotalCount;
          harmonizedCount += item.harmonizedClusterCount;
          totalFRP += item.totalFrpCalibrated;
        }
      }

      list.push({
        year: yr,
        [rawSeriesName]: rawCount,
        [harmonizedSeriesName]: harmonizedCount,
        [t.thermalPowerLegend]: totalFRP,
        [t.carbonEmissionsLegend]: Math.round(totalFRP * 14.8),
        isElNino: yr === 2006 || yr === 2015 || yr === 2019 || yr === 2023,
        sensorEra: yr >= 2012 ? 'Dual VIIRS+MODIS' : 'MODIS Only',
      });
    }

    return list;
  }, [calendarMatrix, rawSeriesName, harmonizedSeriesName, t]);

  // 2. Monthly Seasonality Data
  const monthlySeasonalityData = useMemo(() => {
    const list: Array<{
      month: string;
      [key: string]: string | number;
    }> = [];

    for (let m = 1; m <= 12; m++) {
      let sumHarmonized = 0;
      let overlaySum = 0;

      for (let yr = 2000; yr <= 2026; yr++) {
        for (let w = 1; w <= 52; w++) {
          const item = calendarMatrix[`${yr}-${w}`];
          if (item && item.month === m) {
            sumHarmonized += item.harmonizedClusterCount;
            if (yr === overlayYear) {
              overlaySum += item.harmonizedClusterCount;
            }
          }
        }
      }

      const avg = Math.round(sumHarmonized / 27);
      const mName = MONTHS[m - 1];

      list.push({
        month: mName,
        [climatologySeriesName]: avg,
        [overlaySeriesName]: overlaySum,
      });
    }

    return list;
  }, [calendarMatrix, overlayYear, MONTHS, climatologySeriesName, overlaySeriesName]);

  // 3. Provincial Peatland Carbon & Fire Energy Comparison
  const provincialRankings = useMemo(() => {
    return [
      { name: 'Kalteng (Sebangau/PLG)', island: 'Kalimantan', frpMW: 48200, co2eMt: 71.3, color: '#dc2626' },
      { name: 'Riau (Kampar/Siak)', island: 'Sumatera', frpMW: 42100, co2eMt: 62.3, color: '#ea580c' },
      { name: 'Sumsel (Kubah OKI)', island: 'Sumatera', frpMW: 36800, co2eMt: 54.5, color: '#f97316' },
      { name: 'Kalbar (Ketapang/Rasau)', island: 'Kalimantan', frpMW: 29500, co2eMt: 43.7, color: '#f59e0b' },
      { name: 'Papua Sel (Merauke/Mappi)', island: 'Papua', frpMW: 24100, co2eMt: 35.6, color: '#10b981' },
      { name: 'Kalsel (Banjar/Barito)', island: 'Kalimantan', frpMW: 18900, co2eMt: 28.0, color: '#06b6d4' },
      { name: 'Jambi (Berbak/Tanjab)', island: 'Sumatera', frpMW: 15400, co2eMt: 22.8, color: '#3b82f6' },
      { name: 'Kaltim (Kutai/Berau)', island: 'Kalimantan', frpMW: 12800, co2eMt: 18.9, color: '#6366f1' },
    ];
  }, []);

  // 4. Sensor Physics & Overlap Distribution Pie
  const sensorPhysicsData = useMemo(() => {
    return [
      { name: language === 'id' ? 'VIIRS 375m Deteksi Resolusi Tinggi' : 'VIIRS 375m High-Resolution', value: 58, color: '#f59e0b' },
      { name: language === 'id' ? 'MODIS 1km Deteksi Skala Lanskap' : 'MODIS 1km Synoptic Footprint', value: 24, color: '#dc2626' },
      { name: language === 'id' ? 'Tumpang Tindih Ko-Deteksi Bersamaan' : 'Co-detected Overlapping Events', value: 18, color: '#0071e3' },
    ];
  }, [language]);

  return (
    <div className="bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-2xl p-4 sm:p-6 shadow-xs space-y-5 transition-all">
      
      {/* Header & Question Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#e5e5e7] dark:border-[#1f2937]">
        <div>
          <div className="text-xs font-semibold text-[#86868b] dark:text-[#9ca3af] uppercase tracking-wider">
            {t.analyticsTitle}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#1d1d1f] dark:text-white tracking-tight mt-0.5">
            {activeTab === 'trend'
              ? t.trendChartTitle
              : activeTab === 'seasonality'
              ? t.seasonalityChartTitle
              : activeTab === 'provincial'
              ? t.provincialChartTitle
              : t.physicsChartTitle}
          </h2>
          <p className="text-xs text-[#6e6e73] dark:text-[#9ca3af] mt-1 leading-relaxed max-w-2xl">
            {activeTab === 'trend'
              ? t.trendChartDesc
              : activeTab === 'seasonality'
              ? t.seasonalityChartDesc
              : activeTab === 'provincial'
              ? t.provincialChartDesc
              : t.physicsChartDesc}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-[#f5f5f7] dark:bg-[#1f2937] rounded-xl p-0.5 text-xs font-medium border border-[#e5e5e7] dark:border-[#374151] shrink-0 overflow-x-auto max-w-full">
          {[
            { id: 'trend' as ChartTab, label: t.tabTrend, icon: TrendingUp },
            { id: 'seasonality' as ChartTab, label: t.tabSeasonality, icon: Calendar },
            { id: 'provincial' as ChartTab, label: t.tabProvincial, icon: BarChart3 },
            { id: 'physics' as ChartTab, label: t.tabPhysics, icon: PieIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer min-h-[34px] ${
                  isSel
                    ? 'bg-white dark:bg-[#374151] text-[#1d1d1f] dark:text-white shadow-xs font-bold'
                    : 'text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: 26-Year Trend Line & Area Chart via Recharts */}
      {activeTab === 'trend' && (
        <div className="space-y-4">
          <div className="border border-[#e5e5e7] dark:border-[#1f2937] rounded-2xl bg-[#fafafa] dark:bg-[#0b0f19] p-4 sm:p-5">
            <div className="w-full h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyTrendData} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="harmAreaColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0071e3" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0071e3" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e7" strokeOpacity={0.4} vertical={false} />
                  
                  <XAxis
                    dataKey="year"
                    stroke="#86868b"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => (val % 4 === 0 || val === 2026 ? val : '')}
                  />
                  <YAxis stroke="#86868b" fontSize={11} tickLine={false} axisLine={false} />
                  
                  <Tooltip content={<CustomChartTooltip unit={language === 'id' ? 'titik/klaster' : 'pts/clusters'} />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

                  {/* 2012 VIIRS Launch Divider */}
                  <ReferenceLine x={2012} stroke="#f97316" strokeDasharray="4 4" label={{ value: 'VIIRS 2012', position: 'top', fill: '#ea580c', fontSize: 11, fontWeight: 'bold' }} />

                  {/* 2015 Super El Niño Crisis Highlight */}
                  <ReferenceArea x1={2015} x2={2015} stroke="#dc2626" strokeOpacity={0.4} fill="#fee2e2" fillOpacity={0.2} />

                  {/* NASA Harmonized Area Spline */}
                  <Area
                    type="monotone"
                    dataKey={harmonizedSeriesName}
                    stroke="#0071e3"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#harmAreaColor)"
                    isAnimationActive={true}
                    animationDuration={1000}
                  />

                  {/* Raw Spike Line */}
                  <Line
                    type="monotone"
                    dataKey={rawSeriesName}
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 4"
                    dot={{ r: 2.5, fill: '#94a3b8' }}
                    activeDot={{ r: 6, fill: '#0071e3' }}
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scientific Insight Card */}
          <div className="p-4 bg-[#f5f5f7] dark:bg-[#1f2937] border border-[#e5e5e7] dark:border-[#374151] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-[#1d1d1f] dark:text-white text-sm">
                {language === 'id' ? 'Kesimpulan Analisis Ilmiah:' : 'Scientific Analysis Takeaway:'}
              </span>
              <p className="text-[#6e6e73] dark:text-[#9ca3af] leading-relaxed">
                {language === 'id'
                  ? 'Garis abu-abu putus-putus menunjukkan lonjakan semu 3x lipat sejak 2012 akibat ukuran piksel VIIRS 375m (14 Ha). Garis biru terharmonisasi mengembalikan perbandingan historis yang valid dengan mengelompokkan ke grid 5.5 km.'
                  : 'Dashed gray line illustrates artificial 3x inflation post-2012 caused by VIIRS 375m pixels. The solid blue harmonized series restores continuous historical validity via 5.5 km equal-area binning.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Monthly Seasonality Climatology Wave via Recharts */}
      {activeTab === 'seasonality' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-[#86868b] dark:text-[#9ca3af] font-medium">
              {language === 'id' ? 'Bandingkan Rata-rata 26 Tahun dengan Anomali Tahun:' : 'Compare 26-Yr Average against Specific Year:'}
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[2015, 2019, 2021, 2023, 2026].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setOverlayYear(yr)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer min-h-[32px] ${
                    overlayYear === yr
                      ? 'bg-[#1d1d1f] dark:bg-white text-white dark:text-[#111827] font-bold shadow-xs'
                      : 'bg-[#f5f5f7] dark:bg-[#1f2937] text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                >
                  {language === 'id' ? `Tahun ${yr}` : `Year ${yr}`}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-[#e5e5e7] dark:border-[#1f2937] rounded-2xl bg-[#fafafa] dark:bg-[#0b0f19] p-4 sm:p-5">
            <div className="w-full h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySeasonalityData} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="overlayAreaColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="climaAreaColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e7" strokeOpacity={0.4} vertical={false} />
                  <XAxis dataKey="month" stroke="#86868b" fontSize={11} fontWeight={600} tickLine={false} />
                  <YAxis stroke="#86868b" fontSize={11} tickLine={false} axisLine={false} />
                  
                  <Tooltip content={<CustomChartTooltip unit={language === 'id' ? 'klaster' : 'clusters'} />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

                  {/* 26-Year Climatology Baseline */}
                  <Area
                    type="monotone"
                    dataKey={climatologySeriesName}
                    stroke="#64748b"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fill="url(#climaAreaColor)"
                    isAnimationActive={true}
                    animationDuration={1000}
                  />

                  {/* Overlay Year Curve */}
                  <Area
                    type="monotone"
                    dataKey={overlaySeriesName}
                    stroke="#dc2626"
                    strokeWidth={3}
                    fill="url(#overlayAreaColor)"
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Provincial Peatland Carbon & Energy Bar Chart via Recharts */}
      {activeTab === 'provincial' && (
        <div className="space-y-4">
          <div className="border border-[#e5e5e7] dark:border-[#1f2937] rounded-2xl bg-[#fafafa] dark:bg-[#0b0f19] p-4 sm:p-5">
            <div className="w-full h-80 sm:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={provincialRankings}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e7" strokeOpacity={0.4} horizontal={false} />
                  <XAxis type="number" stroke="#86868b" fontSize={11} tickLine={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#86868b"
                    fontSize={11}
                    fontWeight={600}
                    tickLine={false}
                    width={150}
                  />
                  
                  <Tooltip content={<CustomChartTooltip unit={language === 'id' ? 'MW (Daya Termal)' : 'MW (Thermal FRP)'} />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

                  <Bar
                    dataKey="frpMW"
                    name={t.thermalPowerLegend}
                    radius={[0, 8, 8, 0]}
                    isAnimationActive={true}
                    animationDuration={1200}
                  >
                    {provincialRankings.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Sensor Resolution Physics & Overlap Donut via Recharts */}
      {activeTab === 'physics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          
          {/* Donut Chart */}
          <div className="lg:col-span-6 border border-[#e5e5e7] dark:border-[#1f2937] rounded-2xl bg-[#fafafa] dark:bg-[#0b0f19] p-4 sm:p-5 flex flex-col items-center justify-center">
            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sensorPhysicsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    isAnimationActive={true}
                    animationDuration={1000}
                  >
                    {sensorPhysicsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip unit="%" />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Physics Explanation Cards */}
          <div className="lg:col-span-6 space-y-3 text-xs">
            <div className="p-3.5 bg-[#f5f5f7] dark:bg-[#1f2937] border border-[#e5e5e7] dark:border-[#374151] rounded-xl space-y-1">
              <div className="font-bold text-[#1d1d1f] dark:text-white text-sm">
                MODIS (1,000m × 1,000m = 100 Ha)
              </div>
              <p className="text-[#6e6e73] dark:text-[#9ca3af] leading-relaxed">
                {language === 'id'
                  ? 'Sensor sinoptik NASA pada satelit Terra & Aqua. Merekam front api dalam skala bentang lahan makro sejak tahun 2000.'
                  : 'NASA synoptic sensor onboard Terra & Aqua satellites. Records fire perimeters at landscape scale since 2000.'}
              </p>
            </div>

            <div className="p-3.5 bg-[#f5f5f7] dark:bg-[#1f2937] border border-[#e5e5e7] dark:border-[#374151] rounded-xl space-y-1">
              <div className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                VIIRS (375m × 375m = 14 Ha)
              </div>
              <p className="text-[#6e6e73] dark:text-[#9ca3af] leading-relaxed">
                {language === 'id'
                  ? 'Sensor resolusi tinggi pada satelit Suomi-NPP & NOAA-20. Mendeteksi titik api kecil dan menghasilkan 3–5 deteksi terpisah per front kebakaran.'
                  : 'High-resolution sensor onboard Suomi-NPP & NOAA satellites. Detects small fire fronts and produces 3–5 split detections per event.'}
              </p>
            </div>

            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 rounded-xl space-y-1">
              <div className="font-bold text-[#0071e3] dark:text-blue-400 text-sm">
                {language === 'id' ? 'Solusi Grid Harmonisasi 5.5 km' : '5.5 km Harmonization Grid Solution'}
              </div>
              <p className="text-blue-900 dark:text-blue-200 leading-relaxed">
                {language === 'id'
                  ? 'Terra Harmonia merekonsiliasi perbedaan resolusi kedua sensor ke dalam sel spasial 5.5 km sehingga menghasilkan linimasa 26 tahun yang konsisten secara ilmiah.'
                  : 'Terra Harmonia reconciles multi-sensor resolution discrepancies into 5.5 km spatial cells for an un-biased 26-year time series.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
