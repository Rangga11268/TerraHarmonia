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
import { Flame, ShieldAlert, Radio, RefreshCw, Satellite } from 'lucide-react';

export function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedAOI, setSelectedAOI] = useState<AOIRegion>(PRESET_AOIS[0]);
  const [rawMode, setRawMode] = useState<boolean>(false);
  const [selectedKey, setSelectedKey] = useState<string | null>('2015-38');
  const [selectedWeekData, setSelectedWeekData] = useState<HarmonizedWeekData | null>(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState<boolean>(false);
  const [isNasaModalOpen, setIsNasaModalOpen] = useState<boolean>(false);

  const [isLiveSync, setIsLiveSync] = useState<boolean>(false);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);
  const [liveResult, setLiveResult] = useState<LiveSyncResult | null>(null);
  const [userMapKey, setUserMapKey] = useState<string>(() =>
    localStorage.getItem('terra_harmonia_map_key') || ''
  );

  const t = translations[language];

  const fullDataset = useMemo(() => generateHistoricalFireData(), []);
  const aoiHotspots = useMemo(() => fullDataset[selectedAOI.id] || [], [fullDataset, selectedAOI]);

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
    const next = !isLiveSync;
    setIsLiveSync(next);
    if (next) loadLiveFeed(selectedAOI, userMapKey);
  };

  const handleSaveMapKey = (key: string) => {
    setUserMapKey(key);
    localStorage.setItem('terra_harmonia_map_key', key);
    if (isLiveSync) loadLiveFeed(selectedAOI, key);
  };

  useEffect(() => {
    if (isLiveSync) loadLiveFeed(selectedAOI, userMapKey);
  }, [selectedAOI, isLiveSync, loadLiveFeed, userMapKey]);

  const displayedHotspots = useMemo(() => {
    if (isLiveSync && liveResult?.hotspots && liveResult.hotspots.length > 0) return liveResult.hotspots;
    return aoiHotspots;
  }, [isLiveSync, liveResult, aoiHotspots]);

  const { calendarMatrix, yearlyAverages, weeklyBaselines } = useMemo(
    () => harmonizeHotspots(aoiHotspots),
    [aoiHotspots]
  );

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
  const anomalyCount = Object.values(calendarMatrix).filter((c) => c.isUnusualCondition).length;

  const sourceLabel =
    liveResult?.source === 'NASA_FIRMS_LIVE'
      ? 'NASA FIRMS 24H Live'
      : liveResult?.source === 'NASA_FIRMS_API_KEY'
      ? 'NASA FIRMS API'
      : 'Simulated NRT';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header
        language={language}
        onToggleLanguage={setLanguage}
        onOpenTeam={() => setIsTeamModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Control bar */}
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

        {/* Live status banner */}
        {isLiveSync && (
          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-cyan-100 rounded-lg text-cyan-600">
                <Satellite className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-900">
                    {t.liveSyncNotice} {selectedAOI.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-700 border border-emerald-300">
                    {sourceLabel}
                  </span>
                </div>
                <p className="text-slate-500 mt-0.5">
                  {liveResult
                    ? `${liveResult.modisCount} MODIS + ${liveResult.viirsCount} VIIRS. ${t.liveSyncOvercount}`
                    : t.fetchingNasa}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] self-end sm:self-center">
              <span>{liveResult?.fetchTimestamp || ''}</span>
              <button
                onClick={() => loadLiveFeed(selectedAOI, userMapKey)}
                disabled={isLoadingLive}
                className="p-1.5 hover:text-cyan-600 hover:bg-cyan-100 rounded transition-colors"
                title={language === 'id' ? 'Perbarui data' : 'Refresh data'}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        )}

        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: t.rawDetections,
              value: totalEvents.toLocaleString(),
              sub: isLiveSync ? `${selectedAOI.name} (24h)` : t.rawDetectionsDesc,
              icon: <Radio className="w-4 h-4 text-cyan-500" />,
              accent: 'text-slate-900',
            },
            {
              label: t.historicPeakYear,
              value: `${highestYear ? highestYear[0] : '2015'}`,
              sub: `${t.energyTotal}: ${highestYear ? Math.round(highestYear[1].frp).toLocaleString() : '0'} MW`,
              icon: <Flame className="w-4 h-4 text-orange-500" />,
              accent: 'text-orange-600',
            },
            {
              label: t.spatialResolution,
              value: '5.5 km',
              sub: t.spatialResolutionDesc,
              icon: <RefreshCw className="w-4 h-4 text-emerald-500" />,
              accent: 'text-emerald-600',
            },
            {
              label: t.unusualAnomalies,
              value: `${anomalyCount} ${t.weeks}`,
              sub: t.unusualAnomaliesDesc,
              icon: <ShieldAlert className="w-4 h-4 text-red-500" />,
              accent: 'text-red-600',
            },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span className="font-medium">{kpi.label}</span>
                {kpi.icon}
              </div>
              <div className={`text-2xl font-bold font-mono ${kpi.accent}`}>{kpi.value}</div>
              <p className="text-[11px] text-slate-400 mt-1 leading-tight">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Burning Calendar */}
        <section>
          <BurningCalendar
            language={language}
            calendarMatrix={calendarMatrix}
            rawMode={rawMode}
            selectedKey={selectedKey}
            onSelectCell={handleSelectCell}
          />
        </section>

        {/* Map (wider) + Side analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8">
            <MapViewer
              language={language}
              selectedAOI={selectedAOI}
              hotspots={displayedHotspots}
              selectedWeekData={isLiveSync ? null : selectedWeekData}
              rawMode={rawMode}
              isLiveSync={isLiveSync}
              isLoading={isLoadingLive}
            />
          </div>

          <div className="lg:col-span-4 space-y-5">
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

      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-400 font-mono">
        <p>{t.appName} &bull; {t.appTagline} &bull; {t.footerChallenge}</p>
        <p className="mt-1">{t.footerCourtesy}</p>
      </footer>

      <TeamModal language={language} isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} />
      <NasaApiKeyModal
        language={language}
        isOpen={isNasaModalOpen}
        onClose={() => setIsNasaModalOpen(false)}
        currentKey={userMapKey}
        onSaveKey={handleSaveMapKey}
        onRefreshLive={() => loadLiveFeed(selectedAOI, userMapKey)}
        isLoading={isLoadingLive}
        sourceStatus={
          liveResult?.source === 'NASA_FIRMS_LIVE'
            ? (language === 'id' ? 'Terhubung: Feed Satelit NASA FIRMS 24 Jam' : 'Connected: NASA FIRMS 24-Hour Open Satellite Feed')
            : liveResult?.source === 'NASA_FIRMS_API_KEY'
            ? (language === 'id' ? 'Terhubung: NASA FIRMS API Resmi' : 'Connected: NASA FIRMS Authorized API')
            : undefined
        }
      />
    </div>
  );
}
