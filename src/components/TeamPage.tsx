import React from 'react';
import { Language } from '../data/translations';
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
  MapPin,
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
    focusId: 'Perancangan algoritma harmonisasi spasial 5.5 km, pipeline kalibrasi FRP, dan arsitektur web client-side.',
    focusEn: 'Spatial 5.5 km binning algorithm design, FRP cross-sensor calibration pipeline, and high-performance client architecture.',
    tags: ['MODIS & VIIRS', 'GIS / Leaflet', 'React / TypeScript'],
  },
  {
    name: 'Remote Sensing & Data Scientist',
    roleId: 'Spesialis Penginderaan Jauh & Data Satelit',
    roleEn: 'Remote Sensing & Satellite Data Scientist',
    focusId: 'Analisis deret waktu 26 tahun (2000–2026), normalisasi degradasi sensor Terra/Aqua, dan validasi data NASA FIRMS.',
    focusEn: '26-year time-series analysis (2000–2026), sensor degradation normalization, and NASA FIRMS dataset validation.',
    tags: ['NASA FIRMS', 'Python / GeoPandas', 'Statistical Modeling'],
  },
  {
    name: 'Peatland Hydrology & Ecology Specialist',
    roleId: 'Peneliti Ekologi Gambut & Mitigasi',
    roleEn: 'Peatland Hydrologist & Fire Ecology Researcher',
    focusId: 'Pemodelan kedalaman muka air tanah (TMAG), perhitungan emisi karbon CO2e gambut, dan integrasi regulasi restorasi BRGM.',
    focusEn: 'Groundwater table (TMAG) dynamics modeling, peat CO2e carbon emission metrics, and BRGM regulatory compliance.',
    tags: ['TMAG -40cm', 'Canal Blocking', 'Carbon Accounting'],
  },
  {
    name: 'UI/UX & Human-Centered Interface Designer',
    roleId: 'Desainer Antarmuka & Aksesibilitas',
    roleEn: 'UI/UX & Accessibility Interface Designer',
    focusId: 'Prinsip desain Apple-clean antislop, tipografi data ilmiah tanpa clutter, dan responsivitas mobile bagi komandan lapangan.',
    focusEn: 'Apple-clean antislop design principles, clear data typography without visual noise, and responsive field mobile layouts.',
    tags: ['Antislop UI', 'Design Systems', 'Responsive GIS'],
  },
];

export const TeamPage: React.FC<TeamPageProps> = ({ language }) => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      
      {/* Top Editorial Breadcrumb & Header */}
      <div className="space-y-2 pt-2 pb-5 border-b border-[#e5e5e7]">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b] flex items-center gap-2">
          <Award className="w-4 h-4 text-[#1d1d1f]" />
          <span>NASA Space Apps Challenge 2026 &bull; Global Hackathon Submission</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight">
          {language === 'id' ? 'Profil Tim & Metodologi Ilmiah' : 'Team Dossier & Scientific Methodology'}
        </h1>
        <p className="text-sm sm:text-base text-[#6e6e73] max-w-3xl leading-relaxed">
          {language === 'id'
            ? 'Tim lintas disiplin yang mengembangkan solusi harmonisasi 26 tahun data satelit NASA Terra, Aqua, Suomi-NPP, dan NOAA-20 untuk perlindungan ekosistem lahan gambut Indonesia.'
            : 'An interdisciplinary team engineering a 26-year harmonized satellite climatology combining NASA Terra, Aqua, Suomi-NPP, and NOAA-20 for Indonesian tropical peatland resilience.'}
        </p>
      </div>

      {/* Main Feature: Team Group Showcase & Manifesto */}
      <div className="bg-white border border-[#e5e5e7] rounded-3xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Left: High-Res Photo Container */}
        <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[420px] bg-[#1d1d1f] overflow-hidden">
          <img
            src="/team_photo.jpg"
            alt="Team Terra Harmonia"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Terra Harmonia Initiative</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Team Terra Harmonia
            </h2>
            <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-md">
              {language === 'id'
                ? 'Kolaborasi data sains, penginderaan jauh, dan hidrologi gambut Indonesia.'
                : 'Pioneering unified wildfire climatology for Indonesian peatlands.'}
            </p>
          </div>
        </div>

        {/* Right: Mission Manifesto & Challenge Background */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider">Tantangan Resmi NASA</span>
              <h3 className="text-lg font-bold text-[#1d1d1f] mt-0.5">
                Harmonization of MODIS and VIIRS Hot Spots
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#515154] leading-relaxed">
              {language === 'id'
                ? 'Sebelum tahun 2012, pengamatan titik panas global bergantung pada instrumen MODIS (1 km). Masuknya sensor VIIRS (375 m) menghasilkan lonjakan tajam pada jumlah deteksi mentah bukan karena api bertambah, melainkan karena resolusi sensor yang jauh lebih tajam. Terra Harmonia memecahkan diskontinuitas ini.'
                : 'Prior to 2012, global active fire detection relied on MODIS (1 km). The addition of VIIRS (375 m) introduced a dramatic spike in raw counts due to superior spatial acuity rather than actual fire increase. Terra Harmonia bridges this structural gap.'}
            </p>

            <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-[#e5e5e7] space-y-2">
              <div className="text-xs font-bold text-[#1d1d1f] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{language === 'id' ? 'Tujuan Utama Proyek' : 'Core Objective'}</span>
              </div>
              <p className="text-xs text-[#6e6e73] leading-relaxed">
                {language === 'id'
                  ? 'Menyediakan deret waktu 26 tahun yang konsisten tanpa bias sensor, sehingga pembuat kebijakan dapat mengevaluasi efektivitas moratorium sawit, kanalisasi gambut, dan anomali El Niño secara akurat.'
                  : 'Delivering an un-biased 26-year historical baseline enabling policymakers to rigorously evaluate peatland moratoriums, canal blocking, and El Niño anomalies.'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e5e5e7] flex items-center justify-between text-xs text-[#86868b]">
            <span>Lokasi: Jakarta &bull; Indonesia</span>
            <span>Tahun: 2026</span>
          </div>
        </div>

      </div>

      {/* Team Members Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
              {language === 'id' ? 'Komposisi & Peran Tim' : 'Team Composition & Specializations'}
            </h2>
            <p className="text-xs text-[#86868b] mt-0.5">
              {language === 'id' ? 'Keahlian multi-disiplin untuk mengatasi tantangan geospasial yang kompleks' : 'Multidisciplinary expertise tackling complex geospatial challenges'}
            </p>
          </div>
          <span className="text-xs font-semibold text-[#86868b] bg-[#f5f5f7] px-3 py-1 rounded-full border border-[#e5e5e7]">
            4 Bidang Keahlian
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEAM_MEMBERS.map((member, index) => (
            <div
              key={index}
              className="bg-white border border-[#e5e5e7] rounded-2xl p-5 sm:p-6 shadow-xs hover:border-[#1d1d1f]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-[#1d1d1f]">{member.name}</h3>
                    <p className="text-xs font-semibold text-blue-700 mt-0.5">
                      {language === 'id' ? member.roleId : member.roleEn}
                    </p>
                  </div>
                  <div className="p-2 bg-[#f5f5f7] rounded-xl text-[#1d1d1f] shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-xs text-[#6e6e73] leading-relaxed pt-1">
                  {language === 'id' ? member.focusId : member.focusEn}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#e5e5e7]">
                {member.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5e7]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Scientific Pillars of Terra Harmonia */}
      <div className="bg-white border border-[#e5e5e7] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
            {language === 'id' ? 'Pilar Metodologi' : 'Methodology Pillars'}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] tracking-tight mt-0.5">
            {language === 'id' ? '4 Inovasi Ilmiah Terra Harmonia' : '4 Core Scientific Innovations'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-white border border-[#e5e5e7] text-[#1d1d1f]">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#1d1d1f] text-sm">Spatial Equal-Area Binning</h3>
            <p className="text-[#6e6e73] leading-relaxed">
              {language === 'id'
                ? 'Pengelompokan grid 5.5 km menyatukan beberapa pixel VIIRS dalam satu footprint MODIS untuk mencegah double-counting.'
                : '5.5 km equal-area grid clustering merging multiple VIIRS pixels into unified fire footprints to eliminate overcounting.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-white border border-[#e5e5e7] text-[#1d1d1f]">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#1d1d1f] text-sm">FRP Power-Law Calibration</h3>
            <p className="text-[#6e6e73] leading-relaxed">
              {language === 'id'
                ? 'Transformasi matematis menstandarkan energi panas (MW) antar sensor Terra, Aqua, Suomi-NPP, dan NOAA-20.'
                : 'Mathematical power-law transformations standardizing Fire Radiative Power (MW) across all four satellite platforms.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-white border border-[#e5e5e7] text-[#1d1d1f]">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#1d1d1f] text-sm">Peatland Early Warning (TMAG)</h3>
            <p className="text-[#6e6e73] leading-relaxed">
              {language === 'id'
                ? 'Integrasi ambang batas kritis muka air tanah gambut -40 cm (PP No. 71/2014 & BRGM) dengan deteksi satelit.'
                : 'Integrating the statutory -40 cm groundwater threshold with satellite heat signatures for smoldering fire defense.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-white border border-[#e5e5e7] text-[#1d1d1f]">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#1d1d1f] text-sm">NASA FIRMS Live Ingestion</h3>
            <p className="text-[#6e6e73] leading-relaxed">
              {language === 'id'
                ? 'Sinkronisasi feed satelit 24 jam waktu nyata melalui API resmi NASA FIRMS untuk respon darurat pemadaman.'
                : 'Real-time 24-hour satellite data ingestion via authorized NASA FIRMS API endpoints for emergency patrol response.'}
            </p>
          </div>

        </div>
      </div>

      {/* Open Source & Citation Footer */}
      <div className="bg-[#f5f5f7] border border-[#e5e5e7] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-1 text-center sm:text-left">
          <div className="font-semibold text-[#1d1d1f] flex items-center justify-center sm:justify-start gap-1.5">
            <Code2 className="w-4 h-4 text-[#1d1d1f]" />
            <span>Open Source &amp; Open Science Initiative</span>
          </div>
          <p className="text-[#86868b]">
            Dibuat untuk NASA International Space Apps Challenge 2026. Kode sumber tersedia secara terbuka di GitHub.
          </p>
        </div>

        <a
          href="https://github.com/Rangga11268/TerraHarmonia"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-[#1d1d1f] hover:bg-black text-white font-semibold transition flex items-center gap-2 shadow-xs shrink-0"
        >
          <span>GitHub Repository</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};
