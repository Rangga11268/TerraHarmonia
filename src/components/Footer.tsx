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
  Radio,
  Sparkles,
  MapPin,
  Activity,
  Layers,
  Droplets,
  Thermometer,
} from 'lucide-react';

interface FooterProps {
  language: Language;
  onSelectTab: (tab: NavTab) => void;
}

interface GroundTarget {
  id: string;
  name: string;
  nameId: string;
  coords: string;
  cx: number;
  cy: number;
  color: string;
  depth: string;
  gwl: string;
  status: string;
  statusId: string;
  sensor: string;
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

  const groundTargets: GroundTarget[] = [
    {
      id: 'riau',
      name: 'Riau • Siak Peat Basin',
      nameId: 'Riau • Kubah Gambut Siak',
      coords: '0.5°N 101.8°E',
      cx: 480,
      cy: 258,
      color: '#ef4444',
      depth: '4.2 m',
      gwl: '-38 cm',
      status: 'CRITICAL (FWI 28.4)',
      statusId: 'KRITIS (FWI 28.4)',
      sensor: 'MODIS Band 21/22',
    },
    {
      id: 'kalteng',
      name: 'Central Kalimantan • Ex-PLG Block A',
      nameId: 'Kalimantan Tengah • Eks-PLG Blok A',
      coords: '-2.2°S 113.8°E',
      cx: 740,
      cy: 250,
      color: '#f97316',
      depth: '5.8 m',
      gwl: '-45 cm',
      status: 'VERY HIGH (FWI 32.1)',
      statusId: 'SANGAT TINGGI (FWI 32.1)',
      sensor: 'MODIS TIR 3.9µm',
    },
    {
      id: 'sumsel',
      name: 'South Sumatra • OKI Concession Arc',
      nameId: 'Sumatera Selatan • Konsesi OKI',
      coords: '-3.1°S 105.4°E',
      cx: 980,
      cy: 260,
      color: '#eab308',
      depth: '3.5 m',
      gwl: '-29 cm',
      status: 'MODERATE RISK (FWI 18.6)',
      statusId: 'RISIKO SEDANG (FWI 18.6)',
      sensor: 'VIIRS I4 375m',
    },
    {
      id: 'papua',
      name: 'Papua • Merauke Savanna Basin',
      nameId: 'Papua • Kubah Savana Merauke',
      coords: '-7.8°S 139.6°E',
      cx: 1220,
      cy: 275,
      color: '#10b981',
      depth: '2.1 m',
      gwl: '-14 cm',
      status: 'NOMINAL MONITORING',
      statusId: 'PEMANTAUAN NOMINAL',
      sensor: 'MODIS + VIIRS Cross-Sync',
    },
  ];

  const [activeTarget, setActiveTarget] = useState<GroundTarget>(groundTargets[1]);

  return (
    <footer className="print:hidden relative w-full bg-[#fbfbfd] dark:bg-[#060911] border-t border-[#e5e5e7] dark:border-[#1f2937] text-[#1d1d1f] dark:text-[#f3f4f6] transition-colors overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        
        {/* 1. Four-Column Clean Editorial Navigation Matrix (Top Section) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          
          {/* Col 1: Official Brand Logo & Vision */}
          <div className="space-y-3.5">
            <div>
              <Logo size="md" showNasaBadge={true} />
            </div>

            <p className="text-[#6e6e73] dark:text-[#9ca3af] leading-relaxed">
              {language === 'id'
                ? 'Harmonisasi rekam jejak titik panas satelit MODIS & VIIRS 2000–2026 untuk perlindungan kubah gambut Indonesia dan verifikasi target FOLU Net Sink 2030.'
                : 'Harmonization of MODIS & VIIRS 2000–2026 satellite fire records for Indonesian peatland preservation and FOLU Net Sink 2030 targets.'}
            </p>

            <div className="pt-1 flex items-center gap-2 text-[#515154] dark:text-[#d1d5db]">
              <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span className="font-medium">{language === 'id' ? 'Lisensi Sumber Terbuka MIT' : 'Open Source MIT License'}</span>
            </div>
          </div>

          {/* Col 2: App Modules Navigation */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#1d1d1f] dark:text-white uppercase tracking-wider block border-b border-[#e5e5e7] dark:border-[#1f2937] pb-2">
              {language === 'id' ? 'Navigasi Modul' : 'System Modules'}
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab('overview')}
                  className="text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white transition flex items-center gap-2 min-h-[36px] py-1 cursor-pointer font-medium"
                >
                  <Compass className="w-3.5 h-3.5 text-[#1d1d1f] dark:text-white" />
                  <span>{t.navOverview}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('lab')}
                  className="text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white transition flex items-center gap-2 min-h-[36px] py-1 cursor-pointer font-medium"
                >
                  <Cpu className="w-3.5 h-3.5 text-[#1d1d1f] dark:text-white" />
                  <span>{t.navLab}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('mitigation')}
                  className="text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white transition flex items-center gap-2 min-h-[36px] py-1 cursor-pointer font-medium"
                >
                  <Flame className="w-3.5 h-3.5 text-[#1d1d1f] dark:text-white" />
                  <span>{t.navMitigation}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('data-hub')}
                  className="text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white transition flex items-center gap-2 min-h-[36px] py-1 cursor-pointer font-medium"
                >
                  <Database className="w-3.5 h-3.5 text-[#1d1d1f] dark:text-white" />
                  <span>{t.navData}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('team')}
                  className="text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white transition flex items-center gap-2 min-h-[36px] py-1 cursor-pointer font-medium"
                >
                  <Award className="w-3.5 h-3.5 text-[#1d1d1f] dark:text-white" />
                  <span>{t.navTeam}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Sensor Platforms & Satellites */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#1d1d1f] dark:text-white uppercase tracking-wider block border-b border-[#e5e5e7] dark:border-[#1f2937] pb-2">
              {language === 'id' ? 'Konstelasi Satelit' : 'Satellite Constellations'}
            </span>
            <ul className="space-y-2 text-[#6e6e73] dark:text-[#9ca3af]">
              <li className="flex items-center justify-between">
                <span>NASA Terra (EOS AM-1)</span>
                <span className="text-[#1d1d1f] dark:text-white font-mono text-[11px] font-semibold">MODIS 1km</span>
              </li>
              <li className="flex items-center justify-between">
                <span>NASA Aqua (EOS PM-1)</span>
                <span className="text-[#1d1d1f] dark:text-white font-mono text-[11px] font-semibold">MODIS 1km</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Suomi-NPP (NASA/NOAA)</span>
                <span className="text-[#1d1d1f] dark:text-white font-mono text-[11px] font-semibold">VIIRS 375m</span>
              </li>
              <li className="flex items-center justify-between">
                <span>NOAA-20 / JPSS-1</span>
                <span className="text-[#1d1d1f] dark:text-white font-mono text-[11px] font-semibold">VIIRS 375m</span>
              </li>
              <li className="flex items-center justify-between">
                <span>NOAA-21 / JPSS-2</span>
                <span className="text-[#1d1d1f] dark:text-white font-mono text-[11px] font-semibold">VIIRS 375m</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Open Science & Repository */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#1d1d1f] dark:text-white uppercase tracking-wider block border-b border-[#e5e5e7] dark:border-[#1f2937] pb-2">
              {language === 'id' ? 'Pusat Riset Terbuka' : 'Open Science Hub'}
            </span>
            <p className="text-[#6e6e73] dark:text-[#9ca3af] leading-relaxed">
              {language === 'id'
                ? 'Data observasi bumi terbuka disediakan oleh NASA FIRMS dan Earthdata. Semua algoritma terintegrasi dalam pipeline geospasial terbuka.'
                : 'Open Earth observation data courtesy of NASA FIRMS and Earthdata. Algorithms integrated into an open-source pipeline.'}
            </p>
            <div className="pt-1">
              <a
                href="https://github.com/Rangga11268/TerraHarmonia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1d1d1f] hover:bg-black dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold transition shadow-xs min-h-[44px] cursor-pointer"
              >
                <span>GitHub Repository</span>
                <ExternalLink className="w-3.5 h-3.5 text-white/80" />
              </a>
            </div>
          </div>

        </div>

        {/* 2. DEDICATED CINEMATIC ORBITAL FLIGHT DECK (Unobstructed Story Stage) */}
        <div className="relative w-full rounded-3xl border border-[#e5e5e7] dark:border-[#1f2937] bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] dark:from-[#080d1a] dark:via-[#0c1222] dark:to-[#050811] shadow-xs overflow-hidden">
          
          {/* Header Bar inside Orbital Stage */}
          <div className="relative z-10 px-5 sm:px-8 pt-5 pb-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-[#151d2f]/80 backdrop-blur-md border border-[#e5e5e7] dark:border-[#1f2937] text-xs font-semibold text-[#1d1d1f] dark:text-white shadow-2xs">
                <Orbit className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin" style={{ animationDuration: '20s' }} />
                <span>NASA Earth Observing System (EOS) &bull; Planetary Flight Deck</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ACTIVE SCANNING: INDONESIAN PEATLANDS</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-[#6e6e73] dark:text-[#9ca3af]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#0071e3] dark:text-[#38bdf8]" />
                <strong className="text-[#1d1d1f] dark:text-white num">{utcTime} UTC</strong>
              </span>
              <span className="hidden md:inline text-[11px] text-[#86868b]">&bull; NORAD 25994</span>
            </div>
          </div>

          {/* Panoramic Orbital Sky Window where NASA Terra orbits completely unobstructed */}
          <div className="relative w-full h-[240px] sm:h-[280px] overflow-hidden select-none">
            <svg
              viewBox="0 0 1440 320"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Solar Array Sapphire Blue Gradient */}
                <linearGradient id="orbitSolarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="30%" stopColor="#2563eb" />
                  <stop offset="70%" stopColor="#1d4ed8" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                {/* NASA Multi-Layer Insulation (MLI) Gold Foil Gradient */}
                <linearGradient id="orbitGoldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="25%" stopColor="#f59e0b" />
                  <stop offset="65%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#92400e" />
                </linearGradient>

                {/* Dynamic Multispectral MODIS Sensor Thermal Cone Beam */}
                <linearGradient id="modisSwathBeam" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.65" />
                  <stop offset="35%" stopColor="#06b6d4" stopOpacity="0.35" />
                  <stop offset="75%" stopColor="#10b981" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                </linearGradient>

                {/* Orbit Trajectory Arc Gradient */}
                <linearGradient id="orbitPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0071e3" stopOpacity="0.05" />
                  <stop offset="20%" stopColor="#0071e3" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="80%" stopColor="#0071e3" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0071e3" stopOpacity="0.05" />
                </linearGradient>

                {/* Atmosphere Limb Horizon Glow */}
                <radialGradient id="earthAtmosphereLimb" cx="50%" cy="115%" r="75%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.32" />
                  <stop offset="45%" stopColor="#10b981" stopOpacity="0.16" />
                  <stop offset="85%" stopColor="#0ea5e9" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>

                {/* Curved Orbital Ground Track */}
                <path
                  id="stageFlightTrack"
                  d="M -120 75 C 340 -20, 960 145, 1560 55"
                />
              </defs>

              {/* Earth Curvature Horizon Limb at bottom of sky */}
              <ellipse cx="720" cy="385" rx="940" ry="145" fill="url(#earthAtmosphereLimb)" />
              <path
                d="M -100 310 Q 720 230 1540 310"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.8"
                strokeOpacity="0.45"
              />

              {/* Celestial Coordinate Grid */}
              <g opacity="0.25" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3 6">
                <line x1="0" y1="90" x2="1440" y2="90" />
                <line x1="0" y1="180" x2="1440" y2="180" />
                <line x1="360" y1="0" x2="360" y2="320" />
                <line x1="720" y1="0" x2="720" y2="320" />
                <line x1="1080" y1="0" x2="1080" y2="320" />
              </g>

              {/* Celestial Starfield */}
              <g fill="#94a3b8" opacity="0.55">
                <circle cx="120" cy="40" r="1.2" />
                <circle cx="280" cy="110" r="0.9" />
                <circle cx="450" cy="30" r="1.1" />
                <circle cx="620" cy="85" r="0.8" />
                <circle cx="790" cy="35" r="1.3" />
                <circle cx="950" cy="105" r="1" />
                <circle cx="1120" cy="45" r="0.9" />
                <circle cx="1310" cy="95" r="1.2" />
              </g>

              {/* Glowing Curved Orbit Ground Track (Dashed) */}
              <use
                href="#stageFlightTrack"
                fill="none"
                stroke="url(#orbitPathGrad)"
                strokeWidth="2.5"
                strokeDasharray="8 6"
              />

              {/* INTERACTIVE PEATLAND GROUND TARGET STATIONS ON EARTH LIMB */}
              {groundTargets.map((target) => {
                const isSelected = activeTarget.id === target.id;
                return (
                  <g
                    key={target.id}
                    className="cursor-pointer transition-all"
                    onClick={() => setActiveTarget(target)}
                  >
                    {/* Pulsing Radar Ring */}
                    <circle
                      cx={target.cx}
                      cy={target.cy}
                      r={isSelected ? 10 : 6}
                      fill={target.color}
                      fillOpacity={isSelected ? 0.25 : 0.12}
                    >
                      <animate
                        attributeName="r"
                        values={isSelected ? '6;14;6' : '4;9;4'}
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.8;0.2;0.8"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Central Target Dot */}
                    <circle
                      cx={target.cx}
                      cy={target.cy}
                      r={isSelected ? 4 : 3}
                      fill={target.color}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? 1.5 : 1}
                    />

                    {/* Label */}
                    <text
                      x={target.cx}
                      y={target.cy + 17}
                      textAnchor="middle"
                      fill={isSelected ? '#0f172a' : '#64748b'}
                      className="dark:fill-slate-300"
                      fontSize={isSelected ? '9' : '8'}
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      fontFamily="monospace"
                    >
                      {target.coords}
                    </text>
                  </g>
                );
              })}

              {/* THE REALISTIC NASA TERRA (EOS AM-1) SPACECRAFT IN ORBIT */}
              <g>
                <animateMotion
                  dur="24s"
                  repeatCount="indefinite"
                  rotate="auto"
                  calcMode="linear"
                >
                  <mpath href="#stageFlightTrack" />
                </animateMotion>

                {/* Active MODIS Multispectral Sensor Swath Beam down to Earth */}
                <polygon
                  points="0,8 -90,200 90,200"
                  fill="url(#modisSwathBeam)"
                />
                {/* Ground Scan Footprint Ellipse */}
                <ellipse
                  cx="0"
                  cy="200"
                  rx="90"
                  ry="13"
                  fill="#10b981"
                  fillOpacity="0.22"
                  stroke="#059669"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />

                {/* Spacecraft Vector Assembly */}
                <g transform="scale(0.95)">
                  {/* Central Bus Structure (Gold MLI Thermal Foil) */}
                  <rect
                    x="-18"
                    y="-13"
                    width="36"
                    height="26"
                    rx="3"
                    fill="url(#orbitGoldFoil)"
                    stroke="#b45309"
                    strokeWidth="1"
                    filter="drop-shadow(0 4px 8px rgba(0,0,0,0.35))"
                  />

                  {/* MLI Foil Texture Grid */}
                  <line x1="-18" y1="-4" x2="18" y2="-4" stroke="#78350f" strokeWidth="0.5" opacity="0.6" />
                  <line x1="-18" y1="5" x2="18" y2="5" stroke="#78350f" strokeWidth="0.5" opacity="0.6" />
                  <line x1="-6" y1="-13" x2="-6" y2="13" stroke="#78350f" strokeWidth="0.5" opacity="0.6" />
                  <line x1="6" y1="-13" x2="6" y2="13" stroke="#78350f" strokeWidth="0.5" opacity="0.6" />

                  {/* MODIS Sensor Optical Bay (Pointing Nadir Downward) */}
                  <rect
                    x="-10"
                    y="11"
                    width="20"
                    height="9"
                    rx="2"
                    fill="#1e293b"
                    stroke="#0f172a"
                    strokeWidth="0.8"
                  />
                  {/* MODIS Active Thermal Sensor Lens (Glowing Emerald) */}
                  <circle cx="-4" cy="15.5" r="2.5" fill="#10b981" stroke="#047857" strokeWidth="0.6">
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="1.6s" repeatCount="indefinite" />
                  </circle>
                  {/* ASTER & CERES Instrument Apertures */}
                  <circle cx="4" cy="15.5" r="1.8" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.5" />

                  {/* High Gain Communication Antenna Dish (Pointing to TDRSS Space Network) */}
                  <line x1="0" y1="-13" x2="0" y2="-24" stroke="#64748b" strokeWidth="1.5" />
                  <path
                    d="M -9 -24 Q 0 -30 9 -24 Z"
                    fill="#f8fafc"
                    stroke="#94a3b8"
                    strokeWidth="0.8"
                  />
                  {/* Pulsing Communication Ring */}
                  <circle cx="0" cy="-27" r="1.5" fill="#22c55e">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite" />
                  </circle>

                  {/* Solar Array Booms */}
                  <line x1="-18" y1="0" x2="-26" y2="0" stroke="#334155" strokeWidth="3" />
                  <line x1="18" y1="0" x2="26" y2="0" stroke="#334155" strokeWidth="3" />

                  {/* PORT / LEFT SOLAR ARRAY WING (Blue High-Efficiency Photovoltaic Cells) */}
                  <g transform="translate(-26, 0)">
                    <rect
                      x="-38"
                      y="-16"
                      width="38"
                      height="32"
                      rx="1.5"
                      fill="url(#orbitSolarGrad)"
                      stroke="#1e40af"
                      strokeWidth="1"
                    />
                    {/* Solar Panel Cells Grid */}
                    <line x1="-28" y1="-16" x2="-28" y2="16" stroke="#93c5fd" strokeWidth="0.4" opacity="0.8" />
                    <line x1="-19" y1="-16" x2="-19" y2="16" stroke="#93c5fd" strokeWidth="0.4" opacity="0.8" />
                    <line x1="-9" y1="-16" x2="-9" y2="16" stroke="#93c5fd" strokeWidth="0.4" opacity="0.8" />
                    <line x1="-38" y1="-8" x2="0" y2="-8" stroke="#93c5fd" strokeWidth="0.4" opacity="0.8" />
                    <line x1="-38" y1="0" x2="0" y2="0" stroke="#bfdbfe" strokeWidth="0.6" opacity="0.95" />
                    <line x1="-38" y1="8" x2="0" y2="8" stroke="#93c5fd" strokeWidth="0.4" opacity="0.8" />
                  </g>

                  {/* STARBOARD / RIGHT SOLAR ARRAY WING */}
                  <g transform="translate(26, 0)">
                    <rect
                      x="0"
                      y="-16"
                      width="38"
                      height="32"
                      rx="1.5"
                      fill="url(#orbitSolarGrad)"
                      stroke="#1e40af"
                      strokeWidth="1"
                    />
                    {/* Solar Panel Cells Grid */}
                    <line x1="9" y1="-16" x2="9" y2="16" stroke="#93c5fd" strokeWidth="0.4" opacity="0.8" />
                    <line x1="19" y1="-16" x2="19" y2="16" stroke="#93c5fd" strokeWidth="0.4" opacity="0.8" />
                    <line x1="28" y1="-16" x2="28" y2="16" stroke="#93c5fd" strokeWidth="0.4" opacity="0.8" />
                    <line x1="0" y1="-8" x2="38" y2="-8" stroke="#93c5fd" strokeWidth="0.4" opacity="0.8" />
                    <line x1="0" y1="0" x2="38" y2="0" stroke="#bfdbfe" strokeWidth="0.6" opacity="0.95" />
                    <line x1="0" y1="8" x2="38" y2="8" stroke="#93c5fd" strokeWidth="0.4" opacity="0.8" />
                  </g>

                  {/* Spacecraft Attitude Thruster Pods */}
                  <circle cx="-16" cy="-11" r="1.2" fill="#475569" />
                  <circle cx="16" cy="-11" r="1.2" fill="#475569" />
                  <circle cx="-16" cy="11" r="1.2" fill="#475569" />
                  <circle cx="16" cy="11" r="1.2" fill="#475569" />

                  {/* Telemetry Heartbeat LED */}
                  <circle cx="0" cy="0" r="1.8" fill="#22c55e">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                </g>

                {/* Floating HUD Spacecraft Tag */}
                <g transform="translate(0, -42)">
                  <rect
                    x="-52"
                    y="-11"
                    width="104"
                    height="20"
                    rx="10"
                    fill="#020617"
                    fillOpacity="0.9"
                    stroke="#10b981"
                    strokeWidth="1"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="system-ui, sans-serif"
                    letterSpacing="0.6"
                  >
                    NASA TERRA (EOS AM-1)
                  </text>
                </g>
              </g>
            </svg>
          </div>

          {/* Active Target Peatland Station Insight Bar */}
          <div className="relative z-10 px-5 sm:px-8 py-3 bg-white/70 dark:bg-[#0f172a]/70 border-t border-[#e5e5e7] dark:border-[#1f2937] backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-[#1d1d1f] dark:text-white">
                  {language === 'id' ? activeTarget.nameId : activeTarget.name}
                </span>
                <span className="text-[#6e6e73] dark:text-[#9ca3af] ml-2 font-mono text-[11px]">
                  ({activeTarget.coords})
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 font-mono text-[11px]">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="text-[#6e6e73] dark:text-[#9ca3af]">{language === 'id' ? 'Kedalaman Gambut:' : 'Peat Depth:'}</span>
                <strong className="text-[#1d1d1f] dark:text-white">{activeTarget.depth}</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-[#6e6e73] dark:text-[#9ca3af]">{language === 'id' ? 'Tinggi Air Tanah:' : 'Water Table:'}</span>
                <strong className="text-[#1d1d1f] dark:text-white">{activeTarget.gwl}</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span className="text-[#6e6e73] dark:text-[#9ca3af]">{language === 'id' ? 'Status Pantauan:' : 'Status:'}</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold border border-rose-500/20">
                  {language === 'id' ? activeTarget.statusId : activeTarget.status}
                </span>
              </div>
            </div>
          </div>

          {/* Integrated Mission Telemetry Deck (Docked at bottom of stage with high contrast) */}
          <div className="relative z-10 p-5 sm:p-7 border-t border-[#e5e5e7] dark:border-[#1f2937] bg-white/95 dark:bg-[#0c1324]/95 backdrop-blur-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Mission Summary */}
              <div className="lg:col-span-5 space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f] dark:text-white tracking-tight">
                    NASA Terra (EOS AM-1) Spacecraft
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f5f5f7] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] text-[#6e6e73] dark:text-[#9ca3af]">
                    NORAD 25994
                  </span>
                </div>
                <p className="text-xs text-[#515154] dark:text-[#9ca3af] leading-relaxed">
                  {language === 'id'
                    ? 'Satelit unggulan NASA diluncurkan pada 18 Desember 1999 pada orbit Sun-Synchronous 705 km. Sensor MODIS menjadi tulang punggung pengamatan deret waktu 26 tahun Terra Harmonia.'
                    : 'NASA’s flagship Earth observation satellite launched on Dec 18, 1999 into a 705 km Sun-Synchronous orbit. Its MODIS sensor anchors Terra Harmonia’s 26-year baseline.'}
                </p>
              </div>

              {/* 4 Telemetry KPIs */}
              <div className="lg:col-span-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-[#fbfbfd] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937]">
                  <span className="text-[10px] text-[#86868b] dark:text-[#9ca3af] uppercase font-bold tracking-wider block">
                    {language === 'id' ? 'Ketinggian Orbit' : 'Orbit Altitude'}
                  </span>
                  <strong className="text-base font-bold text-[#1d1d1f] dark:text-white block mt-0.5 num">705 km</strong>
                  <span className="text-[10px] text-[#6e6e73] dark:text-[#9ca3af]">Sun-Synchronous</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#fbfbfd] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937]">
                  <span className="text-[10px] text-[#86868b] dark:text-[#9ca3af] uppercase font-bold tracking-wider block">
                    {language === 'id' ? 'Kecepatan Orbit' : 'Velocity'}
                  </span>
                  <strong className="text-base font-bold text-[#1d1d1f] dark:text-white block mt-0.5 num">7.5 km/s</strong>
                  <span className="text-[10px] text-[#6e6e73] dark:text-[#9ca3af]">27,000 km/h</span>
                </div>
              </div>

              {/* Sensor Payload Badges */}
              <div className="lg:col-span-3 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#86868b] dark:text-[#9ca3af] tracking-wider block">
                  {language === 'id' ? 'Payload Sensor Sains' : 'Science Payload Suite'}
                </span>
                <div className="flex flex-wrap items-center gap-1 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                    MODIS (1 km)
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#f5f5f7] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] text-[#6e6e73] dark:text-[#9ca3af]">
                    ASTER (15 m)
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#f5f5f7] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] text-[#6e6e73] dark:text-[#9ca3af]">
                    CERES
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#f5f5f7] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] text-[#6e6e73] dark:text-[#9ca3af]">
                    MISR
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#f5f5f7] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] text-[#6e6e73] dark:text-[#9ca3af]">
                    MOPITT
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 3. Bottom Minimal Legal Bar */}
        <div className="pt-6 border-t border-[#e5e5e7] dark:border-[#1f2937] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#86868b] dark:text-[#9ca3af]">
          <div className="flex items-center gap-3">
            <Logo size="sm" showSubtitle={false} showNasaBadge={true} />
            <span>&copy; 2026 Terra Harmonia &bull; NASA Space Apps Jakarta 2026 &bull; NASA FIRMS &amp; Earthdata</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>NASA Space Network: Nominal</span>
            </span>
            <span>Jakarta, Indonesia 2026</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
