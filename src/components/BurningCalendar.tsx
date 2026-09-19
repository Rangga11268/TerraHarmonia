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
    if (!item) return 'bg-slate-900 border-slate-800';

    const value = rawMode 
      ? Math.min(100, item.rawTotalCount * 2.2) 
      : item.burningActivityIndex;

    if (value <= 0) return 'bg-slate-900 border-slate-800';
    if (value < 15) return 'bg-teal-950 border-teal-800';
    if (value < 35) return 'bg-amber-800 border-amber-600 text-white';
    if (value < 65) return 'bg-orange-600 border-orange-500 text-white';
    return 'bg-rose-600 border-rose-400 text-white font-bold';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg text-slate-100">
      {/* Calendar Title & View Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <h2 className="font-bold text-base tracking-wide flex items-center gap-2 text-white">
              <span>{t.calendarTitle}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                {t.calendarSpan}
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              {rawMode 
                ? t.calendarSubRaw 
                : t.calendarSubHarmonized}
            </p>
          </div>
        </div>

        {/* Legend and View Switch */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
            <span>{t.scale}</span>
            <span className="inline-block w-3 h-3 bg-slate-900 border border-slate-700" title={t.zero} />
            <span className="inline-block w-3 h-3 bg-teal-950 border border-teal-800" title={t.low} />
            <span className="inline-block w-3 h-3 bg-amber-800 border border-amber-600" title={t.moderate} />
            <span className="inline-block w-3 h-3 bg-orange-600 border border-orange-400" title={t.high} />
            <span className="inline-block w-3 h-3 bg-rose-600 border border-rose-400" title={t.severe} />
            <span className="text-slate-300 text-xs ml-1">{t.severe}</span>
          </div>

          <div className="flex md:hidden bg-slate-950 p-0.5 rounded border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-2 py-1 rounded flex items-center gap-1 min-h-[36px] ${
                viewMode === 'matrix' ? 'bg-slate-800 text-white' : 'text-slate-400'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              {t.fullView}
            </button>
            <button
              onClick={() => setViewMode('focused')}
              className={`px-2 py-1 rounded flex items-center gap-1 min-h-[36px] ${
                viewMode === 'focused' ? 'bg-slate-800 text-white' : 'text-slate-400'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              {t.cardView}
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Full 26-Year Matrix */}
      <div className={`${viewMode === 'focused' ? 'hidden md:block' : 'block'} mt-4 overflow-x-auto pb-2`}>
        <div className="min-w-[800px]">
          {/* Header row: Months and Weeks */}
          <div className="grid grid-cols-[68px_repeat(52,1fr)] text-xs font-mono text-slate-300 text-center mb-1.5">
            <div className="text-left font-bold text-slate-200">{t.year}</div>
            {Array.from({ length: 52 }, (_, i) => {
              const weekNum = i + 1;
              const isMonthStart = (weekNum - 1) % 4 === 0 && Math.floor((weekNum - 1) / 4) < 12;
              const monthName = isMonthStart ? MONTHS[Math.floor((weekNum - 1) / 4)] : '';
              return (
                <div key={weekNum} className="truncate text-[11px]">
                  {monthName || (weekNum % 5 === 0 ? weekNum : '')}
                </div>
              );
            })}
          </div>

          {/* Matrix Rows */}
          <div className="space-y-1">
            {YEARS.map((year) => {
              const isModernSensorEra = year >= 2012;
              return (
                <div key={year} className="grid grid-cols-[68px_repeat(52,1fr)] gap-0.5 items-center">
                  <div className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1">
                    <span>{year}</span>
                    <span 
                      className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                        isModernSensorEra 
                          ? 'bg-slate-800 text-cyan-300 border border-cyan-800' 
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                      title={isModernSensorEra ? 'MODIS + VIIRS Active' : 'MODIS Only'}
                    >
                      {isModernSensorEra ? 'V+M' : 'MOD'}
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
                        className={`h-4.5 w-full rounded-[2px] transition-colors relative border ${getCellColor(item)} ${
                          isSelected ? 'ring-2 ring-cyan-400 z-10' : ''
                        } ${
                          item?.isUnusualCondition ? 'ring-1 ring-rose-400' : ''
                        } focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none`}
                        aria-label={`Year ${year}, Week ${week}, Activity Score ${item?.burningActivityIndex || 0} out of 100`}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mode 2: Mobile Focused Year Breakdown */}
      <div className={`${viewMode === 'focused' ? 'block md:hidden' : 'hidden'} mt-4 space-y-3`}>
        <div className="flex items-center justify-between">
          <label htmlFor="year-select" className="text-xs font-semibold text-slate-300">{t.selectYear}</label>
          <select
            id="year-select"
            value={mobileViewYear}
            onChange={(e) => setMobileViewYear(Number(e.target.value))}
            className="bg-slate-950 text-white border border-slate-700 px-3 py-1.5 rounded text-sm min-h-[44px]"
          >
            {YEARS.map((yr) => (
              <option key={yr} value={yr}>{t.year} {yr} {yr >= 2012 ? '(MODIS + VIIRS)' : '(MODIS only)'}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 12 }, (_, mIdx) => {
            const mNum = mIdx + 1;
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
              <div 
                key={mNum}
                className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs min-h-[70px] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span>{MONTHS[mIdx]}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] ${
                    avgScore > 40 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300'
                  }`}>
                    Idx: {avgScore}
                  </span>
                </div>
                <div className="flex gap-1 mt-2">
                  {monthWeeks.map((wk) => (
                    <button
                      key={wk.week}
                      onClick={() => onSelectCell(`${mobileViewYear}-${wk.week}`, wk)}
                      className={`flex-1 h-7 rounded border text-[10px] font-mono flex items-center justify-center min-h-[36px] ${getCellColor(wk)}`}
                      aria-label={`Year ${mobileViewYear}, Week ${wk.week}`}
                    >
                      W{wk.week}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected/Hovered Detail Bar */}
      <div className="mt-4 p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-4">
        {hoveredData ? (
          <>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 shrink-0">
                <Flame className={`w-5 h-5 ${hoveredData.burningActivityIndex > 40 ? 'text-orange-500' : 'text-amber-500'}`} />
              </div>
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-2 flex-wrap">
                  <span>{t.year} {hoveredData.year}, {language === 'id' ? 'Minggu' : 'Week'} {hoveredData.week} ({MONTHS[hoveredData.month - 1]})</span>
                  {hoveredData.isUnusualCondition && (
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-200 border border-rose-700 text-xs font-mono flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      {t.unusualSpike} (+{hoveredData.zScore}σ)
                    </span>
                  )}
                  {hoveredData.isCriticalPeriod && !hoveredData.isUnusualCondition && (
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-200 border border-amber-700 text-xs font-mono">
                      {t.criticalPeakWindow}
                    </span>
                  )}
                </div>
                <div className="text-slate-300 font-mono text-xs mt-1">
                  {t.harmonizedIndex} <strong className="text-amber-400">{hoveredData.burningActivityIndex}/100</strong>
                  {' | '}
                  {t.calibratedFrp} <strong className="text-cyan-400">{hoveredData.totalFrpCalibrated} MW</strong>
                  {' | '}
                  {t.activeClusters} <strong className="text-slate-100">{hoveredData.harmonizedClusterCount}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 font-mono text-slate-300 border-l border-slate-800 pl-4">
              <div>
                <div className="text-[11px] uppercase text-slate-400">MODIS</div>
                <div className="text-sm font-semibold text-slate-100">{hoveredData.rawModisCount}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-slate-400">VIIRS</div>
                <div className="text-sm font-semibold text-cyan-300">{hoveredData.rawViirsCount}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-slate-400">Raw Total</div>
                <div className="text-sm font-semibold text-slate-300">{hoveredData.rawTotalCount}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-slate-300">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{t.selectPrompt}</span>
          </div>
        )}
      </div>
    </div>
  );
};
