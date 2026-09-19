import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AOIRegion, RawHotspot, HarmonizedWeekData } from '../engine/harmonizer';
import { Layers } from 'lucide-react';
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

function getMarkerRadius(frp: number): number {
  if (frp < 15) return 4;
  if (frp < 40) return 6;
  if (frp < 100) return 9;
  if (frp < 250) return 13;
  return 17;
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
      { maxZoom: 18 }
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

    // AOI bounding box
    L.rectangle([[minLat, minLon], [maxLat, maxLon]], {
      color: '#1d1d1f',
      weight: 1.5,
      dashArray: '4 4',
      fillColor: '#1d1d1f',
      fillOpacity: 0.03,
    }).addTo(layerGroup);

    let display = hotspots.filter((h) => h.aoiId === selectedAOI.id);

    if (isLiveSync) {
      display = display.filter((h) => h.confidence >= 70);
    }

    if (selectedWeekData && !isLiveSync) {
      display = display.filter((h) => new Date(h.date).getUTCFullYear() === selectedWeekData.year);
      display = display.slice(0, 500);
    } else {
      display = display.slice(-300);
    }

    display.forEach((spot) => {
      const isVIIRS = spot.instrument === 'VIIRS';
      const radius = rawMode
        ? (isVIIRS ? 4 : 7)
        : getMarkerRadius(spot.frp);

      const color = isVIIRS ? '#f59e0b' : '#dc2626';
      const strokeColor = '#ffffff';

      const intensity =
        spot.frp < 15 ? (language === 'id' ? 'Rendah' : 'Low')
        : spot.frp < 50 ? (language === 'id' ? 'Sedang' : 'Moderate')
        : spot.frp < 150 ? (language === 'id' ? 'Tinggi' : 'High')
        : (language === 'id' ? 'Sangat Tinggi' : 'Extreme');

      const popupHtml = language === 'id'
        ? `<div style="font-family:system-ui,sans-serif;font-size:12px;min-width:180px;padding:2px">
            <div style="font-weight:700;color:#1d1d1f;font-size:13px;margin-bottom:4px">Titik Api Terdeteksi</div>
            <div><b>Sensor:</b> ${spot.instrument} (${spot.satellite})</div>
            <div><b>Tanggal:</b> ${spot.date} (${spot.time.slice(0,2)}:${spot.time.slice(2)} UTC)</div>
            <div><b>Daya Termal:</b> ${spot.frp} MW (${intensity})</div>
            <div><b>Keyakinan:</b> ${spot.confidence}%</div>
            <div style="color:#86868b;margin-top:3px;font-size:10px">${spot.lat.toFixed(4)}&deg;, ${spot.lon.toFixed(4)}&deg;</div>
          </div>`
        : `<div style="font-family:system-ui,sans-serif;font-size:12px;min-width:180px;padding:2px">
            <div style="font-weight:700;color:#1d1d1f;font-size:13px;margin-bottom:4px">Fire Detections</div>
            <div><b>Sensor:</b> ${spot.instrument} (${spot.satellite})</div>
            <div><b>Date:</b> ${spot.date} (${spot.time.slice(0,2)}:${spot.time.slice(2)} UTC)</div>
            <div><b>FRP:</b> ${spot.frp} MW (${intensity})</div>
            <div><b>Confidence:</b> ${spot.confidence}%</div>
            <div style="color:#86868b;margin-top:3px;font-size:10px">${spot.lat.toFixed(4)}&deg;, ${spot.lon.toFixed(4)}&deg;</div>
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
  }, [selectedAOI, hotspots, selectedWeekData, rawMode, isLiveSync, language]);

  const markerCount = hotspots
    .filter((h) => h.aoiId === selectedAOI.id)
    .filter((h) => !isLiveSync || h.confidence >= 70)
    .length;

  return (
    <div className="bg-white border border-[#e5e5e7] rounded-2xl overflow-hidden shadow-xs flex flex-col">
      {/* Map header */}
      <div className="px-5 py-3 border-b border-[#e5e5e7] flex flex-wrap items-center justify-between gap-2 bg-white">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-[#1d1d1f] text-sm">{selectedAOI.name}</span>
          <span className="text-xs text-[#86868b]">({selectedAOI.biome})</span>
          {markerCount > 0 && (
            <span className="text-xs text-[#6e6e73] font-medium num">
              · {markerCount.toLocaleString()} {language === 'id' ? 'titik' : 'points'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Basemap switch */}
          <div className="flex items-center bg-[#e5e5ea] rounded-xl p-0.5 text-xs font-medium">
            <button
              onClick={() => setBasemap('dark')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                basemap === 'dark'
                  ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              {t.darkMap}
            </button>
            <button
              onClick={() => setBasemap('satellite')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                basemap === 'satellite'
                  ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              {t.satelliteMap}
            </button>
          </div>

          {/* Legend */}
          <div className="hidden sm:flex items-center gap-2.5 text-xs text-[#86868b]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
              MODIS
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              VIIRS
            </span>
          </div>
        </div>
      </div>

      {/* Map tile */}
      <div className="relative">
        <div ref={mapContainerRef} className="w-full h-[540px] lg:h-[600px]" />
      </div>

      {/* Map footer */}
      <div className="px-5 py-2.5 border-t border-[#e5e5e7] bg-[#fbfbfd] flex flex-wrap items-center justify-between gap-2 text-xs text-[#86868b]">
        <span>
          {language === 'id'
            ? 'Ukuran lingkaran = Daya Radiatif Api (FRP Megawatt). Merah = MODIS (1km), Kuning = VIIRS (375m).'
            : 'Circle size = Fire Radiative Power (FRP Megawatt). Red = MODIS (1km), Amber = VIIRS (375m).'}
        </span>
        {isLiveSync && (
          <span className="text-[#1d1d1f] font-medium">
            Keyakinan &ge; 70%
          </span>
        )}
      </div>
    </div>
  );
};
