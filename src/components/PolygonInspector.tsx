import React, { useState, useMemo } from 'react';
import { RawHotspot, AOIRegion } from '../engine/harmonizer';
import { Language } from '../data/translations';
import { MapPin, Upload, FileCode, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface PolygonInspectorProps {
  language: Language;
  selectedAOI: AOIRegion;
  allHotspots: RawHotspot[];
}

interface BoundaryPreset {
  id: string;
  name: string;
  province: string;
  areaHa: number;
  polygon: [number, number][]; // [lat, lng][]
}

const PRESET_BOUNDARIES: BoundaryPreset[] = [
  {
    id: 'tesso_nilo',
    name: 'Taman Nasional Tesso Nilo',
    province: 'Riau',
    areaHa: 81700,
    polygon: [
      [-0.05, 101.40],
      [-0.05, 101.85],
      [-0.35, 101.85],
      [-0.35, 101.40],
    ],
  },
  {
    id: 'plg_block_a',
    name: 'Kawasan Eks-PLG Blok A (Kahayan-Sebangau)',
    province: 'Kalimantan Tengah',
    areaHa: 135000,
    polygon: [
      [-2.15, 113.80],
      [-2.15, 114.25],
      [-2.55, 114.25],
      [-2.55, 113.80],
    ],
  },
  {
    id: 'padang_sugihan',
    name: 'Suaka Margasatwa Padang Sugihan',
    province: 'Sumatera Selatan (OKI)',
    areaHa: 75000,
    polygon: [
      [-2.95, 105.00],
      [-2.95, 105.35],
      [-3.30, 105.35],
      [-3.30, 105.00],
    ],
  },
];

// Point in polygon Ray-casting algorithm
function isPointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
  const [lat, lng] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > lng) !== (yj > lng)) && (lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export const PolygonInspector: React.FC<PolygonInspectorProps> = ({
  language,
  selectedAOI,
  allHotspots,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<BoundaryPreset>(PRESET_BOUNDARIES[0]);
  const [customGeoJsonName, setCustomGeoJsonName] = useState<string | null>(null);
  const [activePolygon, setActivePolygon] = useState<[number, number][]>(PRESET_BOUNDARIES[0].polygon);
  const [areaHectares, setAreaHectares] = useState<number>(PRESET_BOUNDARIES[0].areaHa);

  const handleSelectPreset = (preset: BoundaryPreset) => {
    setSelectedPreset(preset);
    setActivePolygon(preset.polygon);
    setAreaHectares(preset.areaHa);
    setCustomGeoJsonName(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        let coords: [number, number][] = [];

        if (json.type === 'FeatureCollection' && json.features?.[0]?.geometry?.coordinates) {
          const raw = json.features[0].geometry.coordinates[0];
          coords = raw.map((pt: [number, number]) => [pt[1], pt[0]]);
        } else if (json.type === 'Feature' && json.geometry?.coordinates) {
          const raw = json.geometry.coordinates[0];
          coords = raw.map((pt: [number, number]) => [pt[1], pt[0]]);
        } else if (json.type === 'Polygon' && json.coordinates) {
          coords = json.coordinates[0].map((pt: [number, number]) => [pt[1], pt[0]]);
        }

        if (coords.length > 2) {
          setActivePolygon(coords);
          setCustomGeoJsonName(file.name);
          setAreaHectares(50000);
        } else {
          alert('Format GeoJSON tidak memiliki poligon yang valid.');
        }
      } catch (err) {
        alert('Gagal memproses file GeoJSON. Pastikan format valid.');
      }
    };
    reader.readAsText(file);
  };

  // Compute hotspots inside polygon
  const insideHotspots = useMemo(() => {
    return allHotspots.filter((h) => isPointInPolygon([h.lat, h.lon], activePolygon));
  }, [allHotspots, activePolygon]);

  const totalFrp = useMemo(() => {
    return insideHotspots.reduce((s, h) => s + h.frp, 0);
  }, [insideHotspots]);

  const highConfidenceCount = useMemo(() => {
    return insideHotspots.filter((h) => (h.confidence || 80) >= 80).length;
  }, [insideHotspots]);

  // Carbon estimated inside polygon
  const estCarbonTons = Math.round(totalFrp * 12.4);

  return (
    <div className="bg-white border border-[#e5e5e7] rounded-2xl shadow-xs overflow-hidden space-y-5 p-5 sm:p-6 transition-all">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5e5e7]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#f5f5f7] rounded-xl border border-[#e5e5e7] text-[#1d1d1f]">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">
              {language === 'id' ? 'Audit Geospasial Konsesi & Kawasan Lindung' : 'Concession & Protected Area Spatial Audit'}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#1d1d1f] tracking-tight">
              {language === 'id' ? 'Inspektur Poligon & Point-in-Polygon Engine' : 'Polygon Inspector & Custom GeoJSON Audit'}
            </h2>
          </div>
        </div>

        <span className="text-xs text-[#86868b]">
          {language === 'id' ? 'Algoritma Ray-Casting Grid 5.5 km' : 'Ray-Casting 5.5 km Grid Algorithm'}
        </span>
      </div>

      {/* Preset & Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Presets */}
        <div className="md:col-span-8 bg-[#fbfbfd] border border-[#e5e5e7] rounded-xl p-4 space-y-3">
          <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider">
            {language === 'id' ? 'Pilih Poligon Referensi Konsesi / Konservasi:' : 'Select Protected / Concession Area Boundary:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESET_BOUNDARIES.map((preset) => {
              const isSelected = !customGeoJsonName && selectedPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#1d1d1f] bg-white shadow-xs font-semibold'
                      : 'border-[#e5e5e7] bg-white/70 hover:border-[#1d1d1f]/40'
                  }`}
                >
                  <span className="text-xs text-[#1d1d1f] line-clamp-2">{preset.name}</span>
                  <span className="text-[10px] text-[#86868b] mt-2 font-normal">
                    {preset.province} &bull; {(preset.areaHa).toLocaleString()} Ha
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Upload */}
        <div className="md:col-span-4 bg-[#fbfbfd] border border-[#e5e5e7] rounded-xl p-4 flex flex-col justify-between space-y-2">
          <div>
            <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider">
              {language === 'id' ? 'Unggah File GeoJSON Anda:' : 'Upload Custom GeoJSON:'}
            </span>
            <p className="text-[11px] text-[#6e6e73] mt-1">
              {language === 'id'
                ? 'Mendukung batas konsesi sawit, HTI, atau hutan lindung.'
                : 'Supports concession, national park, or customary forest boundaries.'}
            </p>
          </div>

          <label className="border-2 border-dashed border-[#e5e5e7] hover:border-[#1d1d1f] rounded-lg p-3 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1 bg-white">
            <Upload className="w-4 h-4 text-[#86868b]" />
            <span className="text-xs font-semibold text-[#1d1d1f]">
              {customGeoJsonName || (language === 'id' ? 'Pilih Berkas .geojson' : 'Select .geojson File')}
            </span>
            <input type="file" accept=".geojson,.json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

      </div>

      {/* Polygon Analysis Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#fbfbfd] border border-[#e5e5e7] rounded-xl p-4 shadow-xs">
        <div>
          <span className="text-[10px] font-semibold text-[#86868b] uppercase">Titik Panas Teridentifikasi</span>
          <div className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] num mt-1">
            {insideHotspots.length.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#86868b] mt-0.5">Di dalam batas perimeter poligon</p>
        </div>

        <div>
          <span className="text-[10px] font-semibold text-[#86868b] uppercase">Total Radiative Power</span>
          <div className="text-2xl sm:text-3xl font-bold text-orange-600 num mt-1">
            {Math.round(totalFrp).toLocaleString()} <span className="text-sm font-normal text-[#86868b]">MW</span>
          </div>
          <p className="text-[11px] text-[#86868b] mt-0.5">Akumulasi intensitas energi api</p>
        </div>

        <div>
          <span className="text-[10px] font-semibold text-[#86868b] uppercase">Hotspot Keyakinan Tinggi</span>
          <div className="text-2xl sm:text-3xl font-bold text-red-600 num mt-1">
            {highConfidenceCount.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#86868b] mt-0.5">Tingkat confidence &ge; 80%</p>
        </div>

        <div>
          <span className="text-[10px] font-semibold text-[#86868b] uppercase">Estimasi Emisi Karbon</span>
          <div className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] num mt-1">
            {estCarbonTons.toLocaleString()} <span className="text-sm font-normal text-[#86868b]">t CO2e</span>
          </div>
          <p className="text-[11px] text-[#86868b] mt-0.5">Berdasarkan faktor emisi gambut</p>
        </div>
      </div>

      {/* Top 5 Hotspot samples table */}
      <div className="border border-[#e5e5e7] rounded-xl overflow-hidden">
        <div className="bg-[#f5f5f7] px-4 py-2.5 border-b border-[#e5e5e7] flex items-center justify-between">
          <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">
            {language === 'id' ? '5 Titik Panas Berenergi Tertinggi di Dalam Poligon' : 'Top 5 Highest Energy Hotspots in Boundary'}
          </span>
          <span className="text-xs text-[#86868b]">Audit Point-in-Polygon</span>
        </div>

        {insideHotspots.length === 0 ? (
          <p className="text-xs text-[#86868b] italic py-6 text-center bg-white">
            {language === 'id'
              ? 'Tidak ada titik panas yang terdeteksi di dalam poligon yang dipilih.'
              : 'No hotspots detected within the selected boundary polygon.'}
          </p>
        ) : (
          <div className="overflow-x-auto bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fbfbfd] border-b border-[#e5e5e7] text-[#6e6e73]">
                <tr>
                  <th className="py-2.5 px-3">Tanggal / Sesi</th>
                  <th className="py-2.5 px-3">Instrumen</th>
                  <th className="py-2.5 px-3">Koordinat (Lat, Lng)</th>
                  <th className="py-2.5 px-3">FRP (MW)</th>
                  <th className="py-2.5 px-3">Tingkat Keyakinan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e7]">
                {insideHotspots
                  .sort((a, b) => b.frp - a.frp)
                  .slice(0, 5)
                  .map((h, i) => (
                    <tr key={i} className="hover:bg-[#fbfbfd]">
                      <td className="py-2 px-3 font-semibold text-[#1d1d1f]">{h.date || 'Record'}</td>
                      <td className="py-2 px-3">{h.instrument}</td>
                      <td className="py-2 px-3 num font-mono text-[11px]">
                        {h.lat.toFixed(4)}°, {h.lon.toFixed(4)}°
                      </td>
                      <td className="py-2 px-3 num font-bold text-orange-600">{Math.round(h.frp)} MW</td>
                      <td className="py-2 px-3 num">{h.confidence || 80}%</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
