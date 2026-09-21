import React, { useState } from 'react';
import { Language, translations } from '../data/translations';
import { AOIRegion, PRESET_AOIS } from '../engine/harmonizer';
import { Radio, RefreshCw, Settings2, ChevronDown, Volume2, VolumeX, Split, MapPin, Calendar, Share2, CheckCircle2, History, Sparkles, Printer } from 'lucide-react';
import { speakSituationBriefing } from '../utils/audioBriefing';

export type OverviewViewMode = 'main' | 'dual_map' | 'polygon';

interface DashboardControlBarProps {
  language: Language;
  selectedAOI: AOIRegion;
  onSelectAOI: (aoi: AOIRegion) => void;
  rawMode: boolean;
  setRawMode: (val: boolean) => void;
  isLiveSync: boolean;
  onToggleLiveSync: () => void;
  isLoadingLive: boolean;
  onOpenApiKeyModal: () => void;
  activeView: OverviewViewMode;
  onSelectView: (view: OverviewViewMode) => void;
  totalHotspots?: number;
  anomalyCount?: number;
  activeScenario?: string | null;
  onSelectScenario?: (id: string | null) => void;
  onShareLink?: () => void;
  isLinkCopied?: boolean;
  onOpenBriefing?: () => void;
}

export const DashboardControlBar: React.FC<DashboardControlBarProps> = ({
  language,
  selectedAOI,
  onSelectAOI,
  rawMode,
  setRawMode,
  isLiveSync,
  onToggleLiveSync,
  isLoadingLive,
  onOpenApiKeyModal,
  activeView,
  onSelectView,
  totalHotspots = 0,
  anomalyCount = 0,
  activeScenario = null,
  onSelectScenario,
  onShareLink,
  isLinkCopied = false,
  onOpenBriefing,
}) => {
  const t = translations[language];
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const handleToggleVoice = () => {
    speakSituationBriefing(
      selectedAOI,
      totalHotspots,
      anomalyCount,
      language,
      setIsSpeaking
    );
  };

  return (
    <div className="bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-2xl shadow-xs overflow-hidden space-y-0 transition-colors">
      
      {/* Primary Toolbar Controls */}
      <div className="px-4 sm:px-5 py-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">

        {/* Region Selector (Full width on mobile, max-w-md on desktop) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <label htmlFor="aoi-select" className="text-[11px] font-bold text-[#86868b] dark:text-[#9ca3af] uppercase tracking-wider shrink-0">
            {t.region}
          </label>
          <div className="relative flex-1 w-full max-w-full md:max-w-md">
            <select
              id="aoi-select"
              value={selectedAOI.id}
              onChange={(e) => {
                const aoi = PRESET_AOIS.find((a) => a.id === e.target.value);
                if (aoi) onSelectAOI(aoi);
              }}
              className="w-full appearance-none bg-[#f5f5f7] dark:bg-[#1f2937] border border-[#e5e5e7] dark:border-[#374151] rounded-xl pl-3.5 pr-9 py-2.5 text-xs sm:text-sm font-semibold text-[#1d1d1f] dark:text-white focus:outline-none focus:border-[#1d1d1f] dark:focus:border-white cursor-pointer min-h-[44px]"
            >
              {PRESET_AOIS.map((aoi) => (
                <option key={aoi.id} value={aoi.id} className="bg-white dark:bg-[#1f2937] text-[#1d1d1f] dark:text-white">
                  {aoi.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] dark:text-[#9ca3af] pointer-events-none" />
          </div>
        </div>

        {/* Controls: Mode Toggle, NASA Live Sync, Voice & Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:flex items-center gap-2 w-full md:w-auto">
          
          {/* Mode Toggle (Apple style segmented switch) */}
          <div className="flex w-full sm:w-auto rounded-xl bg-[#e5e5ea] dark:bg-[#1f2937] p-0.5 text-xs font-medium min-h-[44px] items-center">
            <button
              onClick={() => setRawMode(false)}
              className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg transition-all cursor-pointer min-h-[38px] flex items-center justify-center ${
                !rawMode
                  ? 'bg-white dark:bg-[#374151] text-[#1d1d1f] dark:text-white shadow-xs font-bold'
                  : 'text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              {t.harmonized}
            </button>
            <button
              onClick={() => setRawMode(true)}
              className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg transition-all cursor-pointer min-h-[38px] flex items-center justify-center ${
                rawMode
                  ? 'bg-white dark:bg-[#374151] text-[#1d1d1f] dark:text-white shadow-xs font-bold'
                  : 'text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              {t.rawSensors}
            </button>
          </div>

          {/* NASA Live Sync Button */}
          <div className="flex w-full sm:w-auto rounded-xl border border-[#e5e5e7] dark:border-[#374151] overflow-hidden text-xs min-h-[44px]">
            <button
              onClick={onToggleLiveSync}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 font-medium transition-all cursor-pointer min-h-[44px] ${
                isLiveSync
                  ? 'bg-[#1d1d1f] dark:bg-white text-white dark:text-[#111827] font-semibold'
                  : 'bg-white dark:bg-[#111827] text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#1f2937]'
              }`}
            >
              {isLoadingLive ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Radio className={`w-4 h-4 ${isLiveSync ? 'text-red-500 animate-pulse' : ''}`} />
              )}
              <span>{isLiveSync ? t.liveSyncActive : t.liveSync}</span>
            </button>
            <button
              onClick={onOpenApiKeyModal}
              title={t.apiKeySettings}
              className="p-2.5 bg-[#f5f5f7] dark:bg-[#1f2937] border-l border-[#e5e5e7] dark:border-[#374151] text-[#86868b] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>

          {/* Voice Audio Briefing Button */}
          <button
            onClick={handleToggleVoice}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl border transition-all text-xs font-medium flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
              isSpeaking
                ? 'bg-red-600 text-white border-red-600 animate-pulse font-bold'
                : 'bg-white dark:bg-[#111827] border-[#e5e5e7] dark:border-[#374151] text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#1f2937]'
            }`}
            title={language === 'id' ? 'Dengarkan Briefing Suara AI' : 'Listen to Audio Situation Briefing'}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSpeaking ? t.stopVoice : t.listenVoice}</span>
          </button>

          {/* 1-Click Executive Briefing Button */}
          {onOpenBriefing && (
            <button
              onClick={onOpenBriefing}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
              title={language === 'id' ? 'Buka Ringkasan Eksekutif Siap Cetak (A4 PDF)' : 'Open Printable Executive Briefing (A4 PDF)'}
            >
              <Printer className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>{t.executiveBriefing}</span>
            </button>
          )}

          {/* Shareable Analysis Permalink Button */}
          {onShareLink && (
            <button
              onClick={onShareLink}
              className={`w-full sm:w-auto px-3 py-2 rounded-xl border transition-all text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
                isLinkCopied
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white dark:bg-[#111827] border-[#e5e5e7] dark:border-[#374151] text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#1f2937]'
              }`}
              title="Salin Tautan Analisis URL untuk Dibagikan"
            >
              {isLinkCopied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>{t.shareLinkCopied}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>{t.shareAnalysisLink}</span>
                </>
              )}
            </button>
          )}

        </div>
      </div>

      {/* Historic Disaster Benchmark Case Studies Strip */}
      {onSelectScenario && (
        <div className="px-4 sm:px-5 py-2 bg-[#f8fafc] dark:bg-[#111827] border-t border-[#e5e5e7] dark:border-[#1f2937] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-[#86868b] dark:text-[#9ca3af] font-bold text-[11px] uppercase tracking-wider shrink-0">
            <History className="w-3.5 h-3.5 text-blue-500" />
            <span>{t.scenariosTitle}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 flex-1 max-w-2xl">
            {[
              {
                id: 'el_nino_2015',
                title: t.scenario2015Title,
                badge: '2015 Peak (Kalteng)',
                activeBg: 'bg-red-600 text-white border-red-600 font-bold',
              },
              {
                id: 'iod_2019',
                title: t.scenario2019Title,
                badge: '2019 IOD+ (Sumsel)',
                activeBg: 'bg-amber-600 text-white border-amber-600 font-bold',
              },
              {
                id: 'restoration_2023',
                title: t.scenarioRestorationTitle,
                badge: '2023 BRGM (Riau)',
                activeBg: 'bg-emerald-600 text-white border-emerald-600 font-bold',
              },
            ].map((sc) => {
              const isSelected = activeScenario === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => onSelectScenario(isSelected ? null : sc.id)}
                  className={`px-3 py-1.5 rounded-xl border text-center transition cursor-pointer min-h-[38px] flex items-center justify-center gap-1 text-xs ${
                    isSelected
                      ? `${sc.activeBg} shadow-xs`
                      : 'bg-white dark:bg-[#151d2f] border-[#e5e5e7] dark:border-[#1f2937] text-[#1d1d1f] dark:text-[#e5e5e7] hover:border-[#0071e3]'
                  }`}
                  title={sc.badge}
                >
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span className="truncate">{sc.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Segmented View Mode Switcher (Clean, fast, uncluttered) */}
      <div className="px-4 sm:px-5 py-3 bg-[#fbfbfd] dark:bg-[#0f172a] border-t border-[#e5e5e7] dark:border-[#1f2937] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        
        {/* Left: Biome Info & Client-Side Engine Badge */}
        <div className="flex items-center gap-2 text-[#6e6e73] dark:text-[#9ca3af] flex-wrap">
          <span className="font-semibold text-[#1d1d1f] dark:text-white">{selectedAOI.biome}</span>
          <span className="text-[#86868b] dark:text-[#6b7280] hidden sm:inline">&bull;</span>
          <span className="hidden sm:inline text-[#86868b] dark:text-[#9ca3af]">{selectedAOI.description}</span>
          
          <span
            title={t.offlineEngineTooltip}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.offlineEngineBadge}</span>
          </span>
        </div>

        {/* Right: Segmented Tool Switcher - 100% Equal Width on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 bg-[#e5e5ea] dark:bg-[#1f2937] rounded-xl p-1 gap-1 w-full md:w-auto">
          <button
            onClick={() => onSelectView('main')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] ${
              activeView === 'main'
                ? 'bg-white dark:bg-[#374151] text-[#1d1d1f] dark:text-white shadow-xs font-bold'
                : 'text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.mainIntelCalendar}</span>
          </button>

          <button
            onClick={() => onSelectView('dual_map')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] ${
              activeView === 'dual_map'
                ? 'bg-white dark:bg-[#374151] text-[#1d1d1f] dark:text-white shadow-xs font-bold'
                : 'text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
          >
            <Split className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.dualMapCompare}</span>
          </button>

          <button
            onClick={() => onSelectView('polygon')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] ${
              activeView === 'polygon'
                ? 'bg-white dark:bg-[#374151] text-[#1d1d1f] dark:text-white shadow-xs font-bold'
                : 'text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.polygonInspector}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
