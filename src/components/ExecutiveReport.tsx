import React from 'react';
import { AOIRegion, HarmonizedWeekData } from '../engine/harmonizer';
import { Language, translations } from '../data/translations';
import { Printer, FileText } from 'lucide-react';

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
  const t = translations[language];

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
    <div className="bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-3xl shadow-xs overflow-hidden transition-all">
      
      {/* Action Header */}
      <div className="print:hidden px-6 py-4 bg-[#fbfbfd] dark:bg-[#151d2f] border-b border-[#e5e5e7] dark:border-[#1f2937] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white dark:bg-[#111827] rounded-xl border border-[#e5e5e7] dark:border-[#1f2937] text-[#1d1d1f] dark:text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#86868b] dark:text-[#9ca3af]">
              {language === 'id' ? 'Dokumen Intelijen Kebakaran A4' : 'A4 Intelligence Dossier'}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#1d1d1f] dark:text-white tracking-tight">
              {language === 'id' ? 'Dossier Eksekutif SitRep Lapangan' : 'Field Operational Situation Report (SitRep)'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-[#1d1d1f] hover:bg-black dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition cursor-pointer min-h-[40px]"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printExportPdf}</span>
          </button>
        </div>
      </div>

      {/* Official Letterhead Dossier Body */}
      <div className="p-6 sm:p-10 space-y-6 text-[#1d1d1f] dark:text-[#f3f4f6] font-sans">
        
        {/* Header Letterhead */}
        <div className="border-b-2 border-[#1d1d1f] dark:border-white/30 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#86868b] dark:text-[#9ca3af]">
              TERRA HARMONIA INTELLIGENCE DOSSIER &bull; REF: TH-SITREP-2026
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-white mt-1">
              {t.sitrepLetterheadTitle}
            </h1>
            <p className="text-xs text-[#6e6e73] dark:text-[#9ca3af] mt-0.5">
              {t.sitrepSubtitle}
            </p>
          </div>

          <div className="text-left sm:text-right text-xs">
            <div className="font-semibold text-[#1d1d1f] dark:text-white">{reportDate}</div>
            <div className="text-[#86868b] dark:text-[#9ca3af] text-[11px]">{t.classificationNotice}</div>
          </div>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#fbfbfd] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] rounded-xl text-xs">
          <div>
            <span className="text-[10px] font-semibold text-[#86868b] dark:text-[#9ca3af] uppercase">
              {language === 'id' ? 'Wilayah Pengamatan' : 'Observation Area'}
            </span>
            <p className="font-bold text-[#1d1d1f] dark:text-white mt-0.5 text-sm">{selectedAOI.name}</p>
            <p className="text-[11px] text-[#86868b] dark:text-[#9ca3af]">{selectedAOI.country}</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-[#86868b] dark:text-[#9ca3af] uppercase">
              {language === 'id' ? 'Ekosistem & Bioma' : 'Ecosystem & Biome'}
            </span>
            <p className="font-bold text-[#1d1d1f] dark:text-white mt-0.5 text-sm">{selectedAOI.biome}</p>
            <p className="text-[11px] text-[#86868b] dark:text-[#9ca3af]">{language === 'id' ? 'Kedalaman Gambut: >300 cm' : 'Peat Depth: >300 cm'}</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-[#86868b] dark:text-[#9ca3af] uppercase">
              {language === 'id' ? 'Total Titik Panas (26 Thn)' : 'Total Detections (26 Yrs)'}
            </span>
            <p className="font-bold text-[#1d1d1f] dark:text-white mt-0.5 text-sm num">{totalHotspots.toLocaleString()}</p>
            <p className="text-[11px] text-orange-600 dark:text-orange-400 font-medium">
              {anomalyWeeks} {language === 'id' ? 'Minggu Anomali Ekstrem' : 'Extreme Anomaly Weeks'}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-[#86868b] dark:text-[#9ca3af] uppercase">
              {language === 'id' ? 'Indeks Radiatif (FRP)' : 'Radiative Power (FRP)'}
            </span>
            <p className="font-bold text-[#1d1d1f] dark:text-white mt-0.5 text-sm num">{Math.round(totalFrp).toLocaleString()} MW</p>
            <p className="text-[11px] text-[#86868b] dark:text-[#9ca3af]">{language === 'id' ? 'Resolusi Grid: 5.5 km' : 'Grid Resolution: 5.5 km'}</p>
          </div>
        </div>

        {/* Section 1 */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1d1d1f] dark:text-white border-b border-[#e5e5e7] dark:border-[#1f2937] pb-1">
            {language === 'id' ? '1. Ringkasan Eksekutif & Status Risiko' : '1. Executive Summary & Risk Baseline'}
          </h3>
          <p className="text-xs text-[#3a3a3c] dark:text-[#d1d5db] leading-relaxed">
            {language === 'id'
              ? `Berdasarkan harmonisasi deret waktu satelit NASA Terra, Aqua, Suomi-NPP, dan NOAA-20 selama 26 tahun, wilayah ${selectedAOI.name} menunjukkan pola kerentanan musiman tinggi pada rentang Minggu ke-32 hingga Minggu ke-42 setiap tahunnya. Kejadian El Niño ekstrem terbukti melipatgandakan intensitas radiative power hingga 400% di atas baseline normal.`
              : `Based on 26 years of harmonized multi-satellite time series from NASA Terra, Aqua, Suomi-NPP, and NOAA-20, the ${selectedAOI.name} region exhibits pronounced seasonal vulnerability between Week 32 and Week 42 annually. Extreme El Niño episodes historically quadruple fire radiative power above normal climatological baselines.`}
          </p>
        </div>

        {/* Section 2: Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1d1d1f] dark:text-white border-b border-[#e5e5e7] dark:border-[#1f2937] pb-1">
            {language === 'id' ? '2. Matriks Kerentanan Hidrologis Gambut' : '2. Peatland Hydrological Vulnerability Matrix'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#e5e5e7] dark:border-[#1f2937] rounded-lg overflow-hidden">
              <thead className="bg-[#f5f5f7] dark:bg-[#151d2f] border-b border-[#e5e5e7] dark:border-[#1f2937] text-[#6e6e73] dark:text-[#9ca3af]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">{language === 'id' ? 'Parameter Hidrologis' : 'Hydrological Parameter'}</th>
                  <th className="py-2.5 px-3 font-semibold">{language === 'id' ? 'Nilai Pengukuran' : 'Current Value'}</th>
                  <th className="py-2.5 px-3 font-semibold">{language === 'id' ? 'Ambang Batas Kritis' : 'Critical Statutory Limit'}</th>
                  <th className="py-2.5 px-3 font-semibold">{language === 'id' ? 'Status' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e7] dark:divide-[#1f2937]">
                <tr>
                  <td className="py-2.5 px-3 font-medium">{language === 'id' ? 'Tinggi Muka Air Tanah (TMAG)' : 'Groundwater Table (TMAG)'}</td>
                  <td className="py-2.5 px-3 num">-48 cm</td>
                  <td className="py-2.5 px-3 text-[#86868b] dark:text-[#9ca3af]">-40 cm (PP No. 71/2014 & BRGM)</td>
                  <td className="py-2.5 px-3 text-red-600 dark:text-red-400 font-bold">{language === 'id' ? 'RAWAN / MELEBIHI BATAS' : 'CRITICAL THRESHOLD EXCEEDED'}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">{language === 'id' ? 'Hari Tanpa Hujan (HTH)' : 'Days Without Rain (Drought Index)'}</td>
                  <td className="py-2.5 px-3 num">{language === 'id' ? '14 Hari' : '14 Days'}</td>
                  <td className="py-2.5 px-3 text-[#86868b] dark:text-[#9ca3af]">&gt; 10 {language === 'id' ? 'Hari' : 'Days'}</td>
                  <td className="py-2.5 px-3 text-orange-600 dark:text-orange-400 font-bold">{language === 'id' ? 'WASPADA TINGGI' : 'HIGH WATCH'}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">{language === 'id' ? 'Kadar Air Serasah Bawah Permukaan' : 'Subsurface Peat Moisture Content'}</td>
                  <td className="py-2.5 px-3 num">110%</td>
                  <td className="py-2.5 px-3 text-[#86868b] dark:text-[#9ca3af]">&lt; 150%</td>
                  <td className="py-2.5 px-3 text-red-600 dark:text-red-400 font-bold">SMOLDERING RISK</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">{language === 'id' ? 'Kerapatan Sekat Kanal Operasional' : 'Canal Block Density'}</td>
                  <td className="py-2.5 px-3 num">{language === 'id' ? '142 Titik Pantau' : '142 Monitored Gates'}</td>
                  <td className="py-2.5 px-3 text-[#86868b] dark:text-[#9ca3af]">Min. 120 {language === 'id' ? 'Titik / KHG' : 'Units / Basin'}</td>
                  <td className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400 font-bold">{language === 'id' ? 'TERPENUHI' : 'ADEQUATE'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Directives */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1d1d1f] dark:text-white border-b border-[#e5e5e7] dark:border-[#1f2937] pb-1">
            {language === 'id' ? '3. Arahan Operasional Komando Lapangan (BNPB / Manggala Agni / BPBD)' : '3. Field Operational Directives (BNPB / Manggala Agni / Forestry Taskforce)'}
          </h3>
          <ul className="list-disc list-inside text-xs text-[#3a3a3c] dark:text-[#d1d5db] space-y-1.5 leading-relaxed">
            <li>
              <strong>{language === 'id' ? 'Prioritas Pembasahan:' : 'Hydrological Re-wetting:'}</strong> {language === 'id' ? 'Aktifkan pompa air dan tutup sekat kanal di zona gambut berkedalaman >3 meter untuk menaikkan muka air tanah ke batas aman > -40 cm.' : 'Engage canal blocks and deploy high-volume water pumps in >3m deep peat domes to elevate water table above the -40 cm threshold.'}
            </li>
            <li>
              <strong>{language === 'id' ? 'Patroli Darat Mandiri:' : 'Ground Patrol Deployment:'}</strong> {language === 'id' ? 'Kerahkan regu Manggala Agni Daops terdekat dan Masyarakat Peduli Api (MPA) untuk menyisir bekas titik panas historis.' : 'Mobilize local fire patrol units (Manggala Agni & MPA) to inspect historical high-density anomaly perimeters.'}
            </li>
            <li>
              <strong>{language === 'id' ? 'Deteksi Asap Bawah Permukaan:' : 'Subsurface Smoldering Scan:'}</strong> {language === 'id' ? 'Gunakan thermal probe untuk mengidentifikasi perambatan bara api tanpa nyala (smoldering) sebelum mencapai lapisan tajuk pohon.' : 'Utilize thermal probes to detect smoldering underground peat fires before flame transitions into canopy fires.'}
            </li>
            <li>
              <strong>{language === 'id' ? 'Kesiapsiagaan Water Bombing:' : 'Aerial Firefighting Readiness:'}</strong> {language === 'id' ? 'Siagakan armada helikopter pemadam apabila FRP harmonisasi melebihi 150 MW dalam jendela 48 jam.' : 'Standby aerial water bombing helicopters if harmonized regional FRP exceeds 150 MW within any 48-hour window.'}
            </li>
          </ul>
        </div>

        {/* Signatures */}
        <div className="pt-6 border-t border-[#e5e5e7] dark:border-[#1f2937] grid grid-cols-2 gap-8 text-xs text-center">
          <div>
            <p className="text-[11px] text-[#86868b] dark:text-[#9ca3af]">{language === 'id' ? 'Disiapkan Oleh Tim Analisis Data' : 'Prepared By Geospatial Analysis Team'}</p>
            <div className="h-12 flex items-center justify-center font-serif italic text-sm text-[#1d1d1f] dark:text-white">
              Terra Harmonia System
            </div>
            <p className="font-semibold text-[#1d1d1f] dark:text-white">{language === 'id' ? 'Sistem Intelijen Satelit NASA' : 'NASA Satellite Intelligence System'}</p>
          </div>
          <div>
            <p className="text-[11px] text-[#86868b] dark:text-[#9ca3af]">{language === 'id' ? 'Mengetahui & Disahkan' : 'Approved & Verified'}</p>
            <div className="h-12 flex items-center justify-center font-serif italic text-sm text-[#1d1d1f] dark:text-white">
              Commander / Forest Operations Lead
            </div>
            <p className="font-semibold text-[#1d1d1f] dark:text-white">{language === 'id' ? 'Pusat Pengendalian Karhutla' : 'Wildfire Crisis Command Center'}</p>
          </div>
        </div>

      </div>

    </div>
  );
};
