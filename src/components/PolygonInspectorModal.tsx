import React, { useState, useMemo } from 'react';
import { RawHotspot, AOIRegion } from '../engine/harmonizer';
import { Language } from '../data/translations';
import { X, Upload, MapPin, CheckCircle2, AlertTriangle, FileCode, Search } from 'lucide-react';

interface PolygonInspectorModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
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

export const PolygonInspectorModal: React.FC<PolygonInspectorModalProps> = ({
  language,
  isOpen,
  onClose,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#f5f5f7] w-full max-w-4xl max-h-[92vh] rounded-2xl border border-[#e5e5e7] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-white border-b border-[#e5e5e7] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f5f5f7] rounded-xl border border-[#e5e5e7]">
              <MapPin className="w-5 h-5 text-[#1d1d1f]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1d1d1f] tracking-tight">
                {language === 'id' ? 'Inspektur Poligon Konsesi & Kawasan Lindung' : 'Custom Concession & Protected Area Polygon Inspector'}
              </h2>
              <p className="text-xs text-[#86868b]">
                {language === 'id'
                  ? 'Audit spasial titik panas historis (2000–2026) di dalam batas wilayah custom GeoJSON'
                  : 'Point-in-polygon historical spatial audit of hotspots within custom GeoJSON boundaries'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Boundary Selector & Uploader */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Presets */}
            <div className="md:col-span-8 bg-white border border-[#e5e5e7] rounded-xl p-4 space-y-3">
              <span className="text-xs font-semibold text-[#86868b] uppercase">Pilih Poligon Referensi Konsesi / Konservasi:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESET_BOUNDARIES.map((preset) => {
                  const isSelected = !customGeoJsonName && selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#1d1d1f] bg-[#f5f5f7] shadow-xs'
                          : 'border-[#e5e5e7] bg-white hover:border-[#1d1d1f]/40'
                      }`}
                    >
                      <span className="text-xs font-bold text-[#1d1d1f] line-clamp-2">{preset.name}</span>
                      <span className="text-[10px] text-[#86868b] mt-2">{preset.province} &bull; {(preset.areaHa).toLocaleString()} Ha</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Upload */}
            <div className="md:col-span-4 bg-white border border-[#e5e5e7] rounded-xl p-4 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-xs font-semibold text-[#86868b] uppercase">Unggah File GeoJSON Anda:</span>
                <p className="text-[11px] text-[#6e6e73] mt-1">
                  Mendukung Polygon / FeatureCollection konsesi HTI, kebun sawit, atau hutan adat.
                </p>
              </div>

              <label className="border-2 border-dashed border-[#e5e5e7] hover:border-[#1d1d1f] rounded-lg p-3 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1 bg-[#fbfbfd]">
                <Upload className="w-4 h-4 text-[#86868b]" />
                <span className="text-xs font-medium text-[#1d1d1f]">
                  {customGeoJsonName || 'Pilih File .geojson'}
                </span>
                <input type="file" accept=".geojson,.json" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

          </div>

          {/* Polygon Analysis Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white border border-[#e5e5e7] rounded-xl p-5 shadow-xs">
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

          {/* Top 5 Hotspot coordinates inside boundary */}
          <div className="bg-white border border-[#e5e5e7] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">
                Sampel 5 Titik Panas Berenergi Tertinggi di Dalam Poligon
              </span>
              <span className="text-xs text-[#86868b]">Hasil Audit Spasial</span>
            </div>

            {insideHotspots.length === 0 ? (
              <p className="text-xs text-[#86868b] italic py-4 text-center">
                Tidak ada titik panas yang terdeteksi di dalam poligon yang dipilih.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f5f5f7] border-b border-[#e5e5e7] text-[#6e6e73]">
                    <tr>
                      <th className="py-2 px-3">Tahun/Minggu</th>
                      <th className="py-2 px-3">Satelit / Sensor</th>
                      <th className="py-2 px-3">Koordinat (Lat, Lng)</th>
                      <th className="py-2 px-3">FRP (MW)</th>
                      <th className="py-2 px-3">Keyakinan</th>
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

        {/* Footer */}
        <div className="bg-white border-t border-[#e5e5e7] px-5 py-3 flex justify-between items-center text-xs text-[#86868b]">
          <span>Metode: Ray-Casting Point-in-Polygon (Harmonisasi 5.5 km)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1d1d1f] text-white font-medium hover:bg-black transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
