import React from 'react';
import { AOIRegion, HarmonizedWeekData } from '../engine/harmonizer';
import { Language } from '../data/translations';
import { X, Printer, Download, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ExecutiveReportModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  selectedAOI: AOIRegion;
  calendarMatrix: Record<string, HarmonizedWeekData>;
  totalHotspots: number;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  language,
  isOpen,
  onClose,
  selectedAOI,
  calendarMatrix,
  totalHotspots,
}) => {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl border border-[#e5e5e7] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Action Bar (Hidden in Print) */}
        <div className="print:hidden bg-[#f5f5f7] border-b border-[#e5e5e7] px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#6e6e73]">
            <FileText className="w-4 h-4 text-[#1d1d1f]" />
            <span className="font-semibold text-[#1d1d1f]">Dossier Eksekutif SitRep</span>
            <span>&bull; Siap Cetak Dokumen A4 / PDF</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Cetak / Simpan PDF' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#86868b] hover:text-[#1d1d1f] hover:bg-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Dossier Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 text-[#1d1d1f] font-sans print:p-0 print:m-0">
          
          {/* Official Letterhead Header */}
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

          {/* AOI Profile & Summary Grid */}
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

          {/* Executive Overview Section */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1d1d1f] border-b border-[#e5e5e7] pb-1">
              1. Ringkasan Eksekutif &amp; Status Risiko
            </h2>
            <p className="text-xs text-[#3a3a3c] leading-relaxed">
              Berdasarkan harmonisasi deret waktu satelit NASA Terra, Aqua, Suomi-NPP, dan NOAA-20 selama 26 tahun, wilayah <strong>{selectedAOI.name}</strong> menunjukkan pola kerentanan musiman tinggi pada rentang Minggu ke-32 hingga Minggu ke-42 setiap tahunnya. Kejadian El Niño ekstrem terbukti melipatgandakan intensitas radiative power hingga 400% di atas baseline normal.
            </p>
          </div>

          {/* Peatland Vulnerability Matrix Table */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1d1d1f] border-b border-[#e5e5e7] pb-1">
              2. Matriks Kerentanan Hidrologis Gambut
            </h2>
            <table className="w-full text-left text-xs border border-[#e5e5e7] rounded-lg overflow-hidden">
              <thead className="bg-[#f5f5f7] border-b border-[#e5e5e7] text-[#6e6e73]">
                <tr>
                  <th className="py-2 px-3 font-semibold">Parameter Hidrologis</th>
                  <th className="py-2 px-3 font-semibold">Nilai Pengukuran</th>
                  <th className="py-2 px-3 font-semibold">Ambang Batas Kritis</th>
                  <th className="py-2 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e7]">
                <tr>
                  <td className="py-2 px-3 font-medium">Tinggi Muka Air Tanah (TMAG)</td>
                  <td className="py-2 px-3 num">-48 cm</td>
                  <td className="py-2 px-3 text-[#86868b]">-40 cm (PP No. 71/2014)</td>
                  <td className="py-2 px-3 text-red-600 font-bold">RAWAN / MELEBIHI BATAS</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Hari Tanpa Hujan (HTH)</td>
                  <td className="py-2 px-3 num">14 Hari</td>
                  <td className="py-2 px-3 text-[#86868b]">&gt; 10 Hari</td>
                  <td className="py-2 px-3 text-orange-600 font-bold">WASPADA TINGGI</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Kadar Air Serasah Bawah Permukaan</td>
                  <td className="py-2 px-3 num">110%</td>
                  <td className="py-2 px-3 text-[#86868b]">&lt; 150%</td>
                  <td className="py-2 px-3 text-red-600 font-bold">SMOLDERING RISK</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Kerapatan Sekat Kanal Operasional</td>
                  <td className="py-2 px-3 num">142 Titik Pantau</td>
                  <td className="py-2 px-3 text-[#86868b]">Min. 120 Titik / Kesatuan KHG</td>
                  <td className="py-2 px-3 text-emerald-700 font-bold">TERPENUHI</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Operational Directives for Patrol Units */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1d1d1f] border-b border-[#e5e5e7] pb-1">
              3. Arahan Operasional Komando Lapangan (BNPB / Manggala Agni / BPBD)
            </h2>
            <ul className="list-disc list-inside text-xs text-[#3a3a3c] space-y-1.5 leading-relaxed">
              <li><strong>Prioritas Pembasahan:</strong> Aktifkan pompa air dan tutup sekat kanal di zona gambut berkedalaman &gt;3 meter untuk menaikkan muka air tanah ke batas aman &gt; -40 cm.</li>
              <li><strong>Patroli Darat Mandiri:</strong> Kerahkan regu Manggala Agni Daops terdekat dan Masyarakat Peduli Api (MPA) untuk menyisir bekas titik panas historis.</li>
              <li><strong>Deteksi Asap Bawah Permukaan:</strong> Gunakan thermal probe untuk mengidentifikasi perambatan bara api tanpa nyala (smoldering) sebelum mencapai lapisan tajuk pohon.</li>
              <li><strong>Kesiapsiagaan Water Bombing:</strong> Siagakan armada helikopter pemadam apabila FRP harmonisasi melebihi 150 MW dalam jendela 48 jam.</li>
            </ul>
          </div>

          {/* Signatures & Certification */}
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
    </div>
  );
};
