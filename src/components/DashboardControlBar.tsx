import React, { useState } from 'react';
import { Language, translations } from '../data/translations';
import { AOIRegion, PRESET_AOIS } from '../engine/harmonizer';
import { Radio, RefreshCw, Settings2, ChevronDown, Volume2, VolumeX, Split, FileText, MapPin } from 'lucide-react';
import { speakSituationBriefing, stopSpeakingBriefing } from '../utils/audioBriefing';

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
  onOpenDualMap?: () => void;
  onOpenExecutiveReport?: () => void;
  onOpenPolygonInspector?: () => void;
  totalHotspots?: number;
  anomalyCount?: number;
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
  onOpenDualMap,
  onOpenExecutiveReport,
  onOpenPolygonInspector,
  totalHotspots = 0,
  anomalyCount = 0,
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
    <div className="bg-white border border-[#e5e5e7] rounded-2xl shadow-xs overflow-hidden">
      
      {/* Primary Toolbar Controls */}
      <div className="px-4 sm:px-5 py-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">

        {/* Region Selector (Full width on mobile, max-w-md on desktop) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <label htmlFor="aoi-select" className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider shrink-0">
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
              className="w-full appearance-none bg-[#f5f5f7] border border-[#e5e5e7] rounded-xl pl-3.5 pr-9 py-2.5 text-xs sm:text-sm font-semibold text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] cursor-pointer"
            >
              {PRESET_AOIS.map((aoi) => (
                <option key={aoi.id} value={aoi.id}>
                  {aoi.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] pointer-events-none" />
          </div>
        </div>

        {/* Controls: Mode Toggle, NASA Live Sync, Voice & Tools */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
          
          {/* Mode Toggle (Apple style segmented switch) */}
          <div className="flex flex-1 sm:flex-initial rounded-xl bg-[#e5e5ea] p-0.5 text-xs font-medium">
            <button
              onClick={() => setRawMode(false)}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                !rawMode
                  ? 'bg-white text-[#1d1d1f] shadow-xs font-bold'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              {t.harmonized}
            </button>
            <button
              onClick={() => setRawMode(true)}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                rawMode
                  ? 'bg-white text-[#1d1d1f] shadow-xs font-bold'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              {t.rawSensors}
            </button>
          </div>

          {/* NASA Live Sync Button */}
          <div className="flex rounded-xl border border-[#e5e5e7] overflow-hidden text-xs shrink-0">
            <button
              onClick={onToggleLiveSync}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium transition-all cursor-pointer ${
                isLiveSync
                  ? 'bg-[#1d1d1f] text-white font-semibold'
                  : 'bg-white text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'
              }`}
            >
              {isLoadingLive ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Radio className={`w-3.5 h-3.5 ${isLiveSync ? 'text-red-500 animate-pulse' : ''}`} />
              )}
              <span>{isLiveSync ? (language === 'id' ? 'Live Satelit' : 'Live Sync') : t.liveSync}</span>
            </button>
            <button
              onClick={onOpenApiKeyModal}
              title={language === 'id' ? 'Pengaturan NASA MAP_KEY' : 'NASA MAP_KEY Settings'}
              className="p-1.5 bg-[#f5f5f7] border-l border-[#e5e5e7] text-[#86868b] hover:text-[#1d1d1f] transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Voice Audio Briefing Button */}
          <button
            onClick={handleToggleVoice}
            className={`p-2 rounded-xl border transition-all text-xs font-medium flex items-center gap-1.5 shrink-0 ${
              isSpeaking
                ? 'bg-red-600 text-white border-red-600 animate-pulse'
                : 'bg-white border-[#e5e5e7] text-[#1d1d1f] hover:bg-[#f5f5f7]'
            }`}
            title={language === 'id' ? 'Dengarkan Briefing Suara AI' : 'Listen to Audio Situation Briefing'}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden xl:inline">{isSpeaking ? 'Hentikan Suara' : 'Voice Briefing'}</span>
          </button>

        </div>
      </div>

      {/* Secondary Quick Action Bar (Dual Map, Dossier SitRep, Polygon Inspector) */}
      <div className="px-4 sm:px-5 py-2.5 bg-[#fbfbfd] border-t border-[#e5e5e7] flex flex-wrap items-center justify-between gap-2.5 text-xs">
        
        {/* Left: Biome Info */}
        <div className="flex items-center gap-2 text-[#6e6e73]">
          <span className="font-semibold text-[#1d1d1f]">{selectedAOI.biome}</span>
          <span className="text-[#86868b]">&bull;</span>
          <span className="hidden sm:inline text-[#86868b]">{selectedAOI.description}</span>
        </div>

        {/* Right: Analytical Tools Launcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {onOpenDualMap && (
            <button
              onClick={onOpenDualMap}
              className="px-2.5 py-1 rounded-lg border border-[#e5e5e7] bg-white hover:border-[#1d1d1f] text-[#1d1d1f] font-medium transition flex items-center gap-1.5 text-xs"
            >
              <Split className="w-3.5 h-3.5 text-[#6e6e73]" />
              <span>{language === 'id' ? 'Komparasi 2 Tahun' : 'Dual Map Comparison'}</span>
            </button>
          )}

          {onOpenPolygonInspector && (
            <button
              onClick={onOpenPolygonInspector}
              className="px-2.5 py-1 rounded-lg border border-[#e5e5e7] bg-white hover:border-[#1d1d1f] text-[#1d1d1f] font-medium transition flex items-center gap-1.5 text-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-[#6e6e73]" />
              <span>{language === 'id' ? 'Inspektur Poligon' : 'Polygon Inspector'}</span>
            </button>
          )}

          {onOpenExecutiveReport && (
            <button
              onClick={onOpenExecutiveReport}
              className="px-2.5 py-1 rounded-lg border border-[#e5e5e7] bg-white hover:border-[#1d1d1f] text-[#1d1d1f] font-medium transition flex items-center gap-1.5 text-xs"
            >
              <FileText className="w-3.5 h-3.5 text-[#6e6e73]" />
              <span>{language === 'id' ? 'Dossier SitRep A4' : 'Executive SitRep'}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
