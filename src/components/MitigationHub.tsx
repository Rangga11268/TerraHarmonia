import React, { useState } from 'react';
import { Download, FileText, Activity, Radio, RefreshCw, ShieldAlert, Droplets, Flame, MapPin, CheckCircle2 } from 'lucide-react';
import { PRESET_AOIS, AOIRegion, HarmonizedWeekData, RawHotspot } from '../engine/harmonizer';
import { Language, translations } from '../data/translations';
import { PeatlandSimulator } from './PeatlandSimulator';
import { ExecutiveReport } from './ExecutiveReport';
import { LiveSyncResult } from '../services/nasaFirmsApi';

interface MitigationHubProps {
  language: Language;
  selectedAOI: AOIRegion;
  onSelectAOI: (aoi: AOIRegion) => void;
  calendarMatrix?: Record<string, HarmonizedWeekData>;
  totalHotspots?: number;
  isLiveSync?: boolean;
  liveResult?: LiveSyncResult | null;
  liveHotspots?: RawHotspot[];
  isLoadingLive?: boolean;
  onRefreshLive?: () => void;
}

export const MitigationHub: React.FC<MitigationHubProps> = ({
  language,
  selectedAOI,
  onSelectAOI,
  calendarMatrix = {},
  totalHotspots = 0,
  isLiveSync = false,
  liveResult = null,
  liveHotspots = [],
  isLoadingLive = false,
  onRefreshLive,
}) => {
  const t = translations[language];
  const [activeSubTab, setActiveSubTab] = useState<'simulator' | 'sitrep'>('simulator');
  const [selectedTeamUnit, setSelectedTeamUnit] = useState<'manggala_agni' | 'mpa' | 'bpbd'>('manggala_agni');
  const [patrolDate, setPatrolDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Comprehensive Region Peatland Risk & Hydrology Database (BRGM & KLHK Baseline)
  const regionRisks: Record<string, { tmag: number; risk: 'extreme' | 'high' | 'moderate' | 'nominal'; canalBlocks: number; khgName: string; peatDepth: string; fwi: number }> = {
    riau: { tmag: -48, risk: 'extreme', canalBlocks: 142, khgName: 'KHG Sungai Siak - Sungai Kampar', peatDepth: '4.8 – 7.0 m', fwi: 28.4 },
    kalteng: { tmag: -55, risk: 'extreme', canalBlocks: 280, khgName: 'Kawasan Eks-PLG Blok A & C (Kahayan)', peatDepth: '5.5 – 9.0 m', fwi: 32.1 },
    kalsel: { tmag: -38, risk: 'high', canalBlocks: 95, khgName: 'KHG Sungai Barito - Sungai Negara', peatDepth: '3.0 – 4.5 m', fwi: 22.0 },
    sumsel: { tmag: -52, risk: 'extreme', canalBlocks: 210, khgName: 'KHG Sungai Sugihan - Sungai Saleh (OKI)', peatDepth: '3.5 – 5.8 m', fwi: 29.5 },
    kaltim: { tmag: -30, risk: 'moderate', canalBlocks: 60, khgName: 'KHG Sungai Mahakam - Danau Semayang', peatDepth: '2.5 – 4.0 m', fwi: 16.8 },
    indonesia: { tmag: -45, risk: 'extreme', canalBlocks: 787, khgName: 'Kubah Gambut Prioritas Restorasi Nasional (7 Provinsi BRGM)', peatDepth: '4.5 m (Rata-rata)', fwi: 26.5 },
  };

  const currentRegionRisk = regionRisks[selectedAOI.id] || regionRisks['riau'];

  // Current active live hotspots in this region
  const regionLiveSpots = liveHotspots.filter(h => h.aoiId === selectedAOI.id || selectedAOI.id === 'indonesia');
  const activeSpotCount = isLiveSync ? regionLiveSpots.length : totalHotspots;
  const maxLiveFrp = regionLiveSpots.length > 0 ? Math.max(...regionLiveSpots.map(h => h.frp)) : 0;

  const handleDownloadDispatch = () => {
    const memo = `===============================================================
${language === 'id' ? 'MEMORANDUM PENUGASAN PATROLI LAPANGAN - TERRA HARMONIA INTELLIGENCE' : 'FIELD PATROL DISPATCH MEMORANDUM - TERRA HARMONIA INTELLIGENCE'}
NASA Space Apps Jakarta 2026 - ${language === 'id' ? 'Sistem Peringatan Dini Kebakaran Kubah Gambut' : 'Peatland Wildfire Early Warning & Mitigation System'}
===============================================================
${language === 'id' ? 'Tanggal Operasi' : 'Operation Date'}  : ${patrolDate}
${language === 'id' ? 'Wilayah Target' : 'Target Region'}   : ${selectedAOI.name} (${selectedAOI.country})
${language === 'id' ? 'Kesatuan Gambut' : 'Peat Landscape'}  : ${currentRegionRisk.khgName}
${language === 'id' ? 'Koordinat Acuan' : 'Reference Coords'}: ${selectedAOI.center[0].toFixed(4)}° N, ${selectedAOI.center[1].toFixed(4)}° E
${language === 'id' ? 'Status Ancaman' : 'Threat Level'}    : ${currentRegionRisk.risk.toUpperCase()} (Indeks FWI: ${currentRegionRisk.fwi})
${language === 'id' ? 'Tinggi Air Tanah' : 'Groundwater Table'}: ${currentRegionRisk.tmag} cm (${language === 'id' ? 'Batas Kritis PP 57/2016' : 'National Limit'}: -40 cm)
${language === 'id' ? 'Sekat Kanal Aktif' : 'Canal Blockings'}: ${currentRegionRisk.canalBlocks} ${language === 'id' ? 'Unit Terpasang' : 'Units Installed'}
${language === 'id' ? 'Titik Api Aktif' : 'Active Hotspots'}: ${activeSpotCount} ${language === 'id' ? 'titik terdeteksi satelit NASA' : 'detections (NASA satellite feed)'}
${maxLiveFrp > 0 ? `${language === 'id' ? 'Daya Termal Tertinggi' : 'Max Radiative Power'}: ${maxLiveFrp} MW` : ''}

${language === 'id' ? 'SATUAN KERJA DITUGASKAN' : 'ASSIGNED PATROL TASKFORCE'}:
- ${language === 'id' ? 'Unit Komando' : 'Command Unit'} : ${selectedTeamUnit === 'manggala_agni' ? (language === 'id' ? 'Brigade Manggala Agni Daops KLHK' : 'Manggala Agni Brigade (KLHK)') : selectedTeamUnit === 'mpa' ? (language === 'id' ? 'Masyarakat Peduli Api (MPA) Tingkat Desa' : 'Community Fire Patrol (MPA)') : (language === 'id' ? 'Satgas Karhutla BPBD / Damkar Daerah' : 'Disaster Management Agency (BPBD)')}

${language === 'id' ? 'INSTRUKSI TAKTIS LAPANGAN' : 'TACTICAL FIELD INSTRUCTIONS'}:
1. ${language === 'id' ? 'Segera lakukan pengecekan suhu serasah gambut (TIR) dan kelembapan tanah di batas perimeter.' : 'Immediately verify peat surface thermal temperature (TIR) and litter moisture along perimeter.'}
2. ${language === 'id' ? 'Pastikan seluruh pintu sekat kanal (canal blocking) tertutup rapat untuk mencegah dehidrasi kubah gambut.' : 'Verify all canal blocks remain sealed to prevent dome dewatering.'}
3. ${language === 'id' ? 'Gunakan nozzle suntik gambut untuk memadamkan bara api bawah tanah (smoldering) sedalam 1–3 meter.' : 'Deploy peat injector nozzles to suppress subsurface smoldering fires down to 1–3m depth.'}
4. ${language === 'id' ? 'Lakukan pendinginan lahan berkala (water bombing/ground cooling) pada titik koordinat anomali panas tinggi.' : 'Execute targeted ground cooling at high-FRP coordinate clusters.'}

${language === 'id' ? 'Sumber Data: NASA FIRMS (MODIS 1km / VIIRS 375m) & Algoritma Harmonisasi Terra Harmonia' : 'Data Sources: NASA FIRMS (MODIS 1km / VIIRS 375m) & Terra Harmonia Harmonization Pipeline'}
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
      
      {/* 1. Top Header & Live Situational Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#e5e5e7] dark:border-[#1f2937]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b] dark:text-[#9ca3af]">
              {language === 'id' ? 'Operasi & Mitigasi Lapangan' : 'Field Operations & Mitigation'}
            </span>
            {isLiveSync ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>NASA FIRMS 24-HOUR FEED LIVE</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 text-[10px] font-mono font-bold">
                <span>HISTORICAL 26-YR CLIMATOLOGY</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">
            {t.mitigationHubTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6e73] dark:text-[#9ca3af] max-w-2xl leading-relaxed">
            {language === 'id'
              ? 'Sistem aksi mitigasi taktis berbasis data satelit NASA: simulasi hidrologi kubah gambut, pembasahan sekat kanal (canal blocking), dan pembuatan memorandum penugasan patroli Manggala Agni.'
              : 'Actionable satellite intelligence: peatland hydrology rewetting simulations, canal blocking management, and automated field dispatch memorandums.'}
          </p>
        </div>

        {/* Sub-view switcher */}
        <div className="flex items-center bg-[#e5e5ea] dark:bg-[#1f2937] rounded-xl p-1 gap-1 shrink-0">
          <button
            onClick={() => setActiveSubTab('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
              activeSubTab === 'simulator'
                ? 'bg-white dark:bg-[#111827] text-[#1d1d1f] dark:text-white shadow-xs'
                : 'text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{t.subTabSimulator}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sitrep')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
              activeSubTab === 'sitrep'
                ? 'bg-white dark:bg-[#111827] text-[#1d1d1f] dark:text-white shadow-xs'
                : 'text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.subTabSitRep}</span>
          </button>
        </div>
      </div>

      {/* 2. Region Quick Selector & Live Telemetry KPI Bar */}
      <div className="bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Region Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-[#86868b] dark:text-[#9ca3af] mr-1 uppercase">
              {language === 'id' ? 'Wilayah Target:' : 'Target AOI:'}
            </span>
            {PRESET_AOIS.map((aoi) => {
              const isSelected = selectedAOI.id === aoi.id;
              return (
                <button
                  key={aoi.id}
                  onClick={() => onSelectAOI(aoi)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[36px] ${
                    isSelected
                      ? 'bg-[#1d1d1f] dark:bg-white text-white dark:text-[#111827] shadow-xs'
                      : 'bg-[#f5f5f7] dark:bg-[#151d2f] text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white border border-[#e5e5e7] dark:border-[#1f2937]'
                  }`}
                >
                  {aoi.name}
                </button>
              );
            })}
          </div>

          {/* Live Sync Trigger / Refresh */}
          {onRefreshLive && (
            <button
              onClick={onRefreshLive}
              disabled={isLoadingLive}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-xs cursor-pointer disabled:opacity-50 shrink-0 min-h-[36px]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin' : ''}`} />
              <span>{isLoadingLive ? (language === 'id' ? 'Menyinkronkan...' : 'Syncing NASA...') : (language === 'id' ? 'Sinkronkan Data Live' : 'Sync Live Satellite Data')}</span>
            </button>
          )}

        </div>

        {/* 4 Live Tactical Metrics */}
        <div className="mt-4 pt-4 border-t border-[#e5e5e7] dark:border-[#1f2937] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          
          <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937]">
            <span className="text-[10px] text-[#86868b] dark:text-[#9ca3af] uppercase font-bold tracking-wider block">
              {language === 'id' ? 'Titik Panas Terpantau' : 'Observed Hotspots'}
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <strong className="text-lg font-bold text-[#1d1d1f] dark:text-white num">
                {activeSpotCount.toLocaleString()}
              </strong>
              <span className="text-[10px] text-[#6e6e73] dark:text-[#9ca3af]">
                {isLiveSync ? (language === 'id' ? '24 Jam Live' : '24h Live') : (language === 'id' ? 'Rerata Musiman' : 'Seasonal Avg')}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937]">
            <span className="text-[10px] text-[#86868b] dark:text-[#9ca3af] uppercase font-bold tracking-wider block">
              {language === 'id' ? 'Tinggi Air Tanah Gambut' : 'Peat Groundwater Table'}
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <strong className={`text-lg font-bold num ${currentRegionRisk.tmag <= -40 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {currentRegionRisk.tmag} cm
              </strong>
              <span className="text-[10px] text-[#86868b] dark:text-[#9ca3af]">
                (Limit: -40 cm)
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937]">
            <span className="text-[10px] text-[#86868b] dark:text-[#9ca3af] uppercase font-bold tracking-wider block">
              {language === 'id' ? 'Indeks Bahaya Api (FWI)' : 'Fire Weather Index (FWI)'}
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <strong className="text-lg font-bold text-amber-600 dark:text-amber-400 num">
                {currentRegionRisk.fwi}
              </strong>
              <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300">
                {currentRegionRisk.risk}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937]">
            <span className="text-[10px] text-[#86868b] dark:text-[#9ca3af] uppercase font-bold tracking-wider block">
              {language === 'id' ? 'Sekat Kanal Pantau (BRGM)' : 'Monitored Canal Dams'}
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <strong className="text-lg font-bold text-[#1d1d1f] dark:text-white num">
                {currentRegionRisk.canalBlocks}
              </strong>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                {language === 'id' ? 'Unit Terpasang' : 'Active Units'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Sub-View 1: Simulator & Patrol Planner */}
      {activeSubTab === 'simulator' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Peatland Simulator Component */}
          <PeatlandSimulator language={language} selectedAOI={selectedAOI} />

          {/* Quick Dispatch Order Generator Card */}
          <div className="bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e5e5e7] dark:border-[#1f2937]">
              <div>
                <h3 className="font-bold text-base text-[#1d1d1f] dark:text-white">
                  {language === 'id' ? 'Generator Surat Perintah Tugas Patroli (SPTP)' : 'Field Patrol Taskforce Dispatch Generator'}
                </h3>
                <p className="text-xs text-[#6e6e73] dark:text-[#9ca3af] mt-0.5">
                  {language === 'id'
                    ? 'Buat instruksi penugasan resmi untuk Manggala Agni Daops, MPA Desa, atau BPBD sesuai koordinat titik panas satelit terkini.'
                    : 'Generate official dispatch orders for Manggala Agni brigades and community fire patrols based on real-time satellite coordinates.'}
                </p>
              </div>

              <button
                onClick={handleDownloadDispatch}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1d1d1f] hover:bg-black dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-xs cursor-pointer min-h-[40px] shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'id' ? 'Unduh Memorandum (.txt)' : 'Download Dispatch (.txt)'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-[#1d1d1f] dark:text-white block mb-1">
                  {language === 'id' ? 'Satuan Kerja Penerima Tugas:' : 'Assigned Taskforce Unit:'}
                </label>
                <select
                  value={selectedTeamUnit}
                  onChange={(e) => setSelectedTeamUnit(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f5f5f7] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] text-[#1d1d1f] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                >
                  <option value="manggala_agni">Brigade Manggala Agni (KLHK)</option>
                  <option value="mpa">Masyarakat Peduli Api (MPA Desa)</option>
                  <option value="bpbd">Satgas Gabungan BPBD &amp; Damkar</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#1d1d1f] dark:text-white block mb-1">
                  {language === 'id' ? 'Tanggal Efektif Patroli:' : 'Effective Patrol Date:'}
                </label>
                <input
                  type="date"
                  value={patrolDate}
                  onChange={(e) => setPatrolDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f5f5f7] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] text-[#1d1d1f] dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1d1d1f] dark:text-white block mb-1">
                  {language === 'id' ? 'Wilayah Operasi:' : 'Operational Sector:'}
                </label>
                <div className="px-3 py-2 rounded-xl bg-[#f5f5f7] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] text-[#1d1d1f] dark:text-white font-bold flex items-center justify-between">
                  <span>{selectedAOI.name}</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">READY</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Sub-View 2: Executive Situation Report Dossier (A4 Print Ready) */}
      {activeSubTab === 'sitrep' && (
        <div className="animate-in fade-in duration-150">
          <ExecutiveReport
            language={language}
            selectedAOI={selectedAOI}
            calendarMatrix={calendarMatrix}
            totalHotspots={activeSpotCount}
          />
        </div>
      )}

    </div>
  );
};
