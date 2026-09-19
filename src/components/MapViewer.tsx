import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AOIRegion, RawHotspot, HarmonizedWeekData } from '../engine/harmonizer';
import { MapPin, Flame } from 'lucide-react';
import { Language, translations } from '../data/translations';

interface MapViewerProps {
  language: Language;
  selectedAOI: AOIRegion;
  hotspots: RawHotspot[];
  selectedWeekData: HarmonizedWeekData | null;
  rawMode: boolean;
}

export const MapViewer: React.FC<MapViewerProps> = ({
  language,
  selectedAOI,
  hotspots,
  selectedWeekData,
  rawMode
}) => {
  const t = translations[language];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: selectedAOI.center,
        zoom: selectedAOI.zoom,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
        attribution: 'Basemap: Esri World Dark Gray | NASA FIRMS'
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setView(selectedAOI.center, selectedAOI.zoom, { animate: true });
  }, [selectedAOI]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    const [minLat, minLon, maxLat, maxLon] = selectedAOI.bbox;
    const bounds: L.LatLngBoundsLiteral = [
      [minLat, minLon],
      [maxLat, maxLon]
    ];

    L.rectangle(bounds, {
      color: '#06B6D4',
      weight: 1.5,
      dashArray: '4, 4',
      fillColor: '#06B6D4',
      fillOpacity: 0.05
    }).addTo(layerGroup);

    let displayHotspots = hotspots.filter((h) => h.aoiId === selectedAOI.id);

    if (selectedWeekData) {
      displayHotspots = displayHotspots.filter((h) => {
        const d = new Date(h.date);
        return d.getUTCFullYear() === selectedWeekData.year;
      });
      displayHotspots = displayHotspots.slice(0, 350);
    } else {
      displayHotspots = displayHotspots.slice(-150);
    }

    displayHotspots.forEach((spot) => {
      const isVIIRS = spot.instrument === 'VIIRS';
      
      const radius = rawMode 
        ? (isVIIRS ? 4 : 8)
        : Math.min(12, Math.max(5, Math.log(spot.frp + 1) * 2));

      const fillColor = isVIIRS ? '#F97316' : '#EF4444';

      const circle = L.circleMarker([spot.lat, spot.lon], {
        radius,
        fillColor,
        color: isVIIRS ? '#FFEDD5' : '#FECACA',
        weight: 1,
        opacity: 0.9,
        fillOpacity: 0.75
      });

      circle.bindPopup(`
        <div style="font-family: system-ui, sans-serif; font-size: 12px; color: #0f172a; padding: 4px;">
          <strong style="color: #c2410c; font-size: 13px;">${spot.instrument} ${t.activeHotspots}</strong><br/>
          <strong>${t.satellite}:</strong> ${spot.satellite}<br/>
          <strong>${t.acquisition}:</strong> ${spot.date} (${spot.time} UTC)<br/>
          <strong>${t.frpPower}:</strong> ${spot.frp} MW<br/>
          <strong>${t.confidence}:</strong> ${spot.confidence}%<br/>
          <strong>${t.coordinates}:</strong> ${spot.lat.toFixed(3)} deg, ${spot.lon.toFixed(3)} deg
        </div>
      `);

      circle.addTo(layerGroup);
    });
  }, [selectedAOI, hotspots, selectedWeekData, rawMode, language]);

  return (
    <div className="relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-[480px]">
      <div className="bg-slate-950 border-b border-slate-800 px-3.5 py-2.5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-xs">
          <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-semibold text-white">{selectedAOI.name}</span>
          <span className="text-slate-400">({selectedAOI.biome})</span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <span className="text-slate-300">{t.modisLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
            <span className="text-slate-300">{t.viirsLabel}</span>
          </div>
        </div>
      </div>

      <div ref={mapContainerRef} className="w-full flex-1 z-0" />

      <div className="absolute bottom-3 left-3 z-10 bg-slate-950/95 border border-slate-800 rounded-lg p-3 text-xs max-w-xs pointer-events-none">
        <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
          <Flame className="w-4 h-4" />
          <span>{t.spatialActiveTitle}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {t.spatialActiveDesc}
        </p>
      </div>
    </div>
  );
};
