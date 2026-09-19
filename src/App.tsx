import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Navbar, NavTab, ThemeMode } from './components/Navbar';
import { DashboardControlBar, OverviewViewMode } from './components/DashboardControlBar';
import { BurningCalendar } from './components/BurningCalendar';
import { MapViewer } from './components/MapViewer';
import { ComparisonMetrics } from './components/ComparisonMetrics';
import { VisualAnalytics } from './components/VisualAnalytics';
import { CriticalAlerts } from './components/CriticalAlerts';
import { RiskForecast } from './components/RiskForecast';
import { HarmonizationLab } from './components/HarmonizationLab';
import { MitigationHub } from './components/MitigationHub';
import { DataHub } from './components/DataHub';
import { TeamPage } from './components/TeamPage';
import { Footer } from './components/Footer';
import { NasaApiKeyModal } from './components/NasaApiKeyModal';
import { DualMapComparison } from './components/DualMapComparison';
import { PolygonInspector } from './components/PolygonInspector';
import { PRESET_AOIS, AOIRegion, RawHotspot, HarmonizedWeekData, harmonizeHotspots } from './engine/harmonizer';
import { generateHistoricalFireData } from './data/generator';
import { fetchLiveNASAHotspots, LiveSyncResult } from './services/nasaFirmsApi';
import { Language, translations } from './data/translations';
import { RefreshCw } from 'lucide-react';

export function App() {
  const [language, setLanguage] = useState<Language>('en');
  
  // Theme Mode: 'system' (default/automatic) | 'light' | 'dark'
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('terra_harmonia_theme') as ThemeMode | null;
    if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
    return 'system';
  });

  // Track system preference in real-time
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Listen to browser/OS prefers-color-scheme media query changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Compute resolved active theme ('light' | 'dark')
  const resolvedTheme: 'light' | 'dark' = useMemo(() => {
    if (themeMode === 'system') {
      return systemPrefersDark ? 'dark' : 'light';
    }
    return themeMode;
  }, [themeMode, systemPrefersDark]);

  // Apply dark class to <html> and persist preference
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('terra_harmonia_theme', themeMode);
  }, [resolvedTheme, themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => {
      if (prev === 'system') return resolvedTheme === 'dark' ? 'light' : 'dark';
      if (prev === 'light') return 'dark';
      return 'system';
    });
  };

  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [overviewView, setOverviewView] = useState<OverviewViewMode>('main');
  const [selectedAOI, setSelectedAOI] = useState<AOIRegion>(PRESET_AOIS[0]);
  const [rawMode, setRawMode] = useState<boolean>(false);
  const [selectedKey, setSelectedKey] = useState<string | null>('2015-38');
  const [selectedWeekData, setSelectedWeekData] = useState<HarmonizedWeekData | null>(null);
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

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#0b0f19] text-[#1d1d1f] dark:text-[#f3f4f6] flex flex-col font-sans transition-colors duration-200">
      
      {/* Apple-style Navigation */}
      <Navbar
        language={language}
        onToggleLanguage={setLanguage}
        theme={resolvedTheme}
        themeMode={themeMode}
        onToggleTheme={toggleTheme}
        onSetThemeMode={setThemeMode}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenTeam={() => setActiveTab('team')}
        isLiveSync={isLiveSync}
      />

      {/* Main Canvas */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">

        {/* Tab 1: Live Intelligence & Harmonized Calendar (Overview) */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Control bar with Segmented Tool Switcher */}
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
              activeView={overviewView}
              onSelectView={setOverviewView}
              totalHotspots={totalEvents}
              anomalyCount={anomalyCount}
            />

            {/* Live sync notification banner */}
            {isLiveSync && (
              <div className="bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-2xl px-5 py-3 flex items-center justify-between gap-3 text-xs shadow-xs">
                <div>
                  <span className="font-semibold text-[#1d1d1f] dark:text-white">
                    {t.liveSyncNotice} {selectedAOI.name}
                  </span>
                  <p className="text-[#86868b] dark:text-[#9ca3af] mt-0.5">
                    {liveResult
                      ? `${liveResult.modisCount} MODIS + ${liveResult.viirsCount} VIIRS. ${t.liveSyncOvercount}`
                      : t.fetchingNasa}
                  </p>
                </div>
                <button
                  onClick={() => loadLiveFeed(selectedAOI, userMapKey)}
                  disabled={isLoadingLive}
                  className="p-1.5 text-[#0071e3] dark:text-[#38bdf8] hover:underline transition-colors flex items-center gap-1 font-medium cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin' : ''}`} />
                  <span>{language === 'id' ? 'Segarkan' : 'Refresh'}</span>
                </button>
              </div>
            )}

            {/* VIEW MODE 1: Main Intelligence & 26-Year Matrix */}
            {overviewView === 'main' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Metric Strip (Clean Apple Design) */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-0 bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-2xl shadow-xs overflow-hidden">
                  
                  <div className="sm:col-span-1 px-5 py-5 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-[#e5e5e7] dark:border-[#1f2937] bg-[#fbfbfd] dark:bg-[#151d2f]">
                    <span className="text-xs font-semibold text-[#86868b] dark:text-[#9ca3af] tracking-wider uppercase">{t.rawDetections}</span>
                    <div>
                      <div className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] dark:text-white num tracking-tight leading-none mt-2">
                        {totalEvents.toLocaleString()}
                      </div>
                      <p className="text-xs text-[#86868b] dark:text-[#9ca3af] mt-1.5 font-medium">
                        {isLiveSync ? `${selectedAOI.name} (Live)` : t.rawDetectionsDesc}
                      </p>
                    </div>
                  </div>

                  {[
                    {
                      label: t.historicPeakYear,
                      value: peakYear,
                      sub: `${t.energyTotal}: ${peakFRP} MW`,
                      valueClass: 'text-[#1d1d1f] dark:text-white',
                    },
                    {
                      label: t.spatialResolution,
                      value: '5.5 km',
                      sub: t.spatialResolutionDesc,
                      valueClass: 'text-[#1d1d1f] dark:text-white',
                    },
                    {
                      label: t.unusualAnomalies,
                      value: `${anomalyCount}`,
                      sub: t.unusualAnomaliesDesc,
                      valueClass: anomalyCount > 10 ? 'text-red-600 dark:text-red-400' : 'text-[#1d1d1f] dark:text-white',
                    },
                  ].map((kpi) => (
                    <div
                      key={kpi.label}
                      className="px-5 py-5 flex flex-col justify-between border-b sm:border-b-0 sm:border-r last:border-r-0 border-[#e5e5e7] dark:border-[#1f2937]"
                    >
                      <span className="text-xs font-semibold text-[#86868b] dark:text-[#9ca3af] uppercase tracking-wider">{kpi.label}</span>
                      <div>
                        <div className={`text-3xl sm:text-4xl font-bold num tracking-tight leading-none mt-2 ${kpi.valueClass}`}>
                          {kpi.value}
                        </div>
                        <p className="text-[11px] text-[#86868b] dark:text-[#9ca3af] mt-1.5 leading-snug">{kpi.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interactive 26-Year Burning Calendar */}
                <section>
                  <BurningCalendar
                    language={language}
                    calendarMatrix={calendarMatrix}
                    rawMode={rawMode}
                    selectedKey={selectedKey}
                    onSelectCell={handleSelectCell}
                  />
                </section>

                {/* Geospatial & Prognosis Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Map Viewer */}
                  <div className="lg:col-span-7">
                    <MapViewer
                      language={language}
                      selectedAOI={selectedAOI}
                      onSelectAOI={setSelectedAOI}
                      hotspots={displayedHotspots}
                      selectedWeekData={isLiveSync ? null : selectedWeekData}
                      rawMode={rawMode}
                      isLiveSync={isLiveSync}
                      isLoading={isLoadingLive}
                    />
                  </div>

                  {/* Side Prognosis & Directives Column */}
                  <div className="lg:col-span-5 space-y-5">
                    <RiskForecast
                      language={language}
                      selectedAOI={selectedAOI}
                      calendarMatrix={calendarMatrix}
                      weeklyBaselines={weeklyBaselines}
                      isLiveSync={isLiveSync}
                      liveHotspotCount={displayedHotspots.length}
                    />
                    
                    <CriticalAlerts
                      language={language}
                      selectedAOI={selectedAOI}
                      calendarMatrix={calendarMatrix}
                      weeklyBaselines={weeklyBaselines}
                    />
                  </div>
                </div>

                {/* Scientific Visual Analytics & Charts Suite */}
                <section>
                  <VisualAnalytics
                    language={language}
                    selectedAOI={selectedAOI}
                    calendarMatrix={calendarMatrix}
                    rawMode={rawMode}
                  />
                </section>

                {/* Science Comparison Section */}
                <div className="grid grid-cols-1 gap-6">
                  <ComparisonMetrics
                    language={language}
                    selectedAOI={selectedAOI}
                    yearlyAverages={yearlyAverages}
                  />
                </div>
              </div>
            )}

            {/* VIEW MODE 2: Dedicated Dual Map Comparison */}
            {overviewView === 'dual_map' && (
              <div className="animate-in fade-in duration-150">
                <DualMapComparison
                  language={language}
                  selectedAOI={selectedAOI}
                  allHotspots={displayedHotspots}
                />
              </div>
            )}

            {/* VIEW MODE 3: Dedicated Polygon & Concession Inspector */}
            {overviewView === 'polygon' && (
              <div className="animate-in fade-in duration-150">
                <PolygonInspector
                  language={language}
                  selectedAOI={selectedAOI}
                  allHotspots={displayedHotspots}
                />
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Harmonization Lab */}
        {activeTab === 'lab' && (
          <div className="animate-in fade-in duration-200">
            <HarmonizationLab language={language} />
          </div>
        )}

        {/* Tab 3: Mitigation Hub & Executive SitRep */}
        {activeTab === 'mitigation' && (
          <div className="animate-in fade-in duration-200">
            <MitigationHub
              language={language}
              selectedAOI={selectedAOI}
              onSelectAOI={setSelectedAOI}
              calendarMatrix={calendarMatrix}
              totalHotspots={totalEvents}
            />
          </div>
        )}

        {/* Tab 4: Open Data Registry */}
        {activeTab === 'data-hub' && (
          <div className="animate-in fade-in duration-200">
            <DataHub
              language={language}
              selectedAOI={selectedAOI}
              calendarMatrix={calendarMatrix}
              onOpenApiKeyModal={() => setIsNasaModalOpen(true)}
              userMapKey={userMapKey}
            />
          </div>
        )}

        {/* Tab 5: Team Profile & Scientific Dossier */}
        {activeTab === 'team' && (
          <div className="animate-in fade-in duration-200">
            <TeamPage language={language} />
          </div>
        )}
      </main>

      {/* Immersive Orbital & NASA Terra Satellite Footer */}
      <Footer language={language} onSelectTab={setActiveTab} />

      {/* Technical Configuration Modal for MAP_KEY if requested */}
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
