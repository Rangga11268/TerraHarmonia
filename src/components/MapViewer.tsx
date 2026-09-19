import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AOIRegion, RawHotspot, HarmonizedWeekData } from '../engine/harmonizer';
import { MapPin, Layers, Flame, AlertCircle } from 'lucide-react';
import { Language, translations } from '../data/translations';

interface MapViewerProps {
  language: Language;
  selectedAOI: AOIRegion;
  hotspots: RawHotspot[];
  selectedWeekData: HarmonizedWeekData | null;
  rawMode: boolean;
  isLiveSync?: boolean;
  isLoading?: boolean;
}

// ponytail: marker FRP bins — good enough for visual scale, no fancy normalization needed
function getMarkerRadius(frp: number): number {
  if (frp < 15) return 5;
  if (frp < 40) return 7;
  if (frp < 100) return 10;
  if (frp < 250) return 14;
  return 18;
}

export const MapViewer: React.FC<MapViewerProps> = ({
  language,
  selectedAOI,
  hotspots,
  selectedWeekData,
  rawMode,
  isLiveSync = false,
  isLoading = false,
}) => {
  const t = translations[language];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [basemap, setBasemap] = useState<'dark' | 'satellite'>('satellite');

  // Init map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: selectedAOI.center,
      zoom: selectedAOI.zoom,
      zoomControl: false,
      attributionControl: false,
    });

    tileLayerRef.current = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 18, attribution: 'Esri World Imagery' }
    ).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);
    layerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
  }, []);

  // Basemap switcher
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);

    const url = basemap === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';

    tileLayerRef.current = L.tileLayer(url, { maxZoom: 18 }).addTo(map);
  }, [basemap]);

  // Fly to new AOI
  useEffect(() => {
    mapInstanceRef.current?.setView(selectedAOI.center, selectedAOI.zoom, { animate: true });
  }, [selectedAOI]);

  // Render hotspot markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    const [minLat, minLon, maxLat, maxLon] = selectedAOI.bbox;

    // AOI bounding box outline
    L.rectangle([[minLat, minLon], [maxLat, maxLon]], {
      color: '#f97316',
      weight: 1.5,
      dashArray: '6 4',
      fillColor: '#f97316',
      fillOpacity: 0.04,
    }).addTo(layerGroup);

    // Filter and slice hotspots
    let display = hotspots.filter((h) => h.aoiId === selectedAOI.id);

    // Confidence filter — only show reliable detections (skip low-confidence noise)
    if (isLiveSync) {
      display = display.filter((h) => h.confidence >= 70);
    }

    if (selectedWeekData && !isLiveSync) {
      display = display.filter((h) => new Date(h.date).getUTCFullYear() === selectedWeekData.year);
      display = display.slice(0, 500);
    } else {
      display = display.slice(-300);
    }

    display.forEach((spot, idx) => {
      const isVIIRS = spot.instrument === 'VIIRS';
      const radius = rawMode
        ? (isVIIRS ? 4 : 7)
        : getMarkerRadius(spot.frp);

      // Bright, high-contrast colors visible on both satellite and light basemap
      const color = isVIIRS ? '#f97316' : '#ef4444';   // orange vs red
      const strokeColor = isVIIRS ? '#fff7ed' : '#fef2f2';

      const intensity =
        spot.frp < 15 ? (language === 'id' ? 'Rendah' : 'Low')
        : spot.frp < 50 ? (language === 'id' ? 'Sedang' : 'Moderate')
        : spot.frp < 150 ? (language === 'id' ? 'Tinggi' : 'High')
        : (language === 'id' ? 'Sangat Tinggi' : 'Extreme');

      const popupHtml = language === 'id'
        ? `<div style="font-family:system-ui,sans-serif;font-size:12px;min-width:180px;padding:2px">
            <div style="font-weight:700;color:#b45309;font-size:13px;margin-bottom:4px">Titik Api Terdeteksi</div>
            <div><b>Sensor:</b> ${spot.instrument} (${spot.satellite})</div>
            <div><b>Tanggal:</b> ${spot.date} pukul ${spot.time.slice(0,2)}:${spot.time.slice(2)} UTC</div>
            <div><b>Kekuatan Panas:</b> ${spot.frp} MW &mdash; <span style="color:${spot.frp>100?'#dc2626':'#d97706'}">${intensity}</span></div>
            <div><b>Keyakinan Deteksi:</b> ${spot.confidence}%</div>
            <div style="color:#6b7280;margin-top:3px;font-size:10px">${spot.lat.toFixed(4)}&deg;, ${spot.lon.toFixed(4)}&deg;</div>
          </div>`
        : `<div style="font-family:system-ui,sans-serif;font-size:12px;min-width:180px;padding:2px">
            <div style="font-weight:700;color:#b45309;font-size:13px;margin-bottom:4px">Active Fire Detected</div>
            <div><b>Sensor:</b> ${spot.instrument} (${spot.satellite})</div>
            <div><b>Date:</b> ${spot.date} at ${spot.time.slice(0,2)}:${spot.time.slice(2)} UTC</div>
            <div><b>Heat Power:</b> ${spot.frp} MW &mdash; <span style="color:${spot.frp>100?'#dc2626':'#d97706'}">${intensity}</span></div>
            <div><b>Detection Confidence:</b> ${spot.confidence}%</div>
            <div style="color:#6b7280;margin-top:3px;font-size:10px">${spot.lat.toFixed(4)}&deg;, ${spot.lon.toFixed(4)}&deg;</div>
          </div>`;

      const circle = L.circleMarker([spot.lat, spot.lon], {
        radius,
        fillColor: color,
        color: strokeColor,
        weight: 1.2,
        opacity: 0.95,
        fillOpacity: 0.85,
      });

      circle.bindPopup(popupHtml, { maxWidth: 240 });
      circle.addTo(layerGroup);
    });

    // Empty state marker if zero results
    if (display.length === 0 && !isLoading) {
      const center = selectedAOI.center;
      L.marker(center, {
        icon: L.divIcon({
          className: '',
          html: `<div style="background:white;border:1.5px solid #e2e8f0;border-radius:8px;padding:8px 12px;font-size:12px;font-family:system-ui,sans-serif;color:#475569;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.12)">
            ${language === 'id' ? 'Tidak ada titik api aktif di area ini' : 'No active fire detections in this area'}
          </div>`,
          iconAnchor: [100, 20],
        })
      }).addTo(layerGroup);
    }
  }, [selectedAOI, hotspots, selectedWeekData, rawMode, isLiveSync, isLoading, language]);

  const markerCount = hotspots
    .filter((h) => h.aoiId === selectedAOI.id)
    .filter((h) => !isLiveSync || h.confidence >= 70)
    .length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Map header */}
      <div className="px-4 py-2.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-white">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
          <span className="font-semibold text-slate-900 text-sm">{selectedAOI.name}</span>
          <span className="text-xs text-slate-400">({selectedAOI.biome})</span>
          {markerCount > 0 && (
            <span className="text-[11px] bg-orange-50 text-orange-600 border border-orange-200 rounded-full px-2 py-0.5 font-mono">
              {markerCount.toLocaleString()} {language === 'id' ? 'titik' : 'pts'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Basemap toggle */}
          <div className="flex items-center bg-slate-50 rounded-lg p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setBasemap('dark')}
              className={`px-2 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
                basemap === 'dark'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title={t.darkMap}
            >
              <Layers className="w-3 h-3" />
              {t.darkMap}
            </button>
            <button
              onClick={() => setBasemap('satellite')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                basemap === 'satellite'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title={t.satelliteMap}
            >
              {t.satelliteMap}
            </button>
          </div>

          {/* Legend */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block border border-red-200" />
              MODIS
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block border border-orange-200" />
              VIIRS
            </span>
          </div>
        </div>
      </div>

      {/* Map tile */}
      <div className="relative">
        <div ref={mapContainerRef} className="w-full h-[560px] lg:h-[620px]" />

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20">
            <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-md flex items-center gap-3 text-sm text-slate-700">
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              {language === 'id' ? 'Memuat titik api dari NASA...' : 'Loading fire data from NASA...'}
            </div>
          </div>
        )}
      </div>

      {/* Map footer legend */}
      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-orange-500" />
          <span>
            {language === 'id'
              ? 'Ukuran lingkaran = kekuatan panas (FRP dalam Megawatt). Merah = MODIS, Oranye = VIIRS.'
              : 'Circle size = heat power (FRP in Megawatts). Red = MODIS, Orange = VIIRS.'}
          </span>
        </div>
        {isLiveSync && (
          <div className="flex items-center gap-1 text-cyan-600">
            <AlertCircle className="w-3 h-3" />
            <span>{language === 'id' ? 'Hanya titik keyakinan >=70% ditampilkan' : 'Only confidence >=70% shown'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
