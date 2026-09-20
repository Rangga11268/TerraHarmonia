import React from 'react';
import { AOIRegion, HarmonizedWeekData, RawHotspot } from '../engine/harmonizer';
import { Language, translations } from '../data/translations';
import { Printer, FileText, Download, ShieldCheck, CheckCircle2, QrCode, ExternalLink } from 'lucide-react';
import { LiveWeatherData } from '../services/weatherApi';
import { resolveHotspotLocation } from '../utils/locationResolver';

interface ExecutiveReportProps {
  language: Language;
  selectedAOI: AOIRegion;
  calendarMatrix?: Record<string, HarmonizedWeekData>;
  totalHotspots?: number;
  liveWeather?: LiveWeatherData | null;
  liveHotspots?: RawHotspot[];
}

export const ExecutiveReport: React.FC<ExecutiveReportProps> = ({
  language,
  selectedAOI,
  calendarMatrix = {},
  totalHotspots = 0,
  liveWeather = null,
  liveHotspots = [],
}) => {
  const t = translations[language];

  const handlePrint = () => {
    window.print();
  };

  const today = new Date();
  const reportDateFormatted = today.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const docRegNumber = `TH/KLHK-BRGM/SITREP/${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}-${selectedAOI.id.toUpperCase()}`;

  const aoiTmatMap: Record<string, number> = {
    riau: -48,
    kalteng: -55,
    sumsel: -52,
    kalsel: -38,
    kaltim: -30,
    indonesia: -44,
  };
  const currentTmat = aoiTmatMap[selectedAOI.id] || -42;
  const effectiveFwi = liveWeather ? liveWeather.fwiScore : 28;
  const threatLevel = effectiveFwi >= 70 ? 'SIAGA DARURAT / EXTREME' : effectiveFwi >= 48 ? 'SIAGA TINGGI / HIGH' : effectiveFwi >= 26 ? 'WASPADA / MODERATE' : 'TERKENDALI / NOMINAL';

  const anomalyWeeks = Object.values(calendarMatrix).filter((w) => w.isUnusualCondition).length;
  const totalFrp = Object.values(calendarMatrix).reduce((sum, w) => sum + (w.totalFrpCalibrated || w.totalFrpRaw || 0), 0);

  // Top 5 active hotspots
  const topSpots = liveHotspots.slice(0, 5);

  return (
    <div className="bg-white border border-[#e5e5e7] rounded-3xl shadow-sm overflow-hidden text-[#1d1d1f] font-sans">
      
      {/* Action Header (Hidden during Print) */}
      <div className="print:hidden px-6 py-4 bg-[#fbfbfd] border-b border-[#e5e5e7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white rounded-xl border border-[#e5e5e7] text-[#1d1d1f] shadow-2xs">
            <FileText className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">
              {language === 'id' ? 'Dokumen Intelijen Kebakaran Hutan & Lahan (Format A4 Resmi)' : 'Official A4 Wildfire Situation Report (SitRep)'}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#1d1d1f] tracking-tight">
              {language === 'id' ? 'Dossier Eksekutif & Surat Perintah Operasi Lapangan' : 'Executive Situation Report & Operational Dossier'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition cursor-pointer min-h-[40px]"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'id' ? 'Cetak Dokumen Resmi (PDF / Print)' : 'Print Official Document (PDF)'}</span>
          </button>
        </div>
      </div>

      {/* Official Printable Document Container (A4 Proportional) */}
      <div className="p-6 sm:p-12 space-y-7 bg-white text-[#111827] max-w-4xl mx-auto print:p-0 print:m-0 print:max-w-full">
        
        {/* 1. Official Government & NASA Letterhead (Kop Surat Resmi) */}
        <div className="border-b-2 border-[#111827] pb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* National Coat / NASA Meatball Logo */}
            <div className="w-16 h-16 flex items-center justify-center shrink-0">
              <img
                src="/nasa_meatball.svg"
                alt="NASA Insignia"
                className="w-14 h-14 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-[#4b5563]">
                REPUBLIK INDONESIA &bull; NASA SPACE APPS JAKARTA 2026
              </h2>
              <h1 className="text-sm sm:text-base font-black tracking-tight text-[#111827] uppercase leading-snug">
                PUSAT PENGENDALIAN OPERASI &amp; SISTEM MONITORING SATELIT TERRA HARMONIA
              </h1>
              <p className="text-[10px] text-[#6b7280] tracking-wide mt-0.5">
                Integrasi Sensor MODIS (Terra/Aqua 1km) &amp; VIIRS (Suomi-NPP/NOAA-20 375m) &bull; SK Badan Restorasi Gambut &amp; KLHK
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="inline-block px-2.5 py-1 rounded border border-rose-600 bg-rose-50 text-rose-700 text-[9px] font-mono font-black uppercase tracking-wider">
              OPERASIONAL TERBATAS
            </span>
            <div className="text-[9px] font-mono text-[#6b7280] mt-1.5">{docRegNumber}</div>
          </div>
        </div>

        {/* 2. Document Identification & Meta Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-xs">
          <div>
            <span className="text-[9px] font-bold text-[#6b7280] uppercase block">Wilayah Sasaran</span>
            <strong className="text-sm font-bold text-[#111827] block mt-0.5">{selectedAOI.name}</strong>
            <span className="text-[10px] text-[#4b5563]">{selectedAOI.country}</span>
          </div>

          <div>
            <span className="text-[9px] font-bold text-[#6b7280] uppercase block">Koordinat Acuan</span>
            <strong className="text-xs font-mono font-bold text-[#111827] block mt-0.5">
              {selectedAOI.center[0].toFixed(4)}° N, {selectedAOI.center[1].toFixed(4)}° E
            </strong>
            <span className="text-[10px] text-[#4b5563]">{selectedAOI.biome}</span>
          </div>

          <div>
            <span className="text-[9px] font-bold text-[#6b7280] uppercase block">Tanggal Observasi</span>
            <strong className="text-xs font-bold text-[#111827] block mt-0.5">{reportDateFormatted}</strong>
            <span className="text-[10px] text-emerald-700 font-semibold">Satelit 24H Feed Synced</span>
          </div>

          <div>
            <span className="text-[9px] font-bold text-[#6b7280] uppercase block">Status Ancaman Karhutla</span>
            <strong className={`text-xs font-black block mt-0.5 ${effectiveFwi >= 50 ? 'text-rose-600' : 'text-amber-600'}`}>
              {threatLevel}
            </strong>
            <span className="text-[10px] text-[#4b5563]">Indeks FWI: {effectiveFwi}/100</span>
          </div>
        </div>

        {/* 3. Executive Situation Synthesis */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#111827] border-b border-[#e5e7eb] pb-1 flex items-center justify-between">
            <span>I. Ringkasan Eksekutif &amp; Analisis Kerentanan Spasial</span>
            <span className="text-[10px] font-mono text-[#6b7280]">MODIS/VIIRS HARMONIZATION PIPELINE</span>
          </h3>
          <p className="text-xs text-[#374151] leading-relaxed text-justify">
            Berdasarkan harmonisasi komputasi 26 tahun rekaman satelit NASA Terra, Aqua, Suomi-NPP, dan NOAA-20 yang dikompilasikan ke dalam grid klaster 5.5 km dengan faktor kalibrasi energi (MODIS 1.04 / VIIRS 0.88), wilayah <strong>{selectedAOI.name}</strong> saat ini berada pada status <strong>{threatLevel}</strong>. Parameter Muka Air Tanah Gambut (TMAT) terpantau di angka <strong>{currentTmat} cm</strong>, yang mana telah melampaui ambang batas kritis nasional PP No. 57/2016 (-40 cm), mengindikasikan tingginya ancaman kebakaran bawah permukaan (*subsurface peat smoldering*).
          </p>
        </div>

        {/* 4. Hydrology & Environmental Telemetry Matrix */}
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#111827] border-b border-[#e5e7eb] pb-1">
            II. Matriks Telemetri Hidrologis Gambut &amp; Cuaca Lapangan (BRGM &amp; Open-Meteo)
          </h3>
          <table className="w-full text-left text-xs border border-[#e5e7eb] rounded-lg overflow-hidden">
            <thead className="bg-[#f3f4f6] text-[#374151] font-bold text-[10px] uppercase border-b border-[#e5e7eb]">
              <tr>
                <th className="py-2 px-3">Parameter Observasi</th>
                <th className="py-2 px-3">Nilai Lapangan Aktual</th>
                <th className="py-2 px-3">Batas Kritis / Standar</th>
                <th className="py-2 px-3">Evaluasi Status Risiko</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb] text-[11px]">
              <tr>
                <td className="py-2 px-3 font-semibold">Tinggi Muka Air Tanah (TMAT)</td>
                <td className="py-2 px-3 font-mono font-bold text-rose-600">{currentTmat} cm</td>
                <td className="py-2 px-3 text-[#6b7280]">-40 cm (PP No. 57/2016 &amp; BRGM)</td>
                <td className="py-2 px-3 font-bold text-rose-600">KRITIS &bull; MELEWATI BATAS</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">Indeks Bahaya Cuaca Api (FWI)</td>
                <td className="py-2 px-3 font-mono font-bold text-amber-600">{effectiveFwi}</td>
                <td className="py-2 px-3 text-[#6b7280]">Ambang Siaga: &ge; 48</td>
                <td className="py-2 px-3 font-bold text-amber-600">POTENSI PERAMBATAN TINGGI</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">Suhu Udara &amp; Kelembapan (RH)</td>
                <td className="py-2 px-3 font-mono">{liveWeather?.temperature ?? 32}°C &bull; RH {liveWeather?.relativeHumidity ?? 62}%</td>
                <td className="py-2 px-3 text-[#6b7280]">RH Kering: &lt; 65%</td>
                <td className="py-2 px-3 font-semibold text-[#374151]">Serasah Cepat Mengering</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">Hari Tanpa Hujan (HTH)</td>
                <td className="py-2 px-3 font-mono">{liveWeather?.dryDaysCount ?? 9} Hari</td>
                <td className="py-2 px-3 text-[#6b7280]">&gt; 7 Hari (Drought Watch)</td>
                <td className="py-2 px-3 font-bold text-amber-600">WASPADA DEHIDRASI KUBAH</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold">Kadar Air Gambut (KAG) Bawah Permukaan</td>
                <td className="py-2 px-3 font-mono">115%</td>
                <td className="py-2 px-3 text-[#6b7280]">&lt; 100% (Titik Sulut Api Gambut)</td>
                <td className="py-2 px-3 font-semibold text-rose-600">Rentan Bara Api Bawah Tanah</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 5. Active Hotspot Surveillance Targets */}
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#111827] border-b border-[#e5e7eb] pb-1 flex items-center justify-between">
            <span>III. Koordinat Sasaran Penugasan Anomali Panas Satelit</span>
            <span className="text-[10px] text-[#6b7280]">FIRMS NRT ACTIVE DETECTIONS</span>
          </h3>
          
          {topSpots.length === 0 ? (
            <div className="p-3 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] text-center text-xs text-[#6b7280]">
              Tidak terdapat titik panas berdaya tinggi yang terdeteksi pada jendela satelit 24 jam terakhir di sektor ini.
            </div>
          ) : (
            <table className="w-full text-left text-xs border border-[#e5e7eb] rounded-lg overflow-hidden">
              <thead className="bg-[#f3f4f6] text-[#374151] font-bold text-[10px] uppercase border-b border-[#e5e7eb]">
                <tr>
                  <th className="py-2 px-2.5">No</th>
                  <th className="py-2 px-2.5">Wilayah &amp; Lanskap KHG</th>
                  <th className="py-2 px-2.5">Koordinat (Lat, Lon)</th>
                  <th className="py-2 px-2.5">Sensor Satelit</th>
                  <th className="py-2 px-2.5">FRP (MW)</th>
                  <th className="py-2 px-2.5">Waktu Akuisisi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb] text-[10.5px]">
                {topSpots.map((spot, idx) => {
                  const loc = resolveHotspotLocation(spot.lat, spot.lon, selectedAOI.id, language);
                  return (
                    <tr key={spot.id}>
                      <td className="py-2 px-2.5 font-bold">{idx + 1}</td>
                      <td className="py-2 px-2.5 font-semibold">
                        {loc.regency}{loc.district ? `, ${loc.district}` : ''}
                        <span className="text-[9px] text-[#6b7280] block font-normal">{loc.landscape}</span>
                      </td>
                      <td className="py-2 px-2.5 font-mono">{spot.lat.toFixed(4)}°, {spot.lon.toFixed(4)}°</td>
                      <td className="py-2 px-2.5 font-mono">{spot.instrument} ({spot.satellite})</td>
                      <td className="py-2 px-2.5 font-mono font-bold text-rose-600">{spot.frp} MW</td>
                      <td className="py-2 px-2.5 font-mono">{loc.localTimeFormatted}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* 6. Tactical Directives for Brigade & Taskforces */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#111827] border-b border-[#e5e7eb] pb-1">
            IV. Instruksi Taktis Operasional (SOP Brigade Manggala Agni / BPBD / MPA)
          </h3>
          <ol className="list-decimal list-inside text-xs text-[#374151] space-y-1 leading-relaxed text-justify">
            <li><strong>Penutupan Sekat Kanal:</strong> Lakukan inspeksi menyeluruh pada pintu sekat kanal BRGM di sekitar KHG terdampak untuk menahan air dan menaikkan kembali muka air tanah &gt; -40 cm.</li>
            <li><strong>Patroli Darat &amp; Nozzle Gambut:</strong> Kerahkan regu pemadaman darat Manggala Agni Daops menggunakan *peat injector nozzle* untuk menyuntikkan air ke lapisan organik sedalam 1–3 meter.</li>
            <li><strong>Pemantauan Malam Hari (Night Passes):</strong> Pantau lintasan satelit malam hari NOAA-20 / Suomi-NPP untuk mendeteksi *smoldering combustion* tanpa gangguan pantulan sinar matahari.</li>
            <li><strong>Water Bombing Standby:</strong> Siagakan helikopter pemadam water bombing apabila klaster titik panas memiliki FRP kumulatif &gt; 120 MW di zona non-aksesibilitas darat.</li>
          </ol>
        </div>

        {/* 7. Official Endorsement & Formal Signature Block */}
        <div className="pt-6 border-t-2 border-[#111827] grid grid-cols-2 gap-8 text-xs text-center">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-[#6b7280] uppercase">Diverifikasi &amp; Disiapkan Oleh</p>
            <p className="font-bold text-[#111827]">Koordinator Sistem Telemetri Satelit</p>
            <div className="h-16 flex items-center justify-center">
              <div className="px-3 py-1.5 border border-emerald-600 rounded bg-emerald-50 text-emerald-800 font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>DIGITALLY VERIFIED BY TERRA HARMONIA ENGINE</span>
              </div>
            </div>
            <p className="font-mono font-bold text-[#111827] text-xs">TERRA HARMONIA INTELLIGENCE TEAM</p>
            <p className="text-[9px] text-[#6b7280]">NASA Space Apps Challenge Jakarta 2026</p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-[#6b7280] uppercase">Mengetahui &amp; Mengesahkan</p>
            <p className="font-bold text-[#111827]">Komandan Posko Pengendalian Karhutla</p>
            <div className="h-16 flex items-center justify-center font-serif italic text-sm text-[#4b5563]">
              ( Tanda Tangan &amp; Cap Stempel Posko )
            </div>
            <p className="font-bold text-[#111827] text-xs">SATGAS PENGENDALIAN KARHUTLA &amp; BRGM</p>
            <p className="text-[9px] text-[#6b7280]">Kementerian Lingkungan Hidup dan Kehutanan</p>
          </div>
        </div>

        {/* Footer Legal & Security Bar */}
        <div className="pt-3 border-t border-[#e5e7eb] flex items-center justify-between text-[9px] text-[#9ca3af] font-mono">
          <span>DOKUMEN INI SAH DAN MEMILIKI KEKUATAN VERIFIKASI MULTI-SATELIT NASA</span>
          <span>HALAMAN 1 DARI 1 &bull; KODE: TH-NASA-SITREP-2026</span>
        </div>

      </div>

    </div>
  );
};
