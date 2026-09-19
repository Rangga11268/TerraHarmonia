import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { DashboardControlBar } from './components/DashboardControlBar';
import { BurningCalendar } from './components/BurningCalendar';
import { MapViewer } from './components/MapViewer';
import { ComparisonMetrics } from './components/ComparisonMetrics';
import { CriticalAlerts } from './components/CriticalAlerts';
import { RiskForecast } from './components/RiskForecast';
import { HarmonizationLab } from './components/HarmonizationLab';
import { MitigationHub } from './components/MitigationHub';
import { DataHub } from './components/DataHub';
import { TeamModal } from './components/TeamModal';
import { NasaApiKeyModal } from './components/NasaApiKeyModal';
import { PRESET_AOIS, AOIRegion, RawHotspot, HarmonizedWeekData, harmonizeHotspots } from './engine/harmonizer';
import { generateHistoricalFireData } from './data/generator';
import { fetchLiveNASAHotspots, LiveSyncResult } from './services/nasaFirmsApi';
import { Language, translations } from './data/translations';
import { RefreshCw, Satellite, Sparkles } from 'lucide-react';

export function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
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
  const peakYear = highestYear ? highestYear[0] : '2015';
  const peakFRP = highestYear ? Math.round(highestYear[1].frp).toLocaleString() : '0';

  const sourceLabel =
    liveResult?.source === 'NASA_FIRMS_LIVE'
      ? 'NASA FIRMS 24H'
      : liveResult?.source === 'NASA_FIRMS_API_KEY'
      ? 'NASA FIRMS API'
      : 'Simulated NRT';

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Apple-style Translucent Navbar */}
      <Navbar
        language={language}
        onToggleLanguage={setLanguage}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenTeam={() => setIsTeamModalOpen(true)}
        isLiveSync={isLiveSync}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">

        {/* Tab 1: Live Intelligence & Harmonized Calendar (Overview) */}
        {activeTab === 'overview' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            
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

            {/* Live sync banner */}
            {isLiveSync && (
              <div className="bg-teal-50/80 border border-teal-200/80 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 text-xs shadow-xs">
                <div className="flex items-center gap-3">
                  <Satellite className="w-4 h-4 text-teal-600 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">
                      {t.liveSyncNotice} {selectedAOI.name}
                    </span>
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                      {sourceLabel}
                    </span>
                    <p className="text-zinc-500 mt-0.5">
                      {liveResult
                        ? `${liveResult.modisCount} MODIS + ${liveResult.viirsCount} VIIRS. ${t.liveSyncOvercount}`
                        : t.fetchingNasa}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 shrink-0">
                  <span className="text-[11px] hidden sm:block font-mono">{liveResult?.fetchTimestamp || ''}</span>
                  <button
                    onClick={() => loadLiveFeed(selectedAOI, userMapKey)}
                    disabled={isLoadingLive}
                    className="p-2 hover:text-teal-600 hover:bg-teal-100 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                    title={language === 'id' ? 'Perbarui data' : 'Refresh data'}
                    aria-label={language === 'id' ? 'Perbarui data' : 'Refresh data'}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            )}

            {/* Apple-style Differentiated Metric Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-0 bg-white border border-zinc-200/80 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
              {/* Hero stat */}
              <div className="sm:col-span-1 px-5 py-5 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-zinc-100 bg-amber-600">
                <p className="text-xs font-bold text-amber-100 tracking-wider uppercase">{t.rawDetections}</p>
                <div>
                  <div className="text-4xl sm:text-5xl font-extrabold text-white num tracking-tight leading-none mt-2">
                    {totalEvents.toLocaleString()}
                  </div>
                  <p className="text-xs text-amber-100/90 mt-1.5 font-medium">
                    {isLiveSync ? `${selectedAOI.name} (24h Live)` : t.rawDetectionsDesc}
                  </p>
                </div>
              </div>

              {/* 3 Secondary stats */}
              {[
                {
                  label: t.historicPeakYear,
                  value: peakYear,
                  sub: `${t.energyTotal}: ${peakFRP} MW`,
                  valueClass: 'text-slate-900',
                },
                {
                  label: t.spatialResolution,
                  value: '5.5 km',
                  sub: t.spatialResolutionDesc,
                  valueClass: 'text-slate-900',
                },
                {
                  label: t.unusualAnomalies,
                  value: `${anomalyCount}`,
                  sub: t.unusualAnomaliesDesc,
                  valueClass: anomalyCount > 10 ? 'text-red-600' : 'text-slate-900',
                },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="px-5 py-5 flex flex-col justify-between border-b sm:border-b-0 sm:border-r last:border-r-0 border-zinc-100"
                >
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{kpi.label}</p>
                  <div>
                    <div className={`text-3xl sm:text-4xl font-extrabold num tracking-tight leading-none mt-2 ${kpi.valueClass}`}>
                      {kpi.value}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1.5 leading-snug">{kpi.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 26-Year Burning Calendar */}
            <section>
              <BurningCalendar
                language={language}
                calendarMatrix={calendarMatrix}
                rawMode={rawMode}
                selectedKey={selectedKey}
                onSelectCell={handleSelectCell}
              />
            </section>

            {/* Map (Wider) + Side Analytics */}
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

              <div className="lg:col-span-4 space-y-4">
                <RiskForecast
                  language={language}
                  selectedAOI={selectedAOI}
                  calendarMatrix={calendarMatrix}
                  weeklyBaselines={weeklyBaselines}
                  isLiveSync={isLiveSync}
                  liveHotspotCount={displayedHotspots.length}
                />
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
          </div>
        )}

        {/* Tab 2: Harmonization Lab & Science */}
        {activeTab === 'lab' && (
          <div className="animate-in fade-in duration-300">
            <HarmonizationLab language={language} />
          </div>
        )}

        {/* Tab 3: Field Directives & Peatland Mitigation */}
        {activeTab === 'mitigation' && (
          <div className="animate-in fade-in duration-300">
            <MitigationHub
              language={language}
              selectedAOI={selectedAOI}
              onSelectAOI={setSelectedAOI}
            />
          </div>
        )}

        {/* Tab 4: Open Data Registry & Satellite Constellation */}
        {activeTab === 'data-hub' && (
          <div className="animate-in fade-in duration-300">
            <DataHub
              language={language}
              selectedAOI={selectedAOI}
              calendarMatrix={calendarMatrix}
              onOpenApiKeyModal={() => setIsNasaModalOpen(true)}
              userMapKey={userMapKey}
            />
          </div>
        )}
      </main>

      {/* Apple-style Minimal Footer */}
      <footer className="border-t border-zinc-200/80 bg-white py-6 px-4 sm:px-6 text-center text-xs text-zinc-400 space-y-1">
        <p className="font-medium text-slate-700">
          {t.appName} &bull; {t.appTagline} &bull; {t.footerChallenge}
        </p>
        <p>{t.footerCourtesy}</p>
      </footer>

      {/* Modals */}
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
            ? (language === 'id' ? 'Terhubung: Feed Satelit NASA FIRMS 24 Jam' : 'Connected: NASA FIRMS 24-Hour Satellite Feed')
            : liveResult?.source === 'NASA_FIRMS_API_KEY'
            ? (language === 'id' ? 'Terhubung: NASA FIRMS API Resmi' : 'Connected: NASA FIRMS Authorized API')
            : undefined
        }
      />
    </div>
  );
}
