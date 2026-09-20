import React, { useState } from 'react';
import { Language, translations } from '../data/translations';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Satellite,
  Layers,
  ShieldCheck,
  TrendingUp,
  Award,
  Globe,
  Database,
  Cpu,
  ChevronRight,
  Activity,
  CheckCircle2,
  ExternalLink,
  Sliders,
  MapPin,
  Calendar,
  Zap,
  Play
} from 'lucide-react';
import { NavTab } from './Navbar';

interface LandingStoryProps {
  language: Language;
  onSelectTab: (tab: NavTab) => void;
  onOpenTour: () => void;
}

export const LandingStory: React.FC<LandingStoryProps> = ({
  language,
  onSelectTab,
  onOpenTour,
}) => {
  const t = translations[language];
  const [paradoxMode, setParadoxMode] = useState<'raw' | 'harmonized'>('raw');

  return (
    <div className="w-full space-y-12 animate-in fade-in duration-200">
      
      {/* 1. HERO SECTION: Grand Editorial Banner with Mission Manifesto */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-[#fbfbfd] to-[#f5f5f7] dark:from-[#111827] dark:via-[#0f172a] dark:to-[#0b0f19] border border-[#e5e5e7] dark:border-[#1f2937] p-6 sm:p-12 lg:p-16 shadow-xs">
        
        {/* Subtle background ambient gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-600/15 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          {/* Top Pill: NASA Challenge Lockup */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] text-xs font-semibold text-[#1d1d1f] dark:text-white shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>NASA Space Apps Challenge 2026 &bull; Global Earth Observation Solution</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1d1d1f] dark:text-white tracking-tight leading-[1.15]">
            {language === 'id' ? (
              <>
                Mengharmonisasikan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-emerald-600 to-amber-500">26 Tahun Data Titik Api</span> Satelit NASA di Indonesia
              </>
            ) : (
              <>
                Harmonizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-emerald-600 to-amber-500">26 Years of NASA Satellite</span> Fire Records
              </>
            )}
          </h1>

          {/* Subtitle / Manifesto */}
          <p className="text-base sm:text-xl text-[#515154] dark:text-[#d1d5db] max-w-3xl mx-auto leading-relaxed font-normal">
            {language === 'id'
              ? 'Dari sensor MODIS 1 km (2000) hingga VIIRS 375 m (2026): Memulihkan kebenaran ilmiah deret waktu iklim, mengeliminasi bias sensorik 300%, dan melindungi 13.4 juta hektar lahan gambut tropis Nusantara.'
              : 'From 1 km MODIS (2000) to 375 m VIIRS (2026): Restoring historical fire climatology truth, eliminating artificial 300% sensor shift bias, and protecting 13.4 million hectares of Indonesian tropical peatlands.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onSelectTab('overview')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
            >
              <Activity className="w-4 h-4" />
              <span>{language === 'id' ? 'Buka Intelijen Peta & Kalender 26-Tahun' : 'Launch 26-Year Intel & Map'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTab('lab')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white dark:bg-[#151d2f] hover:bg-[#f5f5f7] dark:hover:bg-[#1f2937] text-[#1d1d1f] dark:text-white border border-[#e5e5e7] dark:border-[#374151] font-bold text-sm transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
            >
              <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'id' ? 'Eksperimen di Lab Harmonisasi' : 'Open Harmonization Lab'}</span>
            </button>

            <button
              onClick={onOpenTour}
              className="w-full sm:w-auto px-4 py-3.5 rounded-2xl text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white text-xs font-semibold transition cursor-pointer min-h-[48px] flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'id' ? 'Briefing 30 Detik' : '30-Sec Briefing'}</span>
            </button>
          </div>

          {/* 4 Core Quantitative Proof Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 border-t border-[#e5e5e7] dark:border-[#1f2937] text-left">
            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#151d2f]/70 border border-[#e5e5e7] dark:border-[#1f2937]">
              <span className="text-[10px] font-bold uppercase text-[#86868b] dark:text-[#9ca3af] block">Rentang Data NASA</span>
              <strong className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-white num block mt-0.5">26 Tahun</strong>
              <span className="text-[11px] text-[#6e6e73] dark:text-[#9ca3af]">2000 &ndash; 2026</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#151d2f]/70 border border-[#e5e5e7] dark:border-[#1f2937]">
              <span className="text-[10px] font-bold uppercase text-[#86868b] dark:text-[#9ca3af] block">Resolusi Fusi Spasial</span>
              <strong className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-white num block mt-0.5">5.5 km</strong>
              <span className="text-[11px] text-[#6e6e73] dark:text-[#9ca3af]">Equal-Area Binning</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#151d2f]/70 border border-[#e5e5e7] dark:border-[#1f2937]">
              <span className="text-[10px] font-bold uppercase text-[#86868b] dark:text-[#9ca3af] block">Ambang Kritis Gambut</span>
              <strong className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400 num block mt-0.5">&lt; -40 cm</strong>
              <span className="text-[11px] text-[#6e6e73] dark:text-[#9ca3af]">Standar Hidrologi BRGM</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#151d2f]/70 border border-[#e5e5e7] dark:border-[#1f2937]">
              <span className="text-[10px] font-bold uppercase text-[#86868b] dark:text-[#9ca3af] block">Latensi Komputasi</span>
              <strong className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 num block mt-0.5">0 ms</strong>
              <span className="text-[11px] text-[#6e6e73] dark:text-[#9ca3af]">Client-Side Engine</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. THE SENSOR SHIFT PARADOX: Interactive Visual Dilemma */}
      <section className="bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e5e5e7] dark:border-[#1f2937]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              <span>{language === 'id' ? 'Paradoks Sains 2012' : 'The 2012 Scientific Paradox'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] dark:text-white tracking-tight mt-0.5">
              {language === 'id' ? 'Mengapa Titik Api Pasca-2012 Tampak Melonjak 300%?' : 'Why Post-2012 Fire Counts Artificially Tripled'}
            </h2>
            <p className="text-xs sm:text-sm text-[#6e6e73] dark:text-[#9ca3af] mt-1 max-w-3xl">
              {language === 'id'
                ? 'Pada tahun 2012, satelit Suomi-NPP membawa sensor VIIRS dengan resolusi 375 m (7x lebih rapat dari MODIS 1 km). Satu garis api kebakaran yang sama kini terfragmentasi menjadi 5 hingga 9 titik terpisah, menciptakan ilusi data yang menyesatkan pengambil kebijakan.'
                : 'In 2012, Suomi-NPP introduced the VIIRS sensor with 375m pixels (7x sharper than MODIS 1km). A single continuous fire front became fragmented into 5 to 9 discrete detections, creating a statistical illusion that misled policy makers.'}
            </p>
          </div>

          {/* Interactive Simulation Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-[#f5f5f7] dark:bg-[#151d2f] rounded-xl border border-[#e5e5e7] dark:border-[#1f2937] text-xs shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setParadoxMode('raw')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                paradoxMode === 'raw'
                  ? 'bg-red-600 text-white shadow-xs font-bold'
                  : 'text-[#6e6e73] dark:text-[#9ca3af]'
              }`}
            >
              {language === 'id' ? 'Data Mentah (Overcounting)' : 'Raw (Overcounting)'}
            </button>
            <button
              onClick={() => setParadoxMode('harmonized')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                paradoxMode === 'harmonized'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-[#6e6e73] dark:text-[#9ca3af]'
              }`}
            >
              {language === 'id' ? 'Terkalibrasi 5.5 km' : 'Harmonized 5.5 km'}
            </button>
          </div>
        </div>

        {/* Visual Comparison Stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Card 1: MODIS Era Footprint */}
          <div className="p-6 rounded-2xl bg-[#fbfbfd] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 font-mono">
                  ERA 2000–2011 &bull; MODIS Terra/Aqua
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-bold">
                  Resolusi 1.0 km
                </span>
              </div>

              {/* Graphic: 1 single wide footprint */}
              <div className="w-full h-44 rounded-xl bg-white dark:bg-[#0b0f19] border border-[#e5e5e7] dark:border-[#1f2937] flex items-center justify-center p-4 relative overflow-hidden">
                <div className="w-28 h-28 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border-2 border-dashed border-blue-400 dark:border-blue-700 flex items-center justify-center relative">
                  <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    1 Hotspot
                  </div>
                  <span className="absolute bottom-1 text-[9px] text-blue-700 dark:text-blue-300 font-mono">1 km × 1 km</span>
                </div>
              </div>

              <p className="text-xs text-[#515154] dark:text-[#d1d5db] leading-relaxed">
                {language === 'id'
                  ? 'Sensor MODIS merekam seluruh area kebakaran dalam satu piksel makro 1 km. Kebakaran besar terhitung sebagai 1 deteksi tunggal.'
                  : 'MODIS captures the fire complex inside a single 1 km macro pixel footprint. A massive fire counts as 1 single detection.'}
              </p>
            </div>

            <div className="pt-2 border-t border-[#e5e5e7] dark:border-[#1f2937] text-[11px] text-[#86868b] dark:text-[#9ca3af] flex justify-between">
              <span>Hasil Deteksi:</span>
              <strong className="text-[#1d1d1f] dark:text-white num">1 Titik Api</strong>
            </div>
          </div>

          {/* Card 2: VIIRS Era Footprint / Harmonized */}
          <div className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
            paradoxMode === 'raw'
              ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50'
              : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold font-mono ${
                  paradoxMode === 'raw' ? 'text-red-700 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'
                }`}>
                  {paradoxMode === 'raw' ? 'ERA 2012–2026 • VIIRS Raw Detections' : 'SOLUSI TERHARMONISASI • Grid 5.5 km'}
                </span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                  paradoxMode === 'raw'
                    ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                    : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300'
                }`}>
                  {paradoxMode === 'raw' ? 'Resolusi 375 m' : 'Equal-Area Binning'}
                </span>
              </div>

              {/* Graphic: 7-9 fragmented points or unified cluster */}
              <div className="w-full h-44 rounded-xl bg-white dark:bg-[#0b0f19] border border-[#e5e5e7] dark:border-[#1f2937] flex items-center justify-center p-4 relative overflow-hidden">
                {paradoxMode === 'raw' ? (
                  <div className="w-28 h-28 rounded-2xl bg-red-50 dark:bg-red-950/40 border-2 border-dashed border-red-400 dark:border-red-700 grid grid-cols-3 gap-1.5 p-2 place-items-center relative">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div key={i} className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px] font-bold shadow-xs">
                        {i}
                      </div>
                    ))}
                    <span className="absolute -bottom-4 text-[9px] text-red-700 dark:text-red-300 font-mono">Lonjakan Semu +300%</span>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 dark:border-emerald-600 flex flex-col items-center justify-center p-2 relative shadow-xs">
                    <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex flex-col items-center justify-center font-bold text-xs shadow-md">
                      <span>1 Klaster</span>
                      <span className="text-[9px] font-normal font-mono">FRP 420 MW</span>
                    </div>
                    <span className="text-[9px] text-emerald-700 dark:text-emerald-300 font-mono mt-1">Grid Setara 5.5 km</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-[#515154] dark:text-[#d1d5db] leading-relaxed">
                {paradoxMode === 'raw'
                  ? 'Dengan piksel 375 m, kebakaran yang sama pecah menjadi 7 titik api. Tanpa kalibrasi, data tampak melonjak drastis padahal intensitas kebakaran sama.'
                  : 'Algoritma Terra Harmonia menyatukan titik-titik tumpang-tindih ke dalam sel 5.5 km dan mengalibrasi energi radiatif FRP, memulihkan komparabilitas 2000–2026.'}
              </p>
            </div>

            <div className="pt-2 border-t border-[#e5e5e7] dark:border-[#1f2937] text-[11px] text-[#86868b] dark:text-[#9ca3af] flex justify-between">
              <span>Hasil Pembacaan:</span>
              <strong className={`num ${paradoxMode === 'raw' ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'}`}>
                {paradoxMode === 'raw' ? '7 Titik Api (Ilusi Lonjakan)' : '1 Klaster Terkalibrasi (Objektif)'}
              </strong>
            </div>
          </div>

        </div>
      </section>

      {/* 3. 4 CORE SCIENTIFIC PILLARS OF TERRA HARMONIA */}
      <section className="bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b] dark:text-[#9ca3af]">
            {language === 'id' ? 'Arsitektur Metodologi' : 'Methodological Architecture'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] dark:text-white tracking-tight mt-0.5">
            {language === 'id' ? '4 Pilar Inovasi Sains Terra Harmonia' : '4 Pillars of Scientific Innovation'}
          </h2>
          <p className="text-xs sm:text-sm text-[#6e6e73] dark:text-[#9ca3af] mt-1 max-w-3xl">
            {language === 'id'
              ? 'Kombinasi model matematika geospasial, fisika energi termal radiatif, pemantauan hidrologi gambut, dan rekayasa web nir-latensi:'
              : 'A fusion of geospatial mathematics, thermal radiation physics, peatland hydrological telemetry, and zero-latency web engineering:'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="p-6 rounded-2xl bg-[#fbfbfd] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] space-y-3 flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-700 transition-all">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#1d1d1f] dark:text-white">
                {language === 'id' ? '1. Spatial Equal-Area Grid 5.5 km' : '1. 5.5 km Equal-Area Grid'}
              </h3>
              <p className="text-xs text-[#515154] dark:text-[#d1d5db] leading-relaxed">
                {language === 'id'
                  ? 'Menyatukan beberapa piksel tajam VIIRS (375 m) ke dalam satu footprint setara MODIS (1 km), mengeliminasi double-counting lintas satelit.'
                  : 'Aggregates sharp VIIRS (375m) pixels into equivalent MODIS (1km) footprints, eliminating multi-satellite double counting.'}
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">Equal-Area Projection</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#fbfbfd] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] space-y-3 flex flex-col justify-between hover:border-purple-400 dark:hover:border-purple-700 transition-all">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#1d1d1f] dark:text-white">
                {language === 'id' ? '2. Kalibrasi Energi Stefan-Boltzmann' : '2. Stefan-Boltzmann Energy Normalization'}
              </h3>
              <p className="text-xs text-[#515154] dark:text-[#d1d5db] leading-relaxed">
                {language === 'id'
                  ? 'Menstandarkan daya radiatif api (FRP Megawatts) lintas 4 satelit menggunakan model fisika radiasi termal kanal 4 µm & 3.74 µm.'
                  : 'Standardizes Fire Radiative Power (MW) across 4 NASA satellites via thermal infrared radiation physics in 4 µm & 3.74 µm channels.'}
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400">FRP Power-Law Fit</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#fbfbfd] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] space-y-3 flex flex-col justify-between hover:border-red-400 dark:hover:border-red-700 transition-all">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 flex items-center justify-center shadow-xs">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#1d1d1f] dark:text-white">
                {language === 'id' ? '3. Peringatan Dini Gambut (TMAG < -40 cm)' : '3. Peat Early Warning (TMAG < -40 cm)'}
              </h3>
              <p className="text-xs text-[#515154] dark:text-[#d1d5db] leading-relaxed">
                {language === 'id'
                  ? 'Mengintegrasikan ambang batas hidrologi BRGM (PP No. 71/2014) untuk mendeteksi bahaya kebakaran bawah tanah (smoldering) sebelum merembet.'
                  : 'Integrates statutory BRGM peat hydrology thresholds (PP No. 71/2014) to intercept underground smoldering fires before ignition.'}
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-red-600 dark:text-red-400">BRGM Peat Hydrology</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#fbfbfd] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] space-y-3 flex flex-col justify-between hover:border-emerald-400 dark:hover:border-emerald-700 transition-all">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#1d1d1f] dark:text-white">
                {language === 'id' ? '4. NASA GIBS & FIRMS Live Feed' : '4. NASA GIBS & Real-Time FIRMS'}
              </h3>
              <p className="text-xs text-[#515154] dark:text-[#d1d5db] leading-relaxed">
                {language === 'id'
                  ? 'Menghubungkan citra satelit harian asli NASA GIBS WMTS dan live ingestion NASA FIRMS 24 jam dengan disposisi lapangan otomatis WhatsApp.'
                  : 'Connects authentic NASA GIBS WMTS true-color daily imagery with 24-hour NASA FIRMS live feeds and instant WhatsApp field dispatch.'}
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">NASA GIBS WMTS Level 9</span>
          </div>

        </div>
      </section>

      {/* 4. HISTORIC BENCHMARK CASE STUDIES */}
      <section className="bg-gradient-to-r from-blue-900/10 via-emerald-900/5 to-transparent dark:from-blue-950/40 dark:via-emerald-950/20 dark:to-transparent border border-blue-200/80 dark:border-blue-900/50 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
              {language === 'id' ? 'Validasi Empiris 26 Tahun' : '26-Year Empirical Validation'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] dark:text-white tracking-tight mt-0.5">
              {language === 'id' ? '3 Studi Kasus Bencana Karhutla Terbesar Indonesia' : '3 Extreme Indonesian Fire Disaster Benchmarks'}
            </h2>
          </div>
          
          <button
            onClick={() => onSelectTab('overview')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>{language === 'id' ? 'Uji di Dashboard' : 'Test in Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 uppercase">
              Krisis Terparah
            </span>
            <h4 className="font-bold text-sm text-[#1d1d1f] dark:text-white">
              El Niño 2015 (Kalteng &amp; Sumsel)
            </h4>
            <p className="text-xs text-[#6e6e73] dark:text-[#9ca3af] leading-relaxed">
              {language === 'id'
                ? 'Puncak pelepasan energi FRP >12.400 MW. Membuktikan akurasi kalibrasi saat transisi sensor MODIS ke VIIRS di puncak kekeringan terparah.'
                : 'FRP peak >12,400 MW. Proves calibration accuracy during the MODIS-to-VIIRS transition in modern history\'s worst drought.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 uppercase">
              Asap Lintas Batas
            </span>
            <h4 className="font-bold text-sm text-[#1d1d1f] dark:text-white">
              Indian Ocean Dipole (IOD+) 2019
            </h4>
            <p className="text-xs text-[#6e6e73] dark:text-[#9ca3af] leading-relaxed">
              {language === 'id'
                ? 'Kebakaran gambut masif di Kubah Gambut OKI (Sumsel) dan Ketapang (Kalbar). Menunjukkan deteksi dini pada musim kering anomali.'
                : 'Massive peat combustion across OKI (Sumsel) and Ketapang (Kalbar). Demonstrates anomaly detection during positive dipole events.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 uppercase">
              Dampak Restorasi
            </span>
            <h4 className="font-bold text-sm text-[#1d1d1f] dark:text-white">
              Restorasi BRGM 2022–2026 (Riau)
            </h4>
            <p className="text-xs text-[#6e6e73] dark:text-[#9ca3af] leading-relaxed">
              {language === 'id'
                ? 'Penyekatan kanal dan pembasahan gambut (TMAG > -25 cm) berhasil menekan 85% titik api dibandingkan dekade sebelumnya.'
                : 'Canal-blocking and peat rewetting (TMAG > -25 cm) suppressed 85% of fire hotspots compared to previous baseline decades.'}
            </p>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE LAUNCHPAD CTA */}
      <section className="bg-gradient-to-br from-[#1d1d1f] to-[#0f172a] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Open Science &bull; 100% Client-Side Engine</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            {language === 'id' ? 'Siap Mengeksplorasi Data 26 Tahun?' : 'Ready to Explore 26 Years of Satellite Intel?'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
            {language === 'id'
              ? 'Akses peta interaktif, kalender titik api 52-minggu, simulator lab fisika, dan generator disposisi lapangan secara gratis dan terbuka.'
              : 'Access interactive maps, the 52-week fire matrix calendar, the physics lab simulator, and field dispatch tools openly.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={() => onSelectTab('overview')}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer min-h-[50px]"
          >
            <span>{language === 'id' ? 'Buka Dashboard Sekarang' : 'Launch Dashboard Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectTab('team')}
            className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer min-h-[50px]"
          >
            <span>{language === 'id' ? 'Profil Kreator' : 'Creator Profile'}</span>
          </button>
        </div>
      </section>

    </div>
  );
};
