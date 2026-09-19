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
  Flame,
  Layers,
  Calendar,
  Wind,
  ShieldAlert,
  PieChart as PieIcon,
  Sparkles,
  Info,
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
    <div className="bg-white/95 backdrop-blur-xl border border-[#e5e5e7] p-3.5 rounded-2xl shadow-xl text-xs space-y-2 max-w-xs select-none">
      <div className="font-bold text-[#1d1d1f] border-b border-[#e5e5e7] pb-1.5 flex items-center justify-between">
        <span>{label}</span>
      </div>
      <div className="space-y-1.5">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#6e6e73]">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-bold text-[#1d1d1f] num">
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

  // 1. 26-Year Trend Aggregation (2000-2026)
  const yearlyTrendData = useMemo(() => {
    const list: Array<{
      year: number;
      'Deteksi Mentah Satelit': number;
      'Klaster Terharmonisasi (NASA 5.5km)': number;
      'Daya Termal (FRP MW)': number;
      'Emisi Karbon Gambut (Ton CO2e)': number;
      rawCount: number;
      harmonizedCount: number;
      isElNino: boolean;
      sensorEra: string;
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
        'Deteksi Mentah Satelit': rawCount,
        'Klaster Terharmonisasi (NASA 5.5km)': harmonizedCount,
        'Daya Termal (FRP MW)': totalFRP,
        'Emisi Karbon Gambut (Ton CO2e)': Math.round(totalFRP * 14.8),
        rawCount,
        harmonizedCount,
        isElNino: yr === 2006 || yr === 2015 || yr === 2019 || yr === 2023,
        sensorEra: yr >= 2012 ? 'Dual VIIRS+MODIS' : 'MODIS Only',
      });
    }

    return list;
  }, [calendarMatrix]);

  // 2. Monthly Seasonality Data
  const monthlySeasonalityData = useMemo(() => {
    const list: Array<{
      month: string;
      'Rata-rata Klimatologi 26 Thn': number;
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
        'Rata-rata Klimatologi 26 Thn': avg,
        [`Aktivitas Tahun ${overlayYear}`]: overlaySum,
      });
    }

    return list;
  }, [calendarMatrix, overlayYear, MONTHS]);

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
      { name: 'VIIRS 375m Deteksi Resolusi Tinggi', value: 58, color: '#f59e0b' },
      { name: 'MODIS 1km Deteksi Skala Lanskap', value: 24, color: '#dc2626' },
      { name: 'Tumpang Tindih Ko-Deteksi Bersamaan', value: 18, color: '#0071e3' },
    ];
  }, []);

  return (
    <div className="bg-white border border-[#e5e5e7] rounded-2xl p-4 sm:p-6 shadow-xs space-y-5 transition-all">
      
      {/* Header & Question Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#e5e5e7]">
        <div>
          <div className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
            {language === 'id' ? 'Visual Analytics Interaktif' : 'Interactive Visual Analytics'}
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
              ? (language === 'id' ? 'Visualisasi multi-kurva 26 tahun (2000–2026) membedakan titik api mentah dari klaster terharmonisasi 5.5 km NASA.' : '26-Year multi-series curve isolating raw sensor inflation from NASA 5.5 km harmonized clusters.')
              : activeTab === 'seasonality'
              ? (language === 'id' ? 'Kurva gelombang musiman bulanan dengan penanda periode rawan kering (Agustus–Oktober) dan puncak Riau (Februari–Maret).' : 'Monthly seasonality wave curve highlighting primary dry season (Aug–Oct) and early Sumatra peak (Feb–Mar).')
              : activeTab === 'provincial'
              ? (language === 'id' ? 'Diagram batang perbandingan daya radiasi termal (FRP Megawatt) dan estimasi pelepasan karbon per wilayah.' : 'Ranked comparison of thermal energy (FRP MW) and peat carbon emissions across Indonesian priority zones.')
              : (language === 'id' ? 'Komposisi deteksi resolusi sensor satelit dan pemodelan tumpang-tindih spasial Terra Harmonia.' : 'Satellite sensor footprint resolution breakdown and spatial overlap modeling.')}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-[#f5f5f7] rounded-xl p-0.5 text-xs font-medium border border-[#e5e5e7] shrink-0 overflow-x-auto">
          {[
            { id: 'trend' as ChartTab, label: language === 'id' ? 'Tren 26 Tahun' : '26-Year Trend', icon: TrendingUp },
            { id: 'seasonality' as ChartTab, label: language === 'id' ? 'Siklus Musiman' : 'Seasonality', icon: Calendar },
            { id: 'provincial' as ChartTab, label: language === 'id' ? 'Emisi per Wilayah' : 'Provincial Carbon', icon: BarChart3 },
            { id: 'physics' as ChartTab, label: language === 'id' ? 'Fisika Sensor' : 'Sensor Physics', icon: PieIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isSel
                    ? 'bg-white text-[#1d1d1f] shadow-xs font-bold'
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

      {/* TAB 1: 26-Year Trend Line & Area Chart via Recharts */}
      {activeTab === 'trend' && (
        <div className="space-y-4">
          <div className="border border-[#e5e5e7] rounded-2xl bg-[#fafafa] p-4 sm:p-5">
            <div className="w-full h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyTrendData} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="harmAreaColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0071e3" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0071e3" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e7" vertical={false} />
                  
                  <XAxis
                    dataKey="year"
                    stroke="#86868b"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => (val % 4 === 0 || val === 2026 ? val : '')}
                  />
                  <YAxis stroke="#86868b" fontSize={11} tickLine={false} axisLine={false} />
                  
                  <Tooltip content={<CustomChartTooltip unit="titik/klaster" />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

                  {/* 2012 VIIRS Launch Divider */}
                  <ReferenceLine x={2012} stroke="#f97316" strokeDasharray="4 4" label={{ value: 'VIIRS 2012', position: 'top', fill: '#ea580c', fontSize: 11, fontWeight: 'bold' }} />

                  {/* 2015 Super El Niño Crisis Highlight */}
                  <ReferenceArea x1={2015} x2={2015} stroke="#dc2626" strokeOpacity={0.4} fill="#fee2e2" fillOpacity={0.6} />

                  {/* NASA Harmonized Area Spline */}
                  <Area
                    type="monotone"
                    dataKey="Klaster Terharmonisasi (NASA 5.5km)"
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
                    dataKey="Deteksi Mentah Satelit"
                    stroke="#64748b"
                    strokeWidth={2}
                    strokeDasharray="5 4"
                    dot={{ r: 2.5, fill: '#64748b' }}
                    activeDot={{ r: 6, fill: '#1d1d1f' }}
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scientific Insight Card */}
          <div className="p-4 bg-[#f5f5f7] border border-[#e5e5e7] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-[#1d1d1f] text-sm">Kesimpulan Analisis Ilmiah:</span>
              <p className="text-[#6e6e73] leading-relaxed">
                Garis abu-abu putus-putus menunjukkan lonjakan semu 3x lipat sejak 2012 akibat ukuran piksel VIIRS 375m (14 Ha). Garis biru terharmonisasi mengembalikan perbandingan historis yang valid dengan mengelompokkan ke grid 5.5 km.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Monthly Seasonality Climatology Wave via Recharts */}
      {activeTab === 'seasonality' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-[#86868b] font-medium">Bandingkan Rata-rata 26 Tahun dengan Anomali Tahun:</span>
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

          <div className="border border-[#e5e5e7] rounded-2xl bg-[#fafafa] p-4 sm:p-5">
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

                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e7" vertical={false} />
                  <XAxis dataKey="month" stroke="#1d1d1f" fontSize={11} fontWeight={600} tickLine={false} />
                  <YAxis stroke="#86868b" fontSize={11} tickLine={false} axisLine={false} />
                  
                  <Tooltip content={<CustomChartTooltip unit="klaster" />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

                  {/* 26-Year Climatology Baseline */}
                  <Area
                    type="monotone"
                    dataKey="Rata-rata Klimatologi 26 Thn"
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
                    dataKey={`Aktivitas Tahun ${overlayYear}`}
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
          <div className="border border-[#e5e5e7] rounded-2xl bg-[#fafafa] p-4 sm:p-5">
            <div className="w-full h-80 sm:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={provincialRankings}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e7" horizontal={false} />
                  <XAxis type="number" stroke="#86868b" fontSize={11} tickLine={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#1d1d1f"
                    fontSize={11}
                    fontWeight={600}
                    tickLine={false}
                    width={150}
                  />
                  
                  <Tooltip content={<CustomChartTooltip unit="MW (Daya Termal)" />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

                  <Bar
                    dataKey="frpMW"
                    name="Daya Radiasi Termal Api (MW)"
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
          <div className="lg:col-span-6 border border-[#e5e5e7] rounded-2xl bg-[#fafafa] p-4 sm:p-5 flex flex-col items-center justify-center">
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
            <div className="p-3.5 bg-[#f5f5f7] border border-[#e5e5e7] rounded-xl space-y-1">
              <div className="font-bold text-[#1d1d1f] text-sm">MODIS (1.000m x 1.000m = 100 Hektar)</div>
              <p className="text-[#6e6e73] leading-relaxed">
                Sensor sinoptik NASA pada satelit Terra & Aqua. Merekam front api dalam skala bentang lahan makro sejak tahun 2000.
              </p>
            </div>

            <div className="p-3.5 bg-[#f5f5f7] border border-[#e5e5e7] rounded-xl space-y-1">
              <div className="font-bold text-amber-700 text-sm">VIIRS (375m x 375m = 14 Hektar)</div>
              <p className="text-[#6e6e73] leading-relaxed">
                Sensor resolusi tinggi pada satelit Suomi-NPP & NOAA-20. Mendeteksi titik api kecil dan menghasilkan 3–5 deteksi terpisah per front kebakaran.
              </p>
            </div>

            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
              <div className="font-bold text-[#0071e3] text-sm">Solusi Grid Harmonisasi 5.5 km</div>
              <p className="text-blue-900 leading-relaxed">
                Terra Harmonia merekonsiliasi perbedaan resolusi kedua sensor ke dalam sel spasial 5.5 km sehingga menghasilkan linimasa 26 tahun yang konsisten secara ilmiah.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
