import React from 'react';
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
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Rangga & Engineering Lead',
    roleId: 'Pemimpin Tim & Arsitek Geospasial',
    roleEn: 'Team Lead & Geospatial Architect',
    focusId: 'Perancangan arsitektur harmonisasi spasial 5.5 km, pipeline kalibrasi FRP multi-satelit, dan rekayasa antarmuka web client-side berkinerja tinggi.',
    focusEn: 'Spatial 5.5 km binning architecture design, FRP cross-sensor calibration pipeline, and high-performance client-side web engineering.',
    tags: ['MODIS & VIIRS', 'GIS / Leaflet', 'React / TypeScript'],
  },
  {
    name: 'Remote Sensing & Data Scientist',
    roleId: 'Spesialis Penginderaan Jauh & Data Satelit',
    roleEn: 'Remote Sensing & Satellite Data Scientist',
    focusId: 'Analisis statistik deret waktu 26 tahun (2000–2026), normalisasi degradasi sensor Terra/Aqua, dan kurasi dataset NASA FIRMS.',
    focusEn: '26-year time-series statistical analysis (2000–2026), sensor degradation normalization, and NASA FIRMS dataset curation.',
    tags: ['NASA FIRMS', 'Python / GeoPandas', 'Statistical Modeling'],
  },
  {
    name: 'Peatland Hydrology & Ecology Specialist',
    roleId: 'Peneliti Ekologi Gambut & Mitigasi',
    roleEn: 'Peatland Hydrologist & Fire Ecology Researcher',
    focusId: 'Pemodelan dinamika muka air tanah gambut (TMAG < -40 cm), perhitungan emisi karbon CO2e gambut, dan integrasi standar restorasi hidrologis BRGM.',
    focusEn: 'Groundwater table (TMAG < -40 cm) dynamics modeling, peat CO2e carbon accounting, and BRGM hydrological restoration integration.',
    tags: ['TMAG -40cm', 'Canal Blocking', 'Carbon Accounting'],
  },
  {
    name: 'UI/UX & Human-Centered Interface Designer',
    roleId: 'Desainer Antarmuka & Aksesibilitas',
    roleEn: 'UI/UX & Accessibility Interface Designer',
    focusId: 'Penerapan estetika Apple-clean tanpa AI-slop, hierarki visual data ilmiah berkecepatan tinggi, dan responsivitas penuh bagi komandan lapangan.',
    focusEn: 'Apple-clean aesthetic without AI slop, high-acuity scientific visual hierarchy, and full mobile field responsiveness.',
    tags: ['Antislop UI', 'Design Systems', 'Responsive GIS'],
  },
];

export const TeamPage: React.FC<TeamPageProps> = ({ language }) => {
  const t = translations[language];

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Full-Width Editorial Hero Header */}
      <div className="w-full bg-white border border-[#e5e5e7] rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#e5e5e7]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#86868b] uppercase tracking-wider">
            <Award className="w-4 h-4 text-[#1d1d1f]" />
            <span>NASA Space Apps Challenge 2026 &bull; Global Hackathon</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f5f7] border border-[#e5e5e7] text-xs font-semibold text-[#1d1d1f]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              {t.footerChallenge}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          <div className="lg:col-span-8 space-y-3">
            <h1 className="text-3xl sm:text-5xl font-bold text-[#1d1d1f] tracking-tight leading-tight">
              Terra Harmonia
            </h1>
            <p className="text-base sm:text-lg text-[#515154] max-w-3xl leading-relaxed">
              {t.teamHeroDesc}
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7]">
              <span className="text-[10px] font-bold uppercase text-[#86868b] tracking-wider block">
                {language === 'id' ? 'Rentang Data' : 'Data Span'}
              </span>
              <strong className="text-2xl font-bold text-[#1d1d1f] num mt-1 block">26 {t.year}</strong>
              <span className="text-[11px] text-[#6e6e73]">2000 – 2026</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7]">
              <span className="text-[10px] font-bold uppercase text-[#86868b] tracking-wider block">
                {t.spatialResolution}
              </span>
              <strong className="text-2xl font-bold text-[#1d1d1f] num mt-1 block">5.5 km</strong>
              <span className="text-[11px] text-[#6e6e73]">Equal-Area Binning</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Full-Width Team Showcase & Manifesto Card */}
      <div className="w-full bg-white border border-[#e5e5e7] rounded-3xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-0">
        
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
        <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider">
                {language === 'id' ? 'Akar Masalah Ilmiah' : 'Scientific Problem Statement'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#1d1d1f] mt-0.5">
                {t.teamProblemTitle}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#515154] leading-relaxed">
              {t.teamProblemDesc}
            </p>

            <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-2">
              <div className="text-xs font-bold text-[#1d1d1f] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{t.teamSolutionTitle}</span>
              </div>
              <p className="text-xs text-[#6e6e73] leading-relaxed">
                {t.teamSolutionDesc}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e5e5e7] flex items-center justify-between text-xs text-[#86868b]">
            <span>{language === 'id' ? 'Lokasi: Jakarta, Indonesia' : 'Location: Jakarta, Indonesia'}</span>
            <span>NASA Space Apps 2026</span>
          </div>
        </div>

      </div>

      {/* 3. Full-Width Section: Filosofi Nama & Anatomi Logo */}
      <div className="w-full bg-white border border-[#e5e5e7] rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
            {language === 'id' ? 'Identitas & Makna' : 'Identity & Brand Philosophy'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight mt-0.5">
            {t.identityPhilosophyTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#6e6e73] mt-1 max-w-3xl">
            {t.identityPhilosophyDesc}
          </p>
        </div>

        {/* Naming Philosophy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div className="p-6 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-3">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold text-sm">
                TERRA
              </div>
              <div>
                <h3 className="font-bold text-base text-[#1d1d1f]">{t.terraTitle}</h3>
                <span className="text-xs text-[#86868b]">{t.terraOrigin}</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#515154] leading-relaxed">
              {t.terraDesc}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-3">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm">
                HARMONIA
              </div>
              <div>
                <h3 className="font-bold text-base text-[#1d1d1f]">{t.harmoniaTitle}</h3>
                <span className="text-xs text-[#86868b]">{t.harmoniaOrigin}</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#515154] leading-relaxed">
              {t.harmoniaDesc}
            </p>
          </div>

        </div>

        {/* Logo Breakdown Container */}
        <div className="border-t border-[#e5e5e7] pt-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">
                {t.logoAnatomyTitle}
              </span>
              <p className="text-xs text-[#86868b]">{t.logoAnatomyDesc}</p>
            </div>

            <div className="p-4 bg-[#f5f5f7] rounded-2xl border border-[#e5e5e7] flex items-center gap-3 shrink-0">
              <img src="/favicon.svg" alt="Terra Harmonia Logo" className="w-10 h-10" />
              <div className="text-left text-xs">
                <span className="font-bold text-[#1d1d1f] block text-sm">Terra Harmonia</span>
                <span className="text-[#86868b]">Official NASA Hackathon Emblem</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            
            <div className="p-5 rounded-2xl border border-[#e5e5e7] bg-[#fbfbfd] space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0" />
                <strong className="text-sm text-[#1d1d1f]">{t.crescentTitle}</strong>
              </div>
              <p className="text-[#6e6e73] leading-relaxed">
                {t.crescentDesc}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#e5e5e7] bg-[#fbfbfd] space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-red-500 shrink-0" />
                <strong className="text-sm text-[#1d1d1f]">{t.flameTitle}</strong>
              </div>
              <p className="text-[#6e6e73] leading-relaxed">
                {t.flameDesc}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#e5e5e7] bg-[#fbfbfd] space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 shrink-0" />
                <strong className="text-sm text-[#1d1d1f]">{t.orbitRingTitle}</strong>
              </div>
              <p className="text-[#6e6e73] leading-relaxed">
                {t.orbitRingDesc}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* 4. Full-Width Section: Komposisi & Spesialisasi Anggota Tim */}
      <div className="w-full bg-white border border-[#e5e5e7] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
              {t.humanCapitalTitle}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight mt-0.5">
              {t.teamCompTitle}
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#86868b] bg-[#f5f5f7] px-3.5 py-1.5 rounded-full border border-[#e5e5e7] shrink-0">
            {language === 'id' ? '4 Bidang Keahlian' : '4 Core Disciplines'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TEAM_MEMBERS.map((member, index) => (
            <div
              key={index}
              className="bg-[#fbfbfd] border border-[#e5e5e7] rounded-2xl p-6 shadow-xs hover:border-[#1d1d1f]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#1d1d1f]">{member.name}</h3>
                    <p className="text-xs font-bold text-blue-700 mt-0.5">
                      {language === 'id' ? member.roleId : member.roleEn}
                    </p>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[#e5e5e7] text-[#1d1d1f] shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-xs text-[#515154] leading-relaxed pt-1">
                  {language === 'id' ? member.focusId : member.focusEn}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#e5e5e7]">
                {member.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white text-[#1d1d1f] border border-[#e5e5e7]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Full-Width Section: 4 Pilar Metodologi Ilmiah */}
      <div className="w-full bg-white border border-[#e5e5e7] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
            {t.methodologyTitle}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight mt-0.5">
            {t.fourInnovationsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="p-5 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="p-2.5 w-fit rounded-xl bg-white border border-[#e5e5e7] text-[#1d1d1f]">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1d1d1f] text-sm">{t.binningInnovationTitle}</h3>
              <p className="text-[#6e6e73] leading-relaxed">
                {t.binningInnovationDesc}
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">
              {language === 'id' ? 'Metrik Spasial' : 'Spatial Metric'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="p-2.5 w-fit rounded-xl bg-white border border-[#e5e5e7] text-[#1d1d1f]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1d1d1f] text-sm">{t.frpInnovationTitle}</h3>
              <p className="text-[#6e6e73] leading-relaxed">
                {t.frpInnovationDesc}
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">
              {language === 'id' ? 'Fisika Energi' : 'Energy Physics'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="p-2.5 w-fit rounded-xl bg-white border border-[#e5e5e7] text-[#1d1d1f]">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1d1d1f] text-sm">{t.peatInnovationTitle}</h3>
              <p className="text-[#6e6e73] leading-relaxed">
                {t.peatInnovationDesc}
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">
              {language === 'id' ? 'Mitigasi Lapangan' : 'Field Mitigation'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="p-2.5 w-fit rounded-xl bg-white border border-[#e5e5e7] text-[#1d1d1f]">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1d1d1f] text-sm">{t.firmsInnovationTitle}</h3>
              <p className="text-[#6e6e73] leading-relaxed">
                {t.firmsInnovationDesc}
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">
              {language === 'id' ? 'Respon Waktu Nyata' : 'Real-Time Response'}
            </span>
          </div>

        </div>
      </div>

      {/* 6. Full-Width Open Source & Citation Footer */}
      <div className="w-full bg-[#fbfbfd] border border-[#e5e5e7] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-xs">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="font-bold text-sm text-[#1d1d1f] flex items-center justify-center sm:justify-start gap-2">
            <Code2 className="w-4 h-4 text-[#1d1d1f]" />
            <span>{t.openScienceFooter}</span>
          </div>
          <p className="text-[#6e6e73] max-w-2xl leading-relaxed">
            {t.openScienceDesc}
          </p>
        </div>

        <a
          href="https://github.com/Rangga11268/TerraHarmonia"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-[#1d1d1f] hover:bg-black text-white font-semibold transition flex items-center gap-2 shadow-xs shrink-0 cursor-pointer min-h-[44px]"
        >
          <span>GitHub Repository</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
};
