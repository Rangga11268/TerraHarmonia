import React, { useState, useEffect, useRef } from 'react';
import { HarmonizedWeekData } from '../engine/harmonizer';
import { Language, translations } from '../data/translations';
import { Play, Pause, RotateCcw, Sparkles, Filter, ChevronRight } from 'lucide-react';

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
  onSelectCell
}) => {
  const t = translations[language];
  const MONTHS = language === 'id' ? MONTHS_ID : MONTHS_EN;
  
  const [hoveredData, setHoveredData] = useState<HarmonizedWeekData | null>(null);
  const [pinnedData, setPinnedData] = useState<HarmonizedWeekData | null>(null);
  
  // Interactive Timeline Player
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackYear, setPlaybackYear] = useState<number | null>(null);
  const playerTimerRef = useRef<any>(null);

  // Climate Filter preset
  const [activeClimateFilter, setActiveClimateFilter] = useState<'all' | '2015' | '2019' | '2023' | 'lanina'>('all');

  // Filtered Years
  const displayedYears = 
    activeClimateFilter === '2015' ? [2015]
    : activeClimateFilter === '2019' ? [2019]
    : activeClimateFilter === '2023' ? [2023]
    : activeClimateFilter === 'lanina' ? [2010, 2016, 2020]
    : ALL_YEARS;

  // Animation Playback Engine
  useEffect(() => {
    if (isPlaying) {
      playerTimerRef.current = setInterval(() => {
        setPlaybackYear((prev) => {
          const next = prev === null || prev >= 2026 ? 2000 : prev + 1;
          // Auto select peak week of that year
          const peakWeek = `${next}-38`;
          if (calendarMatrix[peakWeek]) {
            onSelectCell(peakWeek, calendarMatrix[peakWeek]);
            setPinnedData(calendarMatrix[peakWeek]);
          }
          return next;
        });
      }, 700);
    } else {
      if (playerTimerRef.current) clearInterval(playerTimerRef.current);
    }
    return () => {
      if (playerTimerRef.current) clearInterval(playerTimerRef.current);
    };
  }, [isPlaying, calendarMatrix, onSelectCell]);

  const getCellColor = (item?: HarmonizedWeekData) => {
    if (!item) return 'bg-[#f2f2f7] border-[#e5e5ea]';

    const value = rawMode
      ? Math.min(100, item.rawTotalCount * 2.2)
      : item.burningActivityIndex;

    if (value <= 0) return 'bg-[#f2f2f7] border-[#e5e5ea]';
    if (value < 15) return 'bg-[#fed7aa] border-[#fdba74]';
    if (value < 35) return 'bg-[#fb923c] border-[#f97316]';
    if (value < 65) return 'bg-[#ea580c] border-[#c2410c]';
    return 'bg-[#dc2626] border-[#b91c1c]';
  };

  const activeInspection = hoveredData || pinnedData || (selectedKey ? calendarMatrix[selectedKey] : null);

  return (
    <div className="bg-white border border-[#e5e5e7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      
      {/* Header & Quick Climate Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#e5e5e7]">
        <div>
          <h2 className="font-semibold text-base text-[#1d1d1f] flex items-baseline gap-2">
            <span>{t.calendarTitle}</span>
            <span className="text-xs text-[#86868b] font-normal num">2000 – 2026 (26 Tahun)</span>
          </h2>
          <p className="text-xs text-[#6e6e73] mt-0.5">
            {rawMode ? t.calendarSubRaw : t.calendarSubHarmonized}
          </p>
        </div>

        {/* Climate Event Selector & Time Player */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Timeline Animation Player */}
          <div className="flex items-center bg-[#f5f5f7] border border-[#e5e5e7] rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 font-semibold text-[#1d1d1f] hover:text-black transition"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Jeda Simulasi' : 'Putar 2000-2026'}</span>
            </button>
            {playbackYear && (
              <span className="px-2 py-0.5 text-[11px] font-bold num text-[#0071e3] bg-white rounded-lg shadow-2xs">
                {playbackYear}
              </span>
            )}
          </div>

          {/* Quick Climate Anomaly Jump */}
          <div className="flex items-center bg-[#e5e5ea] rounded-xl p-0.5 text-xs font-medium">
            <button
              onClick={() => { setActiveClimateFilter('all'); setIsPlaying(false); }}
              className={`px-2.5 py-1 rounded-lg transition ${
                activeClimateFilter === 'all' ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold' : 'text-[#6e6e73]'
              }`}
            >
              Semua (26 Thn)
            </button>
            <button
              onClick={() => { setActiveClimateFilter('2015'); setIsPlaying(false); }}
              className={`px-2.5 py-1 rounded-lg transition ${
                activeClimateFilter === '2015' ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold' : 'text-[#6e6e73]'
              }`}
            >
              El Niño 2015
            </button>
            <button
              onClick={() => { setActiveClimateFilter('2019'); setIsPlaying(false); }}
              className={`px-2.5 py-1 rounded-lg transition ${
                activeClimateFilter === '2019' ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold' : 'text-[#6e6e73]'
              }`}
            >
              El Niño 2019
            </button>
            <button
              onClick={() => { setActiveClimateFilter('lanina'); setIsPlaying(false); }}
              className={`px-2.5 py-1 rounded-lg transition ${
                activeClimateFilter === 'lanina' ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold' : 'text-[#6e6e73]'
              }`}
            >
              La Niña (Basah)
            </button>
          </div>
        </div>
      </div>

      {/* 52-Week Matrix Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[820px]">
          {/* Months Legend */}
          <div className="grid grid-cols-[64px_repeat(52,1fr)] text-[11px] text-[#86868b] text-center mb-1 font-medium">
            <div className="text-left font-semibold text-[#1d1d1f]">{t.year}</div>
            {Array.from({ length: 52 }, (_, i) => {
              const weekNum = i + 1;
              const isMonthStart = (weekNum - 1) % 4 === 0 && Math.floor((weekNum - 1) / 4) < 12;
              const monthName = isMonthStart ? MONTHS[Math.floor((weekNum - 1) / 4)] : '';
              return (
                <div key={weekNum} className="truncate">
                  {monthName || (weekNum % 5 === 0 ? weekNum : '')}
                </div>
              );
            })}
          </div>

          {/* Matrix Rows */}
          <div className="space-y-1">
            {displayedYears.map((year) => {
              const isDual = year >= 2012;
              const isCurrentPlayback = playbackYear === year;

              return (
                <div
                  key={year}
                  className={`grid grid-cols-[64px_repeat(52,1fr)] gap-0.5 items-center p-0.5 rounded-lg transition-colors ${
                    isCurrentPlayback ? 'bg-[#f5f5f7]' : ''
                  }`}
                >
                  <div className="text-[11px] font-medium text-[#1d1d1f] flex items-center justify-between pr-2.5 num">
                    <span className={isCurrentPlayback ? 'font-bold text-[#0071e3]' : ''}>{year}</span>
                    <span className="text-[9px] text-[#86868b]">
                      {isDual ? 'V+M' : 'MOD'}
                    </span>
                  </div>

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
                          }
                        }}
                        onMouseEnter={() => item && setHoveredData(item)}
                        onMouseLeave={() => setHoveredData(null)}
                        className={`h-4 w-full rounded-[2px] heat-cell cursor-pointer ${getCellColor(item)} ${
                          isSelected ? 'ring-2 ring-[#1d1d1f] z-10 relative' : ''
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

      {/* Rich Interactive Inspector Panel */}
      <div className="p-4 bg-[#f5f5f7] border border-[#e5e5e7] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        {activeInspection ? (
          <>
            <div className="space-y-1">
              <div className="font-bold text-sm text-[#1d1d1f] flex items-center gap-2">
                <span>
                  {t.year} {activeInspection.year}, {language === 'id' ? 'Minggu ke-' : 'Week '} {activeInspection.week} ({MONTHS[activeInspection.month - 1]})
                </span>
                {activeInspection.isUnusualCondition && (
                  <span className="text-[11px] font-semibold text-red-600">
                    · Lonjakan Anomali (+{activeInspection.zScore.toFixed(1)}σ)
                  </span>
                )}
                {activeInspection.isCriticalPeriod && !activeInspection.isUnusualCondition && (
                  <span className="text-[11px] font-medium text-amber-700">
                    · Periode Kering Musiman
                  </span>
                )}
              </div>

              <div className="text-[#6e6e73] space-x-3 text-xs">
                <span>Indeks Harmonisasi: <strong className="text-[#1d1d1f] num">{activeInspection.burningActivityIndex} / 100</strong></span>
                <span>·</span>
                <span>Daya Panas: <strong className="text-[#1d1d1f] num">{activeInspection.totalFrpCalibrated} MW</strong></span>
                <span>·</span>
                <span>Klaster 5.5 km: <strong className="text-[#1d1d1f] num">{activeInspection.harmonizedClusterCount}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[#86868b] sm:border-l sm:border-[#e5e5e7] sm:pl-4">
              <div>
                <span className="text-[10px] block">MODIS (1km)</span>
                <span className="font-semibold text-[#1d1d1f] num text-xs">{activeInspection.rawModisCount} titik</span>
              </div>
              <div>
                <span className="text-[10px] block">VIIRS (375m)</span>
                <span className="font-semibold text-[#1d1d1f] num text-xs">{activeInspection.rawViirsCount} titik</span>
              </div>
              <div>
                <span className="text-[10px] block">Total Mentah</span>
                <span className="font-semibold text-[#1d1d1f] num text-xs">{activeInspection.rawTotalCount} titik</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-[#86868b] text-xs">
            {t.selectPrompt}
          </div>
        )}
      </div>
    </div>
  );
};
