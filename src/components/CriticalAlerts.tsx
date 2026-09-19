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
    <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="section-title-bar">
            <ShieldAlert className="w-4 h-4 text-orange-500" />
            <h3 className="font-bold text-sm text-slate-900">{t.earlyWarningTitle}</h3>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] rounded-lg bg-zinc-50 hover:bg-zinc-100 text-slate-600 hover:text-slate-900 text-xs font-semibold border border-zinc-200 transition"
            title={language === 'id' ? 'Unduh data lengkap sebagai file CSV' : 'Download full dataset as CSV'}
          >
            <Download className="w-3.5 h-3.5" />
            {t.exportCsv}
          </button>
        </div>

        {/* Peak season banner — amber strip, not a soft orange box */}
        <div className="mt-3 p-3.5 bg-amber-600 rounded-lg">
          <div className="text-amber-100 text-xs font-semibold mb-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            {t.annualPeakSeason}
          </div>
          <div className="text-2xl font-bold text-white num">
            {language === 'id' ? 'Minggu' : 'Weeks'} {startWeek} – {endWeek}
            <span className="text-base font-normal text-amber-200 ml-2">({Math.round((endWeek - startWeek + 1))} {t.weeksDuration})</span>
          </div>
          <p className="text-xs text-amber-100 mt-1.5 leading-relaxed">
            {language === 'id'
              ? <><strong className="text-white">{selectedAOI.name}</strong>: 20 tahun data NASA membuktikan kebakaran terhebat terpusat di periode ini.</>
              : <>20 years of NASA data confirm that the most intense fires in <strong className="text-white">{selectedAOI.name}</strong> cluster in this window.</>}
          </p>
        </div>

        {/* Top anomalies */}
        <div className="mt-4">
          <div className="section-title-bar mb-2">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <BellRing className="w-3.5 h-3.5 text-red-500" />
              {t.highestAnomalies}
            </span>
          </div>
          <div className="space-y-1.5">
            {anomalies.map((anom, idx) => (
              <div
                key={`${anom.year}-${anom.week}`}
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-red-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 num">
                    {idx + 1}
                  </span>
                  <div>
                    <strong className="text-slate-800">{t.year} {anom.year}, {language === 'id' ? 'Minggu' : 'Week'} {anom.week}</strong>
                    <span className="text-zinc-400 ml-2">({anom.dominantSensor})</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-red-500 font-bold num">+{anom.zScore.toFixed(1)}x</span>
                  <span className="text-zinc-200 mx-1.5">|</span>
                  <span className="text-amber-600 font-semibold num">{anom.totalFrpCalibrated} MW</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Directives — slate-blue, not sky (sky was too close to cyan/teal already used) */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
          <div className="font-semibold mb-1.5 text-slate-600">{t.directivesTitle}</div>
          <ul className="list-disc list-inside space-y-1">
            <li>{language === 'id' ? `Mulai patroli lapangan dua minggu sebelum Minggu ${startWeek}.` : `Begin ground patrols two weeks before Week ${startWeek}.`}</li>
            <li>{t.directive2}</li>
            <li>{t.directive3}</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="text-emerald-600 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {t.verificationComplete}
        </span>
        <span className="font-mono">{t.archiveSpan}</span>
      </div>
    </div>
  );
};
