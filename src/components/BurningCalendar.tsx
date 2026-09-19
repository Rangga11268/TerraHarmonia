import React, { useState } from 'react';
import { Calendar as CalendarIcon, Grid, ListFilter, Flame, AlertTriangle, Info } from 'lucide-react';
import { HarmonizedWeekData } from '../engine/harmonizer';
import { Language, translations } from '../data/translations';

interface BurningCalendarProps {
  language: Language;
  calendarMatrix: Record<string, HarmonizedWeekData>;
  rawMode: boolean;
  selectedKey: string | null;
  onSelectCell: (key: string, data: HarmonizedWeekData) => void;
}

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const YEARS = Array.from({ length: 27 }, (_, i) => 2000 + i);

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
  const [mobileViewYear, setMobileViewYear] = useState<number>(2015);
  const [viewMode, setViewMode] = useState<'matrix' | 'focused'>('matrix');

  const getCellColor = (item?: HarmonizedWeekData) => {
    if (!item) return 'bg-slate-100 border-slate-200';

    const value = rawMode
      ? Math.min(100, item.rawTotalCount * 2.2)
      : item.burningActivityIndex;

    if (value <= 0) return 'bg-slate-100 border-slate-200';
    if (value < 15) return 'bg-teal-100 border-teal-300';
    if (value < 35) return 'bg-amber-300 border-amber-400';
    if (value < 65) return 'bg-orange-400 border-orange-500';
    return 'bg-red-500 border-red-600';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="w-5 h-5 text-orange-500 shrink-0" />
          <div>
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              {t.calendarTitle}
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 font-mono">
                {t.calendarSpan}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {rawMode ? t.calendarSubRaw : t.calendarSubHarmonized}
            </p>
          </div>
        </div>

        {/* Legend + view switch */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-600">{t.scale}:</span>
            <span className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-300 inline-block" title={t.zero} />
            <span className="w-3 h-3 rounded-sm bg-teal-200 border border-teal-400 inline-block" title={t.low} />
            <span className="w-3 h-3 rounded-sm bg-amber-300 border border-amber-400 inline-block" title={t.moderate} />
            <span className="w-3 h-3 rounded-sm bg-orange-400 border border-orange-500 inline-block" title={t.high} />
            <span className="w-3 h-3 rounded-sm bg-red-500 border border-red-600 inline-block" title={t.severe} />
            <span className="text-slate-500 font-semibold ml-0.5">{t.severe}</span>
          </div>

          <div className="flex md:hidden bg-slate-50 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-2 py-1 rounded flex items-center gap-1 min-h-[36px] font-medium ${
                viewMode === 'matrix' ? 'bg-orange-500 text-white' : 'text-slate-500'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              {t.fullView}
            </button>
            <button
              onClick={() => setViewMode('focused')}
              className={`px-2 py-1 rounded flex items-center gap-1 min-h-[36px] font-medium ${
                viewMode === 'focused' ? 'bg-orange-500 text-white' : 'text-slate-500'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              {t.cardView}
            </button>
          </div>
        </div>
      </div>

      {/* Full Matrix */}
      <div className={`${viewMode === 'focused' ? 'hidden md:block' : 'block'} mt-4 overflow-x-auto pb-2`}>
        <div className="min-w-[800px]">
          {/* Month header */}
          <div className="grid grid-cols-[68px_repeat(52,1fr)] text-[11px] font-mono text-slate-400 text-center mb-1.5">
            <div className="text-left font-bold text-slate-600">{t.year}</div>
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

          {/* Matrix rows */}
          <div className="space-y-0.5">
            {YEARS.map((year) => {
              const isDual = year >= 2012;
              return (
                <div key={year} className="grid grid-cols-[68px_repeat(52,1fr)] gap-0.5 items-center">
                  <div className="text-[11px] font-mono text-slate-600 font-semibold flex items-center gap-1">
                    <span>{year}</span>
                    <span
                      className={`text-[9px] px-1 rounded font-mono ${
                        isDual
                          ? 'bg-cyan-50 text-cyan-600 border border-cyan-200'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                      title={isDual ? 'MODIS + VIIRS' : 'MODIS only'}
                    >
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
                        onClick={() => item && onSelectCell(key, item)}
                        onMouseEnter={() => item && setHoveredData(item)}
                        onMouseLeave={() => setHoveredData(null)}
                        onFocus={() => item && setHoveredData(item)}
                        className={`h-4 w-full rounded-[2px] border heat-cell ${getCellColor(item)} ${
                          isSelected ? 'ring-2 ring-orange-500 z-10 relative' : ''
                        } ${
                          item?.isUnusualCondition ? 'ring-1 ring-red-400' : ''
                        } focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none`}
                        aria-label={`${t.year} ${year}, ${language === 'id' ? 'Minggu' : 'Week'} ${week}, ${item?.burningActivityIndex || 0}/100`}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Focused Year */}
      <div className={`${viewMode === 'focused' ? 'block md:hidden' : 'hidden'} mt-4 space-y-3`}>
        <div className="flex items-center justify-between">
          <label htmlFor="year-select" className="text-xs font-semibold text-slate-700">{t.selectYear}</label>
          <select
            id="year-select"
            value={mobileViewYear}
            onChange={(e) => setMobileViewYear(Number(e.target.value))}
            className="border border-slate-200 bg-white text-slate-900 px-3 py-1.5 rounded-lg text-sm min-h-[44px] focus:ring-1 focus:ring-orange-400 focus:outline-none"
          >
            {YEARS.map((yr) => (
              <option key={yr} value={yr}>{t.year} {yr} {yr >= 2012 ? '(MODIS + VIIRS)' : '(MODIS)'}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 12 }, (_, mIdx) => {
            const startWk = Math.round((mIdx * 4.33) + 1);
            const endWk = Math.min(52, Math.round(((mIdx + 1) * 4.33)));
            const monthWeeks: HarmonizedWeekData[] = [];
            for (let w = startWk; w <= endWk; w++) {
              const k = `${mobileViewYear}-${w}`;
              if (calendarMatrix[k]) monthWeeks.push(calendarMatrix[k]);
            }
            const avgScore = monthWeeks.length > 0
              ? Math.round(monthWeeks.reduce((acc, c) => acc + c.burningActivityIndex, 0) / monthWeeks.length)
              : 0;

            return (
              <div key={mIdx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs min-h-[70px] flex flex-col justify-between">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span>{MONTHS[mIdx]}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                    avgScore > 40 ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {avgScore}
                  </span>
                </div>
                <div className="flex gap-1 mt-2">
                  {monthWeeks.map((wk) => (
                    <button
                      key={wk.week}
                      onClick={() => onSelectCell(`${mobileViewYear}-${wk.week}`, wk)}
                      className={`flex-1 h-7 rounded border text-[10px] font-mono flex items-center justify-center min-h-[36px] ${getCellColor(wk)}`}
                      aria-label={`${t.year} ${mobileViewYear}, ${language === 'id' ? 'Minggu' : 'Week'} ${wk.week}`}
                    >
                      {wk.week}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="mt-4 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-4">
        {hoveredData ? (
          <>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-50 border border-orange-200 shrink-0">
                <Flame className={`w-5 h-5 ${hoveredData.burningActivityIndex > 40 ? 'text-orange-500' : 'text-amber-500'}`} />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 flex items-center gap-2 flex-wrap">
                  <span>{t.year} {hoveredData.year}, {language === 'id' ? 'Minggu' : 'Week'} {hoveredData.week} ({MONTHS[hoveredData.month - 1]})</span>
                  {hoveredData.isUnusualCondition && (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200 text-[11px] font-mono flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {t.unusualSpike} (+{hoveredData.zScore.toFixed(1)}x)
                    </span>
                  )}
                  {hoveredData.isCriticalPeriod && !hoveredData.isUnusualCondition && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-300 text-[11px] font-mono">
                      {t.criticalPeakWindow}
                    </span>
                  )}
                </div>
                <div className="text-slate-500 font-mono text-[11px] mt-1 space-x-2">
                  <span>{t.harmonizedIndex} <strong className="text-orange-600">{hoveredData.burningActivityIndex}/100</strong></span>
                  <span>|</span>
                  <span>FRP <strong className="text-cyan-600">{hoveredData.totalFrpCalibrated} MW</strong></span>
                  <span>|</span>
                  <span>{language === 'id' ? 'Klaster' : 'Clusters'} <strong className="text-slate-700">{hoveredData.harmonizedClusterCount}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 font-mono text-xs text-slate-500 border-l border-slate-200 pl-4">
              <div>
                <div className="text-[10px] uppercase text-slate-400">MODIS</div>
                <div className="font-semibold text-slate-700">{hoveredData.rawModisCount}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-slate-400">VIIRS</div>
                <div className="font-semibold text-cyan-600">{hoveredData.rawViirsCount}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-slate-400">{language === 'id' ? 'Total' : 'Raw'}</div>
                <div className="font-semibold text-slate-700">{hoveredData.rawTotalCount}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-slate-500">
            <Info className="w-4 h-4 text-cyan-500 shrink-0" />
            <span>{t.selectPrompt}</span>
          </div>
        )}
      </div>
    </div>
  );
};
