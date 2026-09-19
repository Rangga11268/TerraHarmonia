import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { PRESET_AOIS, AOIRegion } from '../engine/harmonizer';
import { Language } from '../data/translations';
import { PeatlandSimulator } from './PeatlandSimulator';

interface MitigationHubProps {
  language: Language;
  selectedAOI: AOIRegion;
  onSelectAOI: (aoi: AOIRegion) => void;
}

export const MitigationHub: React.FC<MitigationHubProps> = ({
  language,
  selectedAOI,
  onSelectAOI,
}) => {
  const [selectedTeamUnit, setSelectedTeamUnit] = useState<'manggala_agni' | 'mpa' | 'bpbd'>('manggala_agni');
  const [patrolDate, setPatrolDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Region Peatland Risk Table
  const regionRisks = [
    { aoi: PRESET_AOIS[0], tmag: -48, risk: 'extreme', canalBlocks: 142 }, // Riau
    { aoi: PRESET_AOIS[1], tmag: -55, risk: 'extreme', canalBlocks: 280 }, // Kalteng (PLG)
    { aoi: PRESET_AOIS[2], tmag: -38, risk: 'high', canalBlocks: 95 },     // Kalsel
    { aoi: PRESET_AOIS[3], tmag: -52, risk: 'extreme', canalBlocks: 210 }, // Sumsel (OKI)
    { aoi: PRESET_AOIS[4], tmag: -30, risk: 'moderate', canalBlocks: 60 },  // Kaltim
  ];

  const currentRegionRisk = regionRisks.find(r => r.aoi.id === selectedAOI.id) || regionRisks[0];

  const handleDownloadDispatch = () => {
    const memo = `===============================================================
MEMORANDUM PENUGASAN PATROLI LAPANGAN - TERRA HARMONIA INTELLIGENCE
NASA Space Apps Challenge 2026 - Peringatan Dini Kebakaran Gambut
===============================================================
Tanggal Patroli    : ${patrolDate}
Wilayah Target     : ${selectedAOI.name} (${selectedAOI.country})
Tipe Ekosistem     : ${selectedAOI.biome}
Koordinat Titik    : ${selectedAOI.center[0].toFixed(4)}° N, ${selectedAOI.center[1].toFixed(4)}° E
Status Kerentanan  : ${currentRegionRisk.risk.toUpperCase()}
Estimasi TMA Gambut: ${currentRegionRisk.tmag} cm (Batas Kritis: -40 cm)
Sekat Kanal Pantau : ${currentRegionRisk.canalBlocks} Titik

SATUAN KERJA DITUGASKAN:
- Unit Operasional : ${selectedTeamUnit === 'manggala_agni' ? 'Manggala Agni Daops KLHK' : selectedTeamUnit === 'mpa' ? 'Masyarakat Peduli Api (MPA) Desa' : 'Satgas Karhutla BPBD / Damkar'}

INSTRUKSI OPERASIONAL:
1. Lakukan pengecekan kelembapan serasah gambut dan kedalaman air tanah di perimeter.
2. Pastikan pintu sekat kanal (canal blocking) tertutup rapat untuk mencegah pengeringan.
3. Pantau tanda-tanda asap bawah tanah (smoldering) sebelum merambat ke tajuk pohon.
4. Lakukan pendinginan lahan berkala di area bekas kebakaran terdahulu.

Data acuan satelit: NASA FIRMS (MODIS/VIIRS Harmonized Grid 5.5 km)
===============================================================`;

    const blob = new Blob([memo], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dispatch_Briefing_${selectedAOI.id}_${patrolDate}.txt`;
    link.click();
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Editorial Header (No capsule pills) */}
      <div className="space-y-2 pt-2 pb-4 border-b border-[#e5e5e7]">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
          {language === 'id' ? 'Operasi & Mitigasi Lapangan' : 'Field Operations & Mitigation'}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight">
          {language === 'id'
            ? 'Pusat Komando & Peringatan Dini Lahan Gambut'
            : 'Peatland Early Warning & Patrol Command'}
        </h1>
        <p className="text-sm text-[#6e6e73] max-w-3xl leading-relaxed">
          {language === 'id'
            ? 'Menghubungkan kalender historis 26 tahun dengan aksi operasional. Pantau estimasi kedalaman muka air tanah gambut (TMAG) dan buat memorandum briefing penugasan patroli lapangan untuk regu pemadam.'
            : 'Operationalizing 26-year satellite climatology into field action. Monitor groundwater table depth estimates and generate dispatch briefing memos for patrol units.'}
        </p>
      </div>

      {/* 5-Region Peatland Status */}
      <div className="bg-white border border-[#e5e5e7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm text-[#1d1d1f]">
            {language === 'id' ? 'Status 5 Wilayah Gambut Prioritas' : 'Priority Peatland Regions Status'}
          </h2>
          <span className="text-xs text-[#86868b]">Pilih wilayah untuk memuat parameter</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {regionRisks.map((item) => {
            const isSelected = selectedAOI.id === item.aoi.id;
            return (
              <div
                key={item.aoi.id}
                onClick={() => onSelectAOI(item.aoi)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#1d1d1f] bg-[#f5f5f7] shadow-xs'
                    : 'border-[#e5e5e7] bg-white hover:border-[#1d1d1f]/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1d1d1f] truncate">{item.aoi.name}</span>
                    {item.risk === 'extreme' && (
                      <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
                    )}
                  </div>
                  <span className="text-[11px] text-[#86868b] block mt-0.5 truncate">{item.aoi.biome}</span>
                </div>

                <div className="mt-4 pt-3 border-t border-[#e5e5e7] space-y-1 text-xs">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#86868b]">Muka Air (TMAG):</span>
                    <span className={`font-semibold num ${item.tmag <= -40 ? 'text-red-600' : 'text-[#1d1d1f]'}`}>
                      {item.tmag} cm
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#86868b]">Sekat Kanal:</span>
                    <span className="font-medium text-[#1d1d1f] num">{item.canalBlocks} unit</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Field Dispatch Planner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Form */}
        <div className="lg:col-span-6 bg-white border border-[#e5e5e7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="font-semibold text-sm text-[#1d1d1f]">
            {language === 'id' ? 'Pembuatan Memorandum Patroli' : 'Patrol Dispatch Briefing Generator'}
          </h2>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#6e6e73] font-medium mb-1">
                {language === 'id' ? 'Wilayah Target' : 'Target Region'}:
              </label>
              <div className="p-2.5 rounded-lg bg-[#f5f5f7] border border-[#e5e5e7] font-semibold text-[#1d1d1f]">
                {selectedAOI.name} ({selectedAOI.biome})
              </div>
            </div>

            <div>
              <label className="block text-[#6e6e73] font-medium mb-1">
                {language === 'id' ? 'Satuan Regu Operasional' : 'Assigned Patrol Unit'}:
              </label>
              <select
                value={selectedTeamUnit}
                onChange={(e: any) => setSelectedTeamUnit(e.target.value)}
                className="w-full bg-white border border-[#e5e5e7] rounded-lg p-2.5 font-medium text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] cursor-pointer"
              >
                <option value="manggala_agni">Manggala Agni (Kementerian LHK)</option>
                <option value="mpa">Masyarakat Peduli Api (MPA Desa)</option>
                <option value="bpbd">Satgas Karhutla BPBD / Damkar</option>
              </select>
            </div>

            <div>
              <label className="block text-[#6e6e73] font-medium mb-1">
                {language === 'id' ? 'Tanggal Pelaksanaan' : 'Patrol Date'}:
              </label>
              <input
                type="date"
                value={patrolDate}
                onChange={(e) => setPatrolDate(e.target.value)}
                className="w-full bg-white border border-[#e5e5e7] rounded-lg p-2 font-medium text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleDownloadDispatch}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1d1d1f] hover:bg-black text-white font-medium text-xs transition shadow-xs min-h-[42px]"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'id' ? 'Unduh Dokumen Memo (.TXT)' : 'Download Dispatch Memo'}</span>
          </button>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-6 bg-white border border-[#e5e5e7] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between font-mono text-xs space-y-4">
          <div>
            <div className="flex items-center justify-between text-[#86868b] border-b border-[#e5e5e7] pb-2 text-[11px]">
              <span className="font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                DRAF MEMORANDUM BRIEFING
              </span>
              <span>TERRA HARMONIA</span>
            </div>

            <div className="mt-3 space-y-1.5 text-[11px] leading-relaxed text-[#1d1d1f]">
              <p><span className="text-[#86868b]">TARGET:</span> {selectedAOI.name}</p>
              <p><span className="text-[#86868b]">STATUS:</span> <strong className="text-red-600">SIAGA DARURAT (TMAG {currentRegionRisk.tmag} cm)</strong></p>
              <p><span className="text-[#86868b]">SEKAT KANAL:</span> {currentRegionRisk.canalBlocks} Titik Terpantau</p>
              <p className="mt-2 text-[#6e6e73] border-l-2 border-[#1d1d1f] pl-2.5">
                "Instruksi: Pertahankan tinggi muka air gambut di atas -40 cm dan lakukan pemantauan serasah untuk mencegah kebakaran bawah tanah smoldering."
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#e5e5e7] text-[10px] text-[#86868b] flex justify-between">
            <span>NASA FIRMS HISTORICAL REFERENCE</span>
            <span>SIAGA OPERASIONAL</span>
          </div>
        </div>
      </div>

      {/* Interactive Peatland Hydrology & Fire Spread Simulator */}
      <section className="pt-2">
        <PeatlandSimulator
          language={language}
          selectedAOI={selectedAOI}
        />
      </section>
    </div>
  );
};
