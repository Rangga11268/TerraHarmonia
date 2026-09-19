import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Droplets, 
  MapPin, 
  Download, 
  Printer, 
  Users, 
  Flame, 
  CheckCircle2, 
  AlertTriangle,
  Compass,
  FileText
} from 'lucide-react';
import { PRESET_AOIS, AOIRegion } from '../engine/harmonizer';
import { Language } from '../data/translations';

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
  const [dispatchGenerated, setDispatchGenerated] = useState(false);

  // Region Peatland Risk Table
  const regionRisks = [
    { aoi: PRESET_AOIS[0], tmag: -48, risk: 'extreme', canalBlocks: 142, hotspotTrend: '+18%' }, // Riau
    { aoi: PRESET_AOIS[1], tmag: -55, risk: 'extreme', canalBlocks: 280, hotspotTrend: '+34%' }, // Kalteng (PLG)
    { aoi: PRESET_AOIS[2], tmag: -38, risk: 'high', canalBlocks: 95, hotspotTrend: '+12%' },    // Kalsel
    { aoi: PRESET_AOIS[3], tmag: -52, risk: 'extreme', canalBlocks: 210, hotspotTrend: '+28%' }, // Sumsel (OKI)
    { aoi: PRESET_AOIS[4], tmag: -30, risk: 'moderate', canalBlocks: 60, hotspotTrend: '+5%' },  // Kaltim
  ];

  const currentRegionRisk = regionRisks.find(r => r.aoi.id === selectedAOI.id) || regionRisks[0];

  const handleDownloadDispatch = () => {
    const memo = `===============================================================
MEMORANDUM DISPATCH PATROLI LAPANGAN - TERRA HARMONIA INTELLIGENCE
NASA Space Apps Challenge 2026 - Peatland Fire Early Warning
===============================================================
Tanggal Patroli    : ${patrolDate}
Wilayah Prioritas  : ${selectedAOI.name} (${selectedAOI.country})
Zona Ekosistem     : ${selectedAOI.biome}
Koordinat Pusat    : ${selectedAOI.center[0].toFixed(4)}° N, ${selectedAOI.center[1].toFixed(4)}° E
Status Kerentanan  : ${currentRegionRisk.risk.toUpperCase()}
Estimasi TMA Gambut: ${currentRegionRisk.tmag} cm (Batas Kritis: -40 cm)
Sekat Kanal Pantau : ${currentRegionRisk.canalBlocks} Unit

UNIT OPERASIONAL DITUGASKAN:
- Satuan Kerja     : ${selectedTeamUnit === 'manggala_agni' ? 'Manggala Agni Daops KLHK' : selectedTeamUnit === 'mpa' ? 'Masyarakat Peduli Api (MPA) Desa' : 'Satgas BPBD & Pemadam Kebakaran'}

INSTRUKSI OPERASIONAL:
1. Lakukan pengecekan kebasahan serasah dan kedalaman gambut di perimeter.
2. Pastikan pintu sekat kanal (canal blocking) ditutup rapat untuk mempertahankan air.
3. Segera laporkan anomali asap bawah tanah sebelum merambat ke tajuk.
4. Gunakan drone pemantau termal jika jarak pandang terbatas oleh kabut asap.

Data satelit referensi: NASA FIRMS (MODIS/VIIRS Harmonized Grid 5.5 km)
Dikeluarkan secara otomatis oleh Terra Harmonia System.
===============================================================`;

    const blob = new Blob([memo], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dispatch_Briefing_${selectedAOI.id}_${patrolDate}.txt`;
    link.click();
    setDispatchGenerated(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-orange-600" />
            <span>{language === 'id' ? 'Pusat Komando Mitigasi Lahan Gambut' : 'Peatland Mitigation Command'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'id'
              ? 'Prognosis Risiko & Penugasan Patroli Lapangan'
              : 'Fire Risk Prognosis & Field Patrol Dispatch'}
          </h2>
          <p className="text-sm text-zinc-600">
            {language === 'id'
              ? 'Menghubungkan data satelit 26 tahun dengan aksi nyata di lapangan. Estimasi tinggi muka air gambut (TMAG) dan pembuatan memorandum penugasan patroli untuk Manggala Agni dan Masyarakat Peduli Api (MPA).'
              : 'Translating 26-year satellite intelligence into frontline operational action. Peat groundwater depth tracking and patrol dispatch memos for field units.'}
          </p>
        </div>
      </div>

      {/* 5-Region Peatland Vulnerability Grid */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="section-title-bar flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            {language === 'id' ? 'Status 5 Wilayah Gambut Utama Indonesia' : 'Priority Indonesian Peatland Regions Status'}
          </h3>
          <span className="text-xs text-zinc-400 font-medium">Klik wilayah untuk memilih</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {regionRisks.map((item) => {
            const isSelected = selectedAOI.id === item.aoi.id;
            return (
              <div
                key={item.aoi.id}
                onClick={() => onSelectAOI(item.aoi)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                    : 'bg-zinc-50/70 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 truncate">{item.aoi.name}</span>
                    <span className={`w-2 h-2 rounded-full ${item.risk === 'extreme' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
                  </div>
                  <span className="text-[11px] text-zinc-400 block mt-0.5">{item.aoi.biome}</span>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-200/60 space-y-1 text-xs">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-500">Muka Air (TMAG):</span>
                    <strong className={`num font-bold ${item.tmag <= -40 ? 'text-red-600' : 'text-slate-800'}`}>{item.tmag} cm</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-500">Sekat Kanal:</span>
                    <span className="font-semibold text-slate-700 num">{item.canalBlocks} unit</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Field Dispatch Planner Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Dispatch Form Card */}
        <div className="lg:col-span-6 bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="section-title-bar">
            <h3 className="font-bold text-sm text-slate-900">
              {language === 'id' ? 'Generator Penugasan Patroli Lapangan' : 'Ground Patrol Dispatch Memo Generator'}
            </h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-zinc-600 font-semibold mb-1">
                {language === 'id' ? 'Wilayah Target Patroli' : 'Target Region'}:
              </label>
              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 font-bold text-slate-900">
                {selectedAOI.name} ({selectedAOI.biome})
              </div>
            </div>

            <div>
              <label className="block text-zinc-600 font-semibold mb-1">
                {language === 'id' ? 'Satuan Tim Lapangan' : 'Field Operational Unit'}:
              </label>
              <select
                value={selectedTeamUnit}
                onChange={(e: any) => setSelectedTeamUnit(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="manggala_agni">Manggala Agni (Kementerian LHK)</option>
                <option value="mpa">Masyarakat Peduli Api (MPA Desa)</option>
                <option value="bpbd">Satgas Karhutla BPBD / Damkar</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-600 font-semibold mb-1">
                {language === 'id' ? 'Tanggal Pelaksanaan' : 'Patrol Date'}:
              </label>
              <input
                type="date"
                value={patrolDate}
                onChange={(e) => setPatrolDate(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
              </input>
            </div>
          </div>

          <button
            onClick={handleDownloadDispatch}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition shadow-sm focus-visible:ring-2 focus-visible:ring-amber-400 min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'id' ? 'Unduh Dokumen Memo Penugasan (.TXT)' : 'Download Dispatch Memo Briefing'}</span>
          </button>
        </div>

        {/* Live Preview Memo */}
        <div className="lg:col-span-6 bg-zinc-900 text-zinc-100 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between font-mono text-xs space-y-4">
          <div>
            <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800 pb-2 text-[11px]">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <FileText className="w-3.5 h-3.5" />
                BRIEFING MEMORANDUM PREVIEW
              </span>
              <span>CONFIDENTIAL // FIELD USE</span>
            </div>

            <div className="mt-3 space-y-1.5 text-[11px] leading-relaxed text-zinc-300">
              <p><span className="text-zinc-500">TARGET:</span> {selectedAOI.name}</p>
              <p><span className="text-zinc-500">STATUS:</span> <span className="text-red-400 font-bold">SIAGA KRITIS (TMAG {currentRegionRisk.tmag} cm)</span></p>
              <p><span className="text-zinc-500">SEKAT KANAL:</span> {currentRegionRisk.canalBlocks} Titik Pemantauan Aktif</p>
              <p className="mt-2 text-zinc-400 border-l-2 border-amber-500 pl-2">
                "Instruksi: Awasi batas sekat kanal utama dan lakukan pembasahan gambut berkala untuk mencegah kebakaran bawah tanah smoldering."
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-500 flex justify-between">
            <span>TERRA HARMONIA ENGINE 2026</span>
            <span>NASA FIRMS COMPLIANT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
