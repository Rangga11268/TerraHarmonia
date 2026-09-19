import React, { useState } from 'react';
import { Download, FileText, Activity } from 'lucide-react';
import { PRESET_AOIS, AOIRegion, HarmonizedWeekData } from '../engine/harmonizer';
import { Language, translations } from '../data/translations';
import { PeatlandSimulator } from './PeatlandSimulator';
import { ExecutiveReport } from './ExecutiveReport';

interface MitigationHubProps {
  language: Language;
  selectedAOI: AOIRegion;
  onSelectAOI: (aoi: AOIRegion) => void;
  calendarMatrix?: Record<string, HarmonizedWeekData>;
  totalHotspots?: number;
}

export const MitigationHub: React.FC<MitigationHubProps> = ({
  language,
  selectedAOI,
  onSelectAOI,
  calendarMatrix = {},
  totalHotspots = 0,
}) => {
  const t = translations[language];
  const [activeSubTab, setActiveSubTab] = useState<'simulator' | 'sitrep'>('simulator');
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
${language === 'id' ? 'MEMORANDUM PENUGASAN PATROLI LAPANGAN - TERRA HARMONIA INTELLIGENCE' : 'FIELD PATROL DISPATCH MEMORANDUM - TERRA HARMONIA INTELLIGENCE'}
NASA Space Apps Challenge 2026 - ${language === 'id' ? 'Peringatan Dini Kebakaran Gambut' : 'Peatland Wildfire Early Warning'}
===============================================================
${language === 'id' ? 'Tanggal Patroli' : 'Patrol Date'}    : ${patrolDate}
${language === 'id' ? 'Wilayah Target' : 'Target Region'}     : ${selectedAOI.name} (${selectedAOI.country})
${language === 'id' ? 'Tipe Ekosistem' : 'Ecosystem Type'}    : ${selectedAOI.biome}
${language === 'id' ? 'Koordinat Titik' : 'Coordinates'}    : ${selectedAOI.center[0].toFixed(4)}° N, ${selectedAOI.center[1].toFixed(4)}° E
${language === 'id' ? 'Status Kerentanan' : 'Risk Status'}  : ${currentRegionRisk.risk.toUpperCase()}
${language === 'id' ? 'Estimasi TMA Gambut' : 'Est. Groundwater'}: ${currentRegionRisk.tmag} cm (${language === 'id' ? 'Batas Kritis' : 'Critical Limit'}: -40 cm)
${language === 'id' ? 'Sekat Kanal Pantau' : 'Monitored Gates'}: ${currentRegionRisk.canalBlocks} ${language === 'id' ? 'Titik' : 'Units'}

${language === 'id' ? 'SATUAN KERJA DITUGASKAN' : 'ASSIGNED PATROL TASKFORCE'}:
- ${language === 'id' ? 'Unit Operasional' : 'Operational Unit'} : ${selectedTeamUnit === 'manggala_agni' ? (language === 'id' ? 'Manggala Agni Daops KLHK' : 'Manggala Agni Brigade (KLHK)') : selectedTeamUnit === 'mpa' ? (language === 'id' ? 'Masyarakat Peduli Api (MPA) Desa' : 'Community Fire Patrol (MPA)') : (language === 'id' ? 'Satgas Karhutla BPBD / Damkar' : 'Disaster Management Agency (BPBD)')}

${language === 'id' ? 'INSTRUKSI OPERASIONAL' : 'OPERATIONAL INSTRUCTIONS'}:
1. ${language === 'id' ? 'Lakukan pengecekan kelembapan serasah gambut dan kedalaman air tanah di perimeter.' : 'Measure peat litter moisture content and groundwater depth along perimeter.'}
2. ${language === 'id' ? 'Pastikan pintu sekat kanal (canal blocking) tertutup rapat untuk mencegah pengeringan.' : 'Ensure canal blocks remain firmly closed to retain hydrological dome.'}
3. ${language === 'id' ? 'Pantau tanda-tanda asap bawah tanah (smoldering) sebelum merambat ke tajuk pohon.' : 'Scan for subsurface smoldering indicators before fire crowns to tree canopies.'}
4. ${language === 'id' ? 'Lakukan pendinginan lahan berkala di area bekas kebakaran terdahulu.' : 'Execute periodic ground cooling in historical recurring burn scars.'}

${language === 'id' ? 'Data acuan satelit: NASA FIRMS (MODIS/VIIRS Harmonized Grid 5.5 km)' : 'Satellite Reference Data: NASA FIRMS (MODIS/VIIRS Harmonized Grid 5.5 km)'}
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
      
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#e5e5e7]">
        <div className="space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
            {language === 'id' ? 'Operasi & Mitigasi Lapangan' : 'Field Operations & Mitigation'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight">
            {t.mitigationHubTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6e73] max-w-2xl leading-relaxed">
            {t.mitigationHubDesc}
          </p>
        </div>

        {/* Sub-view switcher */}
        <div className="flex items-center bg-[#e5e5ea] rounded-xl p-1 gap-1 shrink-0">
          <button
            onClick={() => setActiveSubTab('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
              activeSubTab === 'simulator'
                ? 'bg-white text-[#1d1d1f] shadow-xs'
                : 'text-[#6e6e73] hover:text-[#1d1d1f]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{t.subTabSimulator}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sitrep')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
              activeSubTab === 'sitrep'
                ? 'bg-white text-[#1d1d1f] shadow-xs'
                : 'text-[#6e6e73] hover:text-[#1d1d1f]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.subTabSitRep}</span>
          </button>
        </div>
      </div>

      {/* Sub-View 1: Simulator & Patrol Planner */}
      {activeSubTab === 'simulator' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* 5-Region Peatland Status */}
          <div className="bg-white border border-[#e5e5e7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm text-[#1d1d1f]">
                {t.priorityRegionsTitle}
              </h2>
              <span className="text-xs text-[#86868b]">{t.selectRegionToLoad}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {regionRisks.map((item) => {
                const isSelected = selectedAOI.id === item.aoi.id;
                return (
                  <div
                    key={item.aoi.id}
                    onClick={() => onSelectAOI(item.aoi)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[120px] ${
                      isSelected
                        ? 'border-[#1d1d1f] bg-[#f5f5f7] shadow-xs font-semibold'
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
                      <span className="text-[11px] text-[#86868b] block mt-0.5 truncate font-normal">{item.aoi.biome}</span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#e5e5e7] space-y-1 text-xs">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#86868b]">{language === 'id' ? 'Muka Air (TMAG):' : 'Water Table:'}</span>
                        <span className={`font-semibold num ${item.tmag <= -40 ? 'text-red-600' : 'text-[#1d1d1f]'}`}>
                          {item.tmag} cm
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#86868b]">{t.canalBlocks}:</span>
                        <span className="font-medium text-[#1d1d1f] num">{item.canalBlocks} {language === 'id' ? 'unit' : 'units'}</span>
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
                {t.dispatchGenTitle}
              </h2>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[#6e6e73] font-medium mb-1">
                    {t.targetRegion}:
                  </label>
                  <div className="p-2.5 rounded-lg bg-[#f5f5f7] border border-[#e5e5e7] font-semibold text-[#1d1d1f]">
                    {selectedAOI.name} ({selectedAOI.biome})
                  </div>
                </div>

                <div>
                  <label className="block text-[#6e6e73] font-medium mb-1">
                    {t.assignedUnit}:
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
                    {t.patrolDate}:
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
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1d1d1f] hover:bg-black text-white font-medium text-xs transition shadow-xs min-h-[44px] cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{t.downloadMemoTxt}</span>
              </button>
            </div>

            {/* Live Preview */}
            <div className="lg:col-span-6 bg-white border border-[#e5e5e7] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between font-mono text-xs space-y-4">
              <div>
                <div className="flex items-center justify-between text-[#86868b] border-b border-[#e5e5e7] pb-2 text-[11px]">
                  <span className="font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    {t.draftMemoHeader}
                  </span>
                  <span>TERRA HARMONIA</span>
                </div>

                <div className="mt-3 space-y-1.5 text-[11px] leading-relaxed text-[#1d1d1f]">
                  <p><span className="text-[#86868b]">TARGET:</span> {selectedAOI.name}</p>
                  <p><span className="text-[#86868b]">STATUS:</span> <strong className="text-red-600">SIAGA DARURAT (TMAG {currentRegionRisk.tmag} cm)</strong></p>
                  <p><span className="text-[#86868b]">{t.canalBlocks.toUpperCase()}:</span> {currentRegionRisk.canalBlocks} {language === 'id' ? 'Titik Terpantau' : 'Monitored Gates'}</p>
                  <p className="mt-2 text-[#6e6e73] border-l-2 border-[#1d1d1f] pl-2.5">
                    "{language === 'id' ? 'Instruksi: Pertahankan tinggi muka air gambut di atas -40 cm dan lakukan pemantauan serasah untuk mencegah kebakaran bawah tanah smoldering.' : 'Directive: Maintain peat groundwater level above -40 cm and conduct litter moisture monitoring to prevent underground smoldering.'}"
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
      )}

      {/* Sub-View 2: Printable A4 SitRep Dossier */}
      {activeSubTab === 'sitrep' && (
        <div className="animate-in fade-in duration-150">
          <ExecutiveReport
            language={language}
            selectedAOI={selectedAOI}
            calendarMatrix={calendarMatrix}
            totalHotspots={totalHotspots}
          />
        </div>
      )}

    </div>
  );
};
