import React, { useState, useEffect } from 'react';
import { Language, translations } from '../data/translations';
import { NavTab } from './Navbar';
import {
  Orbit,
  Radio,
  Clock,
  Globe2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Flame,
  Award,
  Database,
  Cpu,
  Compass,
  FileText
} from 'lucide-react';

interface FooterProps {
  language: Language;
  onSelectTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onSelectTab }) => {
  const t = translations[language];

  // Live UTC Space Clock
  const [utcTime, setUtcTime] = useState<string>(() => new Date().toUTCString().slice(17, 25));

  useEffect(() => {
    const timer = setInterval(() => {
      setUtcTime(new Date().toUTCString().slice(17, 25));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="w-full relative bg-[#050811] text-white overflow-hidden border-t border-slate-800 selection:bg-cyan-500 selection:text-black">
      
      {/* 1. Deep Space Cosmic Background with Stars & Atmosphere Glow */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Starfield simulation */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:48px_48px]" />

        {/* Subtle Cyan / Blue Cosmic Nebula */}
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Earth Atmospheric Curvature Glow at Bottom */}
        <div className="absolute -bottom-64 left-1/2 -translate-x-1/2 w-[160%] sm:w-[120%] h-80 rounded-[100%] bg-gradient-to-t from-cyan-500/20 via-blue-600/10 to-transparent blur-2xl border-t border-cyan-400/40 pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 space-y-12">
        
        {/* 2. NASA Terra Satellite (EOS AM-1) Orbital Showcase Section */}
        <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Mission Description & Telemetry HUD */}
            <div className="lg:col-span-6 space-y-5">
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide">
                  <Orbit className="w-3.5 h-3.5 animate-spin text-cyan-400" style={{ animationDuration: '14s' }} />
                  <span>NASA Earth Observing System (EOS)</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  <span>MODIS 1km / VIIRS 375m</span>
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                  <span>NASA Terra (EOS AM-1)</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-normal">
                    NORAD 25994
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {language === 'id'
                    ? 'Diluncurkan dari Vandenberg AFB pada 18 Desember 1999, satelit NASA Terra telah menyediakan data pengamatan titik api MODIS selama lebih dari 26 tahun tanpa henti, menjadi fondasi ilmiah terharmonisasi Terra Harmonia.'
                    : 'Launched from Vandenberg AFB on December 18, 1999, NASA Terra has recorded continuous MODIS Earth observations for over 26 years, anchoring the historical baseline for Terra Harmonia.'}
                </p>
              </div>

              {/* Orbital Telemetry Grid HUD */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Ketinggian Orbit</span>
                  <span className="text-cyan-400 font-bold text-sm block mt-0.5">705 km</span>
                  <span className="text-[10px] text-slate-500">Kutub Sinkron</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Kecepatan Orbit</span>
                  <span className="text-amber-400 font-bold text-sm block mt-0.5">7.5 km/s</span>
                  <span className="text-[10px] text-slate-500">27,000 km/jam</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Waktu Orbit UTC</span>
                  <span className="text-emerald-400 font-bold text-sm block mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{utcTime}</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Live Space Clock</span>
                </div>
              </div>

            </div>

            {/* Right Column: Intricate Vector Illustration of NASA Terra Satellite */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center relative p-4">
              
              {/* Satellite Vector Canvas */}
              <div className="w-full max-w-md h-56 sm:h-64 relative flex items-center justify-center">
                
                {/* Orbit Trajectory Arc Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 240" fill="none">
                  <path
                    d="M 20,200 Q 200,40 380,180"
                    stroke="rgba(56, 189, 248, 0.25)"
                    strokeWidth="2"
                    strokeDasharray="4 6"
                  />
                  {/* Atmospheric scanning swath beam from satellite to Earth */}
                  <polygon
                    points="200,105 130,220 270,220"
                    fill="url(#scanBeam)"
                    opacity="0.25"
                  />
                  <defs>
                    <linearGradient id="scanBeam" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Animated Floating Satellite Container */}
                <div className="relative animate-bounce" style={{ animationDuration: '4s' }}>
                  
                  <svg width="280" height="150" viewBox="0 0 280 150" fill="none" className="drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                    
                    {/* Left Solar Panel Array Wing */}
                    <g>
                      <rect x="15" y="55" width="80" height="40" rx="3" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.5" />
                      {/* Solar Cell Grid Lines */}
                      <line x1="35" y1="55" x2="35" y2="95" stroke="#38bdf8" strokeWidth="0.75" opacity="0.6" />
                      <line x1="55" y1="55" x2="55" y2="95" stroke="#38bdf8" strokeWidth="0.75" opacity="0.6" />
                      <line x1="75" y1="55" x2="75" y2="95" stroke="#38bdf8" strokeWidth="0.75" opacity="0.6" />
                      <line x1="15" y1="75" x2="95" y2="75" stroke="#38bdf8" strokeWidth="0.75" opacity="0.6" />
                      {/* Panel Bracket */}
                      <rect x="95" y="72" width="15" height="6" fill="#f59e0b" rx="1" />
                    </g>

                    {/* Main Satellite Bus Body (Gold Thermal MLI Blanket) */}
                    <g>
                      <rect x="110" y="45" width="60" height="60" rx="5" fill="#78350f" stroke="#fbbf24" strokeWidth="2" />
                      <rect x="115" y="50" width="50" height="50" rx="3" fill="#b45309" />
                      {/* Bus Panel Details */}
                      <line x1="115" y1="75" x2="165" y2="75" stroke="#fbbf24" strokeWidth="1" opacity="0.7" />
                      <line x1="140" y1="50" x2="140" y2="100" stroke="#fbbf24" strokeWidth="1" opacity="0.7" />
                      {/* Terra Wordmark on Bus */}
                      <text x="140" y="70" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                        TERRA
                      </text>
                      <text x="140" y="82" fill="#e2e8f0" fontSize="6" textAnchor="middle" fontFamily="sans-serif">
                        EOS AM-1
                      </text>
                    </g>

                    {/* Right Instruments & MODIS Sensor Aperture */}
                    <g>
                      {/* MODIS Optical Sensor Pod */}
                      <rect x="170" y="58" width="22" height="34" rx="2" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1.5" />
                      {/* Optical Aperture Lens */}
                      <circle cx="181" cy="75" r="7" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                      <circle cx="181" cy="75" r="3" fill="#38bdf8" />
                      {/* MODIS Label */}
                      <rect x="194" y="68" width="24" height="14" rx="2" fill="#0284c7" />
                      <text x="206" y="78" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                        MODIS
                      </text>
                    </g>

                    {/* High-Gain Dish Antenna */}
                    <g>
                      <path d="M 130,45 Q 140,25 150,45" stroke="#e2e8f0" strokeWidth="2" fill="none" />
                      <ellipse cx="140" cy="22" rx="14" ry="5" fill="#334155" stroke="#e2e8f0" strokeWidth="1.5" />
                      <line x1="140" y1="22" x2="140" y2="12" stroke="#38bdf8" strokeWidth="1.5" />
                      <circle cx="140" cy="11" r="2" fill="#38bdf8" />
                    </g>

                    {/* Downward Scanner Swath Emitter */}
                    <g>
                      <polygon points="135,105 145,105 140,115" fill="#38bdf8" />
                      <circle cx="140" cy="112" r="3" fill="#38bdf8" className="animate-ping" opacity="0.8" />
                    </g>

                  </svg>

                </div>

              </div>

              {/* Payload Instruments Badge Strip */}
              <div className="flex flex-wrap justify-center items-center gap-1.5 pt-2 text-[10px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-bold">MODIS (1km)</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">ASTER (15m)</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">CERES</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">MISR</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">MOPITT</span>
              </div>

            </div>

          </div>

        </div>

        {/* 3. Navigation Links & Open Science Information Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          
          {/* Col 1: Brand & Space Apps */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white font-black shadow-md">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white text-sm block">Terra Harmonia</span>
                <span className="text-[11px] text-slate-400">NASA Space Apps Challenge 2026</span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed">
              {language === 'id'
                ? 'Harmonisasi rekam jejak titik panas satelit MODIS & VIIRS 2000–2026 untuk perlindungan kubah gambut Indonesia dan dukungan target FOLU Net Sink 2030.'
                : 'Harmonization of MODIS & VIIRS 2000–2026 satellite fire records for Indonesian peatland preservation and FOLU Net Sink 2030 targets.'}
            </p>

            <div className="pt-2 flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'id' ? 'Lisensi Sumber Terbuka MIT' : 'Open Source MIT License'}</span>
            </div>
          </div>

          {/* Col 2: App Modules Quick Navigation */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-slate-800 pb-2">
              {language === 'id' ? 'Navigasi Modul' : 'System Modules'}
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab('overview')}
                  className="text-slate-400 hover:text-white transition flex items-center gap-2 min-h-[36px] py-1 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.navOverview}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('lab')}
                  className="text-slate-400 hover:text-white transition flex items-center gap-2 min-h-[36px] py-1 cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.navLab}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('mitigation')}
                  className="text-slate-400 hover:text-white transition flex items-center gap-2 min-h-[36px] py-1 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-red-400" />
                  <span>{t.navMitigation}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('data-hub')}
                  className="text-slate-400 hover:text-white transition flex items-center gap-2 min-h-[36px] py-1 cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.navData}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('team')}
                  className="text-slate-400 hover:text-white transition flex items-center gap-2 min-h-[36px] py-1 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  <span>{t.navTeam}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Sensor Platforms & Satellites */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-slate-800 pb-2">
              {language === 'id' ? 'Konstelasi Satelit' : 'Satellite Constellations'}
            </span>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center justify-between">
                <span>NASA Terra (EOS AM-1)</span>
                <span className="text-cyan-400 font-mono text-[11px]">MODIS 1km</span>
              </li>
              <li className="flex items-center justify-between">
                <span>NASA Aqua (EOS PM-1)</span>
                <span className="text-cyan-400 font-mono text-[11px]">MODIS 1km</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Suomi-NPP (NASA/NOAA)</span>
                <span className="text-amber-400 font-mono text-[11px]">VIIRS 375m</span>
              </li>
              <li className="flex items-center justify-between">
                <span>NOAA-20 / JPSS-1</span>
                <span className="text-amber-400 font-mono text-[11px]">VIIRS 375m</span>
              </li>
              <li className="flex items-center justify-between">
                <span>NOAA-21 / JPSS-2</span>
                <span className="text-amber-400 font-mono text-[11px]">VIIRS 375m</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Open Science & Repository Hub */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-slate-800 pb-2">
              {language === 'id' ? 'Pusat Riset Terbuka' : 'Open Science Hub'}
            </span>
            <p className="text-slate-400 leading-relaxed">
              {language === 'id'
                ? 'Data satelit disediakan oleh NASA FIRMS dan Earthdata. Semua algoritma terintegrasi dalam pipeline geospasial terbuka.'
                : 'Satellite data courtesy of NASA FIRMS and Earthdata. Algorithms integrated in an open geospatial pipeline.'}
            </p>
            <div className="pt-1">
              <a
                href="https://github.com/Rangga11268/TerraHarmonia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition border border-slate-700 min-h-[44px] cursor-pointer"
              >
                <span>GitHub Repository</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

        </div>

        {/* 4. Bottom Trademark & Legal Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            &copy; 2026 Terra Harmonia &bull; {t.footerChallenge} &bull; {t.footerCourtesy}
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>NASA Space Network: Nominal</span>
            </span>
            <span>Indonesia 2026</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
