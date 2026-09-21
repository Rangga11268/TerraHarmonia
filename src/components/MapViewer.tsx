import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AOIRegion, RawHotspot, HarmonizedWeekData } from '../engine/harmonizer';
import { Layers, Maximize2, Flame, Satellite, Activity, Crosshair, Filter } from 'lucide-react';
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
  if (frp < 15) return 4.5;
  if (frp < 40) return 6.5;
  if (frp < 100) return 9.5;
  if (frp < 250) return 13.5;
  return 18;
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
  const haloLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Filter States (FIRMS-grade controls)
  const [basemap, setBasemap] = useState<'dark' | 'satellite' | 'nasa_gibs'>('satellite');
  const [sensorFilter, setSensorFilter] = useState<'ALL' | 'MODIS' | 'VIIRS'>('ALL');
  const [frpThreshold, setFrpThreshold] = useState<number>(0);
  const [isFullMapOpen, setIsFullMapOpen] = useState<boolean>(false);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);

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
    haloLayerGroupRef.current = L.layerGroup().addTo(map);
    layerGroupRef.current = L.layerGroup().addTo(map);

    map.on('mousemove', (e) => {
      setCursorCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    map.on('mouseout', () => {
      setCursorCoords(null);
    });

    mapInstanceRef.current = map;
  }, []);

  // Basemap switcher with NASA GIBS True-Color Support
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);

    if (basemap === 'nasa_gibs') {
      tileLayerRef.current = L.tileLayer(
        'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2024-08-15/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg',
        { maxZoom: 9, minZoom: 4 }
      ).addTo(map);
    } else if (basemap === 'satellite') {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18 }
      ).addTo(map);
    } else {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18 }
      ).addTo(map);
    }
  }, [basemap]);

  // Fly to new AOI
  useEffect(() => {
    mapInstanceRef.current?.setView(selectedAOI.center, selectedAOI.zoom, { animate: true });
  }, [selectedAOI]);

  // Filtered hotspots based on user selections
  const displayHotspots = useMemo(() => {
    let display = hotspots.filter((h) => h.aoiId === selectedAOI.id);

    if (isLiveSync) {
      display = display.filter((h) => h.confidence >= 70);
    }

    if (selectedWeekData && !isLiveSync) {
      const yearPoints = display.filter((h) => new Date(h.date).getUTCFullYear() === selectedWeekData.year);
      if (selectedAOI.id === 'indonesia') {
        display = sampleEvenly(yearPoints, 1400);
      } else {
        display = yearPoints.slice(0, 800);
      }
    } else {
      if (selectedAOI.id === 'indonesia') {
        display = sampleEvenly(display, 1200);
      } else {
        display = display.slice(-600);
      }
    }

    // Filter by sensor if selected
    if (sensorFilter !== 'ALL') {
      display = display.filter((h) => h.instrument === sensorFilter);
    }

    // Filter by FRP threshold
    if (frpThreshold > 0) {
      display = display.filter((h) => h.frp >= frpThreshold);
    }

    return display;
  }, [hotspots, selectedAOI, isLiveSync, selectedWeekData, sensorFilter, frpThreshold]);

  // Render hotspot markers with FIRMS-calibrated styling
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    const haloGroup = haloLayerGroupRef.current;
    if (!map || !layerGroup || !haloGroup) return;

    layerGroup.clearLayers();
    haloGroup.clearLayers();

    const [minLat, minLon, maxLat, maxLon] = selectedAOI.bbox;

    // AOI boundary frame
    if (selectedAOI.id !== 'indonesia') {
      L.rectangle([[minLat, minLon], [maxLat, maxLon]], {
        color: '#0284c7',
        weight: 1.5,
        dashArray: '5 5',
        fillColor: '#0284c7',
        fillOpacity: 0.04,
      }).addTo(layerGroup);
    }

    displayHotspots.forEach((spot) => {
      const isVIIRS = spot.instrument === 'VIIRS';
      const radius = rawMode
        ? (isVIIRS ? 4.5 : 7.5)
        : getMarkerRadius(spot.frp);

      // Color mapping: Red for MODIS (1km), Amber/Gold for VIIRS (375m)
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

      // Deep location resolution & Local Time
      const loc = resolveHotspotLocation(spot.lat, spot.lon, selectedAOI.id, language);
      const localTime = getIndonesianLocalTime(spot.date, spot.time, spot.lon);
      const tempCelsius = (spot.brightness - 273.15).toFixed(1);
      // Stefan-Boltzmann estimated biomass rate (0.368 kg/MJ)
      const biomassRateKgPerSec = (spot.frp * 0.368).toFixed(2);

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
              <span class="hotspot-popup-cell-label">${language === 'id' ? 'Waktu Lintas Orbit' : 'Orbit Overpass'}</span>
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
            <span><b>${language === 'id' ? 'Laju Biomassa' : 'Biomass Rate'}:</b> ~${biomassRateKgPerSec} kg/s</span>
            <span><b>${language === 'id' ? 'Tingkat Keyakinan' : 'Confidence'}:</b> ${spot.confidence}%</span>
          </div>

          <!-- Direct Navigation Link -->
          <div class="hotspot-popup-footer">
            <a href="${loc.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="hotspot-popup-link">
              ${language === 'id' ? 'Buka di Google Maps' : 'Open in Google Maps'}
            </a>
            <span class="hotspot-popup-source">NASA FIRMS Telemetry</span>
          </div>

        </div>
      `;

      // Thermal radiant halo for severe hotspots (>100 MW)
      if (spot.frp >= 100) {
        L.circleMarker([spot.lat, spot.lon], {
          radius: radius * 2.2,
          fillColor: color,
          color: color,
          weight: 1,
          opacity: 0.35,
          fillOpacity: 0.2,
        }).addTo(haloGroup);
      }

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
  }, [selectedAOI, displayHotspots, rawMode, language]);

  // Telemetry counts
  const modisCount = displayHotspots.filter((h) => h.instrument === 'MODIS').length;
  const viirsCount = displayHotspots.filter((h) => h.instrument === 'VIIRS').length;
  const maxFrp = displayHotspots.length > 0
    ? Math.max(...displayHotspots.map((h) => h.frp))
    : 0;

  return (
    <div className="relative z-0 bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col [isolation:isolate] transition-colors">
      
      {/* Map Header Controls (FIRMS-grade toolbar) */}
      <div className="px-4 sm:px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 bg-white dark:bg-[#0c121e]">
        
        {/* Left: AOI & Point count */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedAOI.name}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">({selectedAOI.biome})</span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
            {displayHotspots.length.toLocaleString()} {language === 'id' ? 'titik aktif' : 'active points'}
          </span>
        </div>

        {/* Right: Sensor Filter, FRP Threshold, Basemap, & Full Map */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Sensor Selector (ALL / MODIS / VIIRS) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-0.5 text-xs font-medium border border-slate-200 dark:border-slate-800">
            {(['ALL', 'MODIS', 'VIIRS'] as const).map((sensor) => (
              <button
                key={sensor}
                onClick={() => setSensorFilter(sensor)}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-xs ${
                  sensorFilter === sensor
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sensor === 'ALL' ? 'All Sensors' : sensor}
              </button>
            ))}
          </div>

          {/* FRP Filter Dropdown */}
          <select
            value={frpThreshold}
            onChange={(e) => setFrpThreshold(Number(e.target.value))}
            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium cursor-pointer"
          >
            <option value={0}>All FRP</option>
            <option value={25}>&ge; 25 MW</option>
            <option value={50}>&ge; 50 MW</option>
            <option value={100}>&ge; 100 MW (Extreme)</option>
          </select>

          {/* Basemap switch */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-0.5 text-xs font-medium border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setBasemap('dark')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                basemap === 'dark'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.darkMap}
            </button>
            <button
              onClick={() => setBasemap('satellite')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                basemap === 'satellite'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sat HD
            </button>
            <button
              onClick={() => setBasemap('nasa_gibs')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                basemap === 'nasa_gibs'
                  ? 'bg-sky-600 text-white shadow-xs font-bold'
                  : 'text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-200'
              }`}
              title="NASA Global Imagery Browse Services (MODIS Corrected Reflectance True Color)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-300 inline-block" />
              <span>NASA GIBS</span>
            </button>
          </div>

          {/* Full Screen Map Explorer Button */}
          <button
            onClick={() => setIsFullMapOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl text-xs font-medium transition-all shadow-xs shrink-0 cursor-pointer"
            title={language === 'id' ? 'Buka Peta Penuh dengan Mini Dashboard' : 'Open Full Screen Map Explorer with HUD'}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'id' ? 'Peta Penuh' : 'Full Map'}</span>
          </button>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="relative z-0 [isolation:isolate]">
        <div ref={mapContainerRef} className="w-full h-[520px] lg:h-[580px] z-0" />

        {/* NASA FIRMS Floating Telemetry HUD (Bottom Left inside Map) */}
        <div className="absolute bottom-3 left-3 z-[1000] pointer-events-auto bg-slate-900/90 dark:bg-[#0c121e]/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 text-[11px] text-white space-y-1.5 shadow-xl max-w-xs">
          <div className="flex items-center justify-between gap-3 pb-1 border-b border-slate-700">
            <div className="flex items-center gap-1.5 text-sky-400 font-bold uppercase tracking-wider text-[10px]">
              <Satellite className="w-3 h-3" />
              <span>NASA FIRMS Telemetry</span>
            </div>
            {cursorCoords && (
              <span className="font-mono text-[10px] text-slate-300">
                {cursorCoords.lat.toFixed(3)}°, {cursorCoords.lng.toFixed(3)}°
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
            <div>
              <span className="text-slate-400 block">MODIS</span>
              <span className="font-bold text-red-400">{modisCount} pts</span>
            </div>
            <div>
              <span className="text-slate-400 block">VIIRS</span>
              <span className="font-bold text-amber-400">{viirsCount} pts</span>
            </div>
            <div>
              <span className="text-slate-400 block">Peak FRP</span>
              <span className="font-bold text-emerald-400">{maxFrp} MW</span>
            </div>
          </div>
        </div>

        {/* Floating FRP Legend (Bottom Right inside Map) */}
        <div className="absolute bottom-3 right-3 z-[1000] pointer-events-auto bg-slate-900/90 dark:bg-[#0c121e]/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-2 text-[10px] text-white shadow-xl flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
            <span>MODIS (1km)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>VIIRS (375m)</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-slate-400 border-l border-slate-700 pl-2">
            <span>Radiative Halo = &ge;100 MW</span>
          </div>
        </div>
      </div>

      {/* Map footer */}
      <div className="px-5 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span>
          {language === 'id'
            ? 'Ukuran lingkaran sebanding dengan Fire Radiative Power (FRP MW). Lensa halo berpijar menandai intensitas kritis > 100 MW.'
            : 'Circle size corresponds to Fire Radiative Power (FRP MW). Luminous radiant halos mark critical combustion > 100 MW.'}
        </span>
        {isLiveSync && (
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            NASA FIRMS NRT 24-Hour Sync Active
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
