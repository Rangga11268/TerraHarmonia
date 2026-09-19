import React from 'react';
import { ShieldAlert, CheckCircle2, Download, BellRing, Compass, Flame } from 'lucide-react';
import { AOIRegion, HarmonizedWeekData } from '../engine/harmonizer';
import { Language, translations } from '../data/translations';

interface CriticalAlertsProps {
  language: Language;
  selectedAOI: AOIRegion;
  calendarMatrix: Record<string, HarmonizedWeekData>;
  weeklyBaselines: Record<number, { mean: number; stdDev: number; isCritical: boolean }>;
}

export const CriticalAlerts: React.FC<CriticalAlertsProps> = ({
  language,
  selectedAOI,
  calendarMatrix,
  weeklyBaselines
}) => {
  const t = translations[language];
  const criticalWeeks = Object.entries(weeklyBaselines)
    .filter(([_, b]) => b.isCritical)
    .map(([w]) => parseInt(w, 10))
    .sort((a, b) => a - b);

  const startWeek = criticalWeeks.length > 0 ? criticalWeeks[0] : 30;
  const endWeek = criticalWeeks.length > 0 ? criticalWeeks[criticalWeeks.length - 1] : 42;

  const anomalies = Object.values(calendarMatrix)
    .filter((d) => d.isUnusualCondition)
    .sort((a, b) => b.zScore - a.zScore)
    .slice(0, 5);

  const handleExportCSV = () => {
    const headers = 'Year,Week,Month,Raw_MODIS,Raw_VIIRS,Raw_Total,Harmonized_Clusters,Calibrated_FRP_MW,Burning_Activity_Index,Z_Score,Is_Critical_Period,Is_Unusual_Spike\n';
    const rows = Object.values(calendarMatrix)
      .map((d) => 
        `${d.year},${d.week},${d.month},${d.rawModisCount},${d.rawViirsCount},${d.rawTotalCount},${d.harmonizedClusterCount},${d.totalFrpCalibrated},${d.burningActivityIndex},${d.zScore},${d.isCriticalPeriod ? 'YES' : 'NO'},${d.isUnusualCondition ? 'YES' : 'NO'}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TerraHarmonia_${selectedAOI.id}_2000_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg text-slate-100 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm tracking-wide text-white">
              {t.earlyWarningTitle}
            </h3>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-mono border border-slate-700 transition focus-visible:ring-2 focus-visible:ring-cyan-400"
            title="Download full 26-year harmonized dataset as CSV"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportCsv}</span>
          </button>
        </div>

        {/* 1. Critical Period Forecast Banner */}
        <div className="mt-3 p-3.5 bg-slate-950 border border-amber-800/60 rounded-lg">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-1">
            <Compass className="w-4 h-4 text-orange-400 shrink-0" />
            <span>{t.annualPeakSeason}</span>
          </div>
          <div className="text-lg font-bold font-mono text-white">
            {language === 'id' ? 'Minggu' : 'Weeks'} {startWeek} {t.toLabel} {endWeek} <span className="text-xs text-amber-300 font-normal">({Math.round((endWeek - startWeek + 1))} {t.weeksDuration})</span>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {language === 'id'
              ? <>Data historis 20 tahun membuktikan bahwa sebagian besar energi kebakaran di <strong className="text-slate-100">{selectedAOI.name}</strong> terkonsentrasi pada jendela musim kemarau ini.</>
              : <>The 20-year baseline shows that the majority of intense fire radiative energy in <strong className="text-slate-100">{selectedAOI.name}</strong> concentrates in this dry-season window.</>}
          </p>
        </div>

        {/* 2. Top Extreme Anomaly Historical Events */}
        <div className="mt-4">
          <div className="text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
            <BellRing className="w-4 h-4 text-rose-400" />
            <span>{t.highestAnomalies}</span>
          </div>

          <div className="space-y-2">
            {anomalies.map((anom, idx) => (
              <div
                key={`${anom.year}-${anom.week}`}
                className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <strong className="text-white">{t.year} {anom.year}, {language === 'id' ? 'Minggu' : 'Week'} {anom.week}</strong>
                    <span className="text-xs text-slate-400 ml-2">
                      ({anom.dominantSensor})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-rose-400 font-bold">+{anom.zScore}σ</span>
                  <span className="text-slate-500 mx-1.5">|</span>
                  <span className="text-amber-400 font-semibold">{anom.totalFrpCalibrated} MW</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Actionable Directives */}
        <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
          <div className="text-slate-100 font-semibold mb-1 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>{t.directivesTitle}</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
            <li>{language === 'id' ? `Mulai patroli lapangan dua minggu sebelum Minggu ${startWeek}.` : `Begin ground patrols two weeks prior to Week ${startWeek}.`}</li>
            <li>{t.directive2}</li>
            <li>{t.directive3}</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <span className="text-emerald-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {t.verificationComplete}
        </span>
        <span className="font-mono text-slate-400">{t.archiveSpan}</span>
      </div>
    </div>
  );
};
