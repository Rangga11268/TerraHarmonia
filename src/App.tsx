import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { DashboardControlBar } from './components/DashboardControlBar';
import { BurningCalendar } from './components/BurningCalendar';
import { MapViewer } from './components/MapViewer';
import { ComparisonMetrics } from './components/ComparisonMetrics';
import { CriticalAlerts } from './components/CriticalAlerts';
import { TeamModal } from './components/TeamModal';
import { NasaApiKeyModal } from './components/NasaApiKeyModal';
import { PRESET_AOIS, AOIRegion, RawHotspot, HarmonizedWeekData, harmonizeHotspots } from './engine/harmonizer';
import { generateHistoricalFireData } from './data/generator';
import { fetchLiveNASAHotspots, LiveSyncResult } from './services/nasaFirmsApi';
import { Language, translations } from './data/translations';
import { Flame, ShieldAlert, Radio, RefreshCw, Satellite, CheckCircle } from 'lucide-react';

export function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedAOI, setSelectedAOI] = useState<AOIRegion>(PRESET_AOIS[0]);
  const [rawMode, setRawMode] = useState<boolean>(false);
  const [selectedKey, setSelectedKey] = useState<string | null>('2015-38');
  const [selectedWeekData, setSelectedWeekData] = useState<HarmonizedWeekData | null>(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState<boolean>(false);
  const [isNasaModalOpen, setIsNasaModalOpen] = useState<boolean>(false);

  // Live NASA Sync state
  const [isLiveSync, setIsLiveSync] = useState<boolean>(false);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);
  const [liveResult, setLiveResult] = useState<LiveSyncResult | null>(null);
  const [userMapKey, setUserMapKey] = useState<string>(() => {
    return localStorage.getItem('terra_harmonia_map_key') || '';
  });

  const t = translations[language];

  const fullDataset = useMemo(() => {
    return generateHistoricalFireData();
  }, []);

  const aoiHotspots = useMemo(() => {
    return fullDataset[selectedAOI.id] || [];
  }, [fullDataset, selectedAOI]);

  const loadLiveFeed = useCallback(async (aoi: AOIRegion, mapKey?: string) => {
    setIsLoadingLive(true);
    try {
      const result = await fetchLiveNASAHotspots(aoi, mapKey);
      setLiveResult(result);
    } catch (err) {
      console.error('Failed to load NASA FIRMS live feed:', err);
    } finally {
      setIsLoadingLive(false);
    }
  }, []);

  const handleToggleLiveSync = () => {
    const nextState = !isLiveSync;
    setIsLiveSync(nextState);
    if (nextState) {
      loadLiveFeed(selectedAOI, userMapKey);
    }
  };

  const handleSaveMapKey = (key: string) => {
    setUserMapKey(key);
    localStorage.setItem('terra_harmonia_map_key', key);
    if (isLiveSync) {
      loadLiveFeed(selectedAOI, key);
    }
  };

  useEffect(() => {
    if (isLiveSync) {
      loadLiveFeed(selectedAOI, userMapKey);
    }
  }, [selectedAOI, isLiveSync, loadLiveFeed, userMapKey]);

  const displayedHotspots = useMemo(() => {
    if (isLiveSync && liveResult?.hotspots && liveResult.hotspots.length > 0) {
      return liveResult.hotspots;
    }
    return aoiHotspots;
  }, [isLiveSync, liveResult, aoiHotspots]);

  const { calendarMatrix, yearlyAverages, weeklyBaselines } = useMemo(() => {
    return harmonizeHotspots(aoiHotspots);
  }, [aoiHotspots]);

  useMemo(() => {
    if (selectedKey && calendarMatrix[selectedKey]) {
      setSelectedWeekData(calendarMatrix[selectedKey]);
    }
  }, [selectedKey, calendarMatrix]);

  const handleSelectCell = (key: string, data: HarmonizedWeekData) => {
    setSelectedKey(key);
    setSelectedWeekData(data);
  };

  const totalEvents = displayedHotspots.length;
  const highestYear = Object.entries(yearlyAverages).sort((a, b) => b[1].frp - a[1].frp)[0];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Header
        language={language}
        onToggleLanguage={setLanguage}
        onOpenTeam={() => setIsTeamModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Decoupled Clean Control Bar */}
        <DashboardControlBar
          language={language}
          selectedAOI={selectedAOI}
          onSelectAOI={(aoi) => {
            setSelectedAOI(aoi);
            setSelectedKey(null);
            setSelectedWeekData(null);
          }}
          rawMode={rawMode}
          setRawMode={setRawMode}
          isLiveSync={isLiveSync}
          onToggleLiveSync={handleToggleLiveSync}
          isLoadingLive={isLoadingLive}
          onOpenApiKeyModal={() => setIsNasaModalOpen(true)}
        />

        {/* Live NASA FIRMS Status Banner */}
        {isLiveSync && (
          <div className="bg-cyan-950/40 border border-cyan-700/50 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-cyan-900/60 rounded-lg text-cyan-300">
                <Satellite className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">
                    {t.liveSyncNotice} {selectedAOI.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                    {liveResult?.source === 'NASA_FIRMS_LIVE' ? 'NASA FIRMS 24H LIVE' : liveResult?.source === 'NASA_FIRMS_API_KEY' ? 'NASA FIRMS API' : 'SIMULATED NRT FEED'}
                  </span>
                </div>
                <p className="text-slate-300 mt-0.5">
                  {liveResult ? `${liveResult.modisCount} MODIS + ${liveResult.viirsCount} VIIRS detections. ${t.liveSyncOvercount}` : t.fetchingNasa}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] self-end sm:self-center">
              <span>{liveResult?.fetchTimestamp || 'Just now'}</span>
              <button
                onClick={() => loadLiveFeed(selectedAOI, userMapKey)}
                disabled={isLoadingLive}
                className="p-1.5 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors"
                title="Refresh Live NASA Feed"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        )}

        {/* KPI Metric Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between text-slate-300 text-xs mb-1 font-mono">
              <span>{t.rawDetections}</span>
              <Radio className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {totalEvents.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isLiveSync ? `${selectedAOI.name} (Live 24h)` : t.rawDetectionsDesc}
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between text-slate-300 text-xs mb-1 font-mono">
              <span>{t.historicPeakYear}</span>
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-400">
              {t.year} {highestYear ? highestYear[0] : '2015'}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {t.energyTotal}: {highestYear ? Math.round(highestYear[1].frp).toLocaleString() : '0'} MW
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between text-slate-300 text-xs mb-1 font-mono">
              <span>{t.spatialResolution}</span>
              <RefreshCw className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              5.5 km Grid
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {t.spatialResolutionDesc}
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between text-slate-300 text-xs mb-1 font-mono">
              <span>{t.unusualAnomalies}</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-rose-400">
              {Object.values(calendarMatrix).filter((c) => c.isUnusualCondition).length} {t.weeks}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {t.unusualAnomaliesDesc}
            </p>
          </div>
        </div>

        {/* Central Core Deliverable: Burning Activity Calendar */}
        <section>
          <BurningCalendar
            language={language}
            calendarMatrix={calendarMatrix}
            rawMode={rawMode}
            selectedKey={selectedKey}
            onSelectCell={handleSelectCell}
          />
        </section>

        {/* Map and Multi-Sensor Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <MapViewer
              language={language}
              selectedAOI={selectedAOI}
              hotspots={displayedHotspots}
              selectedWeekData={isLiveSync ? null : selectedWeekData}
              rawMode={rawMode}
            />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <ComparisonMetrics
              language={language}
              selectedAOI={selectedAOI}
              yearlyAverages={yearlyAverages}
            />

            <CriticalAlerts
              language={language}
              selectedAOI={selectedAOI}
              calendarMatrix={calendarMatrix}
              weeklyBaselines={weeklyBaselines}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-900 py-4 px-4 text-center text-xs text-slate-400 font-mono">
        <p>
          {t.appName} : {t.appTagline} : {t.footerChallenge}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          {t.footerCourtesy}
        </p>
      </footer>

      <TeamModal
        language={language}
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />

      <NasaApiKeyModal
        language={language}
        isOpen={isNasaModalOpen}
        onClose={() => setIsNasaModalOpen(false)}
        currentKey={userMapKey}
        onSaveKey={handleSaveMapKey}
        onRefreshLive={() => loadLiveFeed(selectedAOI, userMapKey)}
        isLoading={isLoadingLive}
        sourceStatus={liveResult?.source === 'NASA_FIRMS_LIVE' ? 'Connected: NASA FIRMS 24-Hour Open Satellite Feed' : liveResult?.source === 'NASA_FIRMS_API_KEY' ? 'Connected: NASA FIRMS Authorized API' : 'Active: Near Real-Time Sensor Stream'}
      />
    </div>
  );
}
