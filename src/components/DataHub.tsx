import React, { useState } from 'react';
import { 
  Database, 
  Satellite, 
  Download, 
  Key, 
  CheckCircle, 
  ExternalLink, 
  Clock, 
  FileSpreadsheet, 
  Code2,
  Radio
} from 'lucide-react';
import { PRESET_AOIS, AOIRegion, RawHotspot, HarmonizedWeekData } from '../engine/harmonizer';
import { Language } from '../data/translations';

interface DataHubProps {
  language: Language;
  selectedAOI: AOIRegion;
  calendarMatrix: Record<string, HarmonizedWeekData>;
  onOpenApiKeyModal: () => void;
  userMapKey: string;
}

export const DataHub: React.FC<DataHubProps> = ({
  language,
  selectedAOI,
  calendarMatrix,
  onOpenApiKeyModal,
  userMapKey,
}) => {
  const [downloadFormat, setDownloadFormat] = useState<'csv' | 'json'>('csv');
  const [downloadScope, setDownloadScope] = useState<'selected' | 'all'>('selected');

  // NASA Constellation Data
  const satellites = [
    { name: 'Terra (EOS AM-1)', sensor: 'MODIS', orbit: 'Sun-synchronous (10:30 AM/PM)', status: 'Active', resolution: '1.0 km', waveband: '3.9 μm & 11 μm' },
    { name: 'Aqua (EOS PM-1)', sensor: 'MODIS', orbit: 'Sun-synchronous (1:30 PM/AM)', status: 'Active', resolution: '1.0 km', waveband: '3.9 μm & 11 μm' },
    { name: 'Suomi-NPP', sensor: 'VIIRS', orbit: 'Sun-synchronous (1:30 PM/AM)', status: 'Active', resolution: '375 m', waveband: 'I4 & I5 Bands' },
    { name: 'NOAA-20 (JPSS-1)', sensor: 'VIIRS', orbit: 'Sun-synchronous (1:30 PM/AM)', status: 'Active', resolution: '375 m', waveband: 'I4 & I5 Bands' },
    { name: 'NOAA-21 (JPSS-2)', sensor: 'VIIRS', orbit: 'Sun-synchronous (1:30 PM/AM)', status: 'Active', resolution: '375 m', waveband: 'I4 & I5 Bands' },
  ];

  const handleExport = () => {
    if (downloadFormat === 'csv') {
      const headers = 'Year,Week,Month,Raw_MODIS_Count,Raw_VIIRS_Count,Raw_Total_Detections,Harmonized_Clusters_5_5km,Calibrated_FRP_MW,Burning_Activity_Index,Z_Score,Is_Critical_Period,Is_Unusual_Spike\n';
      const rows = Object.values(calendarMatrix)
        .map((d) =>
          `${d.year},${d.week},${d.month},${d.rawModisCount},${d.rawViirsCount},${d.rawTotalCount},${d.harmonizedClusterCount},${d.totalFrpCalibrated},${d.burningActivityIndex},${d.zScore},${d.isCriticalPeriod ? 'TRUE' : 'FALSE'},${d.isUnusualCondition ? 'TRUE' : 'FALSE'}`
        )
        .join('\n');

      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `TerraHarmonia_${selectedAOI.id}_2000_2026_Calibrated.csv`;
      link.click();
    } else {
      const jsonContent = JSON.stringify(calendarMatrix, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `TerraHarmonia_${selectedAOI.id}_2000_2026_Calibrated.json`;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
            <Database className="w-3.5 h-3.5 text-teal-600" />
            <span>{language === 'id' ? 'Pusat Data & Ekspor Sains' : 'Open Data Hub & Registry'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'id'
              ? 'Arsip Data Satelit & Ekspor Terbuka'
              : 'Satellite Registry & Open Data Export'}
          </h2>
          <p className="text-sm text-zinc-600">
            {language === 'id'
              ? 'Akses penuh ke data 26 tahun (2000-2026) terharmonisasi, dokumentasi konstelasi satelit NASA, dan ekspor dataset CSV/JSON untuk keperluan riset ilmiah dan kebijakan publik.'
              : 'Open access to 26-year (2000-2026) harmonized records, NASA constellation tracker, and programmatic CSV/JSON dataset exports.'}
          </p>
        </div>
      </div>

      {/* 2-Column: Satellite Constellation & Export Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Constellation Registry */}
        <div className="lg:col-span-7 bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="section-title-bar flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              {language === 'id' ? 'Konstelasi Satelit Pengamat Bumi NASA' : 'NASA Earth Observation Constellation'}
            </h3>
            <Satellite className="w-4 h-4 text-teal-600" />
          </div>

          <div className="space-y-2.5">
            {satellites.map((sat) => (
              <div
                key={sat.name}
                className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{sat.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {sat.sensor}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-medium">
                      {sat.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-2">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span>Lintasan: {sat.orbit}</span>
                  </div>
                </div>

                <div className="text-right sm:self-center font-mono text-[11px] text-slate-600">
                  <span className="block font-semibold text-slate-800">{sat.resolution}</span>
                  <span className="text-zinc-400">{sat.waveband}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Engine Card */}
        <div className="lg:col-span-5 bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-5">
          <div>
            <div className="section-title-bar pb-2 border-b border-zinc-100">
              <h3 className="font-bold text-sm text-slate-900">
                {language === 'id' ? 'Unduh Dataset Lengkap' : 'Export Harmonized Dataset'}
              </h3>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-zinc-600 font-semibold mb-1">
                  {language === 'id' ? 'Format File' : 'File Format'}:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDownloadFormat('csv')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-semibold min-h-[38px] ${
                      downloadFormat === 'csv'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-zinc-50 border-zinc-200 text-slate-700'
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>CSV (Spreadsheet)</span>
                  </button>
                  <button
                    onClick={() => setDownloadFormat('json')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-semibold min-h-[38px] ${
                      downloadFormat === 'json'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-zinc-50 border-zinc-200 text-slate-700'
                    }`}
                  >
                    <Code2 className="w-4 h-4" />
                    <span>JSON (API Data)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 font-semibold mb-1">
                  {language === 'id' ? 'Wilayah Ekspor' : 'Selected Region'}:
                </label>
                <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 font-bold text-slate-900">
                  {selectedAOI.name} (2000 - 2026 Archive)
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-sm focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[44px]"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>{language === 'id' ? 'Unduh Dataset Terpilih' : 'Download Dataset File'}</span>
            </button>

            <button
              onClick={onOpenApiKeyModal}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition font-medium min-h-[36px]"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{userMapKey ? 'Konfigurasi NASA API Key Terhubung' : 'Hubungkan NASA FIRMS API Key Pribadi'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
