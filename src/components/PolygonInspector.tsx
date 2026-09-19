import React, { useState, useMemo } from 'react';
import { RawHotspot, AOIRegion } from '../engine/harmonizer';
import { Language, translations } from '../data/translations';
import { MapPin, Upload, FileCode, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface PolygonInspectorProps {
  language: Language;
  selectedAOI: AOIRegion;
  allHotspots: RawHotspot[];
}

interface BoundaryPreset {
  id: string;
  nameId: string;
  nameEn: string;
  provinceId: string;
  provinceEn: string;
  areaHa: number;
  polygon: [number, number][]; // [lat, lng][]
}

const PRESET_BOUNDARIES: BoundaryPreset[] = [
  {
    id: 'tesso_nilo',
    nameId: 'Taman Nasional Tesso Nilo',
    nameEn: 'Tesso Nilo National Park',
    provinceId: 'Riau (Sumatera)',
    provinceEn: 'Riau (Sumatra)',
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
    nameId: 'Kawasan Eks-PLG Blok A (Kahayan-Sebangau)',
    nameEn: 'Ex-Mega Rice Project Block A (Kahayan-Sebangau)',
    provinceId: 'Kalimantan Tengah',
    provinceEn: 'Central Kalimantan',
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
    nameId: 'Suaka Margasatwa Padang Sugihan',
    nameEn: 'Padang Sugihan Wildlife Reserve',
    provinceId: 'Sumatera Selatan (OKI)',
    provinceEn: 'South Sumatra (OKI)',
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
  const t = translations[language];
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
        } else if (json.type === 'Polygon' && json.coordinates?.[0]) {
          coords = json.coordinates[0].map((pt: [number, number]) => [pt[1], pt[0]]);
        }

        if (coords.length >= 3) {
          setActivePolygon(coords);
          setCustomGeoJsonName(file.name);
          setAreaHectares(Math.round(coords.length * 12500));
        }
      } catch (err) {
        console.error('GeoJSON parse error:', err);
      }
    };
    reader.readAsText(file);
  };

  // Filter hotspots inside polygon
  const filteredHotspots = useMemo(() => {
    return allHotspots.filter((h) => isPointInPolygon([h.lat, h.lon], activePolygon));
  }, [allHotspots, activePolygon]);

  const totalFrp = useMemo(() => {
    return Math.round(filteredHotspots.reduce((sum, h) => sum + h.frp, 0));
  }, [filteredHotspots]);

  const modisCount = useMemo(() => {
    return filteredHotspots.filter((h) => h.instrument === 'MODIS').length;
  }, [filteredHotspots]);

  const viirsCount = useMemo(() => {
    return filteredHotspots.filter((h) => h.instrument === 'VIIRS').length;
  }, [filteredHotspots]);

  const fireDensityPer1kHa = areaHectares > 0
    ? ((filteredHotspots.length / areaHectares) * 1000).toFixed(2)
    : '0.00';

  return (
    <div className="bg-white border border-[#e5e5e7] rounded-2xl p-4 sm:p-6 shadow-xs space-y-6 transition-all">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#e5e5e7]">
        <div>
          <div className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
            {language === 'id' ? 'Analisis Spasial Perimeter Khusus' : 'Spatial Custom Boundary Inspection'}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#1d1d1f] tracking-tight mt-0.5">
            {t.polygonInspectorTitle}
          </h2>
          <p className="text-xs text-[#6e6e73] mt-1 leading-relaxed max-w-3xl">
            {t.polygonInspectorDesc}
          </p>
        </div>

        {/* Verification Badge */}
        <div className="px-3.5 py-2 rounded-xl bg-[#f5f5f7] border border-[#e5e5e7] text-xs flex items-center gap-2 shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-medium text-[#1d1d1f]">{t.rayCastingNotice}</span>
        </div>
      </div>

      {/* Preset Boundary Selector & GeoJSON Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Preset Selector */}
        <div className="lg:col-span-8 space-y-3">
          <label className="text-xs font-bold text-[#1d1d1f] block">
            {t.presetZones}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESET_BOUNDARIES.map((preset) => {
              const isSelected = selectedPreset.id === preset.id && !customGeoJsonName;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer min-h-[44px] ${
                    isSelected
                      ? 'bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-xs'
                      : 'bg-white border-[#e5e5e7] text-[#1d1d1f] hover:border-[#1d1d1f]/40'
                  }`}
                >
                  <div className="font-bold text-xs truncate">
                    {language === 'id' ? preset.nameId : preset.nameEn}
                  </div>
                  <div className={`text-[11px] mt-1 ${isSelected ? 'text-slate-300' : 'text-[#86868b]'}`}>
                    {language === 'id' ? preset.provinceId : preset.provinceEn}
                  </div>
                  <div className={`text-[10px] mt-2 font-mono ${isSelected ? 'text-cyan-300' : 'text-[#0071e3]'}`}>
                    {preset.areaHa.toLocaleString()} Ha
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Custom GeoJSON Upload */}
        <div className="lg:col-span-4 space-y-3">
          <label className="text-xs font-bold text-[#1d1d1f] block">
            {t.uploadCustomGeoJson}
          </label>
          <label className="p-3.5 rounded-xl border-2 border-dashed border-[#e5e5e7] hover:border-[#1d1d1f] bg-[#fafafa] flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[92px]">
            <Upload className="w-5 h-5 text-[#86868b] mb-1" />
            <span className="text-xs font-semibold text-[#1d1d1f]">
              {customGeoJsonName || (language === 'id' ? 'Pilih berkas .geojson / .json' : 'Choose .geojson / .json file')}
            </span>
            <span className="text-[10px] text-[#86868b] mt-0.5">
              {language === 'id' ? 'Format Polygon EPSG:4326 WGS84' : 'EPSG:4326 WGS84 Polygon format'}
            </span>
            <input
              type="file"
              accept=".json,.geojson"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

      </div>

      {/* Calculated Stats within Selected Polygon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
        
        <div className="p-4 rounded-xl border border-[#e5e5e7] bg-[#fbfbfd]">
          <span className="text-[10px] uppercase font-bold text-[#86868b]">{t.zoneArea}</span>
          <div className="text-2xl font-black text-[#1d1d1f] mt-1 num">
            {areaHectares.toLocaleString()} Ha
          </div>
          <span className="text-[11px] text-[#6e6e73]">
            {language === 'id' ? 'Kawasan konservasi terpilih' : 'Selected boundary perimeter'}
          </span>
        </div>

        <div className="p-4 rounded-xl border border-[#e5e5e7] bg-[#fbfbfd]">
          <span className="text-[10px] uppercase font-bold text-[#86868b]">{t.hotspotsInside}</span>
          <div className="text-2xl font-black text-red-600 mt-1 num">
            {filteredHotspots.length.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#6e6e73]">
            MODIS: {modisCount} &bull; VIIRS: {viirsCount}
          </span>
        </div>

        <div className="p-4 rounded-xl border border-[#e5e5e7] bg-[#fbfbfd]">
          <span className="text-[10px] uppercase font-bold text-[#86868b]">{language === 'id' ? 'Total Radiasi (FRP)' : 'Total Radiative Power'}</span>
          <div className="text-2xl font-black text-[#1d1d1f] mt-1 num">
            {totalFrp.toLocaleString()} MW
          </div>
          <span className="text-[11px] text-[#6e6e73]">
            {language === 'id' ? 'Energi panas kumulatif' : 'Cumulative thermal energy'}
          </span>
        </div>

        <div className="p-4 rounded-xl border border-[#e5e5e7] bg-[#fbfbfd]">
          <span className="text-[10px] uppercase font-bold text-[#86868b]">{t.fireDensity}</span>
          <div className="text-2xl font-black text-[#0071e3] mt-1 num">
            {fireDensityPer1kHa}
          </div>
          <span className="text-[11px] text-[#6e6e73]">
            {language === 'id' ? 'Titik api per 1.000 Hektar' : 'Detections per 1,000 Hectares'}
          </span>
        </div>

      </div>

    </div>
  );
};
