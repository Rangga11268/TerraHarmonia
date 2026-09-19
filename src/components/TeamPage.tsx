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
  CheckCircle2,
  Layers,
  FileText,
  Trees,
  Orbit,
  Binary,
  Compass,
  Zap,
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
              Tantangan: Harmonization of MODIS &amp; VIIRS Hot Spots
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          <div className="lg:col-span-8 space-y-3">
            <h1 className="text-3xl sm:text-5xl font-bold text-[#1d1d1f] tracking-tight leading-tight">
              Terra Harmonia
            </h1>
            <p className="text-base sm:text-lg text-[#515154] max-w-3xl leading-relaxed">
              {language === 'id'
                ? 'Menghubungkan 26 tahun pengamatan satelit NASA Terra, Aqua, Suomi-NPP, dan NOAA-20 menjadi satu deret waktu konsisten tanpa bias sensor untuk perlindungan ekosistem lahan gambut Indonesia.'
                : 'Unifying 26 years of NASA satellite observations from Terra, Aqua, Suomi-NPP, and NOAA-20 into an un-biased, continuous climatology for Indonesian tropical peatland preservation.'}
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7]">
              <span className="text-[10px] font-bold uppercase text-[#86868b] tracking-wider block">Rentang Data</span>
              <strong className="text-2xl font-bold text-[#1d1d1f] num mt-1 block">26 Tahun</strong>
              <span className="text-[11px] text-[#6e6e73]">2000 s/d 2026</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7]">
              <span className="text-[10px] font-bold uppercase text-[#86868b] tracking-wider block">Resolusi Grid</span>
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
              <span>Tim Terra Harmonia &bull; Indonesia</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Kolaborasi Multi-Disiplin
            </h2>
            <p className="text-xs sm:text-sm text-white/85 max-w-xl leading-relaxed">
              {language === 'id'
                ? 'Sinergi data sains antariksa, penginderaan jauh geospasial, hidrologi lahan gambut tropis, dan rekayasa perangkat lunak modern.'
                : 'A cross-disciplinary synergy of satellite remote sensing, peatland hydrology, and modern geospatial software engineering.'}
            </p>
          </div>
        </div>

        {/* Right: Problem Statement & Project Mission */}
        <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider">Akar Masalah Ilmiah</span>
              <h3 className="text-lg sm:text-xl font-bold text-[#1d1d1f] mt-0.5">
                Mengapa Harmonisasi MODIS &amp; VIIRS Sangat Krusial?
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#515154] leading-relaxed">
              {language === 'id'
                ? 'Sebelum 2012, pemantauan kebakaran hutan global mengandalkan sensor MODIS (resolusi 1 km). Saat sensor VIIRS (resolusi 375 m) beroperasi pada 2012, jumlah titik api mentah melonjak tajam bukan karena kebakaran bertambah, melainkan karena resolusi sensor yang jauh lebih tajam mampu mendeteksi api kecil yang dulunya luput.'
                : 'Prior to 2012, active fire detection relied on MODIS (1 km). The addition of VIIRS (375 m) in 2012 introduced an artificial spike in raw fire counts due to superior spatial acuity rather than an actual increase in burning.'}
            </p>

            <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-2">
              <div className="text-xs font-bold text-[#1d1d1f] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{language === 'id' ? 'Solusi Terra Harmonia' : 'The Terra Harmonia Solution'}</span>
              </div>
              <p className="text-xs text-[#6e6e73] leading-relaxed">
                {language === 'id'
                  ? 'Kami menggabungkan deteksi tumpang-tindih ke dalam grid 5.5 km dan mengalibrasi energi radiatif (FRP) dengan model power-law, menghasilkan satu deret waktu 26 tahun yang adil dan dapat dibandingkan secara objektif.'
                  : 'We merge overlapping detections into unified 5.5 km equal-area grids and calibrate Fire Radiative Power (FRP) with power-law normalization, producing an un-biased 26-year climatology.'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e5e5e7] flex items-center justify-between text-xs text-[#86868b]">
            <span>Lokasi: Jakarta, Indonesia</span>
            <span>Kompetisi: NASA Space Apps 2026</span>
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
            {language === 'id' ? 'Filosofi Nama & Anatomi Lambang Terra Harmonia' : 'Name Philosophy & Logo Emblem Anatomy'}
          </h2>
          <p className="text-xs sm:text-sm text-[#6e6e73] mt-1 max-w-3xl">
            {language === 'id'
              ? 'Setiap kata dan garis geometris pada lambang kami memiliki makna ilmiah dan dedikasi ekologis yang mendalam.'
              : 'Every naming component and geometric contour in our emblem represents satellite science and ecological stewardship.'}
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
                <h3 className="font-bold text-base text-[#1d1d1f]">Planet Bumi &amp; Satelit NASA Terra</h3>
                <span className="text-xs text-[#86868b]">Bahasa Latin: Bumi / Tanah</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#515154] leading-relaxed">
              {language === 'id'
                ? 'Nama Terra mewakili Planet Bumi sebagai rumah bersama, sekaligus penghormatan kepada satelit legendaris NASA Terra (EOS AM-1) yang diluncurkan pada 18 Desember 1999 dan memulai era modern pengamatan titik api global melalui instrumen MODIS.'
                : 'Represents planet Earth and pays tribute to NASA’s flagship Terra satellite (EOS AM-1) launched in 1999, which pioneered modern active fire monitoring via the MODIS sensor.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-3">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm">
                HARMONIA
              </div>
              <div>
                <h3 className="font-bold text-base text-[#1d1d1f]">Harmonisasi &amp; Keselarasan Sensor</h3>
                <span className="text-xs text-[#86868b]">Bahasa Latin/Yunani: Keselarasan Data</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#515154] leading-relaxed">
              {language === 'id'
                ? 'Harmonia melambangkan misi utama kami: menyelaraskan dua era sensor yang berbeda (MODIS 1 km dan VIIRS 375 m) sehingga menghasilkan data deret waktu yang selaras, adil, dan berkesinambungan tanpa lonjakan data artifisial.'
                : 'Harmonia embodies our scientific mission: creating seamless harmony between distinct sensor generations (MODIS and VIIRS) to deliver a cohesive, un-biased 26-year record.'}
            </p>
          </div>

        </div>

        {/* Logo Breakdown Container */}
        <div className="border-t border-[#e5e5e7] pt-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">
                {language === 'id' ? 'Anatomi Visual Lambang Vektor Murni' : 'Visual Anatomy of the Pure Vector Emblem'}
              </span>
              <p className="text-xs text-[#86868b]">Dirancang murni tanpa background kotak untuk integritas transparansi Open Science</p>
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
                <strong className="text-sm text-[#1d1d1f]">Bulan Sabit Bumi (Biosfer)</strong>
              </div>
              <p className="text-[#6e6e73] leading-relaxed">
                Melambangkan ekosistem lahan gambut dan hutan tropis Indonesia yang sangat kaya karbon namun rentan terhadap pengeringan akibat perubahan iklim.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#e5e5e7] bg-[#fbfbfd] space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-red-500 shrink-0" />
                <strong className="text-sm text-[#1d1d1f]">Lidah Api Dinamis (FRP)</strong>
              </div>
              <p className="text-[#6e6e73] leading-relaxed">
                Merepresentasikan energi radiatif api (*Fire Radiative Power*) yang dipantau sensor satelit secara real-time dari orbit luar angkasa.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#e5e5e7] bg-[#fbfbfd] space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 shrink-0" />
                <strong className="text-sm text-[#1d1d1f]">Cincin Orbit Satelit Ganda</strong>
              </div>
              <p className="text-[#6e6e73] leading-relaxed">
                Menggambarkan perpaduan orbit konstelasi MODIS dan VIIRS yang mengelilingi Bumi dalam sinkronisasi matematis yang harmonis.
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
              {language === 'id' ? 'Sumber Daya Manusia' : 'Human Capital'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight mt-0.5">
              {language === 'id' ? 'Komposisi & Peran Anggota Tim' : 'Team Composition & Core Disciplines'}
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#86868b] bg-[#f5f5f7] px-3.5 py-1.5 rounded-full border border-[#e5e5e7] shrink-0">
            4 Bidang Keahlian
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
            {language === 'id' ? 'Arsitektur Metodologi' : 'Scientific Methodology'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight mt-0.5">
            {language === 'id' ? '4 Inovasi Ilmiah Utama Terra Harmonia' : '4 Core Scientific Innovations'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="p-5 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="p-2.5 w-fit rounded-xl bg-white border border-[#e5e5e7] text-[#1d1d1f]">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1d1d1f] text-sm">Spatial Equal-Area Binning (5.5 km)</h3>
              <p className="text-[#6e6e73] leading-relaxed">
                Pengelompokan grid equal-area 5.5 km menyatukan beberapa piksel tajam VIIRS ke dalam satu footprint MODIS untuk mengeliminasi double-counting.
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">Metrik Spasial</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="p-2.5 w-fit rounded-xl bg-white border border-[#e5e5e7] text-[#1d1d1f]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1d1d1f] text-sm">FRP Power-Law Normalization</h3>
              <p className="text-[#6e6e73] leading-relaxed">
                Transformasi daya matematika menstandarkan intensitas energi radiatif (Megawatt) lintas empat platform satelit NASA secara objektif.
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">Fisika Energi</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="p-2.5 w-fit rounded-xl bg-white border border-[#e5e5e7] text-[#1d1d1f]">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1d1d1f] text-sm">Peatland TMAG -40 cm Early Warning</h3>
              <p className="text-[#6e6e73] leading-relaxed">
                Integrasi ambang batas kritis tinggi muka air tanah gambut (PP No. 71/2014 &amp; BRGM) untuk mencegah bara api bawah tanah (*smoldering*).
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">Mitigasi Lapangan</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="p-2.5 w-fit rounded-xl bg-white border border-[#e5e5e7] text-[#1d1d1f]">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1d1d1f] text-sm">NASA FIRMS 24-Hour Live Feed</h3>
              <p className="text-[#6e6e73] leading-relaxed">
                Sinkronisasi data satelit waktu nyata melalui API resmi NASA FIRMS untuk merespons kejadian titik panas darurat dalam waktu 24 jam.
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">Respon Waktu Nyata</span>
          </div>

        </div>
      </div>

      {/* 6. Full-Width Open Source & Citation Footer */}
      <div className="w-full bg-[#fbfbfd] border border-[#e5e5e7] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-xs">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="font-bold text-sm text-[#1d1d1f] flex items-center justify-center sm:justify-start gap-2">
            <Code2 className="w-4 h-4 text-[#1d1d1f]" />
            <span>Open Science &amp; Open Data Initiative</span>
          </div>
          <p className="text-[#6e6e73] max-w-2xl leading-relaxed">
            Dikembangkan untuk NASA International Space Apps Challenge 2026. Seluruh algoritma, dataset, dan kode sumber terbuka di bawah lisensi MIT untuk mendukung riset global.
          </p>
        </div>

        <a
          href="https://github.com/Rangga11268/TerraHarmonia"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-[#1d1d1f] hover:bg-black text-white font-semibold transition flex items-center gap-2 shadow-xs shrink-0 cursor-pointer"
        >
          <span>GitHub Repository</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
};
