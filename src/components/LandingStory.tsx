import React, { useState, useRef, MouseEvent } from 'react';
import { Language, translations } from '../data/translations';
import {
  Flame,
  Satellite,
  Layers,
  ShieldCheck,
  Globe,
  Database,
  Cpu,
  Activity,
  CheckCircle2,
  Sliders,
  Terminal,
  Compass,
  Copy,
  Check,
  ArrowRight,
  PlayCircle,
  BarChart3,
  AlertTriangle,
  Info
} from 'lucide-react';
import { NavTab } from './Navbar';

interface LandingStoryProps {
  language: Language;
  onSelectTab: (tab: NavTab) => void;
  onOpenTour: () => void;
}

// Obsidian Spotlight Card with Cursor-Tracking Radiant Light (Constrained Dose)
const ObsidianSpotlightCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}> = ({ children, className = '', spotlightColor = 'rgba(56, 189, 248, 0.08)' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0B0F17] p-4 sm:p-6 transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-sm hover:shadow-md ${className}`}
    >
      {/* Ambient Spotlight Glow (Restrained) */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-200 rounded-2xl sm:rounded-3xl"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};

export const LandingStory: React.FC<LandingStoryProps> = ({
  language,
  onSelectTab,
  onOpenTour,
}) => {
  const t = translations[language];
  const [paradoxMode, setParadoxMode] = useState<'raw' | 'harmonized'>('harmonized');
  const [copiedClone, setCopiedClone] = useState(false);

  const handleCopyClone = () => {
    navigator.clipboard.writeText('git clone https://github.com/Rangga11268/TerraHarmonia.git');
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  const MARQUEE_ITEMS = [
    { label: 'NASA TERRA EOS AM-1', sub: '705 km Orbit' },
    { label: 'SUOMI-NPP VIIRS', sub: '375 m Spatial Acuity' },
    { label: '5.5 KM EQUAL-AREA', sub: 'Zero Overcounting' },
    { label: '13.4M HA PEATLANDS', sub: 'Indonesia Carbon Sinks' },
    { label: 'BRGM TMAG < -40 CM', sub: 'Smoldering Interception' },
    { label: 'ZERO-LATENCY ENGINE', sub: '0 ms Client-Side' },
    { label: 'RFC 7946 GEOJSON', sub: 'QGIS / ArcGIS Standard' },
  ];

  return (
    <div className="w-full space-y-8 sm:space-y-12 animate-in fade-in duration-200 max-w-full overflow-hidden">
      
      {/* 1. HERO SECTION (HD Satellite Background Backdrop) */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-800 p-5 sm:p-10 lg:p-14 shadow-2xl space-y-6 sm:space-y-8 bg-neutral-950 text-white">
        
        {/* HD Satellite Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity scale-105 pointer-events-none transition duration-1000"
          style={{ backgroundImage: "url('/terra_hero_satellite_earth.jpg')" }}
        />

        {/* Dark Scrim / Vignette for 100% Contrast & Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/90 via-neutral-950/70 to-neutral-950/95 pointer-events-none" />

        {/* Subtle Geometric Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5 sm:space-y-6">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 text-xs font-semibold text-neutral-200 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-tight text-[11px] sm:text-xs">
              NASA Space Apps Challenge 2026 &bull; Global Earth Observation
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight sm:leading-tight text-white drop-shadow-md">
            {language === 'id' ? (
              <>
                Harmonisasi <span className="text-emerald-400">26 Tahun Data Titik Api</span> Satelit NASA di Indonesia
              </>
            ) : (
              <>
                Harmonizing <span className="text-emerald-400">26 Years of NASA Satellite</span> Fire Records
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-neutral-200 max-w-3xl mx-auto leading-relaxed font-normal drop-shadow-sm">
            {language === 'id'
              ? 'Dari sensor MODIS 1 km (2000) hingga VIIRS 375 m (2026): Memulihkan kebenaran ilmiah deret waktu iklim, mengeliminasi bias sensorik 300%, dan melindungi 13.4 juta hektar lahan gambut tropis Indonesia.'
              : 'From 1 km MODIS (2000) to 375 m VIIRS (2026): Restoring historical fire climatology truth, eliminating artificial 300% sensor shift bias, and protecting 13.4 million hectares of Indonesian tropical peatlands.'}
          </p>

          {/* Action CTAs (Mobile: Full-Width Stacked, Desktop: Inline) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onSelectTab('overview')}
              className="w-full sm:w-auto h-12 min-h-[48px] px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <Activity className="w-4 h-4 text-neutral-950" />
              <span>{language === 'id' ? 'Buka Intelijen Peta & Kalender' : 'Launch 26-Year Intel & Map'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTab('lab')}
              className="w-full sm:w-auto h-12 min-h-[48px] px-6 rounded-xl bg-neutral-900/90 backdrop-blur-md hover:bg-neutral-800 text-white border border-neutral-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>{language === 'id' ? 'Lab Harmonisasi & Fisika' : 'Harmonization Lab & Physics'}</span>
            </button>

            <button
              onClick={onOpenTour}
              className="w-full sm:w-auto h-12 min-h-[48px] px-5 rounded-xl bg-neutral-900/60 backdrop-blur-md hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/60 text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <PlayCircle className="w-4 h-4 text-amber-400" />
              <span>{language === 'id' ? 'Panduan Eksplorasi 30 Detik' : '30-Sec Guide'}</span>
            </button>
          </div>

          {/* 4 Quantitative Proof Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 pt-6 sm:pt-8 border-t border-neutral-800/80 text-left">
            <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-900/80 backdrop-blur-md border border-neutral-700/70 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block">Rentang Data NASA</span>
              <strong className="text-xl sm:text-2xl font-black text-white num block mt-0.5">26 Tahun</strong>
              <span className="text-[11px] text-neutral-400">2000 &ndash; 2026 Archive</span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-900/80 backdrop-blur-md border border-neutral-700/70 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block">Fusi Spasial Grid</span>
              <strong className="text-xl sm:text-2xl font-black text-emerald-400 num block mt-0.5">5.5 km</strong>
              <span className="text-[11px] text-neutral-400">Equal-Area Binning</span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-900/80 backdrop-blur-md border border-neutral-700/70 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block">Ambang Gambut BRGM</span>
              <strong className="text-xl sm:text-2xl font-black text-red-400 num block mt-0.5">&lt; -40 cm</strong>
              <span className="text-[11px] text-neutral-400">TMAG Fire Threshold</span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-900/80 backdrop-blur-md border border-neutral-700/70 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block">Latensi Eksekusi</span>
              <strong className="text-xl sm:text-2xl font-black text-blue-400 num block mt-0.5">0 ms</strong>
              <span className="text-[11px] text-neutral-400">Client-Side Engine</span>
            </div>
          </div>

        </div>

      </section>

      {/* 2. CONTINUOUS TICKER MARQUEE (Zero Horizontal Overflow) */}
      <div className="w-full overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-[#070a12] py-2.5 shadow-inner">
        <div className="flex items-center gap-6 sm:gap-8 animate-marquee whitespace-nowrap">
          {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 shrink-0 px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold font-mono tracking-tight text-neutral-800 dark:text-neutral-200">
                {item.label}
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                ({item.sub})
              </span>
              <span className="text-neutral-300 dark:text-neutral-700 ml-3 sm:ml-4">&bull;</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. BENTO GRID: SENSOR SHIFT PARADOX & SCIENTIFIC ARTIFACTS */}
      <section className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>{language === 'id' ? 'Arsitektur & Paradoks Sains' : 'Architecture & Science Dilemma'}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight mt-1">
              {language === 'id' ? 'Membedah Paradoks Sensorik 2012' : 'Deconstructing the 2012 Sensor Shift'}
            </h2>
          </div>

          {/* Interactive Simulation Switcher (Mobile Touch-Friendly) */}
          <div className="w-full sm:w-auto grid grid-cols-2 sm:flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs shrink-0">
            <button
              onClick={() => setParadoxMode('raw')}
              className={`min-h-[40px] sm:min-h-0 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold flex items-center justify-center text-center ${
                paradoxMode === 'raw'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {language === 'id' ? 'Data Mentah (Bias)' : 'Raw (Artifact)'}
            </button>
            <button
              onClick={() => setParadoxMode('harmonized')}
              className={`min-h-[40px] sm:min-h-0 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold flex items-center justify-center text-center ${
                paradoxMode === 'harmonized'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {language === 'id' ? 'Terkalibrasi 5.5 km' : 'Harmonized 5.5 km'}
            </button>
          </div>
        </div>

        {/* Bento Grid Layout (Mobile: Single Column Stack, Desktop: 12 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          
          {/* Bento Item 1: Interactive Paradox Simulator (8 Cols on Desktop) */}
          <ObsidianSpotlightCard
            className="lg:col-span-8"
            spotlightColor={paradoxMode === 'raw' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)'}
          >
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                    Interactive Resolution Comparison
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mt-0.5">
                    {paradoxMode === 'raw'
                      ? (language === 'id' ? 'Ilusi Lonjakan Titik Api Sensorik (VIIRS 375 m)' : 'Artificial Sensor Hotspot Surge (VIIRS 375 m)')
                      : (language === 'id' ? 'Solusi Fusi Spasial Setara Terra Harmonia (5.5 km)' : 'Terra Harmonia Equal-Area Spatial Fusion (5.5 km)')}
                  </h3>
                </div>
                <span className={`self-start sm:self-auto text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                  paradoxMode === 'raw' ? 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                }`}>
                  {paradoxMode === 'raw' ? 'Double Counting Active' : 'Harmonization Active'}
                </span>
              </div>

              {/* Visual Simulation Canvas */}
              <div className="w-full min-h-[220px] sm:min-h-[240px] rounded-xl sm:rounded-2xl bg-neutral-50 dark:bg-[#070a12] border border-neutral-200 dark:border-neutral-800 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden shadow-inner">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                {paradoxMode === 'raw' ? (
                  <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                    <div className="w-44 sm:w-48 h-32 sm:h-36 rounded-xl sm:rounded-2xl bg-red-500/10 border-2 border-dashed border-red-500/60 grid grid-cols-4 gap-2 p-3 place-items-center shadow-md">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <div key={n} className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                          {n}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-3 py-1 rounded-full border border-red-200 dark:border-red-900/50">
                      1 Kebakaran Nyata = 8 Deteksi Terpecah (Bias +300%)
                    </span>
                  </div>
                ) : (
                  <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                    <div className="w-40 sm:w-44 h-40 sm:h-44 rounded-xl sm:rounded-2xl bg-emerald-500/10 border-2 border-emerald-500 flex flex-col items-center justify-center p-4 shadow-md">
                      <div className="w-20 h-20 rounded-full bg-emerald-600 text-white flex flex-col items-center justify-center font-bold text-xs shadow-md">
                        <span className="text-sm">1 Klaster</span>
                        <span className="text-[9px] font-mono opacity-90">420 MW</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 mt-2 font-bold">
                        Grid 5.5 km Equal-Area
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/50">
                      8 Titik Api Disatukan Menjadi 1 Peristiwa Objektif
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {paradoxMode === 'raw'
                  ? 'Sebelum 2012, MODIS (1 km) mendeteksi kebakaran sebagai 1 titik. Masuknya VIIRS (375 m) menghasilkan 7–9 titik pada garis api yang sama. Pengambil kebijakan yang mengandalkan raw data tertipu menyangka frekuensi kebakaran melonjak drastis.'
                  : 'Algoritma Terra Harmonia melakukan pengelompokan equal-area 5.5 km dan mengalibrasi daya radiatif (FRP) Stefan-Boltzmann sehingga deret waktu 2000–2026 kembali homogen dan dapat dipercaya.'}
              </p>
            </div>
          </ObsidianSpotlightCard>

          {/* Bento Item 2: Peatland Hydrology Dial (4 Cols on Desktop) */}
          <ObsidianSpotlightCard className="lg:col-span-4" spotlightColor="rgba(239, 68, 68, 0.10)">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  BRGM Hydrology
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  {language === 'id' ? 'Muka Air Tanah Gambut' : 'Peat Groundwater Table'}
                </h3>
                <span className="text-xs text-red-600 dark:text-red-400 font-semibold font-mono block mt-0.5">
                  TMAG &lt; -40 cm = Zona Kritis
                </span>
              </div>

              {/* Peat Stratigraphy Visualizer */}
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#070a12] border border-neutral-200 dark:border-neutral-800 space-y-2.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-emerald-600 font-semibold">0 cm (Basah)</span>
                  <span className="text-red-500 font-bold">-40 cm (Kritis)</span>
                  <span className="text-neutral-500">-100 cm</span>
                </div>
                <div className="w-full h-3 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-600 relative">
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-red-600 absolute top-1/2 -translate-y-1/2 left-[65%] shadow-md" />
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 pt-1 leading-relaxed">
                  Saat TMAG turun di bawah -40 cm, gambut kering memicu bara api bawah tanah (*smoldering*) yang sulit dipadamkan.
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-500">Regulasi:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">PP No. 71/2014 &amp; BRGM</span>
              </div>
            </div>
          </ObsidianSpotlightCard>

        </div>
      </section>

      {/* 4. 4 CORE SPOTLIGHT INNOVATIONS */}
      <section className="space-y-4 sm:space-y-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Cpu className="w-4 h-4" />
            <span>{language === 'id' ? 'Pilar Sains & Rekayasa' : 'Scientific & Engineering Pillars'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight mt-1">
            {language === 'id' ? '4 Terobosan Teknologi Terra Harmonia' : '4 Core Technological Breakthroughs'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          
          <ObsidianSpotlightCard spotlightColor="rgba(2, 132, 199, 0.12)">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white">
                1. Spatial 5.5 km Equal-Area Grid
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Menyatukan beberapa piksel tajam VIIRS (375 m) ke dalam satu footprint setara MODIS (1 km), mengeliminasi double-counting lintas generasi satelit.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 mt-3 block">
              Equal-Area Projection
            </span>
          </ObsidianSpotlightCard>

          <ObsidianSpotlightCard spotlightColor="rgba(147, 51, 234, 0.12)">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs">
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white">
                2. Stefan-Boltzmann FRP Calibration
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Menstandarkan energi radiatif api (FRP Megawatts) lintas 4 satelit menggunakan model fisika radiasi termal kanal 4 µm &amp; 3.74 µm.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400 mt-3 block">
              FRP Power-Law Fit
            </span>
          </ObsidianSpotlightCard>

          <ObsidianSpotlightCard spotlightColor="rgba(239, 68, 68, 0.12)">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white">
                3. Peat Early Warning (TMAG -40cm)
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Integrasi ambang batas muka air tanah gambut BRGM untuk mendeteksi potensi kebakaran bawah tanah sebelum merembet menjadi krisis asap.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-red-600 dark:text-red-400 mt-3 block">
              BRGM Peat Hydrology
            </span>
          </ObsidianSpotlightCard>

          <ObsidianSpotlightCard spotlightColor="rgba(16, 185, 129, 0.12)">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                <Globe className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white">
                4. NASA GIBS &amp; FIRMS Live Feed
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Menghubungkan citra satelit harian asli NASA GIBS WMTS dan live feed NASA FIRMS 24 jam dengan generator disposisi lapangan WhatsApp otomatis.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-3 block">
              NASA GIBS WMTS Level 9
            </span>
          </ObsidianSpotlightCard>

        </div>
      </section>

      {/* 5. HISTORIC BENCHMARK CASE STUDIES */}
      <section className="rounded-2xl sm:rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-[#070a12]/70 p-5 sm:p-8 lg:p-10 shadow-xs space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {language === 'id' ? 'Validasi Empiris 26 Tahun' : '26-Year Empirical Validation'}
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight mt-0.5">
              {language === 'id' ? '3 Studi Kasus Bencana Karhutla Nyata' : '3 Extreme Indonesian Fire Disaster Benchmarks'}
            </h2>
          </div>
          
          <button
            onClick={() => onSelectTab('overview')}
            className="w-full sm:w-auto h-11 min-h-[44px] px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>{language === 'id' ? 'Uji di Dashboard' : 'Test in Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#111827] border border-neutral-200 dark:border-neutral-800 space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 uppercase">
              Krisis Terparah
            </span>
            <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
              El Niño 2015 (Kalteng &amp; Sumsel)
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Puncak pelepasan energi FRP &gt;12.400 MW. Membuktikan akurasi kalibrasi saat transisi sensor MODIS ke VIIRS di puncak kekeringan terparah.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#111827] border border-neutral-200 dark:border-neutral-800 space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 uppercase">
              Asap Lintas Batas
            </span>
            <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
              Indian Ocean Dipole (IOD+) 2019
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Kebakaran gambut masif di Kubah Gambut OKI (Sumsel) dan Ketapang (Kalbar). Menunjukkan deteksi dini pada musim kering anomali.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-[#111827] border border-neutral-200 dark:border-neutral-800 space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 uppercase">
              Dampak Restorasi
            </span>
            <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
              Restorasi BRGM 2022–2026 (Riau)
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Penyekatan kanal dan pembasahan gambut (TMAG &gt; -25 cm) berhasil menekan 85% titik api dibandingkan dekade sebelumnya.
            </p>
          </div>
        </div>
      </section>

      {/* 6. DEVELOPER TERMINAL & REPOSITORY CTA */}
      <section className="rounded-2xl sm:rounded-3xl bg-neutral-950 text-white border border-neutral-800 p-5 sm:p-8 lg:p-10 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-neutral-800">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Open Science MIT &bull; 100% Client-Side Engine</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight">
              {language === 'id' ? 'Siap Mengeksplorasi Data 26 Tahun?' : 'Ready to Explore 26 Years of Satellite Intel?'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
              Akses peta satelit interaktif, matriks kalender kebakaran 52-minggu, simulator lab fisika, dan generator disposisi lapangan secara instan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('overview')}
              className="w-full sm:w-auto h-12 min-h-[48px] px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>{language === 'id' ? 'Buka Dashboard Sekarang' : 'Launch Dashboard Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTab('team')}
              className="w-full sm:w-auto h-12 min-h-[48px] px-5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>{language === 'id' ? 'Profil Kreator' : 'Creator Profile'}</span>
            </button>
          </div>
        </div>

        {/* Mini Command Line Prompt (Mobile friendly, wraps/scrolls) */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#030508] border border-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-neutral-300 min-w-0 max-w-full overflow-x-auto py-1">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-neutral-500">$</span>
            <span className="text-emerald-300 truncate">git clone https://github.com/Rangga11268/TerraHarmonia.git</span>
          </div>

          <button
            onClick={handleCopyClone}
            className="w-full sm:w-auto min-h-[40px] sm:min-h-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 transition cursor-pointer shrink-0"
          >
            {copiedClone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 opacity-60" />}
            <span>{copiedClone ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </section>

    </div>
  );
};

