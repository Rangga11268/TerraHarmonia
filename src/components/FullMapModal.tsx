import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AOIRegion, RawHotspot, PRESET_AOIS } from '../engine/harmonizer';
import { Language, translations } from '../data/translations';
import { resolveHotspotLocation, getIndonesianLocalTime } from '../utils/locationResolver';
import {
  X,
  ArrowLeft,
  Play,
  Pause,
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
  Satellite,
  Check,
  Globe2,
  TreePine,
  Sparkles,
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

// Preset Indonesian Conservation & Peatland Overlays
const CONSERVATION_OVERLAYS = [
  {
    id: 'sebangau_np',
    name: 'TN Sebangau (Kubah Gambut Kalteng)',
    type: 'Peatland National Park',
    coords: [
      [-2.10, 113.40],
      [-2.10, 114.10],
      [-3.25, 114.10],
      [-3.25, 113.40],
    ] as [number, number][],
    color: '#10b981',
  },
  {
    id: 'tanjung_puting',
    name: 'TN Tanjung Puting (Kalteng)',
    type: 'National Park & Peat Swamp',
    coords: [
      [-2.65, 111.70],
      [-2.65, 112.25],
      [-3.50, 112.25],
      [-3.50, 111.70],
    ] as [number, number][],
    color: '#10b981',
  },
  {
    id: 'tesso_nilo',
    name: 'TN Tesso Nilo & Kampar (Riau)',
    type: 'Lowland Peat Forest',
    coords: [
      [-0.05, 101.40],
      [-0.05, 101.85],
      [-0.35, 101.85],
      [-0.35, 101.40],
    ] as [number, number][],
    color: '#059669',
  },
  {
    id: 'padang_sugihan',
    name: 'SM Padang Sugihan (Kubah Gambut OKI Sumsel)',
    type: 'Wildlife Reserve Peat Dome',
    coords: [
      [-2.95, 105.00],
      [-2.95, 105.35],
      [-3.30, 105.35],
      [-3.30, 105.00],
    ] as [number, number][],
    color: '#059669',
  },
  {
    id: 'berbak_np',
    name: 'TN Berbak-Sembilang (Jambi & Sumsel)',
    type: 'Ramsar Peat Wetland',
    coords: [
      [-1.10, 104.10],
      [-1.10, 104.55],
      [-1.85, 104.55],
      [-1.85, 104.10],
    ] as [number, number][],
    color: '#10b981',
  },
  {
    id: 'baluran_np',
    name: 'TN Baluran (Savana Bekol Jawa Timur)',
    type: 'Savanna National Park',
    coords: [
      [-7.75, 114.30],
      [-7.75, 114.45],
      [-7.95, 114.45],
      [-7.95, 114.30],
    ] as [number, number][],
    color: '#eab308',
  },
  {
    id: 'wasur_np',
    name: 'TN Wasur (Savana Basah Merauke Papua)',
    type: 'Wetland & Savanna National Park',
    coords: [
      [-8.20, 140.35],
      [-8.20, 141.00],
      [-8.95, 141.00],
      [-8.95, 140.35],
    ] as [number, number][],
    color: '#10b981',
  },
];

// Calculate distance in kilometers between two lat/lon points (Haversine formula)
function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
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
  const canvasRendererRef = useRef<L.Canvas | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const bufferLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const peatLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // States
  const [basemap, setBasemap] = useState<'satellite' | 'dark' | 'nasa_gibs'>('satellite');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sensorFilter, setSensorFilter] = useState<'ALL' | 'MODIS' | 'VIIRS'>('ALL');
  const [frpThreshold, setFrpThreshold] = useState<number>(0);
  const [showPeatOverlay, setShowPeatOverlay] = useState<boolean>(true);
  const [isHudCollapsed, setIsHudCollapsed] = useState<boolean>(false);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState<boolean>(false);

  // Radius Inspection Tool state
  const [isRadiusToolActive, setIsRadiusToolActive] = useState<boolean>(false);
  const [bufferRadiusKm, setBufferRadiusKm] = useState<number>(25);
  const [bufferCenter, setBufferCenter] = useState<{ lat: number; lon: number } | null>(null);

  // Grouped Regions for Popover Dropdown
  const regionGroups = useMemo(() => {
    const national = PRESET_AOIS.filter((a) => a.id === 'indonesia');
    const islands = PRESET_AOIS.filter((a) =>
      ['sumatera', 'kalimantan', 'jawa_bali', 'nusa_tenggara', 'sulawesi', 'papua'].includes(a.id)
    );
    const peatlands = PRESET_AOIS.filter((a) =>
      ['riau', 'kalteng', 'sumsel', 'kalbar', 'kalsel', 'kaltim'].includes(a.id)
    );

    return { national, islands, peatlands };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        return;
      }

      const INDONESIA_BOUNDS: L.LatLngBoundsExpression = [
        [-11.5, 94.0],
        [6.5, 141.5],
      ];

      const canvas = L.canvas({ padding: 0.5 });
      canvasRendererRef.current = canvas;

      const map = L.map(mapContainerRef.current, {
        center: selectedAOI.center,
        zoom: selectedAOI.zoom,
        minZoom: 4,
        maxZoom: 18,
        maxBounds: INDONESIA_BOUNDS,
        maxBoundsViscosity: 1.0,
        zoomControl: false,
        attributionControl: false,
        preferCanvas: true,
        renderer: canvas,
      });

      const tileUrl =
        basemap === 'nasa_gibs'
          ? 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2024-08-15/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg'
          : basemap === 'satellite'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';

      tileLayerRef.current = L.tileLayer(tileUrl, { maxZoom: basemap === 'nasa_gibs' ? 9 : 18 }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);
      layerGroupRef.current = L.layerGroup().addTo(map);
      bufferLayerGroupRef.current = L.layerGroup().addTo(map);
      peatLayerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Click event for Radius Inspection
      map.on('click', (e: L.LeafletMouseEvent) => {
        setBufferCenter({ lat: e.latlng.lat, lon: e.latlng.lng });
      });

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
      basemap === 'nasa_gibs'
        ? 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2024-08-15/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg'
        : basemap === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';

    tileLayerRef.current = L.tileLayer(tileUrl, { maxZoom: basemap === 'nasa_gibs' ? 9 : 18 }).addTo(map);
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
    }, 1500);
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
        if (frpThreshold > 0 && h.frp < frpThreshold) return false;
        return true;
      });
  }, [hotspots, selectedAOI, selectedYear, sensorFilter, frpThreshold]);

  // Hotspots within buffer radius (if tool active)
  const bufferHotspots = useMemo(() => {
    if (!bufferCenter) return [];
    return filteredHotspots.filter((h) => {
      const dist = haversineDistanceKm(bufferCenter.lat, bufferCenter.lon, h.lat, h.lon);
      return dist <= bufferRadiusKm;
    });
  }, [filteredHotspots, bufferCenter, bufferRadiusKm]);

  // Render Peatland / Forest Reserve Layer Overlays
  useEffect(() => {
    const peatGroup = peatLayerGroupRef.current;
    if (!peatGroup) return;
    peatGroup.clearLayers();

    if (!showPeatOverlay) return;

    CONSERVATION_OVERLAYS.forEach((poly) => {
      const polygon = L.polygon(poly.coords, {
        color: poly.color,
        weight: 1.5,
        dashArray: '4 4',
        fillColor: poly.color,
        fillOpacity: 0.12,
      });

      polygon.bindTooltip(
        `<div style="font-family:system-ui,sans-serif;font-size:11px;padding:2px;">
          <b>${poly.name}</b><br/>
          <span style="color:${poly.color}">${poly.type}</span>
        </div>`,
        { sticky: true }
      );

      polygon.addTo(peatGroup);
    });
  }, [showPeatOverlay]);

  // Render buffer circle on map
  useEffect(() => {
    const bufferGroup = bufferLayerGroupRef.current;
    if (!bufferGroup) return;
    bufferGroup.clearLayers();

    if (bufferCenter && isRadiusToolActive) {
      const circle = L.circle([bufferCenter.lat, bufferCenter.lon], {
        radius: bufferRadiusKm * 1000,
        color: '#38bdf8',
        weight: 2,
        dashArray: '6 4',
        fillColor: '#0284c7',
        fillOpacity: 0.14,
      });

      const pin = L.circleMarker([bufferCenter.lat, bufferCenter.lon], {
        radius: 6,
        color: '#ffffff',
        fillColor: '#0284c7',
        fillOpacity: 1,
        weight: 2,
      });

      const popupContent =
        language === 'id'
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

  // Render clean FIRMS-authentic small pixel points onto Canvas
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    const canvas = canvasRendererRef.current;
    if (!map || !layerGroup || !canvas) return;

    layerGroup.clearLayers();

    // Regional bounding box
    if (selectedAOI.id !== 'indonesia') {
      const [minLat, minLon, maxLat, maxLon] = selectedAOI.bbox;
      L.rectangle(
        [
          [minLat, minLon],
          [maxLat, maxLon],
        ],
        {
          color: '#38bdf8',
          weight: 1.5,
          dashArray: '5 5',
          fillColor: '#0284c7',
          fillOpacity: 0.02,
          renderer: canvas,
        }
      ).addTo(layerGroup);
    }

    filteredHotspots.forEach((spot) => {
      const isVIIRS = spot.instrument === 'VIIRS';

      // Clean NASA FIRMS dots: small solid pixels without bulky white bullseyes
      const radius = isVIIRS ? 2.5 : 4.0;
      const color = isVIIRS ? '#ff2b2b' : '#dc2626';

      const intensity =
        spot.frp < 15
          ? language === 'id'
            ? 'Rendah'
            : 'Low'
          : spot.frp < 50
          ? language === 'id'
            ? 'Sedang'
            : 'Moderate'
          : spot.frp < 150
          ? language === 'id'
            ? 'Tinggi'
            : 'High'
          : language === 'id'
          ? 'Sangat Tinggi'
          : 'Extreme';

      const intensityColor =
        spot.frp < 15 ? '#10b981' : spot.frp < 50 ? '#f59e0b' : spot.frp < 150 ? '#f97316' : '#dc2626';

      const loc = resolveHotspotLocation(spot.lat, spot.lon, selectedAOI.id, language);
      const localTime = getIndonesianLocalTime(spot.date, spot.time, spot.lon);
      const tempCelsius = (spot.brightness - 273.15).toFixed(1);

      const popupHtml = `
        <div class="hotspot-popup">
          <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:6px;margin-bottom:8px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};"></span>
              <strong style="color:#ffffff;font-size:12px;">${spot.instrument} (${spot.satellite})</strong>
            </div>
            <span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;background:${intensityColor}25;color:${intensityColor};border:1px solid ${intensityColor}50;">
              ${intensity.toUpperCase()} &bull; ${spot.frp} MW
            </span>
          </div>

          <div style="background:rgba(255,255,255,0.06);padding:8px;border-radius:8px;margin-bottom:8px;">
            <div style="font-weight:700;font-size:12px;color:#ffffff;">${loc.regency}</div>
            ${loc.district ? `<div style="font-size:11px;color:#cbd5e1;margin-top:2px;"><b>${language === 'id' ? 'Kecamatan' : 'District'}:</b> ${loc.district}</div>` : ''}
            <div style="font-size:11px;color:#94a3b8;margin-top:2px;">${loc.landscape}</div>
            ${loc.isPeatland ? `<div style="font-size:11px;color:#fbbf24;margin-top:3px;font-weight:600;"><b>${language === 'id' ? 'Kedalaman Gambut' : 'Peat Depth'}:</b> ${loc.peatDepthEstimate}</div>` : ''}
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px;margin-bottom:8px;">
            <div style="background:rgba(0,0,0,0.3);padding:6px;border-radius:6px;">
              <span style="display:block;font-size:9px;color:#94a3b8;text-transform:uppercase;">${language === 'id' ? 'Koordinat' : 'Coords'}</span>
              <strong style="color:#ffffff;font-family:monospace;font-size:11px;">${spot.lat.toFixed(4)}&deg;, ${spot.lon.toFixed(4)}&deg;</strong>
            </div>

            <div style="background:rgba(0,0,0,0.3);padding:6px;border-radius:6px;">
              <span style="display:block;font-size:9px;color:#94a3b8;text-transform:uppercase;">${language === 'id' ? 'Waktu Deteksi' : 'Time'}</span>
              <strong style="color:#ffffff;font-size:11px;">${localTime.timeFormatted}</strong>
              <span style="display:block;font-size:9px;color:#64748b;">${spot.date}</span>
            </div>
          </div>

          <div style="display:flex;justify-content:space-between;font-size:11px;color:#cbd5e1;padding-top:4px;border-top:1px solid rgba(255,255,255,0.1);">
            <span><b>Suhu:</b> ${tempCelsius}&deg;C</span>
            <span><b>Keyakinan:</b> ${spot.confidence}%</span>
          </div>

          <div style="margin-top:8px;padding-top:6px;border-top:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between;align-items:center;">
            <a href="${loc.googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="color:#38bdf8;font-size:11px;text-decoration:underline;">
              ${language === 'id' ? 'Buka Google Maps' : 'Google Maps'}
            </a>
            <span style="font-size:10px;color:#64748b;">NASA FIRMS</span>
          </div>
        </div>
      `;

      const circle = L.circleMarker([spot.lat, spot.lon], {
        radius,
        fillColor: color,
        color: '#ffffff',
        weight: 0.4,
        opacity: 0.9,
        fillOpacity: 0.92,
        renderer: canvas,
      });

      circle.bindPopup(popupHtml, { maxWidth: 300 });
      circle.addTo(layerGroup);
    });
  }, [filteredHotspots, selectedAOI, language]);

  // Live HUD metrics
  const hudMetrics = useMemo(() => {
    const activeSet = isRadiusToolActive && bufferCenter ? bufferHotspots : filteredHotspots;
    const totalCount = activeSet.length;
    const modisCount = activeSet.filter((h) => h.instrument === 'MODIS').length;
    const viirsCount = activeSet.filter((h) => h.instrument === 'VIIRS').length;
    const totalFRP = activeSet.reduce((sum, h) => sum + h.frp, 0);
    const avgConfidence =
      totalCount > 0 ? Math.round(activeSet.reduce((sum, h) => sum + h.confidence, 0) / totalCount) : 0;
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
        harmonizedBy: 'Terra Harmonia NASA Harmonization Engine',
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
    a.download = `TerraHarmonia_GIS_${selectedAOI.id}_${selectedYear}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] bg-[#070d18] text-slate-100 flex flex-col font-sans select-none overflow-hidden animate-in fade-in duration-150">
      
      {/* Top Header Toolbar (Single Clean Row) */}
      <header className="relative z-[3000] h-14 bg-[#0a1120]/95 backdrop-blur-xl border-b border-slate-800/90 px-3 sm:px-5 flex items-center justify-between gap-3 shrink-0 shadow-md">
        
        {/* Left: Back Button + Title + Status */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold border border-slate-700/70 transition cursor-pointer shrink-0 shadow-xs"
            title="Kembali ke Dashboard (Esc)"
          >
            <ArrowLeft className="w-4 h-4 text-sky-400" />
            <span>{language === 'id' ? 'Kembali' : 'Back'}</span>
          </button>

          <div className="h-5 w-px bg-slate-800 hidden sm:block shrink-0" />

          <div className="min-w-0 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 hidden sm:inline-block" />
            <div className="truncate">
              <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-tight truncate">
                Terra Harmonia GIS Explorer
              </h1>
              <p className="text-[10px] text-slate-400 truncate hidden md:block">
                Harmonisasi NASA MODIS (1km) &bull; VIIRS (375m) &bull; Kalibrasi Lahan Gambut
              </p>
            </div>
          </div>
        </div>

        {/* Center: Clean Island & Region Dropdown Popover */}
        <div className="relative">
          <button
            onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700/90 text-white rounded-xl border border-slate-700/80 text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="max-w-[150px] sm:max-w-[220px] truncate">{selectedAOI.name.split(' (')[0]}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isRegionDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Popover Dropdown Menu */}
          {isRegionDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsRegionDropdownOpen(false)}
              />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 sm:w-80 bg-[#0d1627]/98 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl z-50 p-2 text-xs divide-y divide-slate-800/80 max-h-[75vh] overflow-y-auto">
                
                {/* 1. National Overview */}
                <div className="pb-1.5">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Globe2 className="w-3 h-3 text-sky-400" />
                    <span>{language === 'id' ? 'Cakupan Nasional' : 'National Scope'}</span>
                  </div>
                  {regionGroups.national.map((aoi) => {
                    const isSel = selectedAOI.id === aoi.id;
                    return (
                      <button
                        key={aoi.id}
                        onClick={() => {
                          onSelectAOI(aoi);
                          setIsRegionDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition cursor-pointer ${
                          isSel ? 'bg-sky-600 text-white font-bold' : 'text-slate-200 hover:bg-slate-800/90'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{aoi.name.split(' (')[0]}</div>
                          <div className={`text-[10px] ${isSel ? 'text-sky-100' : 'text-slate-400'}`}>38 Provinsi &bull; Seluruh Wilayah</div>
                        </div>
                        {isSel && <Check className="w-4 h-4 text-white shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* 2. Major Islands */}
                <div className="py-1.5">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{language === 'id' ? 'Pulau & Wilayah Utama' : 'Major Islands & Zones'}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-0.5">
                    {regionGroups.islands.map((aoi) => {
                      const isSel = selectedAOI.id === aoi.id;
                      return (
                        <button
                          key={aoi.id}
                          onClick={() => {
                            onSelectAOI(aoi);
                            setIsRegionDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition cursor-pointer ${
                            isSel ? 'bg-sky-600 text-white font-bold' : 'text-slate-200 hover:bg-slate-800/90'
                          }`}
                        >
                          <span className="truncate">{aoi.name.split(' (')[0]}</span>
                          {isSel && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Priority Peatland Landscapes */}
                <div className="pt-1.5">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>{language === 'id' ? 'Kubah Gambut Prioritas' : 'Priority Peat Domes'}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-0.5">
                    {regionGroups.peatlands.map((aoi) => {
                      const isSel = selectedAOI.id === aoi.id;
                      return (
                        <button
                          key={aoi.id}
                          onClick={() => {
                            onSelectAOI(aoi);
                            setIsRegionDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition cursor-pointer ${
                            isSel ? 'bg-sky-600 text-white font-bold' : 'text-slate-200 hover:bg-slate-800/90'
                          }`}
                        >
                          <span className="truncate">{aoi.name.split(' (')[0]}</span>
                          {isSel && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </>
          )}
        </div>

        {/* Right Controls: Basemaps, Peat Overlay & Close */}
        <div className="flex items-center gap-2">
          
          {/* Basemap Switcher Pill */}
          <div className="flex items-center bg-slate-800/90 rounded-xl p-0.5 border border-slate-700/80 text-xs">
            <button
              onClick={() => setBasemap('satellite')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                basemap === 'satellite' ? 'bg-sky-600 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sat HD
            </button>
            <button
              onClick={() => setBasemap('dark')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                basemap === 'dark' ? 'bg-sky-600 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setBasemap('nasa_gibs')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                basemap === 'nasa_gibs' ? 'bg-sky-600 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="NASA Global Imagery Browse Services (MODIS True Color)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>GIBS</span>
            </button>
          </div>

          {/* Peatland / Protected Area Overlay Toggle */}
          <button
            onClick={() => setShowPeatOverlay(!showPeatOverlay)}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              showPeatOverlay
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-800/90 border-slate-700/80 text-slate-400 hover:text-white'
            }`}
            title="Tampilkan Lapisan Kawasan Gambut & Taman Nasional"
          >
            <TreePine className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'id' ? 'Kawasan Gambut' : 'Peatlands'}</span>
          </button>

          {/* GeoJSON Download */}
          <button
            onClick={handleExportGeoJSON}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer"
            title="Unduh Dataset Spasial GeoJSON"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>GeoJSON</span>
          </button>

          {/* Single Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800/90 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700/80 rounded-xl transition cursor-pointer"
            title="Tutup Peta (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* Main Map Viewport */}
      <div className="relative flex-1 w-full h-full bg-[#070d18] [isolation:isolate] z-0 overflow-hidden">
        
        {/* Leaflet DOM Node */}
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0 bg-[#070d18]" />

        {/* Floating Mini Dashboard (Spatial Intelligence HUD) */}
        <div className="absolute top-4 left-4 z-20 w-72 sm:w-80 max-w-[calc(100vw-2rem)]">
          <div className="bg-[#0a1120]/95 text-white backdrop-blur-xl border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
            
            <div className="px-3.5 py-2.5 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-xs tracking-tight text-white">
                  {isRadiusToolActive && bufferCenter
                    ? `Buffer Radius (${bufferRadiusKm} km)`
                    : language === 'id'
                    ? 'Statistik Spasial Terharmonisasi'
                    : 'Harmonized Spatial Metrics'}
                </span>
              </div>
              <button
                onClick={() => setIsHudCollapsed(!isHudCollapsed)}
                className="text-slate-400 hover:text-white transition-colors p-0.5 cursor-pointer"
              >
                {isHudCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>

            {!isHudCollapsed && (
              <div className="p-3 space-y-2.5 text-xs">
                
                {/* Metric Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800/80">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {language === 'id' ? 'Titik Api Aktif' : 'Active Hotspots'}
                    </div>
                    <div className="text-lg font-bold text-white num mt-0.5">
                      {hudMetrics.totalCount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      MODIS: {hudMetrics.modisCount} &bull; VIIRS: {hudMetrics.viirsCount}
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800/80">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {language === 'id' ? 'Klaster 5.5km' : '5.5km Clusters'}
                    </div>
                    <div className="text-lg font-bold text-sky-400 num mt-0.5">
                      {hudMetrics.harmonizedClusters.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {language === 'id' ? 'Harmonisasi NASA' : 'NASA Calibrated'}
                    </div>
                  </div>
                </div>

                {/* Fire Energy & Peat Carbon Emissions */}
                <div className="space-y-1.5 border-t border-slate-800/80 pt-2 text-[11px]">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-red-400" />
                      <span>Total FRP:</span>
                    </span>
                    <span className="font-semibold text-white num font-mono">
                      {hudMetrics.totalFRP.toLocaleString()} MW
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'id' ? 'Emisi Gambut:' : 'Peat Emissions:'}</span>
                    </span>
                    <span className="font-semibold text-amber-300 num font-mono">
                      {hudMetrics.estimatedCO2eTons.toLocaleString()} ton CO₂e
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === 'id' ? 'Rata-rata Keyakinan:' : 'Avg Confidence:'}</span>
                    </span>
                    <span className="font-semibold text-white num font-mono">
                      {hudMetrics.avgConfidence}%
                    </span>
                  </div>
                </div>

                {isRadiusToolActive && !bufferCenter && (
                  <div className="p-2 bg-sky-950/60 border border-sky-500/40 rounded-xl text-[11px] text-sky-300">
                    {language === 'id'
                      ? 'Klik pada titik mana saja di peta untuk menarik radius inspeksi.'
                      : 'Click anywhere on map to inspect within buffer radius.'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Floating Bottom Timeline & Multi-Tool Deck */}
        <div className="absolute bottom-5 left-4 right-4 z-20 max-w-3xl mx-auto">
          <div className="bg-[#0a1120]/95 text-white backdrop-blur-xl border border-slate-800/90 rounded-2xl p-3 sm:p-3.5 shadow-2xl space-y-2.5">
            
            {/* Row 1: Timeline Scrubber & Epoch Presets */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-900 flex items-center justify-center transition shrink-0 shadow-sm cursor-pointer"
                  title={isPlaying ? 'Jeda Animasi' : 'Putar Animasi (2000-2026)'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-white num font-mono min-w-[42px]">
                    {selectedYear}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedYear(Math.max(2000, selectedYear - 1));
                        setIsPlaying(false);
                      }}
                      className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center cursor-pointer transition"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedYear(Math.min(2026, selectedYear + 1));
                        setIsPlaying(false);
                      }}
                      className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center cursor-pointer transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Climate Epoch Milestones */}
              <div className="flex flex-wrap items-center gap-1 scrollbar-none">
                {[
                  { yr: 2000, label: '2000 (Baseline)' },
                  { yr: 2015, label: '2015 (Super El Niño)' },
                  { yr: 2019, label: '2019 (IOD+)' },
                  { yr: 2023, label: '2023 (El Niño)' },
                  { yr: 2024, label: '2024' },
                  { yr: 2026, label: '2026 (Live)' },
                ].map(({ yr, label }) => (
                  <button
                    key={yr}
                    onClick={() => {
                      setSelectedYear(yr);
                      setIsPlaying(false);
                    }}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                      selectedYear === yr
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Sensor Filters, FRP Threshold, & Radius Tool */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
              
              <div className="flex items-center gap-2 flex-wrap">
                
                {/* Sensor Filter */}
                <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/80">
                  {(['ALL', 'VIIRS', 'MODIS'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSensorFilter(s)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                        sensorFilter === s
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {s === 'ALL' ? (language === 'id' ? 'Semua Sensor' : 'All Sensors') : s === 'VIIRS' ? 'VIIRS (375m)' : 'MODIS (1km)'}
                    </button>
                  ))}
                </div>

                {/* FRP Intensity Filter */}
                <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/80">
                  {[
                    { val: 0, label: language === 'id' ? 'Semua FRP' : 'All FRP' },
                    { val: 50, label: '>50 MW' },
                    { val: 100, label: '>100 MW' },
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      onClick={() => setFrpThreshold(val)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                        frpThreshold === val
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Threat Buffer Radius Tool */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsRadiusToolActive(!isRadiusToolActive)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition cursor-pointer ${
                      isRadiusToolActive
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700/80'
                    }`}
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>{isRadiusToolActive ? `Radius (${bufferRadiusKm}km)` : 'Radius Tool'}</span>
                  </button>

                  {isRadiusToolActive && (
                    <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/80">
                      {[10, 25, 50, 100].map((km) => (
                        <button
                          key={km}
                          onClick={() => setBufferRadiusKm(km)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                            bufferRadiusKm === km
                              ? 'bg-sky-600 text-white font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {km}k
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Status summary */}
              <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
                {filteredHotspots.length.toLocaleString()} {language === 'id' ? 'titik aktif' : 'points'}
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
