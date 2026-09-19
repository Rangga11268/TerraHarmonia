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
    <footer className="relative overflow-hidden w-full bg-[#fbfbfd] border-t border-[#e5e5e7] text-[#1d1d1f] transition-all">
      
      {/* Dynamic Animated NASA Terra Satellite (EOS AM-1) Orbital Trajectory Canvas in Background */}
      <div className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden select-none z-0">
        <svg
          viewBox="0 0 1440 650"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full opacity-95"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Solar Array Sapphire Blue Gradient */}
            <linearGradient id="terraSolarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="40%" stopColor="#2563eb" />
              <stop offset="75%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#172554" />
            </linearGradient>

            {/* NASA Multi-Layer Insulation (MLI) Gold Foil Gradient */}
            <linearGradient id="terraGoldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="25%" stopColor="#f59e0b" />
              <stop offset="65%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>

            {/* Active MODIS Thermal Sensor Swath Beam Gradient */}
            <linearGradient id="modisSwathGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="35%" stopColor="#10b981" stopOpacity="0.22" />
              <stop offset="85%" stopColor="#059669" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0" />
            </linearGradient>

            {/* Glowing Orbit Line Trajectory Gradient */}
            <linearGradient id="orbitTrajectoryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0071e3" stopOpacity="0.04" />
              <stop offset="15%" stopColor="#0071e3" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.45" />
              <stop offset="85%" stopColor="#0071e3" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0071e3" stopOpacity="0.04" />
            </linearGradient>

            {/* Earth Limb Atmosphere Glow */}
            <radialGradient id="earthLimbGlow" cx="50%" cy="100%" r="60%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.08" />
              <stop offset="60%" stopColor="#10b981" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>

            {/* Master Curved Orbit Trajectory Path across the Entire Footer */}
            <path
              id="terraOrbitTrack"
              d="M -140 140 C 280 -15, 960 270, 1580 100"
            />
          </defs>

          {/* Faint Earth Horizon Atmosphere Arc at Bottom */}
          <ellipse cx="720" cy="740" rx="980" ry="240" fill="url(#earthLimbGlow)" />

          {/* Faint Grid & Constellation Coordinate Reference Lines */}
          <g opacity="0.25" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="3 6">
            <line x1="0" y1="120" x2="1440" y2="120" />
            <line x1="0" y1="280" x2="1440" y2="280" />
            <line x1="0" y1="440" x2="1440" y2="440" />
            <line x1="360" y1="0" x2="360" y2="650" />
            <line x1="720" y1="0" x2="720" y2="650" />
            <line x1="1080" y1="0" x2="1080" y2="650" />
          </g>

          {/* Star Field Micro-Points */}
          <g fill="#94a3b8" opacity="0.4">
            <circle cx="120" cy="80" r="1" />
            <circle cx="280" cy="210" r="1.2" />
            <circle cx="450" cy="65" r="0.8" />
            <circle cx="620" cy="190" r="1.2" />
            <circle cx="790" cy="75" r="1" />
            <circle cx="950" cy="220" r="1.4" />
            <circle cx="1120" cy="95" r="0.9" />
            <circle cx="1310" cy="240" r="1.1" />
            <circle cx="1400" cy="60" r="1.3" />
          </g>

          {/* Glowing Curved Orbit Trajectory Ground Track (Dashed) */}
          <use
            href="#terraOrbitTrack"
            fill="none"
            stroke="url(#orbitTrajectoryGrad)"
            strokeWidth="2"
            strokeDasharray="8 8"
          />

          {/* Secondary Swath Ground Coverage Footprint Envelope */}
          <path
            d="M -140 220 C 280 65, 960 350, 1580 180"
            fill="none"
            stroke="#10b981"
            strokeOpacity="0.12"
            strokeWidth="32"
            strokeLinecap="round"
          />

          {/* ORBITING NASA TERRA SATELLITE (EOS AM-1) VEHICLE */}
          <g>
            <animateMotion
              dur="28s"
              repeatCount="indefinite"
              rotate="auto"
              calcMode="linear"
            >
              <mpath href="#terraOrbitTrack" />
            </animateMotion>

            {/* 1. Active MODIS Downward Sensor Swath Beam */}
            <polygon
              points="0,6 -75,210 75,210"
              fill="url(#modisSwathGrad)"
            />
            {/* Ground swath footprint indicator */}
            <ellipse
              cx="0"
              cy="210"
              rx="75"
              ry="14"
              fill="#10b981"
              fillOpacity="0.15"
              stroke="#10b981"
              strokeOpacity="0.4"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            {/* Ground sensor scan pulse */}
            <line
              x1="-70"
              y1="210"
              x2="70"
              y2="210"
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeOpacity="0.7"
            >
              <animate
                attributeName="stroke-opacity"
                values="0.2;0.9;0.2"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </line>

            {/* 2. NASA Terra Satellite Detailed 3D-Look Vector Craft */}
            <g transform="scale(0.9) translate(-10, -10)">
              {/* RCS Thruster Ion Glow */}
              <circle cx="-28" cy="0" r="4" fill="#38bdf8" opacity="0.6">
                <animate
                  attributeName="r"
                  values="3;6;3"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;0.9;0.4"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Solar Array Boom Mast */}
              <rect x="14" y="-3" width="18" height="6" fill="#64748b" rx="1" />
              <line x1="14" y1="0" x2="32" y2="0" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Large NASA Terra Solar Array Wing (5 Segments with Photovoltaic Cells) */}
              <g transform="translate(32, -26)">
                {/* Array Shadow & Frame */}
                <rect
                  x="0"
                  y="0"
                  width="64"
                  height="52"
                  rx="3"
                  fill="#0f172a"
                  stroke="#475569"
                  strokeWidth="1"
                />
                {/* Solar Cells Grid */}
                <rect x="2" y="2" width="58" height="48" rx="2" fill="url(#terraSolarGrad)" />
                {/* Solar Panel Division Lines */}
                <line x1="14" y1="2" x2="14" y2="50" stroke="#93c5fd" strokeWidth="0.75" strokeOpacity="0.7" />
                <line x1="26" y1="2" x2="26" y2="50" stroke="#93c5fd" strokeWidth="0.75" strokeOpacity="0.7" />
                <line x1="38" y1="2" x2="38" y2="50" stroke="#93c5fd" strokeWidth="0.75" strokeOpacity="0.7" />
                <line x1="50" y1="2" x2="50" y2="50" stroke="#93c5fd" strokeWidth="0.75" strokeOpacity="0.7" />
                <line x1="2" y1="18" x2="60" y2="18" stroke="#93c5fd" strokeWidth="0.75" strokeOpacity="0.7" />
                <line x1="2" y1="34" x2="60" y2="34" stroke="#93c5fd" strokeWidth="0.75" strokeOpacity="0.7" />
                {/* Solar Panel Cell Specular Glint */}
                <line x1="4" y1="4" x2="58" y2="4" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.4" />
              </g>

              {/* Main Satellite Spacecraft Bus (Gold MLI Thermal Foil) */}
              <rect
                x="-24"
                y="-14"
                width="38"
                height="28"
                rx="4"
                fill="url(#terraGoldFoil)"
                stroke="#78350f"
                strokeWidth="1"
              />
              {/* Bus Panel Foil Creases & Texture */}
              <line x1="-24" y1="0" x2="14" y2="0" stroke="#fef08a" strokeWidth="0.7" strokeOpacity="0.8" />
              <line x1="-8" y1="-14" x2="-8" y2="14" stroke="#78350f" strokeWidth="0.7" strokeOpacity="0.6" />
              <line x1="2" y1="-14" x2="2" y2="14" stroke="#78350f" strokeWidth="0.7" strokeOpacity="0.6" />

              {/* High Gain Antenna (HGA) Gimbal Mast & Dish */}
              <line x1="-12" y1="-14" x2="-20" y2="-24" stroke="#64748b" strokeWidth="1.5" />
              <ellipse cx="-22" cy="-26" rx="9" ry="4" fill="#e2e8f0" stroke="#475569" strokeWidth="1" transform="rotate(-25, -22, -26)" />
              <line x1="-22" y1="-26" x2="-25" y2="-31" stroke="#0ea5e9" strokeWidth="1" />
              <circle cx="-25" cy="-31" r="1.5" fill="#38bdf8" />

              {/* Scientific Payload Instruments */}
              {/* 1. MODIS Optical Sensor Bay (Nadir facing downwards) */}
              <rect x="-18" y="14" width="14" height="8" rx="2" fill="#334155" stroke="#0f172a" strokeWidth="0.7" />
              <circle cx="-11" cy="18" r="3.5" fill="#06b6d4" />
              <circle cx="-11" cy="18" r="1.5" fill="#ffffff" />

              {/* 2. ASTER Telescope Pod */}
              <rect x="-2" y="14" width="10" height="7" rx="1.5" fill="#475569" stroke="#1e293b" strokeWidth="0.7" />
              <circle cx="3" cy="18" r="2.2" fill="#10b981" />

              {/* 3. CERES / MISR Camera Boresights */}
              <rect x="-22" y="-12" width="6" height="5" rx="1" fill="#1e293b" />
              <circle cx="-19" cy="-9.5" r="1.2" fill="#e2e8f0" />

              {/* Active Telemetry LED Strobes */}
              <circle cx="-22" cy="12" r="1.5" fill="#ef4444">
                <animate attributeName="opacity" values="1;0.1;1" dur="1s" repeatCount="indefinite" />
              </circle>
              <circle cx="12" cy="12" r="1.5" fill="#10b981">
                <animate attributeName="opacity" values="0.2;1;0.2" dur="1.4s" repeatCount="indefinite" />
              </circle>
              <circle cx="-22" cy="-12" r="1.5" fill="#3b82f6">
                <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite" />
              </circle>
            </g>

            {/* High-Tech HUD Label Badge Floating Alongside the Satellite */}
            <g transform="translate(42, -28)">
              <rect
                x="0"
                y="0"
                width="136"
                height="32"
                rx="6"
                fill="#ffffff"
                fillOpacity="0.9"
                stroke="#cbd5e1"
                strokeWidth="1"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
              />
              <circle cx="10" cy="12" r="3" fill="#10b981">
                <animate attributeName="fill-opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" />
              </circle>
              <text
                x="18"
                y="14"
                fill="#1d1d1f"
                fontSize="9"
                fontWeight="700"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="0.02em"
              >
                NASA TERRA (EOS AM-1)
              </text>
              <text
                x="18"
                y="24"
                fill="#0071e3"
                fontSize="7.5"
                fontWeight="600"
                fontFamily="ui-monospace, monospace"
              >
                705 KM LEO &bull; MODIS ACTIVE
              </text>
            </g>
          </g>
        </svg>
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        
        {/* 1. Seamless NASA Terra Satellite (EOS AM-1) Orbital Telemetry Ribbon (No Heavy Dark Cards) */}
        <div className="w-full bg-white/95 backdrop-blur-sm border border-[#e5e5e7] rounded-3xl p-6 sm:p-8 shadow-xs overflow-hidden">
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
