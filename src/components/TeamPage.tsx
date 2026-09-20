import React, { useState } from 'react';
import { Language, translations } from '../data/translations';
import {
  Users,
  Award,
  Globe,
  Database,
  Cpu,
  ShieldCheck,
  Flame,
  ExternalLink,
  Code2,
  Sparkles,
  Layers,
  Compass,
  Check,
  Copy,
  Eye,
  Satellite,
  Orbit,
  Maximize2
} from 'lucide-react';

interface TeamPageProps {
  language: Language;
}

interface TeamMember {
  name: string;
  roleId: string;
  roleEn: string;
  focusId: string;
  focusEn: string;
  tags: string[];
  avatarBg: string;
  initials: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Rangga',
    roleId: 'Pemimpin Tim & Arsitek Geospasial',
    roleEn: 'Team Lead & Geospatial Architect',
    focusId: 'Perancangan arsitektur harmonisasi spasial 5.5 km, pipeline kalibrasi FRP multi-satelit, dan rekayasa antarmuka web client-side berkinerja tinggi.',
    focusEn: 'Spatial 5.5 km binning architecture design, FRP cross-sensor calibration pipeline, and high-performance client-side web engineering.',
    tags: ['MODIS & VIIRS', 'GIS / Leaflet', 'React / TypeScript', 'Stefan-Boltzmann Calibration'],
    avatarBg: 'bg-blue-600 text-white',
    initials: 'RA',
  },
  {
    name: 'Data Science & Remote Sensing Division',
    roleId: 'Spesialis Penginderaan Jauh & Data Satelit',
    roleEn: 'Remote Sensing & Satellite Data Scientist',
    focusId: 'Analisis statistik deret waktu 26 tahun (2000–2026), normalisasi degradasi sensor Terra/Aqua, dan integrasi ingestion API NASA FIRMS harian.',
    focusEn: '26-year time-series statistical analysis (2000–2026), sensor degradation normalization, and NASA FIRMS daily API ingestion pipeline.',
    tags: ['NASA FIRMS', 'Python / GeoPandas', 'Statistical Climatology', 'Z-Score Analysis'],
    avatarBg: 'bg-emerald-600 text-white',
    initials: 'DS',
  },
  {
    name: 'Peatland Hydrology & Ecology Division',
    roleId: 'Peneliti Ekologi Gambut & Mitigasi Lapangan',
    roleEn: 'Peatland Hydrologist & Fire Ecology Researcher',
    focusId: 'Pemodelan dinamika muka air tanah gambut (TMAG < -40 cm), perhitungan emisi karbon CO2e gambut, dan integrasi standar restorasi hidrologis BRGM.',
    focusEn: 'Groundwater table (TMAG < -40 cm) dynamics modeling, peat CO2e carbon accounting, and BRGM hydrological restoration integration.',
    tags: ['TMAG < -40cm', 'Canal Blocking', 'Carbon Accounting', 'Manggala Agni SOP'],
    avatarBg: 'bg-amber-600 text-white',
    initials: 'PH',
  },
  {
    name: 'Human-Centered Interface & UX Division',
    roleId: 'Desainer Antarmuka & Aksesibilitas Geospasial',
    roleEn: 'UI/UX & Geospatial Interface Designer',
    focusId: 'Penerapan estetika Apple-clean tanpa AI-slop, kontras WCAG 2.1 AA 100%, sistem token desain, dan responsivitas penuh bagi operator lapangan.',
    focusEn: 'Apple-clean aesthetic without AI slop, 100% WCAG 2.1 AA contrast compliance, token design system, and full mobile field responsiveness.',
    tags: ['WCAG AA', 'Design Tokens', 'Tailwind CSS', 'Mobile First GIS'],
    avatarBg: 'bg-purple-600 text-white',
    initials: 'UX',
  },
];

export const TeamPage: React.FC<TeamPageProps> = ({ language }) => {
  const t = translations[language];
  const [logoCanvasBg, setLogoCanvasBg] = useState<'transparent' | 'dark' | 'light'>('transparent');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const COLOR_TOKENS = [
    {
      name: language === 'id' ? 'Emerald Gambut & Biosfer' : 'Peatland Emerald & Biosphere',
      hex: '#0d9488',
      desc: language === 'id' ? 'Mewakili ekosistem hutan gambut basah & tutupan vegetasi tropis' : 'Represents moist peatland forests & tropical vegetation canopy',
      rgb: 'RGB(13, 148, 136)',
      role: 'Biosphere & Water Table',
    },
    {
      name: language === 'id' ? 'Biru Satelit & Angkasa NASA' : 'NASA Satellite Sapphire',
      hex: '#0284c7',
      desc: language === 'id' ? 'Mewakili orbit LEO 705 km satelit NASA Terra & atmosfer Bumi' : 'Represents NASA Terra 705 km LEO orbit & Earth atmosphere',
      rgb: 'RGB(2, 132, 199)',
      role: 'Orbit & Harmonization',
    },
    {
      name: language === 'id' ? 'Merah Termal FRP (Radiative Heat)' : 'Thermal FRP Crimson',
      hex: '#dc2626',
      desc: language === 'id' ? 'Mewakili intensitas Fire Radiative Power (Megawatt) sensor MODIS' : 'Represents Fire Radiative Power (MW) intensity from MODIS',
      rgb: 'RGB(220, 38, 38)',
      role: 'Thermal Hotspots (MODIS)',
    },
    {
      name: language === 'id' ? 'Amber Sensorik VIIRS 375m' : 'VIIRS 375m Solar Amber',
      hex: '#f59e0b',
      desc: language === 'id' ? 'Mewakili ketajaman resolusi tinggi sensor VIIRS pada Suomi-NPP' : 'Represents high-acuity 375m resolution from VIIRS on Suomi-NPP',
      rgb: 'RGB(245, 158, 11)',
      role: 'High-Resolution (VIIRS)',
    },
  ];

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Full-Width Editorial Hero Header */}
      <div className="w-full bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#e5e5e7] dark:border-[#1f2937]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#86868b] dark:text-[#9ca3af] uppercase tracking-wider">
            <Award className="w-4 h-4 text-[#1d1d1f] dark:text-white" />
            <span>NASA Space Apps Challenge 2026 &bull; Global Hackathon</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f5f7] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] text-xs font-semibold text-[#1d1d1f] dark:text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              {t.footerChallenge}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          <div className="lg:col-span-8 space-y-3">
            <h1 className="text-3xl sm:text-5xl font-bold text-[#1d1d1f] dark:text-white tracking-tight leading-tight">
              Terra Harmonia
            </h1>
            <p className="text-base sm:text-lg text-[#515154] dark:text-[#d1d5db] max-w-3xl leading-relaxed">
              {t.teamHeroDesc}
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-[#fbfbfd] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937]">
              <span className="text-[10px] font-bold uppercase text-[#86868b] dark:text-[#9ca3af] tracking-wider block">
                {language === 'id' ? 'Rentang Data' : 'Data Span'}
              </span>
              <strong className="text-2xl font-bold text-[#1d1d1f] dark:text-white num mt-1 block">26 {t.year}</strong>
              <span className="text-[11px] text-[#6e6e73] dark:text-[#9ca3af]">2000 – 2026</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#fbfbfd] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937]">
              <span className="text-[10px] font-bold uppercase text-[#86868b] dark:text-[#9ca3af] tracking-wider block">
                {t.spatialResolution}
              </span>
              <strong className="text-2xl font-bold text-[#1d1d1f] dark:text-white num mt-1 block">5.5 km</strong>
              <span className="text-[11px] text-[#6e6e73] dark:text-[#9ca3af]">Equal-Area Binning</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Full-Width Team Showcase & Mission Statement */}
      <div className="w-full bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-3xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Left: High-Res Team Photo */}
        <div className="lg:col-span-7 relative min-h-[360px] sm:min-h-[480px] bg-[#1d1d1f] overflow-hidden">
          <img
            src="/team_photo.jpg"
            alt="Team Terra Harmonia"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Team Terra Harmonia &bull; Indonesia</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              {t.teamShowcaseTitle}
            </h2>
            <p className="text-xs sm:text-sm text-white/85 max-w-xl leading-relaxed">
              {t.teamShowcaseSubtitle}
            </p>
          </div>
        </div>

        {/* Right: Problem Statement & Project Mission */}
        <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-white dark:bg-[#111827]">
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold text-[#86868b] dark:text-[#9ca3af] uppercase tracking-wider">
                {language === 'id' ? 'Akar Masalah Ilmiah' : 'Scientific Problem Statement'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#1d1d1f] dark:text-white mt-0.5">
                {t.teamProblemTitle}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#515154] dark:text-[#d1d5db] leading-relaxed">
              {t.teamProblemDesc}
            </p>

            <div className="p-4 rounded-2xl bg-[#fbfbfd] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] space-y-2">
              <div className="text-xs font-bold text-[#1d1d1f] dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>{t.teamSolutionTitle}</span>
              </div>
              <p className="text-xs text-[#6e6e73] dark:text-[#9ca3af] leading-relaxed">
                {t.teamSolutionDesc}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e5e5e7] dark:border-[#1f2937] flex items-center justify-between text-xs text-[#86868b] dark:text-[#9ca3af]">
            <span>{language === 'id' ? 'Lokasi: Jakarta, Indonesia' : 'Location: Jakarta, Indonesia'}</span>
            <span>NASA Space Apps 2026</span>
          </div>
        </div>

      </div>

      {/* 3. HERO BRAND IDENTITY & LARGE LOGO SHOWCASE (Redesigned & Expanded) */}
      <div className="w-full bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e5e5e7] dark:border-[#1f2937]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b] dark:text-[#9ca3af] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{language === 'id' ? 'Identitas Visual & Lambang Resmi' : 'Brand Identity & Official Emblem'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] dark:text-white tracking-tight mt-0.5">
              {t.identityPhilosophyTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#6e6e73] dark:text-[#9ca3af] mt-1 max-w-3xl">
              {t.identityPhilosophyDesc}
            </p>
          </div>

          {/* Background Canvas Selector for Logo Inspection */}
          <div className="flex items-center gap-1.5 p-1 bg-[#f5f5f7] dark:bg-[#151d2f] rounded-xl border border-[#e5e5e7] dark:border-[#1f2937] text-xs self-start sm:self-auto">
            <span className="text-[10px] font-medium text-[#86868b] px-2">{language === 'id' ? 'Latar:' : 'Canvas:'}</span>
            <button
              onClick={() => setLogoCanvasBg('transparent')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                logoCanvasBg === 'transparent'
                  ? 'bg-white dark:bg-[#374151] text-[#1d1d1f] dark:text-white shadow-xs font-bold'
                  : 'text-[#6e6e73] dark:text-[#9ca3af]'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setLogoCanvasBg('dark')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                logoCanvasBg === 'dark'
                  ? 'bg-[#111827] text-white shadow-xs font-bold'
                  : 'text-[#6e6e73] dark:text-[#9ca3af]'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setLogoCanvasBg('light')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                logoCanvasBg === 'light'
                  ? 'bg-white text-[#1d1d1f] shadow-xs font-bold border border-[#e5e5e7]'
                  : 'text-[#6e6e73] dark:text-[#9ca3af]'
              }`}
            >
              Light
            </button>
          </div>
        </div>

        {/* Large Prominent Logo Showcase Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Giant High-Acuity Vector Emblem (Interactive Preview) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div
              className={`w-full max-w-md h-72 sm:h-80 rounded-3xl border transition-all flex flex-col items-center justify-center relative p-8 shadow-inner overflow-hidden ${
                logoCanvasBg === 'dark'
                  ? 'bg-[#0b0f19] border-[#1f2937]'
                  : logoCanvasBg === 'light'
                  ? 'bg-[#fbfbfd] border-[#e5e5e7]'
                  : 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] bg-white dark:bg-[#0b0f19] border-[#e5e5e7] dark:border-[#1f2937]'
              }`}
            >
              {/* Subtle ambient light aura */}
              <div className="absolute w-48 h-48 rounded-full bg-gradient-to-tr from-blue-500/20 via-emerald-500/20 to-amber-500/20 blur-3xl -z-0 pointer-events-none" />

              {/* High-Resolution Emblem */}
              <div className="relative z-10 w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)]">
                <img
                  src="/terra_harmonia_transparent.svg"
                  alt="Terra Harmonia Emblem Large"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Bottom Badge */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-[#86868b] dark:text-[#9ca3af]">
                <span className="font-mono">SVG 64×64 Pure Vector</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% Scalable (Zero Pixelation)</span>
              </div>
            </div>

            {/* Dual Lockup Presentation */}
            <div className="mt-4 flex items-center gap-3 p-3 bg-[#f5f5f7] dark:bg-[#151d2f] rounded-2xl border border-[#e5e5e7] dark:border-[#1f2937]">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/terra_harmonia_transparent.svg" alt="Emblem" className="w-full h-full object-contain" />
              </div>
              <span className="text-[#86868b] font-bold text-sm">×</span>
              <div className="w-8 h-8 rounded-full overflow-hidden shadow-2xs">
                <img src="/nasa_meatball.svg" alt="NASA Meatball" className="w-full h-full object-contain" />
              </div>
              <div className="text-left text-xs pl-1">
                <span className="font-bold text-[#1d1d1f] dark:text-white block">Terra Harmonia × NASA Insignia</span>
                <span className="text-[10px] text-[#86868b] dark:text-[#9ca3af]">Official Hackathon Collaboration Lockup</span>
              </div>
            </div>
          </div>

          {/* Right: Naming Etymology & Scientific Rationale */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl bg-[#fbfbfd] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] space-y-2">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-sm">
                  TERRA
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1d1d1f] dark:text-white">{t.terraTitle}</h3>
                  <span className="text-xs text-[#86868b] dark:text-[#9ca3af]">{t.terraOrigin}</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#515154] dark:text-[#d1d5db] leading-relaxed pt-1">
                {t.terraDesc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fbfbfd] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] space-y-2">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                  HARMONIA
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1d1d1f] dark:text-white">{t.harmoniaTitle}</h3>
                  <span className="text-xs text-[#86868b] dark:text-[#9ca3af]">{t.harmoniaOrigin}</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#515154] dark:text-[#d1d5db] leading-relaxed pt-1">
                {t.harmoniaDesc}
              </p>
            </div>
          </div>

        </div>

        {/* 4. DEDICATED VISUAL BREAKDOWN PER LOGO COMPONENT (Gambar & Visual per Komponen) */}
        <div className="pt-6 border-t border-[#e5e5e7] dark:border-[#1f2937] space-y-6">
          <div>
            <span className="text-xs font-bold text-[#1d1d1f] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'id' ? 'Anatomi Visual 4 Komponen Lambang' : 'Visual Breakdown of 4 Logo Components'}</span>
            </span>
            <p className="text-xs text-[#86868b] dark:text-[#9ca3af] mt-1">
              {language === 'id'
                ? 'Setiap lapisan grafis dirancang dengan tujuan ilmiah spesifik yang mencerminkan fisika sensor satelit dan ekologi gambut Indonesia:'
                : "Each graphic layer was engineered with specific scientific meaning reflecting satellite sensor physics and Indonesian peatland ecology:"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* COMPONENT 1: Orbit Rings & Satellites */}
            <div className="p-5 rounded-2xl border border-[#e5e5e7] dark:border-[#1f2937] bg-[#fbfbfd] dark:bg-[#151d2f] flex flex-col justify-between space-y-4 hover:border-blue-400 dark:hover:border-blue-700 transition-all">
              <div className="space-y-3">
                {/* Visual Graphic: Isolated Orbital Tracks */}
                <div className="w-full h-32 rounded-xl bg-white dark:bg-[#0b0f19] border border-[#e5e5e7] dark:border-[#1f2937] flex items-center justify-center p-3 relative overflow-hidden shadow-xs">
                  <svg viewBox="0 0 64 64" className="w-24 h-24">
                    <circle cx="32" cy="32" r="28" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" fill="none" />
                    <ellipse cx="32" cy="32" rx="26" ry="16" stroke="#f97316" strokeWidth="1.8" transform="rotate(-25 32 32)" opacity="0.9" fill="none" />
                    <circle cx="10" cy="22" r="3.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="54" cy="42" r="3.5" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />
                  </svg>
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono text-[9px] font-bold">
                    Layer 1
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#1d1d1f] dark:text-white">
                    {language === 'id' ? 'Cincin Orbit & Node Satelit' : 'Orbital Rings & Satellites'}
                  </h4>
                  <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                    {language === 'id' ? 'Konstelasi MODIS & VIIRS' : 'MODIS & VIIRS Constellation'}
                  </span>
                </div>

                <p className="text-xs text-[#6e6e73] dark:text-[#9ca3af] leading-relaxed">
                  {language === 'id'
                    ? 'Melambangkan orbit kutub sinkron-matahari 705 km satelit Terra/Aqua (biru) dan 824 km satelit Suomi-NPP (oranye) yang melintasi Indonesia setiap hari.'
                    : 'Symbolizes the 705 km Sun-synchronous polar orbit of Terra/Aqua (blue) and 824 km Suomi-NPP (orange) scanning Indonesia daily.'}
                </p>
              </div>

              <div className="pt-2 border-t border-[#e5e5e7] dark:border-[#1f2937] text-[10px] text-[#86868b] dark:text-[#9ca3af] flex justify-between">
                <span>EOS AM-1 &amp; SNPP</span>
                <span className="font-mono">#0284c7 / #f97316</span>
              </div>
            </div>

            {/* COMPONENT 2: Earth Crescent Peat Biosphere */}
            <div className="p-5 rounded-2xl border border-[#e5e5e7] dark:border-[#1f2937] bg-[#fbfbfd] dark:bg-[#151d2f] flex flex-col justify-between space-y-4 hover:border-emerald-400 dark:hover:border-emerald-700 transition-all">
              <div className="space-y-3">
                {/* Visual Graphic: Isolated Earth Crescent & Continents */}
                <div className="w-full h-32 rounded-xl bg-white dark:bg-[#0b0f19] border border-[#e5e5e7] dark:border-[#1f2937] flex items-center justify-center p-3 relative overflow-hidden shadow-xs">
                  <svg viewBox="0 0 64 64" className="w-24 h-24">
                    <defs>
                      <linearGradient id="compEarthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="50%" stopColor="#0284c7" />
                        <stop offset="100%" stopColor="#0d9488" />
                      </linearGradient>
                    </defs>
                    <path d="M 32 8 A 24 24 0 0 0 32 56 C 41 56 49 46 49 36 C 44 48 27 46 22 36 C 18 29 24 16 32 8 Z" fill="url(#compEarthGrad)" />
                    <path d="M 21 21 C 24 20 27 23 25 27 C 22 28 19 25 21 21 Z" fill="#ffffff" fillOpacity="0.8" />
                    <path d="M 17 31 C 20 30 22 34 19 38 C 16 37 15 33 17 31 Z" fill="#ffffff" fillOpacity="0.8" />
                    <path d="M 25 38 C 28 37 30 42 27 46 C 24 45 23 41 25 38 Z" fill="#ffffff" fillOpacity="0.8" />
                  </svg>
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono text-[9px] font-bold">
                    Layer 2
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#1d1d1f] dark:text-white">
                    {language === 'id' ? 'Bulan Sabit Bumi Nusantara' : 'Earth Peatland Crescent'}
                  </h4>
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    {language === 'id' ? 'Kubah Gambut & Hutan Tropis' : 'Tropical Peat Domes'}
                  </span>
                </div>

                <p className="text-xs text-[#6e6e73] dark:text-[#9ca3af] leading-relaxed">
                  {language === 'id'
                    ? 'Representasi 13.4 juta hektar lahan gambut kaya karbon Indonesia (Sumatera, Kalimantan, Papua) yang harus dijaga dari penurunan muka air tanah.'
                    : "Represents Indonesia's 13.4 million hectares of carbon-dense peatlands across Sumatra, Kalimantan, and Papua needing water table protection."}
                </p>
              </div>

              <div className="pt-2 border-t border-[#e5e5e7] dark:border-[#1f2937] text-[10px] text-[#86868b] dark:text-[#9ca3af] flex justify-between">
                <span>TMAG &gt; -40 cm Target</span>
                <span className="font-mono">#0d9488 / #38bdf8</span>
              </div>
            </div>

            {/* COMPONENT 3: Dynamic FRP Flame */}
            <div className="p-5 rounded-2xl border border-[#e5e5e7] dark:border-[#1f2937] bg-[#fbfbfd] dark:bg-[#151d2f] flex flex-col justify-between space-y-4 hover:border-red-400 dark:hover:border-red-700 transition-all">
              <div className="space-y-3">
                {/* Visual Graphic: Isolated Flame Vector */}
                <div className="w-full h-32 rounded-xl bg-white dark:bg-[#0b0f19] border border-[#e5e5e7] dark:border-[#1f2937] flex items-center justify-center p-3 relative overflow-hidden shadow-xs">
                  <svg viewBox="0 0 64 64" className="w-24 h-24">
                    <defs>
                      <linearGradient id="compFlameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#dc2626" />
                        <stop offset="40%" stopColor="#ea580c" />
                        <stop offset="75%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#facc15" />
                      </linearGradient>
                    </defs>
                    <path d="M 32 8 C 37 18 47 23 47 34 C 47 45 38 52 29 52 C 38 50 43 43 41 34 C 38 27 33 21 32 8 Z" fill="url(#compFlameGrad)" />
                    <path d="M 35 16 C 41 24 49 29 49 38 C 49 47 42 53 34 53 C 26 53 23 46 27 38 C 30 32 37 26 35 16 Z" fill="url(#compFlameGrad)" />
                  </svg>
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-mono text-[9px] font-bold">
                    Layer 3
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#1d1d1f] dark:text-white">
                    {language === 'id' ? 'Lidah Api Radiatif FRP' : 'Radiative Heat FRP Flame'}
                  </h4>
                  <span className="text-[11px] font-medium text-red-600 dark:text-red-400">
                    {language === 'id' ? 'Energi Termal Inframerah (MW)' : 'Infrared Thermal Energy (MW)'}
                  </span>
                </div>

                <p className="text-xs text-[#6e6e73] dark:text-[#9ca3af] leading-relaxed">
                  {language === 'id'
                    ? 'Menggambarkan deteksi gelombang inframerah termal 4 µm (MODIS) dan 3.74 µm (VIIRS) yang mengukur laju pelepasan energi panas pembakaran.'
                    : 'Depicts thermal infrared 4 µm (MODIS) and 3.74 µm (VIIRS) wave channels measuring combustion radiative energy release rates.'}
                </p>
              </div>

              <div className="pt-2 border-t border-[#e5e5e7] dark:border-[#1f2937] text-[10px] text-[#86868b] dark:text-[#9ca3af] flex justify-between">
                <span>Planck 4 µm Channel</span>
                <span className="font-mono">#dc2626 / #ea580c</span>
              </div>
            </div>

            {/* COMPONENT 4: Luminous Hearth & 5.5 km Fusion Grid */}
            <div className="p-5 rounded-2xl border border-[#e5e5e7] dark:border-[#1f2937] bg-[#fbfbfd] dark:bg-[#151d2f] flex flex-col justify-between space-y-4 hover:border-amber-400 dark:hover:border-amber-700 transition-all">
              <div className="space-y-3">
                {/* Visual Graphic: Inner Hearth & 5.5 km Grid */}
                <div className="w-full h-32 rounded-xl bg-white dark:bg-[#0b0f19] border border-[#e5e5e7] dark:border-[#1f2937] flex items-center justify-center p-3 relative overflow-hidden shadow-xs">
                  <svg viewBox="0 0 64 64" className="w-24 h-24">
                    <defs>
                      <linearGradient id="compCoreGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="50%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#fef08a" />
                      </linearGradient>
                    </defs>
                    {/* 5.5 km Equal-Area Grid Mesh lines */}
                    <rect x="16" y="16" width="32" height="32" stroke="#64748b" strokeWidth="0.8" strokeDasharray="2 2" fill="none" opacity="0.4" />
                    <line x1="32" y1="16" x2="32" y2="48" stroke="#64748b" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4" />
                    <line x1="16" y1="32" x2="48" y2="32" stroke="#64748b" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4" />
                    {/* Inner Core Hearth */}
                    <path d="M 33 28 C 37 32 41 36 40 43 C 39 47 34 50 29 49 C 34 47 36 43 35 39 C 34 35 32 31 33 28 Z" fill="url(#compCoreGrad)" />
                    <circle cx="32" cy="38" r="4.5" fill="#fef08a" opacity="0.9" />
                  </svg>
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-mono text-[9px] font-bold">
                    Layer 4
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#1d1d1f] dark:text-white">
                    {language === 'id' ? 'Inti Luminous & Grid 5.5 km' : 'Core Hearth & 5.5 km Grid'}
                  </h4>
                  <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                    {language === 'id' ? 'Harmonisasi & Stefan-Boltzmann' : 'Equal-Area Fusion Grid'}
                  </span>
                </div>

                <p className="text-xs text-[#6e6e73] dark:text-[#9ca3af] leading-relaxed">
                  {language === 'id'
                    ? 'Pusat fusi yang menyatukan titik-titik multi-resolusi ke dalam kisi spasial setara 5.5 km, memulihkan perbandingan objektif 26 tahun.'
                    : 'The fusion center unifying multi-resolution fire points into 5.5 km equal-area bins, restoring 26-year multi-sensor continuity.'}
                </p>
              </div>

              <div className="pt-2 border-t border-[#e5e5e7] dark:border-[#1f2937] text-[10px] text-[#86868b] dark:text-[#9ca3af] flex justify-between">
                <span>Stefan-Boltzmann Eq</span>
                <span className="font-mono">#fbbf24 / #fef08a</span>
              </div>
            </div>

          </div>
        </div>

        {/* 5. COLOR PALETTE & DESIGN SYSTEM TOKENS */}
        <div className="pt-6 border-t border-[#e5e5e7] dark:border-[#1f2937] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1d1d1f] dark:text-white uppercase tracking-wider">
              {language === 'id' ? 'Palet Warna & Token Desain Ilmiah' : 'Scientific Color Palette & Design Tokens'}
            </span>
            <span className="text-[11px] text-[#86868b] dark:text-[#9ca3af]">
              {language === 'id' ? 'Klik HEX untuk menyalin' : 'Click HEX to copy'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {COLOR_TOKENS.map((col) => (
              <div
                key={col.hex}
                className="p-3.5 rounded-2xl border border-[#e5e5e7] dark:border-[#1f2937] bg-[#fbfbfd] dark:bg-[#151d2f] flex items-center justify-between gap-3 text-xs group hover:border-[#1d1d1f]/40 dark:hover:border-white/40 transition-all cursor-pointer"
                onClick={() => handleCopyHex(col.hex)}
                title="Click to copy HEX code"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl shadow-xs shrink-0 border border-black/10 dark:border-white/10"
                    style={{ backgroundColor: col.hex }}
                  />
                  <div>
                    <strong className="text-xs text-[#1d1d1f] dark:text-white block">{col.name}</strong>
                    <span className="text-[11px] font-mono text-[#6e6e73] dark:text-[#9ca3af] block">{col.hex}</span>
                  </div>
                </div>

                <button className="p-1.5 rounded-lg text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition">
                  {copiedColor === col.hex ? (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. Full-Width Section: Komposisi & Spesialisasi Anggota Tim */}
      <div className="w-full bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b] dark:text-[#9ca3af]">
              {t.humanCapitalTitle}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] dark:text-white tracking-tight mt-0.5">
              {t.teamCompTitle}
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#86868b] dark:text-[#9ca3af] bg-[#f5f5f7] dark:bg-[#151d2f] px-3.5 py-1.5 rounded-full border border-[#e5e5e7] dark:border-[#1f2937] shrink-0">
            {language === 'id' ? '4 Bidang Keahlian' : '4 Core Disciplines'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TEAM_MEMBERS.map((member, index) => (
            <div
              key={index}
              className="bg-[#fbfbfd] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] rounded-2xl p-6 shadow-xs hover:border-[#1d1d1f]/40 dark:hover:border-white/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl ${member.avatarBg} font-bold text-sm flex items-center justify-center shadow-xs shrink-0`}>
                      {member.initials}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f] dark:text-white leading-tight">
                        {member.name}
                      </h3>
                      <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mt-0.5">
                        {language === 'id' ? member.roleId : member.roleEn}
                      </p>
                    </div>
                  </div>

                  <div className="p-2 bg-white dark:bg-[#111827] rounded-xl border border-[#e5e5e7] dark:border-[#1f2937] text-[#86868b] dark:text-[#9ca3af] shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-xs text-[#515154] dark:text-[#d1d5db] leading-relaxed pt-1">
                  {language === 'id' ? member.focusId : member.focusEn}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#e5e5e7] dark:border-[#1f2937]">
                {member.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-[#111827] text-[#1d1d1f] dark:text-[#e5e5e7] border border-[#e5e5e7] dark:border-[#1f2937]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Full-Width Section: 4 Pilar Metodologi Ilmiah */}
      <div className="w-full bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b] dark:text-[#9ca3af]">
            {t.methodologyTitle}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] dark:text-white tracking-tight mt-0.5">
            {t.fourInnovationsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="p-5 rounded-2xl bg-[#fbfbfd] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="p-2.5 w-fit rounded-xl bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] text-[#1d1d1f] dark:text-white">
                <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-[#1d1d1f] dark:text-white text-sm">{t.binningInnovationTitle}</h3>
              <p className="text-[#6e6e73] dark:text-[#9ca3af] leading-relaxed">
                {t.binningInnovationDesc}
              </p>
            </div>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {language === 'id' ? 'Metrik Spasial' : 'Spatial Metric'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#fbfbfd] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="p-2.5 w-fit rounded-xl bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] text-[#1d1d1f] dark:text-white">
                <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-bold text-[#1d1d1f] dark:text-white text-sm">{t.frpInnovationTitle}</h3>
              <p className="text-[#6e6e73] dark:text-[#9ca3af] leading-relaxed">
                {t.frpInnovationDesc}
              </p>
            </div>
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              {language === 'id' ? 'Fisika Energi' : 'Energy Physics'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#fbfbfd] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="p-2.5 w-fit rounded-xl bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] text-[#1d1d1f] dark:text-white">
                <Flame className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-bold text-[#1d1d1f] dark:text-white text-sm">{t.peatInnovationTitle}</h3>
              <p className="text-[#6e6e73] dark:text-[#9ca3af] leading-relaxed">
                {t.peatInnovationDesc}
              </p>
            </div>
            <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              {language === 'id' ? 'Mitigasi Lapangan' : 'Field Mitigation'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#fbfbfd] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="p-2.5 w-fit rounded-xl bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] text-[#1d1d1f] dark:text-white">
                <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-[#1d1d1f] dark:text-white text-sm">{t.firmsInnovationTitle}</h3>
              <p className="text-[#6e6e73] dark:text-[#9ca3af] leading-relaxed">
                {t.firmsInnovationDesc}
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {language === 'id' ? 'Respon Waktu Nyata' : 'Real-Time Response'}
            </span>
          </div>

        </div>
      </div>

      {/* 8. Full-Width Open Source & Citation Footer */}
      <div className="w-full bg-[#fbfbfd] dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-xs">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="font-bold text-sm text-[#1d1d1f] dark:text-white flex items-center justify-center sm:justify-start gap-2">
            <Code2 className="w-4 h-4 text-[#1d1d1f] dark:text-white" />
            <span>{t.openScienceFooter}</span>
          </div>
          <p className="text-[#6e6e73] dark:text-[#9ca3af] max-w-2xl leading-relaxed">
            {t.openScienceDesc}
          </p>
        </div>

        <a
          href="https://github.com/Rangga11268/TerraHarmonia"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-[#1d1d1f] hover:bg-black dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold transition flex items-center gap-2 shadow-xs shrink-0 cursor-pointer min-h-[44px]"
        >
          <span>GitHub Repository</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
};
