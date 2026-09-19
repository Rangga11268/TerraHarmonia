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
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-cyan-500" />
            <h3 className="font-bold text-sm text-slate-900">{t.sensorHarmonizationTitle}</h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            {t.calibratedBadge}
          </span>
        </div>

        {/* Explanation */}
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs leading-relaxed">
          <div className="flex items-start gap-2 mb-1.5 text-amber-700 font-semibold">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>{t.whyMisleadTitle}</span>
          </div>
          <p className="text-slate-600">{t.whyMisleadDesc}</p>
        </div>

        {/* 2015 comparison cards */}
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-[11px] text-red-600 font-semibold uppercase mb-1">{t.rawDetectionsCard}</div>
            <div className="text-xl font-bold font-mono text-red-500">
              {y2015.raw.toLocaleString()}
              <span className="text-xs text-slate-400 font-normal ml-1">{language === 'id' ? 'titik' : 'pts'}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{t.rawDetectionsCardDesc}</p>
          </div>

          <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
            <div className="text-[11px] text-cyan-600 font-semibold uppercase mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t.calibratedClustersCard}
            </div>
            <div className="text-xl font-bold font-mono text-cyan-600">
              {y2015.harmonized.toLocaleString()}
              <span className="text-xs text-slate-400 font-normal ml-1">{language === 'id' ? 'klaster' : 'events'}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{t.calibratedClustersCardDesc}</p>
          </div>
        </div>

        {/* Multi-year summary */}
        <div className="mt-4 border-t border-slate-100 pt-3">
          <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span>{t.multiYearTitle} {selectedAOI.name}:</span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            {[
              { year: 2008, data: y2008, label: t.modisEra, labelColor: 'text-slate-500' },
              { year: 2015, data: y2015, label: t.elNinoCrisis, labelColor: 'text-red-500' },
              { year: 2019, data: y2019, label: t.dualEra, labelColor: 'text-cyan-600' },
            ].map(({ year, data, label, labelColor }) => (
              <div key={year} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <strong className="text-slate-800">{t.year} {year}</strong>
                  <span className={`text-[11px] ml-2 ${labelColor}`}>({label})</span>
                </div>
                <div className="text-right text-slate-500">
                  <span>{data.raw} {t.rawLabel}</span>
                  <span className="mx-2 text-slate-300">&rarr;</span>
                  <strong className="text-orange-600">{data.harmonized} {t.calibratedLabel}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          {t.frpWeights}
        </span>
        <span className="font-mono text-cyan-600">{t.equalizedMetric}</span>
      </div>
    </div>
  );
};
