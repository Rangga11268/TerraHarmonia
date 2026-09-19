import React, { useState } from 'react';
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

  return (
    <div className="bg-white border border-[#e5e5e7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e5e5e7]">
        <div>
          <h2 className="font-semibold text-sm text-[#1d1d1f] flex items-baseline gap-2">
            <span>{t.calendarTitle}</span>
            <span className="text-xs text-[#86868b] font-normal num">{t.calendarSpan}</span>
          </h2>
          <p className="text-xs text-[#6e6e73] mt-0.5">
            {rawMode ? t.calendarSubRaw : t.calendarSubHarmonized}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#86868b]">
          <span className="font-medium text-[#1d1d1f]">{t.scale}:</span>
          <span className="w-2.5 h-2.5 rounded-xs bg-[#f2f2f7] border border-[#d1d1d6] inline-block" title={t.zero} />
          <span className="w-2.5 h-2.5 rounded-xs bg-[#fed7aa] inline-block" title={t.low} />
          <span className="w-2.5 h-2.5 rounded-xs bg-[#fb923c] inline-block" title={t.moderate} />
          <span className="w-2.5 h-2.5 rounded-xs bg-[#ea580c] inline-block" title={t.high} />
          <span className="w-2.5 h-2.5 rounded-xs bg-[#dc2626] inline-block" title={t.severe} />
          <span className="ml-1 text-[#1d1d1f] font-medium">{t.severe}</span>
        </div>
      </div>

      {/* Matrix */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[800px]">
          {/* Month Header */}
          <div className="grid grid-cols-[60px_repeat(52,1fr)] text-[11px] text-[#86868b] text-center mb-1 font-medium">
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
          <div className="space-y-0.5">
            {YEARS.map((year) => {
              const isDual = year >= 2012;
              return (
                <div key={year} className="grid grid-cols-[60px_repeat(52,1fr)] gap-0.5 items-center">
                  <div className="text-[11px] font-medium text-[#1d1d1f] flex items-center justify-between pr-2 num">
                    <span>{year}</span>
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
                        onClick={() => item && onSelectCell(key, item)}
                        onMouseEnter={() => item && setHoveredData(item)}
                        onMouseLeave={() => setHoveredData(null)}
                        className={`h-3.5 w-full rounded-[2px] heat-cell ${getCellColor(item)} ${
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

      {/* Detail Footer */}
      <div className="p-3 bg-[#f5f5f7] rounded-xl border border-[#e5e5e7] text-xs flex flex-wrap items-center justify-between gap-3 min-h-[44px]">
        {hoveredData ? (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="font-semibold text-[#1d1d1f]">
              {t.year} {hoveredData.year}, {language === 'id' ? 'Minggu' : 'Week'} {hoveredData.week} ({MONTHS[hoveredData.month - 1]})
            </div>
            <div className="text-[#6e6e73] space-x-3 text-[11px]">
              <span>{t.harmonizedIndex} <strong className="text-[#1d1d1f] num">{hoveredData.burningActivityIndex}/100</strong></span>
              <span>·</span>
              <span>FRP: <strong className="text-[#1d1d1f] num">{hoveredData.totalFrpCalibrated} MW</strong></span>
              <span>·</span>
              <span>MODIS: <strong className="num">{hoveredData.rawModisCount}</strong></span>
              <span>·</span>
              <span>VIIRS: <strong className="num">{hoveredData.rawViirsCount}</strong></span>
            </div>
          </div>
        ) : (
          <div className="text-[#86868b] text-xs">
            {t.selectPrompt}
          </div>
        )}
      </div>
    </div>
  );
};
