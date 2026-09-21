import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  ArrowRight,
  RotateCcw,
  Satellite,
  Flame,
  ShieldCheck,
  Zap,
  Globe2,
  Radio,
  Sliders,
  Compass,
  Crosshair,
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
  const [isWarping, setIsWarping] = useState<boolean>(false);
  const [warpProgress, setWarpProgress] = useState<number>(0);

  const SLIDE_DURATION_MS = 7500; // 7.5 seconds per briefing slide

  // 30-Second NASA Mission Briefing Slides
  const slides = [
    {
      id: 'history_crisis',
      step: '01 / 04',
      badgeId: 'Konteks Sejarah & Krisis Nyata (2000-2026)',
      badgeEn: 'Historical Context & Real Crisis (2000-2026)',
      badgeColor: 'bg-red-950/80 text-red-300 border-red-500/50',
      titleId: '26 Tahun Krisis Asap & Pembakaran Lahan Gambut Tropis Indonesia',
      titleEn: '26 Years of Peatland Wildfire & Transboundary Haze in Indonesia',
      descId:
        'Lahan gambut tropis Indonesia menyimpan lebih dari 57 Gigaton karbon. Pada anomali iklim El Niño 2015 dan IOD+ 2019, jutaan hektar gambut terbakar di bawah tanah (smoldering), melepaskan 1.75 Gt emisi gas rumah kaca dan kabut asap pekat lintas batas ke negara tetangga.',
      descEn:
        'Indonesian tropical peatlands store over 57 Gigatons of carbon. During extreme El Niño 2015 and positive IOD 2019 climate anomalies, millions of hectares of deep peat smoldered underground, releasing 1.75 Gt CO2e and hazardous transboundary haze across Southeast Asia.',
      highlightId: '14.9 Juta Hektar Ekosistem Gambut Rentan Terbakar',
      highlightEn: '14.9 Million Hectares of Fragile Tropical Peat Dome',
      stats: [
        { labelId: 'Emisi Karbon 2015', labelEn: '2015 CO2e Emissions', valueId: '1.75 Gt CO2e', valueEn: '1.75 Gt CO2e' },
        { labelId: 'Rentang Arsip Data', labelEn: 'Archive Span', valueId: '26 Tahun', valueEn: '26 Years' },
        { labelId: 'Kedalaman Gambut', labelEn: 'Peat Dome Depth', valueId: 'Hingga 12 m', valueEn: 'Up to 12 m' },
      ],
      missionTelemetry: {
        mode: 'CRISIS TELEMETRY',
        statusId: 'Anomali El Niño & Pembakaran Bawah Tanah',
        statusEn: 'El Niño Anomaly & Subsurface Smoldering',
        color: 'text-red-400',
      },
    },
    {
      id: 'satellite_shift',
      step: '02 / 04',
      badgeId: 'Paradoks Pergeseran Sensor Satelit NASA',
      badgeEn: 'The NASA Satellite Shift Paradox',
      badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
      titleId: 'Mengapa Data Titik Api Mentah Pasca-2012 Melonjak Hingga 300%?',
      titleEn: 'Why Uncorrected Post-2012 Satellite Fire Counts Artificially Tripled',
      descId:
        'Pada tahun 2000, NASA mengoperasikan satelit Terra (MODIS, resolusi piksel 1 km). Pada tahun 2012, satelit Suomi-NPP (VIIRS, resolusi 375 m) mulai beroperasi. Karena resolusi optik VIIRS 7x lebih rapat, satu garis api yang sama terdeteksi sebagai 5 sampai 9 titik terpisah. Tanpa kalibrasi, pengambil kebijakan tertipu mengira kebakaran melonjak drastis.',
      descEn:
        'In 2000, NASA deployed the Terra satellite (MODIS, 1 km pixel footprint). In 2012, Suomi-NPP (VIIRS, 375 m pixel) joined. Because VIIRS has a 7x finer optical footprint, a single continuous fire front gets detected as 5 to 9 discrete hotspots. Uncorrected raw data misleads decision-makers into assuming fire frequency exploded.',
      highlightId: 'MODIS 1 km vs VIIRS 375 m: Perbedaan Jejak Optik Sensor',
      highlightEn: 'MODIS 1 km vs VIIRS 375 m: Sensor Optical Footprint Divergence',
      stats: [
        { labelId: 'Resolusi MODIS', labelEn: 'MODIS Footprint', valueId: '1,000 m (1 km)', valueEn: '1,000 m (1 km)' },
        { labelId: 'Resolusi VIIRS', labelEn: 'VIIRS Footprint', valueId: '375 m', valueEn: '375 m' },
        { labelId: 'Lonjakan Hitungan', labelEn: 'Artificial Multiplier', valueId: '5-9x Titik Mentah', valueEn: '5-9x Raw Points' },
      ],
      missionTelemetry: {
        mode: 'OPTICAL FOOTPRINT',
        statusId: 'Perbedaan Resolusi MODIS vs VIIRS',
        statusEn: 'MODIS vs VIIRS Footprint Disparity',
        color: 'text-amber-400',
      },
    },
    {
      id: 'terra_harmonia',
      step: '03 / 04',
      badgeId: 'Solusi: Algoritma Rekonsiliasi Terra Harmonia',
      badgeEn: 'The Solution: Terra Harmonia Reconciliation Engine',
      badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-500/50',
      titleId: 'Menyatukan 26 Tahun Rekaman Satelit NASA Menjadi Data Iklim Homogen',
      titleEn: 'Harmonizing 26 Years of NASA Satellite Data into One Verified Climate Record',
      descId:
        'Terra Harmonia menyelesaikan distorsi ini melalui agregasi spasial sel 5.5 km equal-area dan kalibrasi daya radiasi api (Fire Radiative Power - FRP Megawatt) berbasis hukum radiasi termal Stefan-Boltzmann. Seluruh titik api dari MODIS dan VIIRS diselaraskan ke dalam satu deret waktu iklim yang valid untuk seluruh 38 provinsi.',
      descEn:
        'Terra Harmonia reconciles this distortion through 5.5 km equal-area spatial binning and Fire Radiative Power (FRP Megawatts) thermal calibration using Stefan-Boltzmann radiation laws. Merging MODIS and VIIRS into a homogeneous, long-term climate series across all 38 Indonesian provinces.',
      highlightId: 'Grid Spasial 5.5 km Equal-Area & Kalibrasi FRP Stefan-Boltzmann',
      highlightEn: '5.5 km Equal-Area Spatial Grid & Stefan-Boltzmann FRP Calibration',
      stats: [
        { labelId: 'Ukuran Grid Sel', labelEn: 'Spatial Grid Cell', valueId: '5.5 km Equal-Area', valueEn: '5.5 km Equal-Area' },
        { labelId: 'Eliminasi Overcount', labelEn: 'Overcount Eliminated', valueId: '100% Terkalibrasi', valueEn: '100% Calibrated' },
        { labelId: 'Kepatuhan Standar', labelEn: 'Standard Compliance', valueId: 'NASA FIRMS / GIBS', valueEn: 'NASA FIRMS / GIBS' },
      ],
      missionTelemetry: {
        mode: 'ALGORITHM ACTIVE',
        statusId: 'Kalibrasi Spasial 5.5 km & FRP Megawatt',
        statusEn: '5.5 km Spatial & FRP Megawatt Calibration',
        color: 'text-blue-400',
      },
    },
    {
      id: 'field_action',
      step: '04 / 04',
      badgeId: 'Aksi Lapangan & Mitigasi Kebakaran Nyata',
      badgeEn: 'Field Action & Frontline Wildfire Mitigation',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50',
      titleId: 'Dari Telemetri Antariksa Menjadi Instruksi Cepat Brigada Manggala Agni',
      titleEn: 'From Satellite Telemetry to Rapid Ground Dispatch for Fire Brigades',
      descId:
        'Terra Harmonia mengintegrasikan data satelit dengan parameter hidrologi gambut: ambang batas Tinggi Muka Air Gambut (TMAG < -40 cm BRGM), penghitungan emisi karbon gambut, format laporan cepat WhatsApp untuk tim patroli lapangan Manggala Agni, dan ekspor GeoJSON standar GIS.',
      descEn:
        'Terra Harmonia bridges orbital telemetry with ground hydrology: statutory Peat Water Table thresholds (TMAG < -40 cm), peatland carbon emission quantification, automated WhatsApp dispatch generator for Manggala Agni patrol crews, and open GeoJSON GIS exports.',
      highlightId: 'Pencegahan Kebakaran Gambut Bawah Tanah & Proteksi Iklim',
      highlightEn: 'Subsurface Peat Fire Prevention & Carbon Reservoir Protection',
      stats: [
        { labelId: 'Ambang Kritis BRGM', labelEn: 'BRGM Critical Depth', valueId: '-40 cm TMAG', valueEn: '-40 cm TMAG' },
        { labelId: 'Format Disposisi', labelEn: 'Dispatch Pipeline', valueId: 'WhatsApp / SMS Sitrep', valueEn: 'WhatsApp / SMS Sitrep' },
        { labelId: 'Standar Data Geospasial', labelEn: 'Geospatial Standard', valueId: 'GeoJSON / RFC 7946', valueEn: 'GeoJSON / RFC 7946' },
      ],
      missionTelemetry: {
        mode: 'FIELD DISPATCH',
        statusId: 'Integrasi TMAG Gambut & Disposisi Cepat',
        statusEn: 'Peat TMAG Integration & Rapid Sitrep',
        color: 'text-emerald-400',
      },
    },
  ];

  // Satellite orbit continuous rotation
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setOrbitAngle((prev) => (prev + 0.6) % 360);
    }, 25);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Slide progress & auto-advance timer
  useEffect(() => {
    if (!isOpen || !isAutoPlaying || isWarping) return;

    const tickMs = 50;
    const progressStep = (tickMs / SLIDE_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((s) => {
            if (s < slides.length - 1) {
              return s + 1;
            } else {
              // Final slide completed: launch mission warp
              triggerMissionLaunch();
              return s;
            }
          });
          return 0;
        }
        return prev + progressStep;
      });
    }, tickMs);

    return () => clearInterval(timer);
  }, [isOpen, isAutoPlaying, currentSlide, isWarping, slides.length]);

  const handleSelectSlide = (idx: number) => {
    if (isWarping) return;
    setCurrentSlide(idx);
    setProgress(0);
  };

  const handleNext = () => {
    if (isWarping) return;
    if (currentSlide < slides.length - 1) {
      handleSelectSlide(currentSlide + 1);
    } else {
      triggerMissionLaunch();
    }
  };

  const handlePrev = () => {
    if (isWarping) return;
    if (currentSlide > 0) {
      handleSelectSlide(currentSlide - 1);
    }
  };

  // High-Speed Mission Warp & Transition Sequence into Application
  const triggerMissionLaunch = () => {
    if (isWarping) return;
    setIsWarping(true);
    setIsAutoPlaying(false);

    let p = 0;
    const warpInterval = setInterval(() => {
      p += 4;
      setWarpProgress(p);
      if (p >= 100) {
        clearInterval(warpInterval);
        try {
          localStorage.setItem('terra_harmonia_intro_seen', 'true');
        } catch (e) {}
        if (onEnterApp) onEnterApp();
        onClose();
      }
    }, 30);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        triggerMissionLaunch();
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
  }, [isOpen, currentSlide, isWarping]);

  if (!isOpen) return null;

  const current = slides[currentSlide];

  // Orbital Mechanics Calculations for Dual Satellites
  // Terra MODIS: Inclination 98.2°, Semi-major axis 7085 km (Altitude 705 km)
  const radTerra = (orbitAngle * Math.PI) / 180;
  const terraX = 50 + 38 * Math.cos(radTerra);
  const terraY = 50 + 15 * Math.sin(radTerra);

  // Suomi-NPP VIIRS: Inclination 98.7°, Altitude 824 km
  const radViirs = ((orbitAngle + 190) * Math.PI) / 180;
  const viirsX = 50 + 44 * Math.cos(radViirs);
  const viirsY = 50 + 22 * Math.sin(radViirs);

  const modalContent = (
    <div className="fixed inset-0 z-[100000] bg-[#020617] text-slate-100 flex flex-col font-sans select-none overflow-hidden animate-in fade-in duration-300">
      
      {/* Background Starfield & Subtle NASA Coordinate Grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle NASA Deep Blue Nebula Backdrops */}
        <div className="absolute top-0 left-1/3 w-[650px] h-[650px] bg-[#0b3d91]/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[550px] h-[550px] bg-[#1e3a8a]/12 rounded-full blur-[140px]" />
        
        {/* Aerospace Telemetry Coordinate Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-35" />
        
        {/* Corner Telemetry Markers */}
        <div className="absolute top-4 left-4 text-[9px] font-mono text-slate-500 tracking-wider hidden sm:block">
          SYS.ID: NASA-TH-2026 // GEO: 0.789°S, 113.921°E
        </div>
        <div className="absolute top-4 right-4 text-[9px] font-mono text-slate-500 tracking-wider hidden sm:block">
          SENSOR PIPELINE: MODIS/TERRA + VIIRS/SNPP
        </div>
      </div>

      {/* Top Bar: Official NASA Space Apps Header, Language Toggle, Launch Action */}
      <header className="relative z-30 h-16 px-4 sm:px-8 flex items-center justify-between border-b border-slate-800/80 bg-[#060b18]/90 backdrop-blur-md">
        
        {/* Brand: Dual NASA Meatball & Terra Harmonia Emblem */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-[#0b1b36] border border-blue-500/40 p-1 flex items-center justify-center shadow-lg shadow-blue-950">
              <img
                src="/terra_harmonia_transparent.svg"
                alt="Terra Harmonia"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-slate-500 font-mono text-xs">×</span>
            <div className="w-7 h-7 rounded-full overflow-hidden shadow-md shadow-blue-950 shrink-0">
              <img
                src="/nasa_meatball.svg"
                alt="NASA"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-tight">Terra Harmonia</span>
              <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-700/60">
                NASA SPACE APPS 2026
              </span>
            </div>
            <p className="text-[10.5px] text-slate-400 font-medium">
              {language === 'id'
                ? 'Pengantar Misi: Harmonisasi Satelit Titik Api Lahan Gambut Indonesia'
                : 'Mission Briefing: Indonesian Peatland Satellite Fire Harmonization'}
            </p>
          </div>
        </div>

        {/* Top Right Controls: Auto-Play, Language Selector, Direct Launch */}
        <div className="flex items-center gap-2.5">
          
          {/* Auto-Play Toggle */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            disabled={isWarping}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition cursor-pointer text-xs flex items-center gap-1.5"
            title={
              isAutoPlaying
                ? language === 'id' ? 'Jeda Putar Otomatis' : 'Pause Auto-Play'
                : language === 'id' ? 'Lanjutkan Putar Otomatis' : 'Resume Auto-Play'
            }
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5 text-blue-400" /> : <Play className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline font-medium text-[11px]">{isAutoPlaying ? 'Auto' : 'Paused'}</span>
          </button>

          {/* Bilingual Selector (ID / EN) */}
          <div className="flex items-center bg-slate-900/90 rounded-xl p-0.5 border border-slate-700/80 text-xs font-semibold">
            <button
              onClick={() => onToggleLanguage('en')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] ${
                language === 'en' ? 'bg-[#0b3d91] text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onToggleLanguage('id')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] ${
                language === 'id' ? 'bg-[#0b3d91] text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              ID
            </button>
          </div>

          {/* Mission Enter / Skip Button */}
          <button
            onClick={triggerMissionLaunch}
            disabled={isWarping}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0b3d91] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all border border-blue-500/40 shadow-lg shadow-blue-950/60 cursor-pointer shrink-0"
          >
            <span>{language === 'id' ? 'Masuk ke Platform' : 'Enter Mission'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </header>

      {/* Main Mission Briefing Display: 2 Clean Columns */}
      <div className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20 overflow-y-auto">
        
        {/* Left Column: Scientific Narrative & Telemetry Metrics */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
          
          {/* Step Sequence & Topic Badge */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
              STEP {current.step}
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${current.badgeColor}`}>
              {language === 'id' ? current.badgeId : current.badgeEn}
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {language === 'id' ? current.titleId : current.titleEn}
          </h2>

          {/* Narrative Body */}
          <p className="text-sm sm:text-[15px] text-slate-300 leading-relaxed font-normal">
            {language === 'id' ? current.descId : current.descEn}
          </p>

          {/* Key Metric Telemetry Cards */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            {current.stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold truncate">
                  {language === 'id' ? stat.labelId : stat.labelEn}
                </div>
                <div className="text-sm sm:text-base font-black text-white font-mono mt-1 truncate">
                  {language === 'id' ? stat.valueId : stat.valueEn}
                </div>
              </div>
            ))}
          </div>

          {/* Mission Focus Telemetry Strip */}
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="font-semibold text-white">
                {language === 'id' ? current.highlightId : current.highlightEn}
              </span>
            </div>
            <span className={`text-[10px] font-mono font-bold ${current.missionTelemetry.color} hidden sm:inline`}>
              [{current.missionTelemetry.mode}]
            </span>
          </div>

        </div>

        {/* Right Column: Authentic NASA Orbital Radar & Dual-Satellite Stage */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          
          <div className="relative w-full max-w-lg aspect-square rounded-3xl bg-[#040916] border border-slate-800 shadow-2xl p-6 flex flex-col items-center justify-center overflow-hidden [isolation:isolate]">
            
            {/* Orbital Grid Radar Rings */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,61,145,0.12)_0%,transparent_70%)]" />
            <div className="absolute inset-8 rounded-full border border-slate-800/80 border-dashed" />
            <div className="absolute inset-20 rounded-full border border-blue-900/40" />
            <div className="absolute inset-32 rounded-full border border-emerald-900/30" />

            {/* Coordinate Crosshairs */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-800/40 pointer-events-none" />
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-800/40 pointer-events-none" />

            {/* Orbit Paths SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
              {/* Elliptical Orbit Terra MODIS (Blue Orbit) */}
              <ellipse cx="50" cy="50" rx="38" ry="15" fill="none" stroke="#2563eb" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.7" />
              
              {/* Elliptical Orbit Suomi-NPP VIIRS (Green Orbit) */}
              <ellipse cx="50" cy="50" rx="44" ry="22" fill="none" stroke="#10b981" strokeWidth="0.5" strokeDasharray="3 2" opacity="0.7" />

              {/* Optical Sensor Scanning Cones Projecting to Indonesian Peatlands */}
              <polygon
                points={`${terraX},${terraY} 46,50 54,50`}
                fill="url(#terraBeamGrad)"
                opacity="0.4"
              />
              <polygon
                points={`${viirsX},${viirsY} 48,52 52,48`}
                fill="url(#viirsBeamGrad)"
                opacity="0.4"
              />

              <defs>
                <linearGradient id="terraBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="viirsBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Central Globe Representation */}
            <div className="relative w-40 h-40 rounded-full bg-gradient-to-tr from-[#021b36] via-[#052e16] to-[#0a1128] border-2 border-blue-500/50 shadow-2xl flex flex-col items-center justify-center p-3 text-center z-10 overflow-hidden">
              
              {/* Atmospheric Rayleigh Scattering Rim Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-blue-400/20 to-transparent pointer-events-none" />
              
              {/* Vector Silhouette for Equatorial Indonesia Landmass */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                <Globe2 className="w-28 h-28 text-emerald-400" />
              </div>

              {/* Real Peatland Fire Nodes (Kalimantan, Sumatra, Papua) with Thermal Waves */}
              <div className="absolute top-12 left-10 w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping opacity-90" />
              <div className="absolute top-14 left-14 w-2 h-2 rounded-full bg-red-500 animate-ping opacity-95 delay-200" />
              <div className="absolute top-20 left-20 w-3 h-3 rounded-full bg-amber-400 animate-ping opacity-85 delay-500" />
              <div className="absolute bottom-12 right-10 w-2 h-2 rounded-full bg-red-600 animate-ping opacity-90 delay-700" />

              <div className="relative z-10">
                <span className="font-extrabold text-[12px] text-white tracking-widest uppercase block drop-shadow">
                  INDONESIA
                </span>
                <span className="text-[9.5px] text-emerald-300 font-mono block mt-0.5">
                  0.789° S, 113.921° E
                </span>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-slate-950/80 text-slate-300 border border-slate-700 mt-1 inline-block">
                  PEAT DOME REGION
                </span>
              </div>
            </div>

            {/* Satellite 1: EOS-AM1 (Terra MODIS) */}
            <div
              className="absolute z-20 flex items-center gap-1.5 transition-all duration-75 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${terraX}%`, top: `${terraY}%` }}
            >
              <div className="w-7 h-7 rounded-lg bg-[#0b3d91] text-white flex items-center justify-center shadow-lg shadow-blue-900/60 ring-1 ring-blue-400">
                <Satellite className="w-4 h-4" />
              </div>
              <div className="text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-blue-950/95 text-blue-200 border border-blue-500/60 shadow-xs whitespace-nowrap">
                <span className="font-bold">TERRA (MODIS)</span>
                <span className="text-slate-400 block text-[7.5px]">1 km | 705 km SSO</span>
              </div>
            </div>

            {/* Satellite 2: Suomi-NPP (VIIRS) */}
            <div
              className="absolute z-20 flex items-center gap-1.5 transition-all duration-75 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${viirsX}%`, top: `${viirsY}%` }}
            >
              <div className="w-7 h-7 rounded-lg bg-[#047857] text-white flex items-center justify-center shadow-lg shadow-emerald-900/60 ring-1 ring-emerald-400">
                <Satellite className="w-4 h-4" />
              </div>
              <div className="text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/95 text-emerald-200 border border-emerald-500/60 shadow-xs whitespace-nowrap">
                <span className="font-bold">SUOMI-NPP (VIIRS)</span>
                <span className="text-slate-400 block text-[7.5px]">375 m | 824 km SSO</span>
              </div>
            </div>

            {/* Bottom HUD Telemetry Status Box */}
            <div className="absolute bottom-3 left-4 right-4 bg-[#060b18]/95 backdrop-blur-md rounded-xl p-2.5 border border-slate-800 text-[10px] text-slate-300 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-slate-400">NASA EOSDIS GIBS Sync</span>
              </div>
              <div className="font-mono font-bold text-blue-400">
                {language === 'id' ? current.missionTelemetry.statusId : current.missionTelemetry.statusEn}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Controls: Segmented Progress & Slide Stepper */}
      <footer className="relative z-30 px-4 sm:px-8 py-4 border-t border-slate-800/80 bg-[#060b18]/95 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Slide Progress Stepper */}
        <div className="flex items-center gap-2 w-full sm:w-80">
          {slides.map((_, idx) => {
            const isDone = idx < currentSlide;
            const isCurrent = idx === currentSlide;
            return (
              <button
                key={idx}
                onClick={() => handleSelectSlide(idx)}
                disabled={isWarping}
                className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden cursor-pointer transition-all hover:opacity-90"
              >
                <div
                  className={`h-full transition-all duration-75 ${
                    isDone
                      ? 'w-full bg-[#0b3d91]'
                      : isCurrent
                      ? 'bg-blue-500'
                      : 'w-0'
                  }`}
                  style={{ width: isCurrent ? `${progress}%` : undefined }}
                />
              </button>
            );
          })}
        </div>

        {/* Step Buttons */}
        <div className="flex items-center gap-3">
          
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0 || isWarping}
            className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              currentSlide === 0 || isWarping
                ? 'opacity-40 text-slate-500 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{language === 'id' ? 'Sebelumnya' : 'Back'}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={isWarping}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0b3d91] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition border border-blue-500/40 shadow-lg shadow-blue-950 cursor-pointer"
          >
            <span>
              {currentSlide === slides.length - 1
                ? language === 'id'
                  ? 'Luncurkan Platform'
                  : 'Launch Mission'
                : language === 'id'
                ? 'Lanjut'
                : 'Next'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

      </footer>

      {/* Full-Screen High-Speed Mission Warp & Launch Sequence Overlay */}
      {isWarping && (
        <div className="absolute inset-0 z-50 bg-[#020617] flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-200">
          
          {/* Warp Speed Optical Lines */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-blue-500/40 animate-ping opacity-60" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-2 border-emerald-400/60 animate-ping opacity-80 delay-150" />
          </div>

          <div className="relative z-10 flex flex-col items-center space-y-4 max-w-md">
            
            {/* NASA Crest Lock-on Icon */}
            <div className="w-16 h-16 rounded-full bg-[#0b3d91] border-2 border-blue-400 flex items-center justify-center shadow-2xl shadow-blue-500/50 animate-pulse">
              <Crosshair className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                {language === 'id' ? 'KUNCI TELEMETRI AKTIF' : 'TELEMETRY LOCKED: INDONESIA EQUATORIAL GRID'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-mono">
                {language === 'id' ? 'MEMASUKI SISTEM TERRA HARMONIA...' : 'ENTERING TERRA HARMONIA ENGINE...'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                COORD: 0.7893° S, 113.9213° E // 26-YEAR CLIMATOLOGY LOADED
              </p>
            </div>

            {/* Launch Progress Meter */}
            <div className="w-64 h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-75"
                style={{ width: `${warpProgress}%` }}
              />
            </div>

          </div>

        </div>
      )}

    </div>
  );

  return createPortal(modalContent, document.body);
};
