import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HarmonizedWeekData } from '../engine/harmonizer';
import { Language, translations } from '../data/translations';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Calendar as CalendarIcon,
  BarChart3,
  Flame,
  Wind,
  Info,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface BurningCalendarProps {
  language: Language;
  calendarMatrix: Record<string, HarmonizedWeekData>;
  rawMode: boolean;
  selectedKey: string | null;
  onSelectCell: (key: string, data: HarmonizedWeekData) => void;
}

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const ALL_YEARS = Array.from({ length: 27 }, (_, i) => 2000 + i);

export const BurningCalendar: React.FC<BurningCalendarProps> = ({
  language,
  calendarMatrix,
  rawMode,
  selectedKey,
  onSelectCell,
}) => {
  const t = translations[language];
  const MONTHS = language === 'id' ? MONTHS_ID : MONTHS_EN;

  // View modes: 'matrix' (Dense 52-week heatmap) or 'monthly' (Mobile-first monthly card breakdown)
  const [viewMode, setViewMode] = useState<'matrix' | 'monthly'>('matrix');
  const [hoveredData, setHoveredData] = useState<HarmonizedWeekData | null>(null);
  const [pinnedData, setPinnedData] = useState<HarmonizedWeekData | null>(null);

  // Focus year for monthly view
  const [focusYear, setFocusYear] = useState<number>(2023);

  // Playback engine
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackYear, setPlaybackYear] = useState<number | null>(null);
  const playerTimerRef = useRef<any>(null);

  // Climate filter preset
  const [activeClimateFilter, setActiveClimateFilter] = useState<'all' | '2015' | '2019' | '2023' | 'lanina'>('all');

  // Filtered Years
  const displayedYears = useMemo(() => {
    if (activeClimateFilter === '2015') return [2015];
    if (activeClimateFilter === '2019') return [2019];
    if (activeClimateFilter === '2023') return [2023];
    if (activeClimateFilter === 'lanina') return [2010, 2016, 2020];
    return ALL_YEARS;
  }, [activeClimateFilter]);

  // Animation Playback Engine
  useEffect(() => {
    if (isPlaying) {
      playerTimerRef.current = setInterval(() => {
        setPlaybackYear((prev) => {
          const next = prev === null || prev >= 2026 ? 2000 : prev + 1;
          setFocusYear(next);
          // Auto select peak week of that year (typically week 36-38 in Sept)
          const peakWeek = `${next}-37`;
          if (calendarMatrix[peakWeek]) {
            onSelectCell(peakWeek, calendarMatrix[peakWeek]);
            setPinnedData(calendarMatrix[peakWeek]);
          }
          return next;
        });
      }, 800);
    } else {
      if (playerTimerRef.current) clearInterval(playerTimerRef.current);
    }
    return () => {
      if (playerTimerRef.current) clearInterval(playerTimerRef.current);
    };
  }, [isPlaying, calendarMatrix, onSelectCell]);

  // Color intensity scale
  const getCellColor = (item?: HarmonizedWeekData) => {
    if (!item) return 'bg-[#f2f2f7] hover:bg-[#e5e5ea]';

    const value = rawMode
      ? Math.min(100, item.rawTotalCount * 2.2)
      : item.burningActivityIndex;

    if (value <= 0) return 'bg-[#f2f2f7] hover:bg-[#e5e5ea]';
    if (value < 15) return 'bg-[#fef08a] hover:bg-[#fde047]'; // Level 1 (Rendah)
    if (value < 35) return 'bg-[#fed7aa] hover:bg-[#fdba74]'; // Level 2 (Sedang)
    if (value < 65) return 'bg-[#fb923c] hover:bg-[#f97316]'; // Level 3 (Tinggi)
    return 'bg-[#dc2626] hover:bg-[#b91c1c] text-white';      // Level 4 (Ekstrem)
  };

  const activeInspection = hoveredData || pinnedData || (selectedKey ? calendarMatrix[selectedKey] : null);

  // Monthly aggregated data for focusYear (Mobile card view)
  const monthlyDataForFocusYear = useMemo(() => {
    const monthlyStats: Array<{
      monthIndex: number;
      monthName: string;
      totalFRP: number;
      harmonizedCount: number;
      rawCount: number;
      maxIndex: number;
      isPeakDry: boolean;
      weeks: HarmonizedWeekData[];
    }> = [];

    for (let m = 1; m <= 12; m++) {
      const monthWeeks: HarmonizedWeekData[] = [];
      let totalFRP = 0;
      let harmonizedCount = 0;
      let rawCount = 0;
      let maxIndex = 0;

      for (let w = 1; w <= 52; w++) {
        const item = calendarMatrix[`${focusYear}-${w}`];
        if (item && item.month === m) {
          monthWeeks.push(item);
          totalFRP += item.totalFrpCalibrated;
          harmonizedCount += item.harmonizedClusterCount;
          rawCount += item.rawTotalCount;
          if (item.burningActivityIndex > maxIndex) {
            maxIndex = item.burningActivityIndex;
          }
        }
      }

      monthlyStats.push({
        monthIndex: m,
        monthName: MONTHS[m - 1],
        totalFRP,
        harmonizedCount,
        rawCount,
        maxIndex,
        isPeakDry: m >= 7 && m <= 10,
        weeks: monthWeeks,
      });
    }

    return monthlyStats;
  }, [focusYear, calendarMatrix, MONTHS]);

  return (
    <div className="bg-white border border-[#e5e5e7] rounded-2xl p-4 sm:p-6 shadow-xs space-y-5 transition-all">
      
      {/* Top Header & Interactive View Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#e5e5e7]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base sm:text-lg text-[#1d1d1f] tracking-tight">
              {t.calendarTitle}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#6e6e73] border border-[#e5e5e7] num">
              2000 – 2026 (26 Tahun)
            </span>
          </div>
          <p className="text-xs text-[#6e6e73] mt-1 leading-relaxed">
            {rawMode ? t.calendarSubRaw : t.calendarSubHarmonized}
          </p>
        </div>

        {/* View Mode Toggle & Timeline Animation Player */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Segmented View Switcher: Matrix vs Monthly */}
          <div className="flex items-center bg-[#f5f5f7] rounded-xl p-0.5 text-xs font-medium border border-[#e5e5e7]">
            <button
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Matriks 52-Minggu</span>
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'monthly'
                  ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Kartu Bulanan</span>
            </button>
          </div>

          {/* Time-lapse Playback Engine Button */}
          <div className="flex items-center bg-[#f5f5f7] border border-[#e5e5e7] rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 font-bold text-[#1d1d1f] hover:text-black transition cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current text-red-600" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current text-[#0071e3]" />
              )}
              <span>{isPlaying ? 'Jeda Simulasi' : 'Putar 2000–2026'}</span>
            </button>
            {playbackYear && (
              <span className="px-2 py-0.5 text-xs font-bold num text-[#0071e3] bg-white rounded-lg shadow-2xs border border-[#e5e5e7]">
                {playbackYear}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Climate Anomaly Quick Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          <span className="text-[#86868b] font-medium mr-1 text-[11px] uppercase tracking-wider hidden sm:inline">
            Anomali Iklim:
          </span>
          {[
            { key: 'all', label: 'Semua (26 Tahun)' },
            { key: '2015', label: '🔥 El Niño 2015 (Super Peak)' },
            { key: '2019', label: '⚠️ El Niño 2019 (IOD+)' },
            { key: '2023', label: '🍂 El Niño 2023' },
            { key: 'lanina', label: '🌧️ La Niña (Basah 2010/16/20)' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                setActiveClimateFilter(key as any);
                setIsPlaying(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeClimateFilter === key
                  ? 'bg-[#1d1d1f] text-white font-semibold shadow-xs'
                  : 'bg-[#f5f5f7] text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#e5e5ea]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Dynamic Dry Season Peak Badge */}
        <div className="flex items-center gap-2 text-[11px] text-[#86868b]">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
          <span>Musim Kemarau Utama: <b>Agustus – Oktober</b></span>
        </div>
      </div>

      {/* MODE 1: 52-Week Dense Contribution Heatmap */}
      {viewMode === 'matrix' && (
        <div className="space-y-3">
          
          {/* Scrollable Heatmap Container with Custom Scroll Styling */}
          <div className="overflow-x-auto pb-2 border border-[#e5e5e7] rounded-xl bg-[#fafafa] p-3 sm:p-4">
            <div className="min-w-[840px]">
              
              {/* Month Header Legend with Dry Season Band */}
              <div className="grid grid-cols-[68px_repeat(52,1fr)] text-[11px] text-[#86868b] text-center mb-2 font-medium items-center">
                <div className="text-left font-bold text-[#1d1d1f] pl-1">
                  {t.year}
                </div>
                {Array.from({ length: 52 }, (_, i) => {
                  const weekNum = i + 1;
                  const isMonthStart = (weekNum - 1) % 4 === 0 && Math.floor((weekNum - 1) / 4) < 12;
                  const monthIdx = Math.floor((weekNum - 1) / 4);
                  const monthName = isMonthStart ? MONTHS[monthIdx] : '';
                  const isDryPeak = monthIdx >= 7 && monthIdx <= 9; // Aug - Oct

                  return (
                    <div
                      key={weekNum}
                      className={`truncate py-0.5 rounded-sm ${
                        isDryPeak && isMonthStart ? 'text-red-700 font-bold bg-red-100/60' : ''
                      }`}
                    >
                      {monthName || (weekNum % 5 === 0 ? weekNum : '')}
                    </div>
                  );
                })}
              </div>

              {/* Matrix Heat Rows */}
              <div className="space-y-1">
                {displayedYears.map((year) => {
                  const isDual = year >= 2012;
                  const isCurrentPlayback = playbackYear === year || focusYear === year;

                  return (
                    <div
                      key={year}
                      className={`grid grid-cols-[68px_repeat(52,1fr)] gap-0.5 items-center p-1 rounded-lg transition-colors ${
                        isCurrentPlayback ? 'bg-blue-50/70 ring-1 ring-[#0071e3]' : 'hover:bg-white'
                      }`}
                    >
                      {/* Year Header Label */}
                      <button
                        onClick={() => {
                          setFocusYear(year);
                          setViewMode('monthly');
                        }}
                        className="text-[11px] font-bold text-[#1d1d1f] flex items-center justify-between pr-2.5 num cursor-pointer hover:text-[#0071e3]"
                        title={`Klik untuk melihat rincian bulanan tahun ${year}`}
                      >
                        <span className={isCurrentPlayback ? 'text-[#0071e3]' : ''}>{year}</span>
                        <span className="text-[9px] text-[#86868b] font-normal">
                          {isDual ? 'V+M' : 'MOD'}
                        </span>
                      </button>

                      {/* 52 Week Heatmap Cells */}
                      {Array.from({ length: 52 }, (_, i) => {
                        const week = i + 1;
                        const key = `${year}-${week}`;
                        const item = calendarMatrix[key];
                        const isSelected = selectedKey === key;

                        return (
                          <button
                            key={key}
                            onClick={() => {
                              if (item) {
                                onSelectCell(key, item);
                                setPinnedData(item);
                                setFocusYear(year);
                              }
                            }}
                            onMouseEnter={() => item && setHoveredData(item)}
                            onMouseLeave={() => setHoveredData(null)}
                            className={`h-4 sm:h-4.5 w-full rounded-[2.5px] heat-cell transition-transform hover:scale-125 hover:z-20 cursor-pointer ${getCellColor(
                              item
                            )} ${
                              isSelected
                                ? 'ring-2 ring-[#1d1d1f] scale-110 z-10 relative shadow-xs'
                                : ''
                            }`}
                            aria-label={`${t.year} ${year}, Week ${week}`}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: Mobile-Friendly Monthly Cards (12 Months Breakdown) */}
      {viewMode === 'monthly' && (
        <div className="space-y-4">
          
          {/* Year Navigator Bar */}
          <div className="flex items-center justify-between bg-[#f5f5f7] border border-[#e5e5e7] rounded-xl p-3">
            <button
              onClick={() => setFocusYear((prev) => Math.max(2000, prev - 1))}
              disabled={focusYear <= 2000}
              className="p-1.5 rounded-lg hover:bg-white text-[#1d1d1f] disabled:opacity-30 transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="text-xl font-bold text-[#1d1d1f] num">{focusYear}</div>
              <p className="text-[11px] text-[#86868b]">
                {focusYear >= 2012 ? 'Era Sensor Ganda (MODIS + VIIRS)' : 'Era Sensor Tunggal (MODIS 1km)'}
              </p>
            </div>

            <button
              onClick={() => setFocusYear((prev) => Math.min(2026, prev + 1))}
              disabled={focusYear >= 2026}
              className="p-1.5 rounded-lg hover:bg-white text-[#1d1d1f] disabled:opacity-30 transition cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* 12-Month Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {monthlyDataForFocusYear.map((m) => {
              const hasExtreme = m.maxIndex > 50;
              const hasModerate = m.maxIndex > 20;

              return (
                <div
                  key={m.monthIndex}
                  className={`p-3.5 rounded-xl border transition-all ${
                    m.isPeakDry
                      ? 'bg-red-50/40 border-red-200 shadow-2xs'
                      : 'bg-white border-[#e5e5e7] hover:border-[#1d1d1f]/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#1d1d1f]">{m.monthName}</span>
                    {m.isPeakDry && (
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-100 px-1.5 py-0.5 rounded">
                        Puncak Kering
                      </span>
                    )}
                  </div>

                  {/* 4 Weekly Cells for this month */}
                  <div className="grid grid-cols-4 gap-1 my-2.5">
                    {m.weeks.map((w) => {
                      const key = `${w.year}-${w.week}`;
                      const isSelected = selectedKey === key;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            onSelectCell(key, w);
                            setPinnedData(w);
                          }}
                          className={`h-6 rounded-md transition-transform hover:scale-105 cursor-pointer ${getCellColor(
                            w
                          )} ${isSelected ? 'ring-2 ring-[#1d1d1f]' : ''}`}
                          title={`W${w.week}: Indeks ${w.burningActivityIndex}`}
                        />
                      );
                    })}
                  </div>

                  <div className="text-[11px] text-[#6e6e73] space-y-0.5 pt-2 border-t border-[#e5e5e7]">
                    <div className="flex justify-between">
                      <span>Daya Panas (FRP):</span>
                      <strong className="text-[#1d1d1f] num">{m.totalFRP} MW</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Klaster Gambut:</span>
                      <strong className="text-[#1d1d1f] num">{m.harmonizedCount} klaster</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Detail Inspector Bottom Card */}
      <div className="p-4 sm:p-5 bg-[#f5f5f7] border border-[#e5e5e7] rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
        {activeInspection ? (
          <>
            <div className="space-y-1.5">
              <div className="font-bold text-sm sm:text-base text-[#1d1d1f] flex flex-wrap items-center gap-2">
                <span>
                  {t.year} {activeInspection.year}, {language === 'id' ? 'Minggu ke-' : 'Week '} {activeInspection.week} ({MONTHS[activeInspection.month - 1]})
                </span>
                {activeInspection.isUnusualCondition && (
                  <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-md">
                    Lonjakan Anomali (+{activeInspection.zScore.toFixed(1)}σ)
                  </span>
                )}
                {activeInspection.isCriticalPeriod && !activeInspection.isUnusualCondition && (
                  <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                    Periode Rawan Kering
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#6e6e73] text-xs">
                <span>Indeks Harmonisasi: <strong className="text-[#1d1d1f] num text-sm">{activeInspection.burningActivityIndex} / 100</strong></span>
                <span>&bull;</span>
                <span>Daya Panas Termal: <strong className="text-[#1d1d1f] num text-sm">{activeInspection.totalFrpCalibrated} MW</strong></span>
                <span>&bull;</span>
                <span>Klaster 5.5 km: <strong className="text-[#1d1d1f] num text-sm">{activeInspection.harmonizedClusterCount}</strong></span>
              </div>
            </div>

            {/* Sensor Breakdown Pills */}
            <div className="flex items-center gap-3 text-[#86868b] lg:border-l lg:border-[#e5e5e7] lg:pl-5 shrink-0">
              <div className="bg-white p-2 rounded-xl border border-[#e5e5e7] text-center min-w-[70px]">
                <span className="text-[10px] block text-[#86868b]">MODIS (1km)</span>
                <span className="font-bold text-[#1d1d1f] num text-xs sm:text-sm">{activeInspection.rawModisCount}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-[#e5e5e7] text-center min-w-[70px]">
                <span className="text-[10px] block text-[#86868b]">VIIRS (375m)</span>
                <span className="font-bold text-[#1d1d1f] num text-xs sm:text-sm">{activeInspection.rawViirsCount}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-[#e5e5e7] text-center min-w-[70px]">
                <span className="text-[10px] block text-[#86868b]">Total Deteksi</span>
                <span className="font-bold text-[#1d1d1f] num text-xs sm:text-sm">{activeInspection.rawTotalCount}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-[#86868b] text-xs py-1">
            <Info className="w-4 h-4 text-[#0071e3] shrink-0" />
            <span>{t.selectPrompt} atau klik salah satu sel kalender di atas untuk memeriksa data mingguan.</span>
          </div>
        )}
      </div>

      {/* Heat Scale Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-[#86868b]">
        <span className="font-medium text-[#1d1d1f]">Skala Intensitas Kebakaran & Emisi:</span>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-[2px] bg-[#f2f2f7] border border-[#e5e5ea]" />
            <span>Aman (0)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-[2px] bg-[#fef08a] border border-[#fde047]" />
            <span>Rendah (1–15)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-[2px] bg-[#fed7aa] border border-[#fdba74]" />
            <span>Sedang (15–35)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-[2px] bg-[#fb923c] border border-[#f97316]" />
            <span>Tinggi (35–65)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-[2px] bg-[#dc2626] border border-[#b91c1c]" />
            <span>Ekstrem (&gt;65)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
