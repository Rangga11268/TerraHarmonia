import React from 'react';
import { AOIRegion, HarmonizedWeekData } from '../engine/harmonizer';
import { Language } from '../data/translations';
import { Printer, FileText, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ExecutiveReportProps {
  language: Language;
  selectedAOI: AOIRegion;
  calendarMatrix: Record<string, HarmonizedWeekData>;
  totalHotspots: number;
}

export const ExecutiveReport: React.FC<ExecutiveReportProps> = ({
  language,
  selectedAOI,
  calendarMatrix,
  totalHotspots,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const reportDate = new Date().toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const anomalyWeeks = Object.values(calendarMatrix).filter((w) => w.isUnusualCondition).length;
  const totalFrp = Object.values(calendarMatrix).reduce((sum, w) => sum + (w.totalFrpCalibrated || w.totalFrpRaw || 0), 0);

  return (
    <div className="bg-white border border-[#e5e5e7] rounded-3xl shadow-xs overflow-hidden transition-all">
      
      {/* Action Header */}
      <div className="print:hidden px-6 py-4 bg-[#fbfbfd] border-b border-[#e5e5e7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl border border-[#e5e5e7] text-[#1d1d1f]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">
              {language === 'id' ? 'Dokumen Intelijen Kebakaran A4' : 'A4 Intelligence Dossier'}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#1d1d1f] tracking-tight">
              {language === 'id' ? 'Dossier Eksekutif SitRep Lapangan' : 'Field Operational Situation Report (SitRep)'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'id' ? 'Cetak / Ekspor PDF Resmi' : 'Print / Export Official PDF'}</span>
          </button>
        </div>
      </div>

      {/* Official Letterhead Dossier Body */}
      <div className="p-6 sm:p-10 space-y-6 text-[#1d1d1f] font-sans">
        
        {/* Header Letterhead */}
        <div className="border-b-2 border-[#1d1d1f] pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">
              TERRA HARMONIA INTELLIGENCE DOSSIER &bull; REF: TH-SITREP-2026
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f] mt-1">
              LAPORAN SITUASI INTELIJEN KEBAKARAN HUTAN & LAHAN
            </h1>
            <p className="text-xs text-[#6e6e73] mt-0.5">
              Harmonisasi Sensor Multi-Satelit MODIS &amp; VIIRS (2000–2026)
            </p>
          </div>

          <div className="text-left sm:text-right text-xs">
            <div className="font-semibold text-[#1d1d1f]">{reportDate}</div>
            <div className="text-[#86868b] text-[11px]">Klasifikasi: TERBUKA / RESMI</div>
          </div>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#fbfbfd] border border-[#e5e5e7] rounded-xl text-xs">
          <div>
            <span className="text-[10px] font-semibold text-[#86868b] uppercase">Wilayah Pengamatan</span>
            <p className="font-bold text-[#1d1d1f] mt-0.5 text-sm">{selectedAOI.name}</p>
            <p className="text-[11px] text-[#86868b]">{selectedAOI.country}</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-[#86868b] uppercase">Ekosistem &amp; Bioma</span>
            <p className="font-bold text-[#1d1d1f] mt-0.5 text-sm">{selectedAOI.biome}</p>
            <p className="text-[11px] text-[#86868b]">Kedalaman Gambut: &gt;300 cm</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-[#86868b] uppercase">Total Titik Panas (26 Thn)</span>
            <p className="font-bold text-[#1d1d1f] mt-0.5 text-sm num">{totalHotspots.toLocaleString()}</p>
            <p className="text-[11px] text-orange-600 font-medium">{anomalyWeeks} Minggu Anomali Ekstrem</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-[#86868b] uppercase">Indeks Radiatif (FRP)</span>
            <p className="font-bold text-[#1d1d1f] mt-0.5 text-sm num">{Math.round(totalFrp).toLocaleString()} MW</p>
            <p className="text-[11px] text-[#86868b]">Resolusi Grid: 5.5 km</p>
          </div>
        </div>

        {/* Section 1 */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1d1d1f] border-b border-[#e5e5e7] pb-1">
            1. Ringkasan Eksekutif &amp; Status Risiko
          </h3>
          <p className="text-xs text-[#3a3a3c] leading-relaxed">
            Berdasarkan harmonisasi deret waktu satelit NASA Terra, Aqua, Suomi-NPP, dan NOAA-20 selama 26 tahun, wilayah <strong>{selectedAOI.name}</strong> menunjukkan pola kerentanan musiman tinggi pada rentang Minggu ke-32 hingga Minggu ke-42 setiap tahunnya. Kejadian El Niño ekstrem terbukti melipatgandakan intensitas radiative power hingga 400% di atas baseline normal.
          </p>
        </div>

        {/* Section 2: Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1d1d1f] border-b border-[#e5e5e7] pb-1">
            2. Matriks Kerentanan Hidrologis Gambut
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#e5e5e7] rounded-lg overflow-hidden">
              <thead className="bg-[#f5f5f7] border-b border-[#e5e5e7] text-[#6e6e73]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Parameter Hidrologis</th>
                  <th className="py-2.5 px-3 font-semibold">Nilai Pengukuran</th>
                  <th className="py-2.5 px-3 font-semibold">Ambang Batas Kritis</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e7]">
                <tr>
                  <td className="py-2.5 px-3 font-medium">Tinggi Muka Air Tanah (TMAG)</td>
                  <td className="py-2.5 px-3 num">-48 cm</td>
                  <td className="py-2.5 px-3 text-[#86868b]">-40 cm (PP No. 71/2014)</td>
                  <td className="py-2.5 px-3 text-red-600 font-bold">RAWAN / MELEBIHI BATAS</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">Hari Tanpa Hujan (HTH)</td>
                  <td className="py-2.5 px-3 num">14 Hari</td>
                  <td className="py-2.5 px-3 text-[#86868b]">&gt; 10 Hari</td>
                  <td className="py-2.5 px-3 text-orange-600 font-bold">WASPADA TINGGI</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">Kadar Air Serasah Bawah Permukaan</td>
                  <td className="py-2.5 px-3 num">110%</td>
                  <td className="py-2.5 px-3 text-[#86868b]">&lt; 150%</td>
                  <td className="py-2.5 px-3 text-red-600 font-bold">SMOLDERING RISK</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">Kerapatan Sekat Kanal Operasional</td>
                  <td className="py-2.5 px-3 num">142 Titik Pantau</td>
                  <td className="py-2.5 px-3 text-[#86868b]">Min. 120 Titik / Kesatuan KHG</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">TERPENUHI</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Directives */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1d1d1f] border-b border-[#e5e5e7] pb-1">
            3. Arahan Operasional Komando Lapangan (BNPB / Manggala Agni / BPBD)
          </h3>
          <ul className="list-disc list-inside text-xs text-[#3a3a3c] space-y-1.5 leading-relaxed">
            <li><strong>Prioritas Pembasahan:</strong> Aktifkan pompa air dan tutup sekat kanal di zona gambut berkedalaman &gt;3 meter untuk menaikkan muka air tanah ke batas aman &gt; -40 cm.</li>
            <li><strong>Patroli Darat Mandiri:</strong> Kerahkan regu Manggala Agni Daops terdekat dan Masyarakat Peduli Api (MPA) untuk menyisir bekas titik panas historis.</li>
            <li><strong>Deteksi Asap Bawah Permukaan:</strong> Gunakan thermal probe untuk mengidentifikasi perambatan bara api tanpa nyala (smoldering) sebelum mencapai lapisan tajuk pohon.</li>
            <li><strong>Kesiapsiagaan Water Bombing:</strong> Siagakan armada helikopter pemadam apabila FRP harmonisasi melebihi 150 MW dalam jendela 48 jam.</li>
          </ul>
        </div>

        {/* Signatures */}
        <div className="pt-6 border-t border-[#e5e5e7] grid grid-cols-2 gap-8 text-xs text-center">
          <div>
            <p className="text-[11px] text-[#86868b]">Disiapkan Oleh Tim Analisis Data</p>
            <div className="h-12 flex items-center justify-center font-serif italic text-sm text-[#1d1d1f]">
              Terra Harmonia System
            </div>
            <p className="font-semibold text-[#1d1d1f]">Sistem Intelijen Satelit NASA</p>
          </div>
          <div>
            <p className="text-[11px] text-[#86868b]">Mengetahui &amp; Disahkan</p>
            <div className="h-12 flex items-center justify-center font-serif italic text-sm text-[#1d1d1f]">
              Komandan Satgas Operasi
            </div>
            <p className="font-semibold text-[#1d1d1f]">Pusat Pengendalian Karhutla</p>
          </div>
        </div>

      </div>

    </div>
  );
};
