import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AOIRegion, RawHotspot, HarmonizedWeekData } from '../engine/harmonizer';
import { Layers, Maximize2 } from 'lucide-react';
import { Language, translations } from '../data/translations';
import { FullMapModal } from './FullMapModal';
import { resolveHotspotLocation, toDMS, getIndonesianLocalTime } from '../utils/locationResolver';

interface MapViewerProps {
  language: Language;
  selectedAOI: AOIRegion;
  onSelectAOI?: (aoi: AOIRegion) => void;
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

function sampleEvenly<T>(arr: T[], maxCount: number): T[] {
  if (arr.length <= maxCount) return arr;
  const step = arr.length / maxCount;
  const result: T[] = [];
  for (let i = 0; i < maxCount; i++) {
    result.push(arr[Math.floor(i * step)]);
  }
  return result;
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

export const MapViewer: React.FC<MapViewerProps> = ({
  language,
  selectedAOI,
  onSelectAOI,
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
  const [isFullMapOpen, setIsFullMapOpen] = useState<boolean>(false);

  // Init map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const INDONESIA_BOUNDS: L.LatLngBoundsExpression = [
      [-11.5, 94.0],
      [6.5, 141.5],
    ];

    const map = L.map(mapContainerRef.current, {
      center: selectedAOI.center,
      zoom: selectedAOI.zoom,
      minZoom: 4,
      maxZoom: 18,
      maxBounds: INDONESIA_BOUNDS,
      maxBoundsViscosity: 1.0,
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

    // AOI bounding box for regional view
    if (selectedAOI.id !== 'indonesia') {
      L.rectangle([[minLat, minLon], [maxLat, maxLon]], {
        color: '#1d1d1f',
        weight: 1.5,
        dashArray: '4 4',
        fillColor: '#1d1d1f',
        fillOpacity: 0.03,
      }).addTo(layerGroup);
    }

    let display = hotspots.filter((h) => h.aoiId === selectedAOI.id);

    if (isLiveSync) {
      display = display.filter((h) => h.confidence >= 70);
    }

    if (selectedWeekData && !isLiveSync) {
      const yearPoints = display.filter((h) => new Date(h.date).getUTCFullYear() === selectedWeekData.year);
      if (selectedAOI.id === 'indonesia') {
        display = sampleEvenly(yearPoints, 1200);
      } else {
        display = yearPoints.slice(0, 600);
      }
    } else {
      if (selectedAOI.id === 'indonesia') {
        display = sampleEvenly(display, 1000);
      } else {
        display = display.slice(-400);
      }
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

      const intensityColor =
        spot.frp < 15 ? '#10b981'
        : spot.frp < 50 ? '#f59e0b'
        : spot.frp < 150 ? '#f97316'
        : '#dc2626';

      // Deep location resolution
      const loc = resolveHotspotLocation(spot.lat, spot.lon, selectedAOI.id, language);
      const localTime = getIndonesianLocalTime(spot.date, spot.time, spot.lon);
      const tempCelsius = (spot.brightness - 273.15).toFixed(1);

      const popupHtml = `
        <div class="hotspot-popup">
          
          <!-- Header: Status & Instrument -->
          <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid;padding-bottom:6px;margin-bottom:8px;" class="hotspot-popup-divider">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};"></span>
              <strong class="hotspot-popup-title">${spot.instrument} (${spot.satellite})</strong>
            </div>
            <span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;background:${intensityColor}20;color:${intensityColor};border:1px solid ${intensityColor}40;">
              ${intensity.toUpperCase()} &bull; ${spot.frp} MW
            </span>
          </div>

          <!-- Administrative Region & Peat Landscape -->
          <div class="hotspot-popup-card">
            <div class="hotspot-popup-regency">
              ${loc.regency}
            </div>
            ${loc.district ? `<div class="hotspot-popup-text-subtle" style="font-size:11px;margin-top:2px;"><b>${language === 'id' ? 'Kecamatan' : 'District'}:</b> ${loc.district}</div>` : ''}
            <div class="hotspot-popup-landscape">
              ${loc.landscape}
            </div>
            ${loc.isPeatland ? `<div class="hotspot-popup-peat"><b>${language === 'id' ? 'Kedalaman Gambut' : 'Peat Depth'}:</b> ${loc.peatDepthEstimate}</div>` : ''}
          </div>

          <!-- Precise Coordinates & Local Time -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px;margin-bottom:8px;">
            <div class="hotspot-popup-grid-cell">
              <span class="hotspot-popup-cell-label">${language === 'id' ? 'Koordinat Presisi' : 'Coordinates'}</span>
              <strong class="hotspot-popup-cell-val">
                ${spot.lat.toFixed(5)}&deg;, ${spot.lon.toFixed(5)}&deg;
              </strong>
              <span class="hotspot-popup-cell-sub">
                ${loc.coordinatesDMS}
              </span>
            </div>

            <div class="hotspot-popup-grid-cell">
              <span class="hotspot-popup-cell-label">${language === 'id' ? 'Waktu Deteksi' : 'Detection Time'}</span>
              <strong class="hotspot-popup-cell-val">
                ${localTime.timeFormatted}
              </strong>
              <span class="hotspot-popup-cell-sub">
                ${spot.date} (${spot.time.slice(0,2)}:${spot.time.slice(2)} UTC)
              </span>
            </div>
          </div>

          <!-- Telemetry & Sensor Stats -->
          <div class="hotspot-popup-stats">
            <span><b>${language === 'id' ? 'Suhu Termal' : 'Thermal Temp'}:</b> ${tempCelsius}&deg;C (${spot.brightness} K)</span>
            <span><b>${language === 'id' ? 'Keyakinan' : 'Confidence'}:</b> ${spot.confidence}%</span>
          </div>

          <!-- Direct Navigation Link -->
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
        color: strokeColor,
        weight: 1.2,
        opacity: 0.95,
        fillOpacity: 0.85,
      });

      circle.bindPopup(popupHtml, { maxWidth: 320 });
      circle.addTo(layerGroup);
    });
  }, [selectedAOI, hotspots, selectedWeekData, rawMode, isLiveSync, language]);

  const markerCount = hotspots
    .filter((h) => h.aoiId === selectedAOI.id)
    .filter((h) => !isLiveSync || h.confidence >= 70)
    .length;

  return (
    <div className="relative z-0 bg-white dark:bg-[#111827] border border-[#e5e5e7] dark:border-[#1f2937] rounded-2xl overflow-hidden shadow-xs flex flex-col [isolation:isolate] transition-colors">
      {/* Map header */}
      <div className="px-5 py-3 border-b border-[#e5e5e7] dark:border-[#1f2937] flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-[#111827]">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-[#1d1d1f] dark:text-white text-sm">{selectedAOI.name}</span>
          <span className="text-xs text-[#86868b] dark:text-[#9ca3af]">({selectedAOI.biome})</span>
          {markerCount > 0 && (
            <span className="text-xs text-[#6e6e73] dark:text-[#9ca3af] font-medium num">
              · {markerCount.toLocaleString()} {language === 'id' ? 'titik' : 'points'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Basemap switch */}
          <div className="flex items-center bg-[#e5e5ea] dark:bg-[#1f2937] rounded-xl p-0.5 text-xs font-medium">
            <button
              onClick={() => setBasemap('dark')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                basemap === 'dark'
                  ? 'bg-white dark:bg-[#374151] text-[#1d1d1f] dark:text-white shadow-xs font-semibold'
                  : 'text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              {t.darkMap}
            </button>
            <button
              onClick={() => setBasemap('satellite')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                basemap === 'satellite'
                  ? 'bg-white dark:bg-[#374151] text-[#1d1d1f] dark:text-white shadow-xs font-semibold'
                  : 'text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              {t.satelliteMap}
            </button>
          </div>

          {/* Legend */}
          <div className="hidden sm:flex items-center gap-2.5 text-xs text-[#86868b] dark:text-[#9ca3af]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
              MODIS
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              VIIRS
            </span>
          </div>

          {/* Full Screen Map Explorer Button */}
          <button
            onClick={() => setIsFullMapOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1d1d1f] dark:bg-white text-white dark:text-[#111827] hover:bg-black dark:hover:bg-neutral-100 rounded-xl text-xs font-medium transition-all shadow-xs shrink-0 cursor-pointer"
            title={language === 'id' ? 'Buka Peta Penuh dengan Mini Dashboard' : 'Open Full Screen Map Explorer with HUD'}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'id' ? 'Peta Penuh' : 'Full Map'}</span>
          </button>
        </div>
      </div>

      {/* Map tile */}
      <div className="relative z-0 [isolation:isolate]">
        <div ref={mapContainerRef} className="w-full h-[520px] lg:h-[580px] z-0" />
      </div>

      {/* Map footer */}
      <div className="px-5 py-2.5 border-t border-[#e5e5e7] dark:border-[#1f2937] bg-[#fbfbfd] dark:bg-[#0f172a] flex flex-wrap items-center justify-between gap-2 text-xs text-[#86868b] dark:text-[#9ca3af]">
        <span>
          {language === 'id'
            ? 'Ukuran lingkaran = Daya Radiatif Api (FRP Megawatt). Merah = MODIS (1km), Kuning = VIIRS (375m).'
            : 'Circle size = Fire Radiative Power (FRP Megawatt). Red = MODIS (1km), Amber = VIIRS (375m).'}
        </span>
        {isLiveSync && (
          <span className="text-[#1d1d1f] dark:text-emerald-400 font-medium">
            Keyakinan &ge; 70%
          </span>
        )}
      </div>

      {/* Full-Screen Immersive Map Explorer Modal */}
      <FullMapModal
        language={language}
        isOpen={isFullMapOpen}
        onClose={() => setIsFullMapOpen(false)}
        selectedAOI={selectedAOI}
        onSelectAOI={(aoi) => {
          if (onSelectAOI) onSelectAOI(aoi);
        }}
        hotspots={hotspots}
        isLiveSync={isLiveSync}
      />
    </div>
  );
};
