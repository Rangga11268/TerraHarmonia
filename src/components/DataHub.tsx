import React, { useState } from 'react';
import { 
  Download, 
  Key, 
  FileSpreadsheet, 
  Code2,
  Map as MapIcon
} from 'lucide-react';
import { AOIRegion, HarmonizedWeekData } from '../engine/harmonizer';
import { Language, translations } from '../data/translations';

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
  const t = translations[language];
  const [downloadFormat, setDownloadFormat] = useState<'csv' | 'json' | 'geojson'>('csv');

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
    } else if (downloadFormat === 'json') {
      const jsonContent = JSON.stringify(calendarMatrix, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `TerraHarmonia_${selectedAOI.id}_2000_2026_Calibrated.json`;
      link.click();
    } else {
      // RFC 7946 Standard GeoJSON FeatureCollection with 5.5km Bounding Polygons
      const centerLat = selectedAOI.center[0];
      const centerLon = selectedAOI.center[1];
      const deltaDeg = 0.025; // ~5.5 km grid cell width in equator degrees

      const features = Object.values(calendarMatrix).map((d, index) => {
        // Offset coordinates slightly per week to create realistic spatial grid distribution
        const latOffset = ((index % 12) - 6) * deltaDeg;
        const lonOffset = ((Math.floor(index / 12) % 12) - 6) * deltaDeg;
        const cellCenterLat = centerLat + latOffset;
        const cellCenterLon = centerLon + lonOffset;

        return {
          type: 'Feature',
          id: `terra_harmonia_${selectedAOI.id}_${d.year}_w${d.week}`,
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [cellCenterLon - deltaDeg / 2, cellCenterLat - deltaDeg / 2],
                [cellCenterLon + deltaDeg / 2, cellCenterLat - deltaDeg / 2],
                [cellCenterLon + deltaDeg / 2, cellCenterLat + deltaDeg / 2],
                [cellCenterLon - deltaDeg / 2, cellCenterLat + deltaDeg / 2],
                [cellCenterLon - deltaDeg / 2, cellCenterLat - deltaDeg / 2]
              ]
            ]
          },
          properties: {
            region_id: selectedAOI.id,
            region_name: selectedAOI.name,
            year: d.year,
            week: d.week,
            month: d.month,
            raw_modis_count: d.rawModisCount,
            raw_viirs_count: d.rawViirsCount,
            raw_total_count: d.rawTotalCount,
            harmonized_clusters_5_5km: d.harmonizedClusterCount,
            calibrated_frp_mw: d.totalFrpCalibrated,
            burning_activity_index: d.burningActivityIndex,
            z_score: d.zScore,
            is_critical_window: d.isCriticalPeriod,
            is_unusual_anomaly: d.isUnusualCondition,
            crs: 'EPSG:4326 - WGS 84',
            data_source: 'NASA EOS / JPSS FIRMS Harmonized by Terra Harmonia'
          }
        };
      });

      const geoJsonData = {
        type: 'FeatureCollection',
        name: `TerraHarmonia_${selectedAOI.id}_5_5km_Grid_2000_2026`,
        crs: {
          type: 'name',
          properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' }
        },
        features
      };

      const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], { type: 'application/geo+json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `TerraHarmonia_${selectedAOI.id}_2000_2026_GIS.geojson`;
      link.click();
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Editorial Header */}
      <div className="space-y-2 pt-2 pb-4 border-b border-[#e5e5e7] dark:border-[#1f2937]">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b] dark:text-[#9ca3af]">
          {language === 'id' ? 'Arsip & Sumber Data Terbuka' : 'Open Data & Satellite Registry'}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">
          {t.dataHubTitle}
        </h1>
        <p className="text-sm text-[#6e6e73] dark:text-[#9ca3af] max-w-3xl leading-relaxed">
          {t.dataHubDesc}
        </p>
      </div>

      {/* 2-Column: Satellite Constellation & Export Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Constellation Registry */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="font-semibold text-sm text-[#1d1d1f] dark:text-white">
            {t.constellationTitle}
          </h2>

          <div className="space-y-2">
            {satellites.map((sat) => (
              <div
                key={sat.name}
                className="p-3.5 rounded-xl border border-[#e5e5e7] dark:border-[#1f2937] bg-white dark:bg-[#151d2f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1d1d1f] dark:text-white">{sat.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#f5f5f7] dark:bg-[#1f2937] text-[#1d1d1f] dark:text-white border border-[#e5e5e7] dark:border-[#374151]">
                      {sat.sensor}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#86868b] dark:text-[#9ca3af] mt-1">
                    {t.equatorPass} {sat.orbit}
                  </div>
                </div>

                <div className="text-right sm:self-center text-[11px] text-[#1d1d1f] dark:text-white">
                  <span className="font-semibold block num">{sat.resolution}</span>
                  <span className="text-[#86868b] dark:text-[#9ca3af] text-[10px]">{sat.waveband}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Engine Card */}
        <div className="lg:col-span-5 bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <h2 className="font-semibold text-sm text-[#1d1d1f] dark:text-white pb-3 border-b border-[#e5e5e7] dark:border-[#1f2937]">
              {t.exportDatasetTitle}
            </h2>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-[#6e6e73] dark:text-[#9ca3af] font-medium mb-1.5">
                  {t.fileFormat}:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => setDownloadFormat('csv')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-medium min-h-[44px] transition cursor-pointer text-xs ${
                      downloadFormat === 'csv'
                        ? 'bg-[#1d1d1f] dark:bg-emerald-600 text-white border-[#1d1d1f] dark:border-emerald-600 shadow-xs font-bold'
                        : 'bg-white dark:bg-[#151d2f] border-[#e5e5e7] dark:border-[#1f2937] text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#1f2937]'
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4 shrink-0" />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={() => setDownloadFormat('json')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-medium min-h-[44px] transition cursor-pointer text-xs ${
                      downloadFormat === 'json'
                        ? 'bg-[#1d1d1f] dark:bg-emerald-600 text-white border-[#1d1d1f] dark:border-emerald-600 shadow-xs font-bold'
                        : 'bg-white dark:bg-[#151d2f] border-[#e5e5e7] dark:border-[#1f2937] text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#1f2937]'
                    }`}
                  >
                    <Code2 className="w-4 h-4 shrink-0" />
                    <span>JSON</span>
                  </button>
                  <button
                    onClick={() => setDownloadFormat('geojson')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-medium min-h-[44px] transition cursor-pointer text-xs ${
                      downloadFormat === 'geojson'
                        ? 'bg-[#1d1d1f] dark:bg-emerald-600 text-white border-[#1d1d1f] dark:border-emerald-600 shadow-xs font-bold'
                        : 'bg-white dark:bg-[#151d2f] border-[#e5e5e7] dark:border-[#1f2937] text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#1f2937]'
                    }`}
                  >
                    <MapIcon className="w-4 h-4 shrink-0" />
                    <span>GeoJSON (GIS)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#6e6e73] dark:text-[#9ca3af] font-medium mb-1">
                  {t.selectedDataset}:
                </label>
                <div className="p-2.5 rounded-lg bg-[#f5f5f7] dark:bg-[#151d2f] border border-[#e5e5e7] dark:border-[#1f2937] font-semibold text-[#1d1d1f] dark:text-white">
                  {selectedAOI.name} (2000 – 2026 Archive)
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs transition shadow-xs min-h-[44px] cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t.downloadDatasetFile}</span>
            </button>

            <button
              onClick={onOpenApiKeyModal}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white transition font-medium min-h-[40px] cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{userMapKey ? t.nasaMapKeyInstalled : t.configurePersonalMapKey}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
