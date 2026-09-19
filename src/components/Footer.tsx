import React, { useState, useEffect } from 'react';
import { Language, translations } from '../data/translations';
import { NavTab } from './Navbar';
import {
  Orbit,
  Clock,
  ExternalLink,
  ShieldCheck,
  Compass,
  Cpu,
  Flame,
  Database,
  Award,
  Radio,
  Satellite
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
    <footer className="w-full relative overflow-hidden select-none">
      
      {/* 1. Atmospheric Stratosphere Transition (Smooth Gradient from Light Canvas to Orbit Twilight) */}
      <div className="w-full h-24 sm:h-32 bg-gradient-to-b from-[#f5f5f7] via-[#0f172a] to-[#050811] relative pointer-events-none">
        {/* Soft atmospheric blue horizon glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-cyan-500/15 blur-xl pointer-events-none" />
      </div>

      {/* 2. Main Deep Space & Orbit Container */}
      <div className="w-full bg-[#050811] text-white relative">
        
        {/* Ambient Cosmic Starfield and Earth Curvature Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-35 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="absolute -top-20 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[140%] h-80 rounded-[100%] bg-gradient-to-t from-cyan-500/15 via-blue-600/10 to-transparent blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-14 space-y-12">
          
          {/* 3. Hero 3D NASA Terra Satellite Showcase Card */}
          <div className="w-full bg-slate-900/70 backdrop-blur-2xl border border-slate-700/60 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden relative group">
            
            {/* Ambient edge glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Side: Mission Info & Live HUD Telemetry */}
              <div className="lg:col-span-7 space-y-5">
                
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold tracking-wide">
                    <Orbit className="w-3.5 h-3.5 animate-spin text-cyan-400" style={{ animationDuration: '16s' }} />
                    <span>NASA Earth Observing System (EOS)</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                    <span>26-Yr Continuous Climatology</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                    <span>NASA Terra (EOS AM-1)</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-normal">
                      NORAD 25994
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                    {language === 'id'
                      ? 'Satelit unggulan NASA Terra (diluncurkan 18 Desember 1999) mengorbit Bumi pada ketinggian 705 km, membawa sensor MODIS yang menjadi pilar observasi titik panas selama 26 tahun terharmonisasi Terra Harmonia.'
                      : 'NASA’s flagship Terra satellite (launched Dec 18, 1999) orbits Earth at 705 km altitude, hosting the MODIS sensor that anchors 26 years of harmonized fire climatology for Terra Harmonia.'}
                  </p>
                </div>

                {/* Telemetry Metric HUD Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      {language === 'id' ? 'Ketinggian Orbit' : 'Orbit Altitude'}
                    </span>
                    <span className="text-cyan-400 font-bold text-base block mt-0.5">705 km</span>
                    <span className="text-[10px] text-slate-500">Sun-Synchronous</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      {language === 'id' ? 'Kecepatan Orbit' : 'Velocity'}
                    </span>
                    <span className="text-amber-400 font-bold text-base block mt-0.5">7.5 km/s</span>
                    <span className="text-[10px] text-slate-500">27,000 km/h</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      {language === 'id' ? 'Waktu Ruang UTC' : 'Live UTC Time'}
                    </span>
                    <span className="text-emerald-400 font-bold text-base block mt-0.5 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span>{utcTime}</span>
                    </span>
                    <span className="text-[10px] text-slate-500">Telemetry Clock</span>
                  </div>
                </div>

                {/* Instruments Chip Row */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono text-slate-300">
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                    MODIS (1 km)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
                    ASTER (15 m)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
                    CERES
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
                    MISR
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
                    MOPITT
                  </span>
                </div>

              </div>

              {/* Right Side: Realistic 3D Photorealistic Satellite Render */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="w-full relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group-hover:border-cyan-400/50 transition-all duration-300 bg-black">
                  <img
                    src="/nasa_terra_satellite_3d.jpg"
                    alt="NASA Terra Satellite in Low Earth Orbit"
                    className="w-full h-56 sm:h-72 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Image Overlay Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/90">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Satellite className="w-3.5 h-3.5 text-cyan-400" />
                      NASA Terra (EOS AM-1) 3D Model
                    </span>
                    <span className="font-mono text-[10px] text-cyan-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                      10:30 AM Node
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* 4. Information Columns with Official Logo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
            
            {/* Col 1: Official Brand Logo & Mission */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                  <img
                    src="/terra_harmonia_transparent.svg"
                    alt="Terra Harmonia Logo"
                    className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]"
                  />
                </div>
                <div>
                  <span className="font-bold text-white text-base block tracking-tight">Terra Harmonia</span>
                  <span className="text-[11px] text-slate-400 font-medium">NASA Space Apps Challenge 2026</span>
                </div>
              </div>

              <p className="text-slate-400 leading-relaxed">
                {language === 'id'
                  ? 'Harmonisasi rekam jejak titik panas satelit MODIS & VIIRS 2000–2026 untuk perlindungan kubah gambut Indonesia dan verifikasi target FOLU Net Sink 2030.'
                  : 'Harmonization of MODIS & VIIRS 2000–2026 satellite fire records for Indonesian peatland preservation and FOLU Net Sink 2030 targets.'}
              </p>

              <div className="pt-1 flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
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
                  ? 'Data observasi bumi terbuka disediakan oleh NASA FIRMS dan Earthdata. Semua algoritma terintegrasi dalam pipeline geospasial terbuka.'
                  : 'Open Earth observation data courtesy of NASA FIRMS and Earthdata. Algorithms integrated into an open-source pipeline.'}
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

          {/* 5. Bottom Trademark & Legal Bar */}
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

      </div>

    </footer>
  );
};
