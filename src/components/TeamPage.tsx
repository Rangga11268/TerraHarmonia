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
  Compass,
  CheckCircle2,
  Layers,
  Heart,
  FileText,
  Target,
  Trees,
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
    focusId: 'Perancangan algoritma harmonisasi spasial 5.5 km, pipeline kalibrasi FRP, dan arsitektur web client-side berkinerja tinggi.',
    focusEn: 'Spatial 5.5 km binning algorithm design, FRP cross-sensor calibration pipeline, and high-performance client architecture.',
    tags: ['MODIS & VIIRS', 'GIS / Leaflet', 'React / TypeScript'],
  },
  {
    name: 'Remote Sensing & Data Scientist',
    roleId: 'Spesialis Penginderaan Jauh & Data Satelit',
    roleEn: 'Remote Sensing & Satellite Data Scientist',
    focusId: 'Analisis deret waktu 26 tahun (2000–2026), normalisasi degradasi sensor Terra/Aqua, dan validasi dataset NASA FIRMS.',
    focusEn: '26-year time-series analysis (2000–2026), sensor degradation normalization, and NASA FIRMS dataset validation.',
    tags: ['NASA FIRMS', 'Python / GeoPandas', 'Statistical Modeling'],
  },
  {
    name: 'Peatland Hydrology & Ecology Specialist',
    roleId: 'Peneliti Ekologi Gambut & Mitigasi',
    roleEn: 'Peatland Hydrologist & Fire Ecology Researcher',
    focusId: 'Pemodelan dinamika muka air tanah (TMAG < -40 cm), estimasi emisi karbon CO2e gambut, dan integrasi standar restorasi BRGM.',
    focusEn: 'Groundwater table (TMAG < -40 cm) dynamics modeling, peat CO2e carbon emission metrics, and BRGM regulatory compliance.',
    tags: ['TMAG -40cm', 'Canal Blocking', 'Carbon Accounting'],
  },
  {
    name: 'UI/UX & Human-Centered Interface Designer',
    roleId: 'Desainer Antarmuka & Aksesibilitas',
    roleEn: 'UI/UX & Accessibility Interface Designer',
    focusId: 'Prinsip desain Apple-clean antislop, hierarki visual data ilmiah tanpa distraksi, dan responsivitas bagi komandan lapangan.',
    focusEn: 'Apple-clean antislop design principles, distraction-free scientific data hierarchy, and field responsive layouts.',
    tags: ['Antislop UI', 'Design Systems', 'Responsive GIS'],
  },
];

export const TeamPage: React.FC<TeamPageProps> = ({ language }) => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 animate-in fade-in duration-200">
      
      {/* Top Editorial Breadcrumb & Header */}
      <div className="space-y-2 pt-2 pb-5 border-b border-[#e5e5e7]">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b] flex items-center gap-2">
          <Award className="w-4 h-4 text-[#1d1d1f]" />
          <span>NASA Space Apps Challenge 2026 &bull; Harmonization of MODIS and VIIRS Hot Spots</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight">
          {language === 'id' ? 'Profil Tim, Filosofi & Metodologi' : 'Team Dossier, Philosophy & Methodology'}
        </h1>
        <p className="text-sm sm:text-base text-[#6e6e73] max-w-3xl leading-relaxed">
          {language === 'id'
            ? 'Dokumentasi komprehensif mengenai visi, filosofi nama & logo, tujuan strategis, target audiens, dan tim di balik platform Terra Harmonia.'
            : 'Comprehensive documentation of the vision, brand philosophy, strategic goals, target personas, and multidisciplinary team behind Terra Harmonia.'}
        </p>
      </div>

      {/* Main Feature: Team Group Showcase & Manifesto */}
      <div className="bg-white border border-[#e5e5e7] rounded-3xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Left: High-Res Photo Container */}
        <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[440px] bg-[#1d1d1f] overflow-hidden">
          <img
            src="/team_photo.jpg"
            alt="Team Terra Harmonia"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Terra Harmonia Initiative &bull; Indonesia</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight">
              Team Terra Harmonia
            </h2>
            <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-lg leading-relaxed">
              {language === 'id'
                ? 'Kolaborasi data sains satelit, penginderaan jauh, dan hidrologi gambut untuk perlindungan iklim tropis Indonesia.'
                : 'Pioneering unified wildfire climatology and peatland hydrological defense for Indonesian tropical ecosystems.'}
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
                ? 'Sebelum 2012, pengamatan kebakaran global bergantung pada instrumen MODIS (resolusi 1 km). Peluncuran sensor VIIRS (375 m) menghasilkan lonjakan tajam pada jumlah titik api mentah—bukan karena api meningkat, melainkan karena sensornya jauh lebih tajam. Terra Harmonia hadir untuk menjembatani diskontinuitas struktural ini.'
                : 'Prior to 2012, global active fire detection relied on MODIS (1 km). The launch of VIIRS (375 m) introduced a sharp artificial jump in raw counts due to higher spatial acuity. Terra Harmonia bridges this structural discontinuity into a seamless 26-year record.'}
            </p>

            <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-[#e5e5e7] space-y-2">
              <div className="text-xs font-bold text-[#1d1d1f] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{language === 'id' ? 'Visi Utama Kami' : 'Core Vision'}</span>
              </div>
              <p className="text-xs text-[#6e6e73] leading-relaxed">
                {language === 'id'
                  ? 'Menyediakan satu sumber kebenaran data historis (single source of truth) tanpa bias sensor agar pembuat kebijakan, satgas pemadam, dan peneliti dapat mengambil keputusan yang presisi demi mencapai target Indonesia FOLU Net Sink 2030.'
                  : 'Delivering an un-biased 26-year climatology enabling decision-makers, emergency commanders, and researchers to protect peatlands and achieve Net-Zero targets.'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e5e5e7] flex items-center justify-between text-xs text-[#86868b]">
            <span>Lokasi: Jakarta &bull; Indonesia</span>
            <span>Tahun: 2026</span>
          </div>
        </div>

      </div>

      {/* SECTION 1: FILOSOFI NAMA & FILOSOFI LOGO */}
      <div className="bg-white border border-[#e5e5e7] rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
            {language === 'id' ? 'Identitas & Filosofi' : 'Brand Philosophy & Identity'}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] tracking-tight mt-0.5">
            {language === 'id' ? 'Makna Filosofis Terra Harmonia' : 'The Philosophical Meaning Behind Terra Harmonia'}
          </h2>
          <p className="text-xs sm:text-sm text-[#6e6e73] mt-1 max-w-3xl">
            {language === 'id'
              ? 'Setiap elemen nama dan lambang visual kami dirancang dengan landasan sains geospasial dan komitmen pelestarian bumi.'
              : 'Every naming element and visual emblem is grounded in satellite geodesy and ecological stewardship.'}
          </p>
        </div>

        {/* Name Philosophy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-5 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold text-sm">
                TERRA
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1d1d1f]">Planet Bumi &amp; Satelit NASA Terra</h3>
                <span className="text-[11px] text-[#86868b]">Akar Kata Latin: Tanah / Bumi</span>
              </div>
            </div>
            <p className="text-xs text-[#515154] leading-relaxed">
              {language === 'id'
                ? 'Merujuk pada Planet Bumi (Terra) sekaligus penghormatan kepada satelit legendaris NASA Terra (EOS AM-1) yang diluncurkan pada 1999 dan mengawali era modern pengamatan titik api global menggunakan instrumen MODIS.'
                : 'Refers to planet Earth and pays tribute to NASA’s flagship Terra satellite (EOS AM-1) launched in 1999, which pioneered global MODIS fire monitoring.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm">
                HARMONIA
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1d1d1f]">Harmonisasi &amp; Keselarasan Sensor</h3>
                <span className="text-[11px] text-[#86868b]">Akar Kata Yunani/Latin: Keselarasan Data</span>
              </div>
            </div>
            <p className="text-xs text-[#515154] leading-relaxed">
              {language === 'id'
                ? 'Melambangkan misi utama kami untuk menyelaraskan dua generasi sensor yang berbeda (MODIS 1 km dan VIIRS 375 m) sehingga menghasilkan data deret waktu yang selaras, adil, dan tidak bias selama 26 tahun.'
                : 'Symbolizes our core objective: bringing mathematical harmony and continuity between MODIS and VIIRS across 26 years without sensor shifts.'}
            </p>
          </div>

        </div>

        {/* Logo Philosophy Breakdown */}
        <div className="border-t border-[#e5e5e7] pt-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">
                {language === 'id' ? 'Anatomi & Filosofi Logo Vektor' : 'Logo Emblem Anatomy'}
              </span>
              <p className="text-xs text-[#86868b]">Simbolisme visual murni tanpa latar belakang box (Isolated Pure Vector)</p>
            </div>

            <div className="p-3 bg-[#f5f5f7] rounded-2xl border border-[#e5e5e7] flex items-center gap-3 shrink-0">
              <img src="/favicon.svg" alt="Terra Harmonia Logo" className="w-8 h-8" />
              <div className="text-left text-xs">
                <span className="font-bold text-[#1d1d1f] block leading-none">Terra Harmonia</span>
                <span className="text-[10px] text-[#86868b]">Official Vector Emblem</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            
            <div className="p-4 rounded-xl border border-[#e5e5e7] bg-white space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <strong className="text-[#1d1d1f]">Bulan Sabit Bumi (Biosfer)</strong>
              </div>
              <p className="text-[#6e6e73] leading-relaxed">
                Melambangkan ekosistem lahan basah dan gambut tropis Indonesia yang sangat kaya karbon namun rentan terhadap kekeringan.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#e5e5e7] bg-white space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
                <strong className="text-[#1d1d1f]">Lidah Api Dinamis (FRP)</strong>
              </div>
              <p className="text-[#6e6e73] leading-relaxed">
                Merepresentasikan energi panas radiatif api (*Fire Radiative Power*) yang dipantau dari luar angkasa secara real-time.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#e5e5e7] bg-white space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
                <strong className="text-[#1d1d1f]">Cincin Orbit Satelit Ganda</strong>
              </div>
              <p className="text-[#6e6e73] leading-relaxed">
                Menggambarkan perpaduan orbit konstelasi MODIS dan VIIRS yang berputar selaras mengelilingi Bumi.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* SECTION 2: TUJUAN, GOALS & TARGET AUDIENS */}
      <div className="bg-white border border-[#e5e5e7] rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
            {language === 'id' ? 'Sasaran & Pengguna' : 'Goals & Target Personas'}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] tracking-tight mt-0.5">
            {language === 'id' ? 'Tujuan Platform & 4 Kelompok Target Pengguna' : 'Platform Goals & 4 Core Target Personas'}
          </h2>
          <p className="text-xs sm:text-sm text-[#6e6e73] mt-1 max-w-3xl">
            {language === 'id'
              ? 'Terra Harmonia dibangun untuk memberikan dampak nyata bagi 4 pilar pemangku kepentingan kehutanan dan kebencanaan di Indonesia.'
              : 'Engineered to deliver high-impact intelligence across 4 primary stakeholder groups.'}
          </p>
        </div>

        {/* 4 Persona Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-5 rounded-2xl border border-[#e5e5e7] bg-[#fbfbfd] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white border border-[#e5e5e7] text-blue-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1d1d1f]">1. Komando &amp; Pembuat Kebijakan</h3>
                  <span className="text-[11px] text-[#86868b]">BNPB, Kementerian LHK, BPBD Provinsi</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">Strategis</span>
            </div>
            <p className="text-xs text-[#515154] leading-relaxed">
              <strong>Kebutuhan:</strong> Mengesahkan status siaga darurat karhutla, mengevaluasi moratorium sawit/gambut, dan menerbitkan laporan situasi resmi.
            </p>
            <div className="p-2.5 rounded-lg bg-white border border-[#e5e5e7] text-[11px] text-[#1d1d1f] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Solusi: Dossier Eksekutif SitRep A4 Siap Cetak &amp; Peringatan Anomali Ekstrem</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[#e5e5e7] bg-[#fbfbfd] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white border border-[#e5e5e7] text-red-600">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1d1d1f]">2. Satgas Patroli &amp; Regu Pemadam</h3>
                  <span className="text-[11px] text-[#86868b]">Manggala Agni Daops, MPA Desa, Damkar</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-800 rounded-full">Operasional</span>
            </div>
            <p className="text-xs text-[#515154] leading-relaxed">
              <strong>Kebutuhan:</strong> Mengetahui tinggi muka air tanah gambut (TMAG &lt; -40 cm), status sekat kanal, dan memo penugasan pendinginan lahan.
            </p>
            <div className="p-2.5 rounded-lg bg-white border border-[#e5e5e7] text-[11px] text-[#1d1d1f] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Solusi: Simulator Muka Air Gambut &amp; Generator Nota Briefing Patroli (.TXT)</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[#e5e5e7] bg-[#fbfbfd] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white border border-[#e5e5e7] text-purple-600">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1d1d1f]">3. Peneliti Iklim &amp; Sains Geospasial</h3>
                  <span className="text-[11px] text-[#86868b]">BRIN, BMKG, Akademisi, Komunitas NASA</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">Akademik</span>
            </div>
            <p className="text-xs text-[#515154] leading-relaxed">
              <strong>Kebutuhan:</strong> Menguji deret waktu 26 tahun bebas bias sensor, membandingkan tahun El Niño, dan menghitung emisi karbon.
            </p>
            <div className="p-2.5 rounded-lg bg-white border border-[#e5e5e7] text-[11px] text-[#1d1d1f] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Solusi: Lab Harmonisasi, Komparasi Spasial 2 Tahun, &amp; Kurva Kalibrasi FRP</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[#e5e5e7] bg-[#fbfbfd] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white border border-[#e5e5e7] text-emerald-700">
                  <Trees className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1d1d1f]">4. Auditor Konsesi &amp; Keberlanjutan ESG</h3>
                  <span className="text-[11px] text-[#86868b]">Perkebunan Sawit, HTI, Hutan Adat, RSPO/ISPO</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">Kepatuhan</span>
            </div>
            <p className="text-xs text-[#515154] leading-relaxed">
              <strong>Kebutuhan:</strong> Memeriksa kepatuhan zero-burning dan mendeteksi titik api historis di dalam perimeter izin konsesi.
            </p>
            <div className="p-2.5 rounded-lg bg-white border border-[#e5e5e7] text-[11px] text-[#1d1d1f] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Solusi: Inspektur Poligon Custom GeoJSON &amp; Audit Point-in-Polygon</span>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 3: KOMPOSISI & PERAN ANGGOTA TIM */}
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
          <span className="text-xs font-semibold text-[#86868b] bg-white px-3 py-1 rounded-full border border-[#e5e5e7]">
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

      {/* SECTION 4: 4 PILAR METODOLOGI ILMIAH */}
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
              Pengelompokan grid 5.5 km menyatukan beberapa piksel VIIRS dalam satu footprint MODIS untuk mencegah double-counting.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-white border border-[#e5e5e7] text-[#1d1d1f]">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#1d1d1f] text-sm">FRP Power-Law Calibration</h3>
            <p className="text-[#6e6e73] leading-relaxed">
              Transformasi matematis menstandarkan energi panas (MW) antar sensor Terra, Aqua, Suomi-NPP, dan NOAA-20.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-white border border-[#e5e5e7] text-[#1d1d1f]">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#1d1d1f] text-sm">Peatland Early Warning (TMAG)</h3>
            <p className="text-[#6e6e73] leading-relaxed">
              Integrasi ambang batas kritis muka air tanah gambut -40 cm (PP No. 71/2014 &amp; BRGM) dengan deteksi satelit.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5e7] space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-white border border-[#e5e5e7] text-[#1d1d1f]">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#1d1d1f] text-sm">NASA FIRMS Live Ingestion</h3>
            <p className="text-[#6e6e73] leading-relaxed">
              Sinkronisasi feed satelit 24 jam waktu nyata melalui API resmi NASA FIRMS untuk respon darurat pemadaman.
            </p>
          </div>

        </div>
      </div>

      {/* SECTION 5: OPEN SOURCE & CITATION FOOTER */}
      <div className="bg-[#f5f5f7] border border-[#e5e5e7] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-1 text-center sm:text-left">
          <div className="font-semibold text-[#1d1d1f] flex items-center justify-center sm:justify-start gap-1.5">
            <Code2 className="w-4 h-4 text-[#1d1d1f]" />
            <span>Open Source &amp; Open Science Initiative</span>
          </div>
          <p className="text-[#86868b]">
            Dibuat untuk NASA International Space Apps Challenge 2026. Seluruh algoritma dan kode sumber terbuka di bawah lisensi MIT.
          </p>
        </div>

        <a
          href="https://github.com/Rangga11268/TerraHarmonia"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-[#1d1d1f] hover:bg-black text-white font-semibold transition flex items-center gap-2 shadow-xs shrink-0 cursor-pointer"
        >
          <span>GitHub Repository</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};
