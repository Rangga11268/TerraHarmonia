import React from 'react';
import { AOIRegion } from '../engine/harmonizer';
import { Language, translations } from '../data/translations';

interface ComparisonMetricsProps {
  language: Language;
  selectedAOI: AOIRegion;
  yearlyAverages: Record<number, { raw: number; harmonized: number; frp: number }>;
}

export const ComparisonMetrics: React.FC<ComparisonMetricsProps> = ({
  language,
  selectedAOI,
  yearlyAverages
}) => {
  const t = translations[language];
  const y2008 = yearlyAverages[2008] || { raw: 0, harmonized: 0, frp: 0 };
  const y2015 = yearlyAverages[2015] || { raw: 0, harmonized: 0, frp: 0 };
  const y2019 = yearlyAverages[2019] || { raw: 0, harmonized: 0, frp: 0 };

  return (
    <div className="bg-white border border-[#e5e5e7] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Clean Header */}
        <div className="flex items-baseline justify-between pb-3 border-b border-[#e5e5e7]">
          <h2 className="font-semibold text-sm text-[#1d1d1f]">
            {t.sensorHarmonizationTitle}
          </h2>
          <span className="text-xs font-semibold text-[#86868b]">
            {t.calibratedBadge}
          </span>
        </div>

        {/* Clear explanation without loud colored box */}
        <div className="mt-3 text-xs text-[#6e6e73] leading-relaxed">
          <span className="font-semibold text-[#1d1d1f] block mb-0.5">{t.whyMisleadTitle}</span>
          <p>{t.whyMisleadDesc}</p>
        </div>

        {/* 2015 El Niño: raw vs harmonized comparison in clean neutral cards */}
        <div className="mt-3.5 grid grid-cols-2 gap-2.5">
          <div className="p-3.5 border border-[#e5e5e7] rounded-xl bg-[#fbfbfd]">
            <div className="text-[11px] text-[#86868b] font-medium uppercase tracking-wider mb-1">
              {t.rawDetectionsCard}
            </div>
            <div className="text-2xl font-bold text-[#1d1d1f] num">
              {y2015.raw.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#86868b] mt-1">{t.rawDetectionsCardDesc}</p>
          </div>

          <div className="p-3.5 border border-[#1d1d1f]/15 rounded-xl bg-white shadow-xs">
            <div className="text-[11px] text-[#1d1d1f] font-semibold uppercase tracking-wider mb-1">
              {t.calibratedClustersCard}
            </div>
            <div className="text-2xl font-bold text-[#1d1d1f] num">
              {y2015.harmonized.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#6e6e73] mt-1">{t.calibratedClustersCardDesc}</p>
          </div>
        </div>

        {/* Multi-year trend in clean table rows */}
        <div className="mt-4 border-t border-[#e5e5e7] pt-3">
          <div className="text-xs font-semibold text-[#1d1d1f] mb-2">
            {t.multiYearTitle} {selectedAOI.name}:
          </div>

          <div className="space-y-1.5 text-xs">
            {[
              { year: 2008, data: y2008, label: t.modisEra },
              { year: 2015, data: y2015, label: t.elNinoCrisis },
              { year: 2019, data: y2019, label: t.dualEra },
            ].map(({ year, data, label }) => (
              <div key={year} className="flex items-center justify-between p-2 rounded-lg border border-[#e5e5e7] bg-white">
                <div>
                  <span className="font-semibold text-[#1d1d1f] num">{t.year} {year}</span>
                  <span className="text-[11px] text-[#86868b] ml-1.5">({label})</span>
                </div>
                <div className="text-right text-[#6e6e73]">
                  <span className="num">{data.raw} {t.rawLabel}</span>
                  <span className="mx-1.5 text-[#86868b]">&rarr;</span>
                  <strong className="text-[#1d1d1f] num">{data.harmonized} {t.calibratedLabel}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-[#e5e5e7] text-[10px] text-[#86868b] flex items-center justify-between">
        <span>{t.frpWeights}</span>
        <span className="font-medium text-[#1d1d1f]">{t.equalizedMetric}</span>
      </div>
    </div>
  );
};
