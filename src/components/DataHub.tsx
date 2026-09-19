import React, { useState } from 'react';
import { 
  Download, 
  Key, 
  FileSpreadsheet, 
  Code2,
  ExternalLink
} from 'lucide-react';
import { AOIRegion, HarmonizedWeekData } from '../engine/harmonizer';
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

  // NASA Constellation Data
  const satellites = [
    { name: 'Terra (EOS AM-1)', sensor: 'MODIS', orbit: '10:30 AM / 10:30 PM', resolution: '1.0 km', waveband: '3.9 μm & 11 μm' },
    { name: 'Aqua (EOS PM-1)', sensor: 'MODIS', orbit: '1:30 PM / 1:30 AM', resolution: '1.0 km', waveband: '3.9 μm & 11 μm' },
    { name: 'Suomi-NPP', sensor: 'VIIRS', orbit: '1:30 PM / 1:30 AM', resolution: '375 m', waveband: 'I4 & I5 Bands' },
    { name: 'NOAA-20 (JPSS-1)', sensor: 'VIIRS', orbit: '1:30 PM / 1:30 AM', resolution: '375 m', waveband: 'I4 & I5 Bands' },
    { name: 'NOAA-21 (JPSS-2)', sensor: 'VIIRS', orbit: '1:30 PM / 1:30 AM', resolution: '375 m', waveband: 'I4 & I5 Bands' },
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
    <div className="w-full space-y-6">
      
      {/* Editorial Header (No capsule pills) */}
      <div className="space-y-2 pt-2 pb-4 border-b border-[#e5e5e7]">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
          {language === 'id' ? 'Arsip & Sumber Data Terbuka' : 'Open Data & Satellite Registry'}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight">
          {language === 'id'
            ? 'Registri Satelit & Unduh Dataset Terbuka'
            : 'Satellite Registry & Open Data Access'}
        </h1>
        <p className="text-sm text-[#6e6e73] max-w-3xl leading-relaxed">
          {language === 'id'
            ? 'Akses ke dataset terharmonisasi 2000–2026 per wilayah gambut, dokumentasi instrumen sensor NASA, dan ekspor data dalam format standar untuk riset.'
            : 'Access 2000–2026 harmonized datasets across Indonesian peatland regions, NASA Earth observation instrument records, and open data exports.'}
        </p>
      </div>

      {/* 2-Column: Satellite Constellation & Export Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Constellation Registry */}
        <div className="lg:col-span-7 bg-white border border-[#e5e5e7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="font-semibold text-sm text-[#1d1d1f]">
            {language === 'id' ? 'Konstelasi Satelit Pengamat Bumi NASA' : 'NASA Earth Observation Constellation'}
          </h2>

          <div className="space-y-2">
            {satellites.map((sat) => (
              <div
                key={sat.name}
                className="p-3.5 rounded-xl border border-[#e5e5e7] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1d1d1f]">{sat.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5e7]">
                      {sat.sensor}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#86868b] mt-1">
                    Lintasan Khatulistiwa: {sat.orbit}
                  </div>
                </div>

                <div className="text-right sm:self-center text-[11px] text-[#1d1d1f]">
                  <span className="font-semibold block num">{sat.resolution}</span>
                  <span className="text-[#86868b] text-[10px]">{sat.waveband}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Engine Card */}
        <div className="lg:col-span-5 bg-white border border-[#e5e5e7] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <h2 className="font-semibold text-sm text-[#1d1d1f] pb-3 border-b border-[#e5e5e7]">
              {language === 'id' ? 'Ekspor Dataset Terharmonisasi' : 'Export Harmonized Dataset'}
            </h2>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-[#6e6e73] font-medium mb-1.5">
                  {language === 'id' ? 'Format Berkas' : 'File Format'}:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDownloadFormat('csv')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-medium min-h-[38px] transition ${
                      downloadFormat === 'csv'
                        ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                        : 'bg-white border-[#e5e5e7] text-[#1d1d1f] hover:bg-[#f5f5f7]'
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>CSV (Spreadsheet)</span>
                  </button>
                  <button
                    onClick={() => setDownloadFormat('json')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-medium min-h-[38px] transition ${
                      downloadFormat === 'json'
                        ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                        : 'bg-white border-[#e5e5e7] text-[#1d1d1f] hover:bg-[#f5f5f7]'
                    }`}
                  >
                    <Code2 className="w-4 h-4" />
                    <span>JSON (API Array)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#6e6e73] font-medium mb-1">
                  {language === 'id' ? 'Wilayah Terpilih' : 'Selected Dataset'}:
                </label>
                <div className="p-2.5 rounded-lg bg-[#f5f5f7] border border-[#e5e5e7] font-semibold text-[#1d1d1f]">
                  {selectedAOI.name} (2000 – 2026 Archive)
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs transition shadow-xs min-h-[42px]"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'id' ? 'Unduh Berkas Dataset' : 'Download Dataset File'}</span>
            </button>

            <button
              onClick={onOpenApiKeyModal}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-[#6e6e73] hover:text-[#1d1d1f] transition font-medium min-h-[36px]"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{userMapKey ? 'NASA MAP_KEY Terpasang' : 'Atur NASA MAP_KEY Pribadi'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
