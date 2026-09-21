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
  const canvasRendererRef = useRef<L.Canvas | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const bufferLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // States
  const [basemap, setBasemap] = useState<'satellite' | 'dark' | 'topo' | 'nasa_gibs'>('satellite');
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sensorFilter, setSensorFilter] = useState<'ALL' | 'MODIS' | 'VIIRS'>('ALL');
  const [confidenceMin, setConfidenceMin] = useState<number>(0);
  const [frpMin, setFrpMin] = useState<number>(0);
  const [isHudCollapsed, setIsHudCollapsed] = useState<boolean>(false);

  // Radius Inspection Tool state
  const [isRadiusToolActive, setIsRadiusToolActive] = useState<boolean>(false);
  const [bufferRadiusKm, setBufferRadiusKm] = useState<number>(25);
  const [bufferCenter, setBufferCenter] = useState<{ lat: number; lon: number } | null>(null);

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
          : basemap === 'dark'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
          : 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';

      tileLayerRef.current = L.tileLayer(tileUrl, { maxZoom: basemap === 'nasa_gibs' ? 9 : 18 }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);
      layerGroupRef.current = L.layerGroup().addTo(map);
      bufferLayerGroupRef.current = L.layerGroup().addTo(map);
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
        : basemap === 'dark'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';

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
      const circle = L.circle([bufferCenter.lat, bufferCenter.lon], {
        radius: bufferRadiusKm * 1000,
        color: '#0284c7',
        weight: 2,
        dashArray: '6 4',
        fillColor: '#0284c7',
        fillOpacity: 0.12,
      });

      const pin = L.circleMarker([bufferCenter.lat, bufferCenter.lon], {
        radius: 6,
        color: '#ffffff',
        fillColor: '#0284c7',
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
      L.rectangle([[minLat, minLon], [maxLat, maxLon]], {
        color: '#0284c7',
        weight: 1.5,
        dashArray: '5 5',
        fillColor: '#0284c7',
        fillOpacity: 0.02,
        renderer: canvas,
      }).addTo(layerGroup);
    }

    filteredHotspots.forEach((spot) => {
      const isVIIRS = spot.instrument === 'VIIRS';
      
      // Clean NASA FIRMS dots: small solid pixels without bulky white bullseyes
      const radius = isVIIRS ? 2.5 : 4.0;
      const color = isVIIRS ? '#ff1e1e' : '#dc2626';

      const intensity =
        spot.frp < 15 ? (language === 'id' ? 'Rendah' : 'Low')
        : spot.frp < 50 ? (language === 'id' ? 'Sedang' : 'Moderate')
        : spot.frp < 150 ? (language === 'id' ? 'Tinggi' : 'High')
        : (language === 'id' ? 'Sangat Tinggi' : 'Extreme');

      const intensityColor =
        spot.frp < 15 ? '#10b981'
        : spot.frp < 50 ? '#f59e0b'
        : spot.frp < 150 ? '#f97316'
        : '#dc2626';

      const loc = resolveHotspotLocation(spot.lat, spot.lon, selectedAOI.id, language);
      const localTime = getIndonesianLocalTime(spot.date, spot.time, spot.lon);
      const tempCelsius = (spot.brightness - 273.15).toFixed(1);

      const popupHtml = `
        <div class="hotspot-popup">
          <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid;padding-bottom:6px;margin-bottom:8px;" class="hotspot-popup-divider">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};"></span>
              <strong class="hotspot-popup-title">${spot.instrument} (${spot.satellite})</strong>
            </div>
            <span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;background:${intensityColor}20;color:${intensityColor};border:1px solid ${intensityColor}40;">
              ${intensity.toUpperCase()} &bull; ${spot.frp} MW
            </span>
          </div>

          <div class="hotspot-popup-card">
            <div class="hotspot-popup-regency">${loc.regency}</div>
            ${loc.district ? `<div class="hotspot-popup-text-subtle" style="font-size:11px;margin-top:2px;"><b>${language === 'id' ? 'Kecamatan' : 'District'}:</b> ${loc.district}</div>` : ''}
            <div class="hotspot-popup-landscape">${loc.landscape}</div>
            ${loc.isPeatland ? `<div class="hotspot-popup-peat"><b>${language === 'id' ? 'Kedalaman Gambut' : 'Peat Depth'}:</b> ${loc.peatDepthEstimate}</div>` : ''}
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px;margin-bottom:8px;">
            <div class="hotspot-popup-grid-cell">
              <span class="hotspot-popup-cell-label">${language === 'id' ? 'Koordinat Presisi' : 'Coordinates'}</span>
              <strong class="hotspot-popup-cell-val">${spot.lat.toFixed(5)}&deg;, ${spot.lon.toFixed(5)}&deg;</strong>
              <span class="hotspot-popup-cell-sub">${loc.coordinatesDMS}</span>
            </div>

            <div class="hotspot-popup-grid-cell">
              <span class="hotspot-popup-cell-label">${language === 'id' ? 'Waktu Deteksi' : 'Detection Time'}</span>
              <strong class="hotspot-popup-cell-val">${localTime.timeFormatted}</strong>
              <span class="hotspot-popup-cell-sub">${spot.date} (${spot.time.slice(0,2)}:${spot.time.slice(2)} UTC)</span>
            </div>
          </div>

          <div class="hotspot-popup-stats">
            <span><b>${language === 'id' ? 'Suhu Termal' : 'Thermal Temp'}:</b> ${tempCelsius}&deg;C (${spot.brightness} K)</span>
            <span><b>${language === 'id' ? 'Keyakinan' : 'Confidence'}:</b> ${spot.confidence}%</span>
          </div>

          <div class="hotspot-popup-footer">
            <a href="${loc.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="hotspot-popup-link">
              ${language === 'id' ? 'Buka di Google Maps' : 'Open in Google Maps'}
            </a>
            <span class="hotspot-popup-source">NASA FIRMS Active Fire</span>
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

      circle.bindPopup(popupHtml, { maxWidth: 320 });
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
    const avgConfidence = totalCount > 0 ? Math.round(activeSet.reduce((sum, h) => sum + h.confidence, 0) / totalCount) : 0;
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
    a.download = `TerraHarmonia_GIS_${selectedAOI.id}_${selectedYear}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] bg-[#0c121e] text-slate-100 flex flex-col font-sans select-none overflow-hidden animate-in fade-in duration-150">
      
      {/* Top Navigation Header */}
      <header className="relative z-[3000] h-14 bg-white dark:bg-[#0c121e] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 shadow-sm">
        
        {/* Left: Back / Return Button & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer"
            title="Kembali ke Dashboard (Esc)"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'id' ? 'Kembali' : 'Back'}</span>
          </button>

          <div className="w-2 h-2 rounded-full bg-red-600 shrink-0 hidden sm:inline-block" />

          <div className="min-w-0">
            <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight truncate">
              Terra Harmonia GIS Full Explorer
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {selectedAOI.name} &bull; {selectedYear} ({filteredHotspots.length.toLocaleString()} {language === 'id' ? 'titik aktif' : 'active points'})
            </p>
          </div>
        </div>

        {/* Center: Quick Spatial Presets */}
        <div className="hidden lg:flex flex-wrap items-center gap-1.5 py-1 scrollbar-none">
          {PRESET_AOIS.map((aoi) => {
            const isSel = selectedAOI.id === aoi.id;
            return (
              <button
                key={aoi.id}
                onClick={() => onSelectAOI(aoi)}
                className={`px-3 py-1 text-xs rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  isSel
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {aoi.id === 'indonesia' ? (language === 'id' ? 'Seluruh Indonesia' : 'All Indonesia') : aoi.name.split(' (')[0]}
              </button>
            );
          })}
        </div>

        {/* Right Controls: Basemap & Close Button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 text-xs font-medium border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setBasemap('satellite')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                basemap === 'satellite' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Sat HD
            </button>
            <button
              onClick={() => setBasemap('dark')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                basemap === 'dark' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setBasemap('nasa_gibs')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                basemap === 'nasa_gibs' ? 'bg-sky-600 text-white shadow-xs font-bold' : 'text-sky-600 dark:text-sky-400'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-300 inline-block" />
              <span>NASA GIBS</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
            title="Tutup Peta Penuh (Esc)"
          >
            <X className="w-4 h-4" />
            <span>{language === 'id' ? 'Tutup Peta' : 'Close Map'}</span>
          </button>
        </div>
      </header>

      {/* Main Map Canvas Area */}
      <div className="relative flex-1 w-full h-full bg-[#0c121e] [isolation:isolate] z-0 overflow-hidden">
        
        {/* Leaflet DOM Node */}
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0 bg-[#0c121e]" />

        {/* Floating Mini Dashboard (Top Left) */}
        <div className="absolute top-4 left-4 z-20 w-76 max-w-[calc(100vw-2rem)]">
          <div className="bg-slate-900/95 text-white backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
            
            <div className="px-3.5 py-2.5 border-b border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400" />
                <span className="font-semibold text-xs tracking-tight text-white">
                  {isRadiusToolActive && bufferCenter ? `Buffer (${bufferRadiusKm} km)` : (language === 'id' ? 'Statistik Spasial' : 'Spatial Intelligence')}
                </span>
              </div>
              <button
                onClick={() => setIsHudCollapsed(!isHudCollapsed)}
                className="text-slate-400 hover:text-white transition-colors p-0.5"
              >
                {isHudCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>

            {!isHudCollapsed && (
              <div className="p-3.5 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{language === 'id' ? 'Titik Api Aktif' : 'Active Hotspots'}</div>
                    <div className="text-lg font-bold text-white num mt-0.5">
                      {hudMetrics.totalCount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      MODIS: {hudMetrics.modisCount} &bull; VIIRS: {hudMetrics.viirsCount}
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{language === 'id' ? 'Klaster 5.5km' : '5.5km Clusters'}</div>
                    <div className="text-lg font-bold text-sky-400 num mt-0.5">
                      {hudMetrics.harmonizedClusters.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {language === 'id' ? 'Terkalibrasi NASA' : 'NASA Calibrated'}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 border-t border-slate-700/80 pt-2 text-[11px]">
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
                      <span>Peat Emission:</span>
                    </span>
                    <span className="font-semibold text-white num font-mono">
                      {hudMetrics.estimatedCO2eTons.toLocaleString()} ton CO₂e
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Bottom Control Deck */}
        <div className="absolute bottom-5 left-4 right-4 z-20 max-w-3xl mx-auto">
          <div className="bg-slate-900/95 text-white backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3.5 sm:p-4 shadow-2xl space-y-3">
            
            {/* Year Scrubber & Epoch Presets */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-slate-100 transition-all shrink-0 shadow-sm cursor-pointer"
                  title={isPlaying ? 'Jeda Animasi' : 'Putar Animasi (2000-2026)'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white num leading-none font-mono">
                    {selectedYear}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedYear(Math.max(2000, selectedYear - 1));
                        setIsPlaying(false);
                      }}
                      className="w-6 h-6 rounded-md bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedYear(Math.min(2026, selectedYear + 1));
                        setIsPlaying(false);
                      }}
                      className="w-6 h-6 rounded-md bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
                    >
                      +1
                    </button>
                  </div>
                </div>
              </div>

              {/* Climate Presets */}
              <div className="flex flex-wrap items-center gap-1.5 scrollbar-none">
                {[
                  { yr: 2000, label: '2000' },
                  { yr: 2015, label: '2015 (El Niño)' },
                  { yr: 2019, label: '2019 (IOD+)' },
                  { yr: 2023, label: '2023' },
                  { yr: 2026, label: '2026 (Live)' },
                ].map(({ yr, label }) => (
                  <button
                    key={yr}
                    onClick={() => {
                      setSelectedYear(yr);
                      setIsPlaying(false);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedYear === yr
                        ? 'bg-sky-600 text-white shadow-xs font-bold'
                        : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tool Actions & GIS Exports */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-700/80 text-xs">
              
              <div className="flex items-center gap-2 flex-wrap">
                {/* Threat Radius Tool */}
                <button
                  onClick={() => setIsRadiusToolActive(!isRadiusToolActive)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                    isRadiusToolActive
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>{isRadiusToolActive ? `Radius (${bufferRadiusKm}km)` : 'Radius Tool'}</span>
                </button>

                {/* Sensor Filter */}
                <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                  {(['ALL', 'MODIS', 'VIIRS'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSensorFilter(s)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition cursor-pointer ${
                        sensorFilter === s
                          ? 'bg-sky-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* GIS Export */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportGeoJSON}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition cursor-pointer text-xs"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>GeoJSON</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition shadow-xs cursor-pointer text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{language === 'id' ? 'Tutup' : 'Close'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
