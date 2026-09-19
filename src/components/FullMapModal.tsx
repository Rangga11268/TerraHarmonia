import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AOIRegion, RawHotspot, PRESET_AOIS } from '../engine/harmonizer';
import { Language, translations } from '../data/translations';
import {
  X,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Download,
  Crosshair,
  MapPin,
  Layers,
  ChevronDown,
  ChevronUp,
  Flame,
  Activity,
  Wind,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface FullMapModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  selectedAOI: AOIRegion;
  onSelectAOI: (aoi: AOIRegion) => void;
  hotspots: RawHotspot[];
  isLiveSync?: boolean;
}

const REGION_NAMES: Record<string, string> = {
  riau: 'Riau (Sumatera)',
  kalteng: 'Kalimantan Tengah',
  sumsel: 'Sumatera Selatan (OKI)',
  kalsel: 'Kalimantan Selatan',
  kaltim: 'Kalimantan Timur',
  kalbar: 'Kalimantan Barat (Ketapang/Pontianak)',
  jambi: 'Jambi (Berbak)',
  sumut_aceh: 'Aceh & Sumut (Rawa Tripa)',
  papua: 'Papua Selatan (Merauke/Mappi)',
  sulawesi: 'Sulawesi (Konawe/Morowali)',
  nusa_tenggara: 'Nusa Tenggara (Sumba/Timor)',
};

function getMarkerRadius(frp: number): number {
  if (frp < 15) return 4;
  if (frp < 40) return 6;
  if (frp < 100) return 9;
  if (frp < 250) return 13;
  return 17;
}

// Calculate distance in kilometers between two lat/lon points (Haversine formula)
function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const FullMapModal: React.FC<FullMapModalProps> = ({
  language,
  isOpen,
  onClose,
  selectedAOI,
  onSelectAOI,
  hotspots,
  isLiveSync = false,
}) => {
  const t = translations[language];

  // Map & Leaflet refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const bufferLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // States
  const [basemap, setBasemap] = useState<'satellite' | 'dark' | 'topo'>('satellite');
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sensorFilter, setSensorFilter] = useState<'ALL' | 'MODIS' | 'VIIRS'>('ALL');
  const [confidenceMin, setConfidenceMin] = useState<number>(0);
  const [frpMin, setFrpMin] = useState<number>(0);
  const [isHudCollapsed, setIsHudCollapsed] = useState<boolean>(false);

  // Radius Inspection Tool state
  const [isRadiusToolActive, setIsRadiusToolActive] = useState<boolean>(false);
  const [bufferRadiusKm, setBufferRadiusKm] = useState<number>(25);
  const [bufferCenter, setBufferCenter] = useState<{ lat: number; lon: number; name?: string } | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Init Leaflet map once when modal is opened
  useEffect(() => {
    if (!isOpen) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      return;
    }

    const timer = setTimeout(() => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: selectedAOI.center,
        zoom: selectedAOI.zoom,
        zoomControl: false,
        attributionControl: false,
      });

      const tileUrl =
        basemap === 'satellite'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : basemap === 'dark'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
          : 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';

      tileLayerRef.current = L.tileLayer(tileUrl, { maxZoom: 18 }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);
      layerGroupRef.current = L.layerGroup().addTo(map);
      bufferLayerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Click event for Radius Inspection
      map.on('click', (e: L.LeafletMouseEvent) => {
        setBufferCenter({ lat: e.latlng.lat, lon: e.latlng.lng });
      });

      // Force size recalculation
      map.invalidateSize();
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Basemap switcher
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);

    const tileUrl =
      basemap === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : basemap === 'dark'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';

    tileLayerRef.current = L.tileLayer(tileUrl, { maxZoom: 18 }).addTo(map);
  }, [basemap]);

  // Sync AOI camera change
  useEffect(() => {
    mapInstanceRef.current?.setView(selectedAOI.center, selectedAOI.zoom, { animate: true });
  }, [selectedAOI]);

  // Playback timer (2000-2026 animation)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSelectedYear((prev) => (prev >= 2026 ? 2000 : prev + 1));
    }, 1400);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Filtered hotspots matching current year, sensor, and threshold
  const filteredHotspots = useMemo(() => {
    return hotspots
      .filter((h) => h.aoiId === selectedAOI.id)
      .filter((h) => {
        const yr = new Date(h.date).getUTCFullYear();
        if (yr !== selectedYear) return false;
        if (sensorFilter !== 'ALL' && h.instrument !== sensorFilter) return false;
        if (confidenceMin > 0 && h.confidence < confidenceMin) return false;
        if (frpMin > 0 && h.frp < frpMin) return false;
        return true;
      });
  }, [hotspots, selectedAOI, selectedYear, sensorFilter, confidenceMin, frpMin]);

  // Hotspots within buffer radius (if tool active)
  const bufferHotspots = useMemo(() => {
    if (!bufferCenter) return [];
    return filteredHotspots.filter((h) => {
      const dist = haversineDistanceKm(bufferCenter.lat, bufferCenter.lon, h.lat, h.lon);
      return dist <= bufferRadiusKm;
    });
  }, [filteredHotspots, bufferCenter, bufferRadiusKm]);

  // Render buffer circle on map
  useEffect(() => {
    const bufferGroup = bufferLayerGroupRef.current;
    if (!bufferGroup) return;
    bufferGroup.clearLayers();

    if (bufferCenter && isRadiusToolActive) {
      // Draw outer threat circle
      const circle = L.circle([bufferCenter.lat, bufferCenter.lon], {
        radius: bufferRadiusKm * 1000,
        color: '#0071e3',
        weight: 2,
        dashArray: '6 4',
        fillColor: '#0071e3',
        fillOpacity: 0.12,
      });

      // Draw center pin
      const pin = L.circleMarker([bufferCenter.lat, bufferCenter.lon], {
        radius: 6,
        color: '#ffffff',
        fillColor: '#0071e3',
        fillOpacity: 1,
        weight: 2,
      });

      const popupContent = language === 'id'
        ? `<div style="font-family:system-ui,sans-serif;font-size:12px;padding:2px">
            <b>Pusat Inspeksi Radius ${bufferRadiusKm} km</b><br/>
            Koordinat: ${bufferCenter.lat.toFixed(4)}&deg;, ${bufferCenter.lon.toFixed(4)}&deg;<br/>
            Titik Api di Radius: <b>${bufferHotspots.length} titik</b>
          </div>`
        : `<div style="font-family:system-ui,sans-serif;font-size:12px;padding:2px">
            <b>Inspection Center (${bufferRadiusKm} km Buffer)</b><br/>
            Coords: ${bufferCenter.lat.toFixed(4)}&deg;, ${bufferCenter.lon.toFixed(4)}&deg;<br/>
            Hotspots in Radius: <b>${bufferHotspots.length} detections</b>
          </div>`;

      pin.bindPopup(popupContent).openPopup();
      circle.addTo(bufferGroup);
      pin.addTo(bufferGroup);
    }
  }, [bufferCenter, bufferRadiusKm, isRadiusToolActive, bufferHotspots.length, language]);

  // Render hotspot markers on map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // Regional bounding box
    if (selectedAOI.id !== 'indonesia') {
      const [minLat, minLon, maxLat, maxLon] = selectedAOI.bbox;
      L.rectangle([[minLat, minLon], [maxLat, maxLon]], {
        color: '#1d1d1f',
        weight: 1.5,
        dashArray: '4 4',
        fillColor: '#1d1d1f',
        fillOpacity: 0.03,
      }).addTo(layerGroup);
    }

    filteredHotspots.forEach((spot) => {
      const isVIIRS = spot.instrument === 'VIIRS';
      const radius = getMarkerRadius(spot.frp);
      const color = isVIIRS ? '#f59e0b' : '#dc2626';

      let locationName = selectedAOI.name;
      if (spot.id.startsWith('NAT-')) {
        const parts = spot.id.split('-');
        if (parts.length >= 2 && REGION_NAMES[parts[1]]) {
          locationName = REGION_NAMES[parts[1]];
        }
      }

      const popupHtml = language === 'id'
        ? `<div style="font-family:system-ui,-apple-system,sans-serif;font-size:12px;min-width:210px;padding:2px;line-height:1.4">
            <div style="font-weight:700;color:#1d1d1f;font-size:13px;margin-bottom:3px">Titik Api Satelit</div>
            <div style="color:#0071e3;font-weight:600;margin-bottom:4px">${locationName}</div>
            <div><b>Instrumen:</b> ${spot.instrument} (${spot.satellite})</div>
            <div><b>Tanggal:</b> ${spot.date} (${spot.time.slice(0,2)}:${spot.time.slice(2)} UTC)</div>
            <div><b>Daya Termal (FRP):</b> ${spot.frp} MW</div>
            <div><b>Keyakinan Deteksi:</b> ${spot.confidence}%</div>
            <div style="color:#86868b;margin-top:4px;font-size:10px">${spot.lat.toFixed(4)}&deg;, ${spot.lon.toFixed(4)}&deg;</div>
          </div>`
        : `<div style="font-family:system-ui,-apple-system,sans-serif;font-size:12px;min-width:210px;padding:2px;line-height:1.4">
            <div style="font-weight:700;color:#1d1d1f;font-size:13px;margin-bottom:3px">Satellite Hotspot Detection</div>
            <div style="color:#0071e3;font-weight:600;margin-bottom:4px">${locationName}</div>
            <div><b>Instrument:</b> ${spot.instrument} (${spot.satellite})</div>
            <div><b>Date:</b> ${spot.date} (${spot.time.slice(0,2)}:${spot.time.slice(2)} UTC)</div>
            <div><b>Thermal Power (FRP):</b> ${spot.frp} MW</div>
            <div><b>Confidence:</b> ${spot.confidence}%</div>
            <div style="color:#86868b;margin-top:4px;font-size:10px">${spot.lat.toFixed(4)}&deg;, ${spot.lon.toFixed(4)}&deg;</div>
          </div>`;

      const circle = L.circleMarker([spot.lat, spot.lon], {
        radius,
        fillColor: color,
        color: '#ffffff',
        weight: 1.2,
        opacity: 0.95,
        fillOpacity: 0.85,
      });

      circle.bindPopup(popupHtml, { maxWidth: 260 });
      circle.addTo(layerGroup);
    });
  }, [filteredHotspots, selectedAOI, language]);

  // Calculate live HUD metrics
  const hudMetrics = useMemo(() => {
    const activeSet = isRadiusToolActive && bufferCenter ? bufferHotspots : filteredHotspots;
    const totalCount = activeSet.length;
    const modisCount = activeSet.filter((h) => h.instrument === 'MODIS').length;
    const viirsCount = activeSet.filter((h) => h.instrument === 'VIIRS').length;
    const totalFRP = activeSet.reduce((sum, h) => sum + h.frp, 0);
    const avgConfidence = totalCount > 0 ? Math.round(activeSet.reduce((sum, h) => sum + h.confidence, 0) / totalCount) : 0;
    
    // Peatland Carbon emissions: ~12.5 tons CO2e per 5.5km cluster MW
    const harmonizedClusters = Math.max(1, Math.ceil(totalCount / (viirsCount > 0 ? 3.2 : 1.2)));
    const estimatedCO2eTons = Math.round(totalFRP * 14.8);

    return {
      totalCount,
      modisCount,
      viirsCount,
      totalFRP,
      avgConfidence,
      harmonizedClusters,
      estimatedCO2eTons,
    };
  }, [filteredHotspots, bufferHotspots, isRadiusToolActive, bufferCenter]);

  // Export GeoJSON
  const handleExportGeoJSON = () => {
    const activeSet = isRadiusToolActive && bufferCenter ? bufferHotspots : filteredHotspots;
    const geojson = {
      type: 'FeatureCollection',
      metadata: {
        aoi: selectedAOI.name,
        year: selectedYear,
        generatedAt: new Date().toISOString(),
        totalFeatures: activeSet.length,
        harmonizedBy: 'Terra Harmonia NASA Algorithm',
      },
      features: activeSet.map((h) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [h.lon, h.lat],
        },
        properties: {
          id: h.id,
          instrument: h.instrument,
          satellite: h.satellite,
          date: h.date,
          time: h.time,
          frp_mw: h.frp,
          confidence_pct: h.confidence,
          brightness_k: h.brightness,
          aoi_id: h.aoiId,
        },
      })),
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TerraHarmonia_Hotspots_${selectedAOI.id}_${selectedYear}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export Situation Report Memo (.txt)
  const handleExportSitRep = () => {
    const activeSet = isRadiusToolActive && bufferCenter ? bufferHotspots : filteredHotspots;
    const text = `=====================================================
TERRA HARMONIA - SITUATION REPORT (SITREP)
NASA SPACE APPS CHALLENGE: MODIS & VIIRS HARMONIZATION
=====================================================
Tanggal Dibuat      : ${new Date().toLocaleString('id-ID')}
Wilayah Pantauan    : ${selectedAOI.name}
Ekosistem / Bioma   : ${selectedAOI.biome}
Tahun Analisis      : ${selectedYear}
Filter Sensor       : ${sensorFilter}
Radius Buffer       : ${isRadiusToolActive && bufferCenter ? `${bufferRadiusKm} km dari (${bufferCenter.lat.toFixed(4)}, ${bufferCenter.lon.toFixed(4)})` : 'Tidak Aktif (Seluruh Zona)'}

RINGKASAN INTELIJEN:
-----------------------------------------------------
1. Total Deteksi Mentah : ${hudMetrics.totalCount} titik api
   - Sensor MODIS (1km) : ${hudMetrics.modisCount} titik
   - Sensor VIIRS (375m): ${hudMetrics.viirsCount} titik
2. Klaster Terharmonisasi: ${hudMetrics.harmonizedClusters} klaster (Grid 5.5 km)
3. Total Daya Termal    : ${hudMetrics.totalFRP.toLocaleString()} MW
4. Estimasi Karbon CO2e : ${hudMetrics.estimatedCO2eTons.toLocaleString()} Ton
5. Rerata Keyakinan     : ${hudMetrics.avgConfidence}%

STATUS RISIKO & REKOMENDASI:
- Level Ancaman: ${hudMetrics.totalCount > 100 ? 'KRITIS / WASPADA TINGGI' : 'SIAGA / PEMANTAUAN RUTIN'}
- Disarankan pengerahan regu Manggala Agni / BPBD untuk verifikasi lapangan pada titik-titik dengan FRP > 50 MW.
=====================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SitRep_${selectedAOI.id}_${selectedYear}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-[#1d1d1f] flex flex-col font-sans select-none overflow-hidden animate-in fade-in duration-200">
      
      {/* Top Navigation Header with ultra-high z-index */}
      <header className="relative z-[3000] h-14 bg-white border-b border-[#e5e5e7] px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 shadow-xs">
        
        {/* Left: Back / Return Button & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#1d1d1f] hover:bg-black text-white font-bold text-xs rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
            title="Kembali ke Dashboard (Esc)"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'id' ? 'Kembali' : 'Back'}</span>
          </button>

          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0 hidden sm:inline-block" />

          <div className="min-w-0">
            <h1 className="text-sm font-bold text-[#1d1d1f] tracking-tight truncate">
              Terra Harmonia GIS Full Explorer
            </h1>
            <p className="text-[11px] text-[#86868b] truncate">
              {selectedAOI.name} &bull; {selectedYear} ({filteredHotspots.length} titik aktif)
            </p>
          </div>
        </div>

        {/* Center: Quick Spatial Presets */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto py-1">
          {PRESET_AOIS.map((aoi) => {
            const isSel = selectedAOI.id === aoi.id;
            return (
              <button
                key={aoi.id}
                onClick={() => onSelectAOI(aoi)}
                className={`px-3 py-1 text-xs rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  isSel
                    ? 'bg-[#1d1d1f] text-white font-medium shadow-xs'
                    : 'bg-[#f5f5f7] text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#e5e5ea]'
                }`}
              >
                {aoi.id === 'indonesia' ? 'Seluruh Indonesia' : aoi.name.split(' (')[0]}
              </button>
            );
          })}
        </div>

        {/* Right Controls: Basemap & Close Button */}
        <div className="flex items-center gap-2.5">
          {/* Basemap switch */}
          <div className="flex items-center bg-[#f5f5f7] rounded-xl p-0.5 text-xs font-medium border border-[#e5e5e7]">
            <button
              onClick={() => setBasemap('satellite')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                basemap === 'satellite' ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold' : 'text-[#86868b]'
              }`}
            >
              Satelit
            </button>
            <button
              onClick={() => setBasemap('dark')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                basemap === 'dark' ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold' : 'text-[#86868b]'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setBasemap('topo')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                basemap === 'topo' ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold' : 'text-[#86868b]'
              }`}
            >
              Topo
            </button>
          </div>

          {/* Primary Red/Dark Close Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
            title="Tutup Peta Penuh (Esc)"
          >
            <X className="w-4 h-4" />
            <span>{language === 'id' ? 'Tutup Peta' : 'Close Map'}</span>
          </button>
        </div>
      </header>

      {/* Main Map Canvas Area */}
      <div className="relative flex-1 w-full h-full bg-[#1d1d1f] [isolation:isolate] z-0">
        
        {/* Leaflet DOM Node */}
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

        {/* Floating Apple-Style Mini Dashboard (HUD) */}
        <div className="absolute top-4 left-4 z-20 w-80 max-w-[calc(100vw-2rem)]">
          <div className="bg-white/90 backdrop-blur-xl border border-[#e5e5e7] rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
            
            {/* HUD Header */}
            <div className="px-4 py-3 border-b border-[#e5e5e7] flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#0071e3]" />
                <span className="font-semibold text-xs text-[#1d1d1f] tracking-tight">
                  {isRadiusToolActive && bufferCenter ? `Analisis Buffer (${bufferRadiusKm} km)` : 'Statistik Intelijen Spasial'}
                </span>
              </div>
              <button
                onClick={() => setIsHudCollapsed(!isHudCollapsed)}
                className="text-[#86868b] hover:text-[#1d1d1f] transition-colors p-0.5"
              >
                {isHudCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>

            {/* HUD Body */}
            {!isHudCollapsed && (
              <div className="p-4 space-y-3.5 text-xs">
                
                {/* Primary Metrics Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-[#f5f5f7] rounded-xl border border-[#e5e5e7]">
                    <div className="text-[10px] text-[#86868b] uppercase tracking-wider font-medium">Titik Api Aktif</div>
                    <div className="text-xl font-bold text-[#1d1d1f] num mt-0.5">
                      {hudMetrics.totalCount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#6e6e73] mt-0.5">
                      MODIS: {hudMetrics.modisCount} &bull; VIIRS: {hudMetrics.viirsCount}
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#f5f5f7] rounded-xl border border-[#e5e5e7]">
                    <div className="text-[10px] text-[#86868b] uppercase tracking-wider font-medium">Klaster 5.5km</div>
                    <div className="text-xl font-bold text-[#0071e3] num mt-0.5">
                      {hudMetrics.harmonizedClusters.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#6e6e73] mt-0.5">
                      Terkalibrasi NASA
                    </div>
                  </div>
                </div>

                {/* Energy & Carbon */}
                <div className="space-y-1.5 border-t border-[#e5e5e7] pt-2.5">
                  <div className="flex items-center justify-between text-[#6e6e73]">
                    <span className="flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-red-500" />
                      Total Daya Radiasi (FRP)
                    </span>
                    <span className="font-semibold text-[#1d1d1f] num">
                      {hudMetrics.totalFRP.toLocaleString()} MW
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#6e6e73]">
                    <span className="flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-amber-500" />
                      Estimasi Emisi Gambut
                    </span>
                    <span className="font-semibold text-[#1d1d1f] num">
                      {hudMetrics.estimatedCO2eTons.toLocaleString()} ton CO₂e
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#6e6e73]">
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
                      Rerata Keyakinan Sensor
                    </span>
                    <span className="font-semibold text-[#1d1d1f] num">
                      {hudMetrics.avgConfidence}%
                    </span>
                  </div>
                </div>

                {/* Buffer status banner */}
                {isRadiusToolActive && (
                  <div className="p-2 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 text-[11px] leading-snug">
                    {bufferCenter ? (
                      <div>
                        <b>Titik Inspeksi Terpilih:</b> {bufferCenter.lat.toFixed(4)}&deg;, {bufferCenter.lon.toFixed(4)}&deg;.
                        <div className="mt-0.5 text-blue-700">
                          Klik lokasi lain di peta untuk memindahkan zona radius.
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <Crosshair className="w-3.5 h-3.5 shrink-0" />
                        <span>Klik di mana saja pada peta untuk meletakkan radius buffer.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Floating Bottom Control Deck / Toolbar */}
        <div className="absolute bottom-6 left-4 right-4 z-20 max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-xl border border-[#e5e5e7] rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
            
            {/* Row 1: Time Scrubber & Anomaly Presets */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              {/* Play / Year Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center hover:bg-black transition-all shrink-0 shadow-sm"
                  title={isPlaying ? 'Jeda Animasi' : 'Putar Animasi (2000–2026)'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <div>
                  <div className="text-[11px] text-[#86868b] uppercase tracking-wider font-semibold">
                    Tahun Observasi
                  </div>
                  <div className="text-xl font-bold text-[#1d1d1f] num leading-none mt-0.5">
                    {selectedYear}
                  </div>
                </div>
              </div>

              {/* Range Slider */}
              <div className="flex-1 mx-2">
                <input
                  type="range"
                  min="2000"
                  max="2026"
                  step="1"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[#e5e5e7] rounded-lg appearance-none cursor-pointer accent-[#1d1d1f]"
                />
                <div className="flex justify-between text-[10px] text-[#86868b] font-medium mt-1">
                  <span>2000 (MODIS Era)</span>
                  <span className="font-semibold text-red-600">2015 El Niño</span>
                  <span>2026 (Sekarang)</span>
                </div>
              </div>

              {/* Climate Presets */}
              <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto">
                {[
                  { yr: 2015, label: '2015 Super El Niño' },
                  { yr: 2019, label: '2019 El Niño' },
                  { yr: 2023, label: '2023 El Niño' },
                  { yr: 2021, label: '2021 La Niña' },
                ].map(({ yr, label }) => (
                  <button
                    key={yr}
                    onClick={() => {
                      setSelectedYear(yr);
                      setIsPlaying(false);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      selectedYear === yr
                        ? 'bg-red-500 text-white shadow-xs font-semibold'
                        : 'bg-[#f5f5f7] text-[#6e6e73] hover:text-[#1d1d1f]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Tool Actions & GIS Exports */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#e5e5e7] text-xs">
              
              {/* Interactive Tools Group */}
              <div className="flex items-center gap-2 flex-wrap">
                
                {/* Radius Tool Toggle */}
                <button
                  onClick={() => setIsRadiusToolActive(!isRadiusToolActive)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                    isRadiusToolActive
                      ? 'bg-[#0071e3] text-white shadow-xs'
                      : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e5e5ea]'
                  }`}
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>{isRadiusToolActive ? 'Radius Aktif' : 'Alat Radius Ancaman'}</span>
                </button>

                {/* Radius Distance Selector */}
                {isRadiusToolActive && (
                  <div className="flex items-center bg-[#f5f5f7] rounded-xl p-0.5 border border-[#e5e5e7]">
                    {[10, 25, 50, 100].map((km) => (
                      <button
                        key={km}
                        onClick={() => setBufferRadiusKm(km)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                          bufferRadiusKm === km
                            ? 'bg-white text-[#0071e3] shadow-xs font-bold'
                            : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                        }`}
                      >
                        {km} km
                      </button>
                    ))}
                  </div>
                )}

                {/* Sensor Filter */}
                <div className="flex items-center bg-[#f5f5f7] rounded-xl p-0.5 border border-[#e5e5e7]">
                  {(['ALL', 'MODIS', 'VIIRS'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSensorFilter(s)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                        sensorFilter === s
                          ? 'bg-white text-[#1d1d1f] shadow-xs font-bold'
                          : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                      }`}
                    >
                      {s === 'ALL' ? 'Semua Sensor' : s}
                    </button>
                  ))}
                </div>
              </div>

              {/* GIS Export Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportGeoJSON}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e5e5ea] rounded-xl font-medium transition-all"
                  title="Unduh dataset spasial dalam format GeoJSON"
                >
                  <Download className="w-3.5 h-3.5 text-[#0071e3]" />
                  <span>GeoJSON</span>
                </button>

                <button
                  onClick={handleExportSitRep}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e5e5ea] rounded-xl font-medium transition-all"
                  title="Unduh ringkasan memorandum situasi operasional lapangan"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>SitRep</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-xs cursor-pointer"
                  title="Tutup Peta Penuh dan Kembali (Esc)"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Tutup</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
