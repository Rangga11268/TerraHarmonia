import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Satellite,
  Flame,
  ShieldCheck,
  Zap,
  Globe2,
  CheckCircle2,
  Play,
  Pause,
  ArrowRight,
  RotateCcw,
  TreePine,
  Activity,
  Layers,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Language } from '../data/translations';

interface CinematicIntroTourProps {
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  isOpen: boolean;
  onClose: () => void;
  onEnterApp?: () => void;
}

export const CinematicIntroTour: React.FC<CinematicIntroTourProps> = ({
  language,
  onToggleLanguage,
  isOpen,
  onClose,
  onEnterApp,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [orbitAngle, setOrbitAngle] = useState<number>(0);

  const SLIDE_DURATION_MS = 7000; // 7 seconds per slide

  // 30-Second Mission Briefing Slides
  const slides = [
    {
      id: 'history_crisis',
      step: '01 / 04',
      badgeId: 'Sejarah & Krisis Nyata (2000–2026)',
      badgeEn: 'Historical Context & Real Crisis (2000–2026)',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
      titleId: '26 Tahun Krisis Asap & Pembakaran Lahan Gambut Indonesia',
      titleEn: '26 Years of Peatland Wildfire & Transboundary Haze in Indonesia',
      descId:
        'Lahan gambut tropis Indonesia menyimpan lebih dari 57 Gigaton karbon. Saat terjadi anomali iklim ekstrem seperti Super El Niño 2015 dan IOD+ 2019, jutaan hektar gambut terbakar di bawah tanah (smoldering), melepaskan emisi gas rumah kaca masif dan kabut asap lintas batas yang melumpuhkan Asia Tenggara.',
      descEn:
        'Indonesian tropical peatlands store over 57 Gigatons of carbon. During extreme climate anomalies like Super El Niño 2015 and positive IOD 2019, millions of hectares of deep peat smolder underground, releasing massive greenhouse emissions and suffocating transboundary haze across Southeast Asia.',
      highlightId: '14.9 Juta Hektar Ekosistem Gambut Rentan Terbakar',
      highlightEn: '14.9 Million Hectares of Fragile Tropical Peat Dome',
      stats: [
        { labelId: 'Emisi 2015', labelEn: '2015 Emissions', value: '1.75 Gt CO₂e' },
        { labelId: 'Rentang Rekaman', labelEn: 'Archive Span', value: '26 Tahun' },
        { labelId: 'Kedalaman Gambut', labelEn: 'Peat Dome Depth', value: 'Hingga 12 m' },
      ],
      mode: 'crisis',
    },
    {
      id: 'satellite_shift',
      step: '02 / 04',
      badgeId: 'Paradoks Pergeseran Sensor NASA',
      badgeEn: 'The NASA Satellite Shift Paradox',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      titleId: 'Mengapa Data Titik Api Mentah Pasca-2012 Seolah Melonjak 300%?',
      titleEn: 'Why Uncorrected Post-2012 Satellite Fire Counts Artificially Tripled',
      descId:
        'Pada 2000, NASA meluncurkan satelit Terra (MODIS, piksel 1km). Pada 2012, satelit Suomi-NPP (VIIRS, piksel 375m) ditambahkan. Karena VIIRS 7x lebih tajam, satu kebakaran yang sama terdeteksi sebagai 5–9 titik terpisah! Tanpa kalibrasi, pengambil kebijakan tertipu mengira kebakaran meningkat drastis.',
      descEn:
        'In 2000, NASA deployed Terra (MODIS, 1km pixel). In 2012, Suomi-NPP (VIIRS, 375m pixel) joined. Because VIIRS has 7x smaller pixels, a single continuous fire front gets counted as 5 to 9 discrete points! Without harmonization, raw data misleads decision-makers into assuming fire frequency exploded.',
      highlightId: 'Piksel 1km (MODIS) vs 375m (VIIRS) Tanpa Kalibrasi',
      highlightEn: 'MODIS 1km vs VIIRS 375m Optical Footprint Divergence',
      stats: [
        { labelId: 'Resolusi MODIS', labelEn: 'MODIS Footprint', value: '1,000 m' },
        { labelId: 'Resolusi VIIRS', labelEn: 'VIIRS Footprint', value: '375 m' },
        { labelId: 'Pecahan Deteksi', labelEn: 'Overcount Ratio', value: '5 – 9x Spike' },
      ],
      mode: 'sensors',
    },
    {
      id: 'terra_harmonia',
      step: '03 / 04',
      badgeId: 'Solusi: Lahirnya Terra Harmonia',
      badgeEn: 'The Solution: Birth of Terra Harmonia',
      badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
      titleId: 'Menyatukan 26 Tahun Sains Antariksa NASA Menjadi Satu Rekaman Iklim yang Valid',
      titleEn: 'Harmonizing 26 Years of NASA Satellite Data into One True Climate Record',
      descId:
        'Terra Harmonia mengintegrasikan algoritma Equal-Area Binning 5.5 km dan normalisasi energi termal Fire Radiative Power (FRP Megawatt) berbasis hukum radiasi Stefan-Boltzmann. Menyatukan MODIS dan VIIRS ke dalam satu standar iklim yang homogen dan akurat untuk seluruh 38 provinsi Indonesia.',
      descEn:
        'Terra Harmonia solves this through 5.5 km Equal-Area Spatial Binning and Stefan-Boltzmann Fire Radiative Power (FRP Megawatts) cross-calibration. Harmonizing MODIS and VIIRS into a unified, cross-decadal climatology across all 38 provinces of Indonesia.',
      highlightId: 'Harmonisasi Spasial 5.5km & Pembobotan FRP Termal',
      highlightEn: '5.5 km Equal-Area Grid & Cross-Sensor FRP Weighting',
      stats: [
        { labelId: 'Grid Spasial', labelEn: 'Equal-Area Grid', value: '5.5 km' },
        { labelId: 'Koreksi Overcount', labelEn: 'Overcount Cleared', value: '100% Valid' },
        { labelId: 'Standar Kalibrasi', labelEn: 'Calibration Base', value: 'NASA FIRMS' },
      ],
      mode: 'harmonize',
    },
    {
      id: 'field_action',
      step: '04 / 04',
      badgeId: 'Dampak Nyata & Mitigasi Lapangan',
      badgeEn: 'Field Mitigation & Climate Action',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      titleId: 'Dari Sains Antariksa Menjadi Aksi Cepat Tim Patroli Manggala Agni',
      titleEn: 'From Orbital Science to Rapid Ground Action for Fire Brigades',
      descId:
        'Terra Harmonia menghubungkan deteksi satelit dengan parameter hidrologi gambut nyata: status Muka Air Tanah (TMAG < -40 cm BRGM), estimasi emisi karbon lahan gambut, generator disposisi WhatsApp untuk Manggala Agni, dan ekspor spasial GeoJSON untuk GIS lapangan.',
      descEn:
        'Terra Harmonia bridges orbital telemetry with ground hydrology: statutory Peat Water Table depths (TMAG < -40 cm), real-time carbon emission estimation, automated WhatsApp dispatch for frontline fire brigades, and instant GeoJSON GIS exports.',
      highlightId: 'Pencegahan Kebakaran Bawah Tanah & Proteksi Karbon',
      highlightEn: 'Underground Smoldering Prevention & Peat Conservation',
      stats: [
        { labelId: 'Ambang Kritis BRGM', labelEn: 'BRGM Critical TMAG', value: '-40 cm' },
        { labelId: 'Integrasi Disposisi', labelEn: 'Dispatch Pipeline', value: 'WhatsApp & SMS' },
        { labelId: 'Format Standar', labelEn: 'Standard Format', value: 'GeoJSON / RFC 7946' },
      ],
      mode: 'mitigate',
    },
  ];

  // Satellite orbit animation tick
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setOrbitAngle((prev) => (prev + 0.8) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Slide progress & auto-advance timer
  useEffect(() => {
    if (!isOpen || !isAutoPlaying) return;

    const tickMs = 50;
    const progressStep = (tickMs / SLIDE_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((s) => (s < slides.length - 1 ? s + 1 : 0));
          return 0;
        }
        return prev + progressStep;
      });
    }, tickMs);

    return () => clearInterval(timer);
  }, [isOpen, isAutoPlaying, currentSlide, slides.length]);

  // Reset progress when manual slide changes
  const handleSelectSlide = (idx: number) => {
    setCurrentSlide(idx);
    setProgress(0);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      handleSelectSlide(currentSlide + 1);
    } else {
      handleEnter();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      handleSelectSlide(currentSlide - 1);
    }
  };

  const handleEnter = () => {
    try {
      localStorage.setItem('terra_harmonia_intro_seen', 'true');
    } catch (e) {}
    if (onEnterApp) onEnterApp();
    onClose();
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleEnter();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide]);

  if (!isOpen) return null;

  const current = slides[currentSlide];

  // Satellite orbit visual coordinates
  const radTerra = (orbitAngle * Math.PI) / 180;
  const terraX = 50 + 38 * Math.cos(radTerra);
  const terraY = 50 + 16 * Math.sin(radTerra);

  const radViirs = ((orbitAngle + 180) * Math.PI) / 180;
  const viirsX = 50 + 44 * Math.cos(radViirs);
  const viirsY = 50 + 20 * Math.sin(radViirs);

  const modalContent = (
    <div className="fixed inset-0 z-[100000] bg-[#050914] text-slate-100 flex flex-col font-sans select-none overflow-hidden animate-in fade-in duration-300">
      
      {/* Background Starfield & Atmospheric Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-sky-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Top Bar: Mission Brand, Language Switcher, Skip / Close */}
      <header className="relative z-30 h-16 px-5 sm:px-8 flex items-center justify-between border-b border-slate-800/80 bg-[#070c1a]/80 backdrop-blur-md">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 p-0.5 shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-[#070c1a] rounded-[10px] flex items-center justify-center text-sky-400">
              <Globe2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white tracking-tight">Terra Harmonia</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                NASA Space Apps
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {language === 'id' ? 'Tur Singkat Misi & Harmonisasi Spasial 30 Detik' : '30-Second Mission Briefing & Climatology Tour'}
            </p>
          </div>
        </div>

        {/* Right Actions: Auto-play Toggle, Language, Skip Button */}
        <div className="flex items-center gap-2.5">
          
          {/* Auto-play toggle */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition cursor-pointer text-xs flex items-center gap-1.5"
            title={isAutoPlaying ? (language === 'id' ? 'Jeda Putar Otomatis' : 'Pause Auto-Play') : (language === 'id' ? 'Mulai Putar Otomatis' : 'Start Auto-Play')}
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isAutoPlaying ? 'Auto' : 'Paused'}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-800/90 rounded-xl p-0.5 border border-slate-700/80 text-xs font-semibold">
            <button
              onClick={() => onToggleLanguage('en')}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                language === 'en' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onToggleLanguage('id')}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                language === 'id' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              ID
            </button>
          </div>

          {/* Skip Button to Enter Dashboard */}
          <button
            onClick={handleEnter}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-sky-600/20 cursor-pointer shrink-0"
          >
            <span>{language === 'id' ? 'Masuk ke Web' : 'Enter App'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </header>

      {/* Main Content Area: 2 Columns (Narrative Card + 3D Satellite Radar Stage) */}
      <div className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center z-20 overflow-y-auto">
        
        {/* Left Column: Narrative Card & Metrics */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
          
          {/* Step Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-sky-400">
              {current.step}
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${current.badgeColor}`}>
              {language === 'id' ? current.badgeId : current.badgeEn}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {language === 'id' ? current.titleId : current.titleEn}
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {language === 'id' ? current.descId : current.descEn}
          </p>

          {/* Key Stat Cards */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {current.stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/90 shadow-sm"
              >
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold truncate">
                  {language === 'id' ? stat.labelId : stat.labelEn}
                </div>
                <div className="text-sm sm:text-base font-black text-white num mt-0.5 truncate">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Highlight Banner */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="font-semibold text-white">
              {language === 'id' ? current.highlightId : current.highlightEn}
            </span>
          </div>

        </div>

        {/* Right Column: Animated Interactive 3D Orbit Radar Stage */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          
          <div className="relative w-full max-w-lg aspect-square rounded-3xl bg-[#091122]/90 border border-slate-800/90 shadow-2xl p-6 flex flex-col items-center justify-center overflow-hidden [isolation:isolate]">
            
            {/* Radar Scan Grid Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08)_0%,transparent_70%)]" />
            <div className="absolute inset-6 rounded-full border border-slate-800/80 border-dashed" />
            <div className="absolute inset-16 rounded-full border border-sky-500/20" />
            <div className="absolute inset-28 rounded-full border border-emerald-500/20" />

            {/* Orbit Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
              {/* Elliptical Orbit Terra MODIS */}
              <ellipse cx="50" cy="50" rx="38" ry="16" fill="none" stroke="#38bdf8" strokeWidth="0.4" strokeDasharray="2 2" opacity="0.6" />
              {/* Elliptical Orbit Suomi-NPP VIIRS */}
              <ellipse cx="50" cy="50" rx="44" ry="20" fill="none" stroke="#34d399" strokeWidth="0.4" strokeDasharray="3 2" opacity="0.6" />

              {/* Sensor Beam Cone Projection to Earth */}
              <polygon
                points={`${terraX},${terraY} 46,50 54,50`}
                fill="url(#terraBeamGrad)"
                opacity="0.35"
              />
              <polygon
                points={`${viirsX},${viirsY} 48,52 52,48`}
                fill="url(#viirsBeamGrad)"
                opacity="0.35"
              />

              <defs>
                <linearGradient id="terraBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="viirsBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Earth Center Globe Visual */}
            <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-sky-950 via-emerald-950 to-slate-900 border-2 border-sky-500/40 shadow-2xl flex flex-col items-center justify-center p-3 text-center z-10 overflow-hidden">
              
              {/* Glowing Atmosphere Rim */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-sky-400/20 to-transparent pointer-events-none" />
              
              {/* Simulated Fire Hotspots Pulsing on Earth */}
              <div className="absolute top-12 left-10 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping opacity-80" />
              <div className="absolute top-16 left-16 w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-90 delay-300" />
              <div className="absolute bottom-12 right-12 w-2 h-2 rounded-full bg-red-600 animate-ping opacity-80 delay-700" />

              <Globe2 className="w-10 h-10 text-sky-400/60 mb-1" />
              <span className="font-bold text-[11px] text-white tracking-wider uppercase">Indonesia</span>
              <span className="text-[9px] text-emerald-400 font-mono">0.789° S, 113.921° E</span>
            </div>

            {/* Terra MODIS Satellite Icon Marker */}
            <div
              className="absolute z-20 flex items-center gap-1.5 transition-all duration-75 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${terraX}%`, top: `${terraY}%` }}
            >
              <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/40 ring-1 ring-sky-300">
                <Satellite className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-bold font-mono px-1 py-0.5 rounded bg-sky-950/90 text-sky-300 border border-sky-500/50 shadow-xs">
                MODIS (1km)
              </span>
            </div>

            {/* Suomi-NPP VIIRS Satellite Icon Marker */}
            <div
              className="absolute z-20 flex items-center gap-1.5 transition-all duration-75 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${viirsX}%`, top: `${viirsY}%` }}
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 ring-1 ring-emerald-300">
                <Satellite className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-bold font-mono px-1 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-xs">
                VIIRS (375m)
              </span>
            </div>

            {/* Stage HUD Telemetry Box */}
            <div className="absolute bottom-3 left-4 right-4 bg-slate-950/80 backdrop-blur-md rounded-xl p-2.5 border border-slate-800 text-[10px] text-slate-300 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono">EOSDIS GIBS Orbit Sync</span>
              </div>
              <div className="font-mono text-sky-400 font-bold">
                {current.mode === 'crisis' && '🔥 ANOMALY EL NIÑO PEAK'}
                {current.mode === 'sensors' && '🛰️ MULTI-SENSOR DIVERGENCE'}
                {current.mode === 'harmonize' && '⚡ 5.5KM STEFAN-BOLTZMANN CALIBRATED'}
                {current.mode === 'mitigate' && '🛡️ BRGM TMAG & SITREP ACTIVE'}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Controls: Segmented Progress Bar & Slide Stepper */}
      <footer className="relative z-30 px-5 sm:px-8 py-4 border-t border-slate-800/80 bg-[#070c1a]/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Slide Progress Bars */}
        <div className="flex items-center gap-2 w-full sm:w-80">
          {slides.map((_, idx) => {
            const isDone = idx < currentSlide;
            const isCurrent = idx === currentSlide;
            return (
              <button
                key={idx}
                onClick={() => handleSelectSlide(idx)}
                className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden cursor-pointer transition-all hover:opacity-90"
              >
                <div
                  className={`h-full transition-all duration-75 ${
                    isDone
                      ? 'w-full bg-sky-500'
                      : isCurrent
                      ? 'bg-gradient-to-r from-sky-400 to-emerald-400'
                      : 'w-0'
                  }`}
                  style={{ width: isCurrent ? `${progress}%` : undefined }}
                />
              </button>
            );
          })}
        </div>

        {/* Step Navigation Buttons */}
        <div className="flex items-center gap-3">
          
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              currentSlide === 0
                ? 'opacity-40 text-slate-500 cursor-not-allowed'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{language === 'id' ? 'Sebelumnya' : 'Back'}</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-sky-600/30 cursor-pointer"
          >
            <span>
              {currentSlide === slides.length - 1
                ? language === 'id'
                  ? 'Mulai Eksplorasi Sekarang'
                  : 'Start Exploring Now'
                : language === 'id'
                ? 'Lanjut'
                : 'Next'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

      </footer>

    </div>
  );

  return createPortal(modalContent, document.body);
};
