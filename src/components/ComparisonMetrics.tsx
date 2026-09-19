import React from 'react';
import { Scale, Zap, ShieldCheck, AlertCircle, TrendingUp } from 'lucide-react';
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
    <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="section-title-bar">
          <h3 className="font-bold text-sm text-slate-900">{t.sensorHarmonizationTitle}</h3>
        </div>
        <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
          {t.calibratedBadge}
        </span>
      </div>

      {/* Why it matters — kept amber since it's a "caution" explanation */}
      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs leading-relaxed">
        <div className="flex items-start gap-2 mb-1 text-amber-700 font-semibold">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span>{t.whyMisleadTitle}</span>
        </div>
        <p className="text-slate-600">{t.whyMisleadDesc}</p>
      </div>

      {/* 2015 El Niño: raw vs harmonized comparison */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-[11px] text-red-600 font-semibold uppercase tracking-wide mb-1">{t.rawDetectionsCard}</div>
          <div className="text-2xl font-bold text-red-500 num">
            {y2015.raw.toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">{t.rawDetectionsCardDesc}</p>
        </div>

        <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
          <div className="text-[11px] text-teal-700 font-semibold uppercase tracking-wide mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            {t.calibratedClustersCard}
          </div>
          <div className="text-2xl font-bold text-teal-600 num">
            {y2015.harmonized.toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">{t.calibratedClustersCardDesc}</p>
        </div>
      </div>

      {/* Multi-year trend */}
      <div className="mt-4 border-t border-zinc-100 pt-3">
        <div className="section-title-bar mb-2">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            {t.multiYearTitle} {selectedAOI.name}:
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          {[
            { year: 2008, data: y2008, label: t.modisEra, labelColor: 'text-zinc-400' },
            { year: 2015, data: y2015, label: t.elNinoCrisis, labelColor: 'text-red-500 font-semibold' },
            { year: 2019, data: y2019, label: t.dualEra, labelColor: 'text-teal-600' },
          ].map(({ year, data, label, labelColor }) => (
            <div key={year} className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-200">
              <div>
                <strong className="text-slate-800 num">{t.year} {year}</strong>
                <span className={`text-[11px] ml-2 ${labelColor}`}>({label})</span>
              </div>
              <div className="text-right text-zinc-500">
                <span className="num">{data.raw} {t.rawLabel}</span>
                <span className="mx-1.5 text-zinc-300">&rarr;</span>
                <strong className="text-amber-600 num">{data.harmonized} {t.calibratedLabel}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-zinc-100 text-[11px] text-zinc-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          {t.frpWeights}
        </span>
        <span className="text-teal-600">{t.equalizedMetric}</span>
      </div>
    </div>
  );
};
