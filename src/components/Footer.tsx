import React, { useState, useEffect } from 'react';
import { Language, translations } from '../data/translations';
import { NavTab } from './Navbar';
import { Logo } from './Logo';
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
  Satellite,
  Radio
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
    <footer className="w-full bg-[#fbfbfd] border-t border-[#e5e5e7] text-[#1d1d1f] transition-all">
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        
        {/* 1. Seamless NASA Terra Satellite (EOS AM-1) Orbital Telemetry Ribbon (No Heavy Dark Cards) */}
        <div className="w-full bg-white border border-[#e5e5e7] rounded-3xl p-6 sm:p-8 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Mission Description & Telemetry */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f5f7] border border-[#e5e5e7] text-xs font-semibold text-[#1d1d1f]">
                  <Orbit className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: '18s' }} />
                  <span>NASA Earth Observing System (EOS)</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  <span>26-Yr Harmonized Climatology</span>
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] tracking-tight flex items-center gap-2.5">
                  <span>NASA Terra (EOS AM-1)</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#f5f5f7] border border-[#e5e5e7] text-[#6e6e73] font-normal">
                    NORAD 25994
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-[#515154] leading-relaxed mt-1 max-w-2xl">
                  {language === 'id'
                    ? 'Satelit unggulan NASA Terra diluncurkan pada 18 Desember 1999 dan mengorbit Bumi pada ketinggian 705 km. Sensor MODIS yang dibawanya menjadi pilar pengamatan kebakaran selama 26 tahun terharmonisasi Terra Harmonia.'
                    : 'NASA’s flagship Terra satellite was launched on Dec 18, 1999, orbiting Earth at 705 km altitude. Its MODIS sensor anchors 26 years of harmonized fire observation for Terra Harmonia.'}
                </p>
              </div>

              {/* Minimalist Telemetry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="p-3 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7]">
                  <span className="text-[10px] text-[#86868b] uppercase font-bold tracking-wider block">
                    {language === 'id' ? 'Ketinggian Orbit' : 'Orbit Altitude'}
                  </span>
                  <strong className="text-base font-bold text-[#1d1d1f] block mt-0.5 num">705 km</strong>
                  <span className="text-[10px] text-[#6e6e73]">Sun-Synchronous</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7]">
                  <span className="text-[10px] text-[#86868b] uppercase font-bold tracking-wider block">
                    {language === 'id' ? 'Kecepatan Orbit' : 'Velocity'}
                  </span>
                  <strong className="text-base font-bold text-[#1d1d1f] block mt-0.5 num">7.5 km/s</strong>
                  <span className="text-[10px] text-[#6e6e73]">27,000 km/h</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-[#86868b] uppercase font-bold tracking-wider block">
                    {language === 'id' ? 'Waktu Ruang UTC' : 'Live UTC Space Clock'}
                  </span>
                  <strong className="text-base font-bold text-[#1d1d1f] block mt-0.5 flex items-center gap-1.5 num">
                    <Clock className="w-4 h-4 text-[#0071e3]" />
                    <span>{utcTime}</span>
                  </strong>
                  <span className="text-[10px] text-[#6e6e73]">Telemetry Clock</span>
                </div>
              </div>

              {/* Instrument tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  MODIS (1 km)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#f5f5f7] border border-[#e5e5e7] text-[#6e6e73]">
                  ASTER (15 m)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#f5f5f7] border border-[#e5e5e7] text-[#6e6e73]">
                  CERES
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#f5f5f7] border border-[#e5e5e7] text-[#6e6e73]">
                  MISR
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#f5f5f7] border border-[#e5e5e7] text-[#6e6e73]">
                  MOPITT
                </span>
              </div>

            </div>

            {/* Right Column: Clean Isolated 3D NASA Terra Satellite Visual */}
            <div className="lg:col-span-5 flex items-center justify-center p-2">
              <div className="w-full max-w-sm sm:max-w-md relative flex items-center justify-center">
                <img
                  src="/terra_satellite_isolated.jpg"
                  alt="NASA Terra Satellite EOS AM-1"
                  className="w-full h-auto object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>

          </div>
        </div>

        {/* 2. Four-Column Clean Editorial Navigation Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          
          {/* Col 1: Official Brand Logo & Vision */}
          <div className="space-y-3.5">
            <div>
              <Logo size="md" />
            </div>

            <p className="text-[#6e6e73] leading-relaxed">
              {language === 'id'
                ? 'Harmonisasi rekam jejak titik panas satelit MODIS & VIIRS 2000–2026 untuk perlindungan kubah gambut Indonesia dan verifikasi target FOLU Net Sink 2030.'
                : 'Harmonization of MODIS & VIIRS 2000–2026 satellite fire records for Indonesian peatland preservation and FOLU Net Sink 2030 targets.'}
            </p>

            <div className="pt-1 flex items-center gap-2 text-[#515154]">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="font-medium">{language === 'id' ? 'Lisensi Sumber Terbuka MIT' : 'Open Source MIT License'}</span>
            </div>
          </div>

          {/* Col 2: App Modules Navigation */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider block border-b border-[#e5e5e7] pb-2">
              {language === 'id' ? 'Navigasi Modul' : 'System Modules'}
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab('overview')}
                  className="text-[#6e6e73] hover:text-[#1d1d1f] transition flex items-center gap-2 min-h-[36px] py-1 cursor-pointer font-medium"
                >
                  <Compass className="w-3.5 h-3.5 text-[#1d1d1f]" />
                  <span>{t.navOverview}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('lab')}
                  className="text-[#6e6e73] hover:text-[#1d1d1f] transition flex items-center gap-2 min-h-[36px] py-1 cursor-pointer font-medium"
                >
                  <Cpu className="w-3.5 h-3.5 text-[#1d1d1f]" />
                  <span>{t.navLab}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('mitigation')}
                  className="text-[#6e6e73] hover:text-[#1d1d1f] transition flex items-center gap-2 min-h-[36px] py-1 cursor-pointer font-medium"
                >
                  <Flame className="w-3.5 h-3.5 text-[#1d1d1f]" />
                  <span>{t.navMitigation}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('data-hub')}
                  className="text-[#6e6e73] hover:text-[#1d1d1f] transition flex items-center gap-2 min-h-[36px] py-1 cursor-pointer font-medium"
                >
                  <Database className="w-3.5 h-3.5 text-[#1d1d1f]" />
                  <span>{t.navData}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('team')}
                  className="text-[#6e6e73] hover:text-[#1d1d1f] transition flex items-center gap-2 min-h-[36px] py-1 cursor-pointer font-medium"
                >
                  <Award className="w-3.5 h-3.5 text-[#1d1d1f]" />
                  <span>{t.navTeam}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Sensor Platforms & Satellites */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider block border-b border-[#e5e5e7] pb-2">
              {language === 'id' ? 'Konstelasi Satelit' : 'Satellite Constellations'}
            </span>
            <ul className="space-y-2 text-[#6e6e73]">
              <li className="flex items-center justify-between">
                <span>NASA Terra (EOS AM-1)</span>
                <span className="text-[#1d1d1f] font-mono text-[11px] font-semibold">MODIS 1km</span>
              </li>
              <li className="flex items-center justify-between">
                <span>NASA Aqua (EOS PM-1)</span>
                <span className="text-[#1d1d1f] font-mono text-[11px] font-semibold">MODIS 1km</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Suomi-NPP (NASA/NOAA)</span>
                <span className="text-[#1d1d1f] font-mono text-[11px] font-semibold">VIIRS 375m</span>
              </li>
              <li className="flex items-center justify-between">
                <span>NOAA-20 / JPSS-1</span>
                <span className="text-[#1d1d1f] font-mono text-[11px] font-semibold">VIIRS 375m</span>
              </li>
              <li className="flex items-center justify-between">
                <span>NOAA-21 / JPSS-2</span>
                <span className="text-[#1d1d1f] font-mono text-[11px] font-semibold">VIIRS 375m</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Open Science & Repository */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider block border-b border-[#e5e5e7] pb-2">
              {language === 'id' ? 'Pusat Riset Terbuka' : 'Open Science Hub'}
            </span>
            <p className="text-[#6e6e73] leading-relaxed">
              {language === 'id'
                ? 'Data observasi bumi terbuka disediakan oleh NASA FIRMS dan Earthdata. Semua algoritma terintegrasi dalam pipeline geospasial terbuka.'
                : 'Open Earth observation data courtesy of NASA FIRMS and Earthdata. Algorithms integrated into an open-source pipeline.'}
            </p>
            <div className="pt-1">
              <a
                href="https://github.com/Rangga11268/TerraHarmonia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1d1d1f] hover:bg-black text-white font-semibold transition shadow-xs min-h-[44px] cursor-pointer"
              >
                <span>GitHub Repository</span>
                <ExternalLink className="w-3.5 h-3.5 text-white/80" />
              </a>
            </div>
          </div>

        </div>

        {/* 3. Bottom Minimal Legal Bar */}
        <div className="pt-8 border-t border-[#e5e5e7] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#86868b]">
          <p className="text-center sm:text-left">
            &copy; 2026 {t.appName} &bull; {t.footerChallenge} &bull; {t.footerCourtesy}
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>NASA Space Network: Nominal</span>
            </span>
            <span>Indonesia 2026</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
