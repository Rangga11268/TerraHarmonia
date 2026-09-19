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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg text-slate-100 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm tracking-wide text-white">
              {t.sensorHarmonizationTitle}
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
            {t.calibratedBadge}
          </span>
        </div>

        {/* The Scientific Explanation */}
        <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs leading-relaxed text-slate-300">
          <div className="flex items-start gap-2 mb-1.5 text-amber-300 font-semibold">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{t.whyMisleadTitle}</span>
          </div>
          <p className="text-xs text-slate-300">
            {t.whyMisleadDesc}
          </p>
        </div>

        {/* Comparative Cards */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-slate-950 border border-rose-900/50 rounded-lg">
            <div className="text-xs font-mono uppercase text-rose-300 font-semibold mb-1">
              {t.rawDetectionsCard}
            </div>
            <div className="text-xl font-bold font-mono text-rose-400">
              {y2015.raw.toLocaleString()} <span className="text-xs text-slate-400 font-normal">{language === 'id' ? 'titik' : 'points'}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {t.rawDetectionsCardDesc}
            </p>
          </div>

          <div className="p-3 bg-slate-950 border border-cyan-800/50 rounded-lg">
            <div className="text-xs font-mono uppercase text-cyan-300 font-semibold mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.calibratedClustersCard}</span>
            </div>
            <div className="text-xl font-bold font-mono text-cyan-400">
              {y2015.harmonized.toLocaleString()} <span className="text-xs text-slate-400 font-normal">{language === 'id' ? 'klaster' : 'events'}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {t.calibratedClustersCardDesc}
            </p>
          </div>
        </div>

        {/* Multi-Year Longitudinal Summary */}
        <div className="mt-4 border-t border-slate-800 pt-3">
          <div className="text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>{t.multiYearTitle} {selectedAOI.name}:</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
              <div>
                <strong className="text-slate-100">{t.year} 2008</strong>
                <span className="text-xs text-slate-400 ml-2">({t.modisEra})</span>
              </div>
              <div className="text-right text-slate-300">
                <span>{y2008.raw} {t.rawLabel}</span>
                <span className="text-slate-500 mx-2">{t.toLabel}</span>
                <strong className="text-amber-400">{y2008.harmonized} {t.calibratedLabel}</strong>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
              <div>
                <strong className="text-slate-100">{t.year} 2015</strong>
                <span className="text-xs text-rose-400 ml-2">({t.elNinoCrisis})</span>
              </div>
              <div className="text-right text-slate-300">
                <span className="text-rose-400">{y2015.raw} {t.rawLabel}</span>
                <span className="text-slate-500 mx-2">{t.toLabel}</span>
                <strong className="text-cyan-400">{y2015.harmonized} {t.calibratedLabel}</strong>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
              <div>
                <strong className="text-slate-100">{t.year} 2019</strong>
                <span className="text-xs text-cyan-400 ml-2">({t.dualEra})</span>
              </div>
              <div className="text-right text-slate-300">
                <span>{y2019.raw} {t.rawLabel}</span>
                <span className="text-slate-500 mx-2">{t.toLabel}</span>
                <strong className="text-amber-400">{y2019.harmonized} {t.calibratedLabel}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-slate-300">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          {t.frpWeights}
        </span>
        <span className="font-mono text-cyan-400">{t.equalizedMetric}</span>
      </div>
    </div>
  );
};
