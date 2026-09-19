import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AOIRegion, RawHotspot, PRESET_AOIS, harmonizeHotspots } from '../engine/harmonizer';
import { Language } from '../data/translations';
import { X, Layers, Split, Calendar, Info, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DualMapComparisonProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  selectedAOI: AOIRegion;
  allHotspots: RawHotspot[];
}

export const DualMapComparison: React.FC<DualMapComparisonProps> = ({
  language,
  isOpen,
  onClose,
  selectedAOI,
  allHotspots,
}) => {
  const [yearA, setYearA] = useState<number>(2015);
  const [yearB, setYearB] = useState<number>(2021);
  const [isSyncMove, setIsSyncMove] = useState<boolean>(true);

  const mapARef = useRef<HTMLDivElement>(null);
  const mapBRef = useRef<HTMLDivElement>(null);
  const leafletMapA = useRef<L.Map | null>(null);
  const leafletMapB = useRef<L.Map | null>(null);
  const layerGroupA = useRef<L.LayerGroup | null>(null);
  const layerGroupB = useRef<L.LayerGroup | null>(null);

  // Filter hotspots for year A and year B
  const hotspotsA = useMemo(() => {
    const yStr = String(yearA);
    return allHotspots.filter((h) => h.date && h.date.startsWith(yStr));
  }, [allHotspots, yearA]);

  const hotspotsB = useMemo(() => {
    const yStr = String(yearB);
    return allHotspots.filter((h) => h.date && h.date.startsWith(yStr));
  }, [allHotspots, yearB]);

  // Statistics
  const statsA = useMemo(() => {
    const count = hotspotsA.length;
    const totalFrp = hotspotsA.reduce((sum, h) => sum + h.frp, 0);
    const avgConfidence = count > 0 ? Math.round(hotspotsA.reduce((s, h) => s + (h.confidence || 80), 0) / count) : 0;
    return { count, totalFrp: Math.round(totalFrp), avgConfidence };
  }, [hotspotsA]);

  const statsB = useMemo(() => {
    const count = hotspotsB.length;
    const totalFrp = hotspotsB.reduce((sum, h) => sum + h.frp, 0);
    const avgConfidence = count > 0 ? Math.round(hotspotsB.reduce((s, h) => s + (h.confidence || 80), 0) / count) : 0;
    return { count, totalFrp: Math.round(totalFrp), avgConfidence };
  }, [hotspotsB]);

  // Initialize Maps
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (mapARef.current && !leafletMapA.current) {
        const mapA = L.map(mapARef.current, {
          center: selectedAOI.center,
          zoom: selectedAOI.zoom,
          zoomControl: false,
          attributionControl: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 18,
        }).addTo(mapA);

        layerGroupA.current = L.layerGroup().addTo(mapA);
        leafletMapA.current = mapA;
      }

      if (mapBRef.current && !leafletMapB.current) {
        const mapB = L.map(mapBRef.current, {
          center: selectedAOI.center,
          zoom: selectedAOI.zoom,
          zoomControl: false,
          attributionControl: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 18,
        }).addTo(mapB);

        layerGroupB.current = L.layerGroup().addTo(mapB);
        leafletMapB.current = mapB;
      }

      // Synchronize pan and zoom
      if (leafletMapA.current && leafletMapB.current) {
        const mapA = leafletMapA.current;
        const mapB = leafletMapB.current;

        const onMoveA = () => {
          if (!isSyncMove) return;
          mapB.setView(mapA.getCenter(), mapA.getZoom(), { animate: false });
        };
        const onMoveB = () => {
          if (!isSyncMove) return;
          mapA.setView(mapB.getCenter(), mapB.getZoom(), { animate: false });
        };

        mapA.on('move', onMoveA);
        mapB.on('move', onMoveB);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      if (leafletMapA.current) {
        leafletMapA.current.remove();
        leafletMapA.current = null;
      }
      if (leafletMapB.current) {
        leafletMapB.current.remove();
        leafletMapB.current = null;
      }
    };
  }, [isOpen, selectedAOI, isSyncMove]);

  // Update Map Markers
  useEffect(() => {
    if (!leafletMapA.current || !layerGroupA.current) return;
    layerGroupA.current.clearLayers();

    hotspotsA.forEach((h) => {
      const radius = Math.min(12, Math.max(4, Math.sqrt(h.frp) * 0.8));
      const color = h.frp > 150 ? '#dc2626' : h.frp > 50 ? '#ea580c' : '#d97706';

      const circle = L.circleMarker([h.lat, h.lon], {
        radius,
        fillColor: color,
        color: '#ffffff',
        weight: 1,
        opacity: 0.9,
        fillOpacity: 0.75,
      });

      circle.bindTooltip(
        `<div class="font-sans text-xs">
          <strong>${h.instrument}</strong> &bull; FRP: ${Math.round(h.frp)} MW<br/>
          Tgl: ${h.date || h.time}
        </div>`
      );
      circle.addTo(layerGroupA.current!);
    });
  }, [hotspotsA]);

  useEffect(() => {
    if (!leafletMapB.current || !layerGroupB.current) return;
    layerGroupB.current.clearLayers();

    hotspotsB.forEach((h) => {
      const radius = Math.min(12, Math.max(4, Math.sqrt(h.frp) * 0.8));
      const color = h.frp > 150 ? '#dc2626' : h.frp > 50 ? '#ea580c' : '#d97706';

      const circle = L.circleMarker([h.lat, h.lon], {
        radius,
        fillColor: color,
        color: '#ffffff',
        weight: 1,
        opacity: 0.9,
        fillOpacity: 0.75,
      });

      circle.bindTooltip(
        `<div class="font-sans text-xs">
          <strong>${h.instrument}</strong> &bull; FRP: ${Math.round(h.frp)} MW<br/>
          Tgl: ${h.date || h.time}
        </div>`
      );
      circle.addTo(layerGroupB.current!);
    });
  }, [hotspotsB]);

  if (!isOpen) return null;

  const years = Array.from({ length: 27 }, (_, i) => 2000 + i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#f5f5f7] w-full max-w-7xl h-[92vh] rounded-2xl border border-[#e5e5e7] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-white border-b border-[#e5e5e7] px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f5f5f7] rounded-xl border border-[#e5e5e7]">
              <Split className="w-5 h-5 text-[#1d1d1f]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#1d1d1f] tracking-tight">
                {language === 'id' ? 'Komparasi Spasial Dua Tahun Berdampingan' : 'Side-by-Side Dual-Year Spatial Comparison'}
              </h2>
              <p className="text-xs text-[#86868b]">
                {selectedAOI.name} &bull; {language === 'id' ? 'Sinkronisasi peta waktu nyata' : 'Real-time synchronized dual viewport'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSyncMove(!isSyncMove)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
                isSyncMove
                  ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                  : 'bg-white text-[#6e6e73] border-[#e5e5e7] hover:border-[#1d1d1f]'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isSyncMove
                  ? language === 'id' ? 'Sinkron Aktif' : 'Sync Locked'
                  : language === 'id' ? 'Sinkron Lepas' : 'Sync Unlocked'}
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dual Viewport Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2 p-2 sm:p-3 overflow-hidden">
          
          {/* Pane A */}
          <div className="bg-white rounded-xl border border-[#e5e5e7] flex flex-col overflow-hidden relative shadow-xs">
            {/* Control Strip A */}
            <div className="bg-white/95 backdrop-blur-xs border-b border-[#e5e5e7] px-4 py-2.5 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#86868b] uppercase">Tahun A:</span>
                <select
                  value={yearA}
                  onChange={(e) => setYearA(Number(e.target.value))}
                  className="bg-[#f5f5f7] border border-[#e5e5e7] rounded-lg px-2.5 py-1 text-xs font-bold text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] cursor-pointer"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y} {y === 2015 ? '(El Niño Super)' : y === 2019 ? '(El Niño Moderat)' : y === 2021 ? '(La Niña Basah)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mini Stats */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-baseline gap-1">
                  <span className="text-[#86868b]">Hotspot:</span>
                  <strong className="num text-[#1d1d1f]">{statsA.count.toLocaleString()}</strong>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[#86868b]">Energi:</span>
                  <strong className="num text-orange-600">{statsA.totalFrp.toLocaleString()} MW</strong>
                </div>
              </div>
            </div>

            {/* Map Container A */}
            <div ref={mapARef} className="flex-1 w-full h-full min-h-[220px]" />
          </div>

          {/* Pane B */}
          <div className="bg-white rounded-xl border border-[#e5e5e7] flex flex-col overflow-hidden relative shadow-xs">
            {/* Control Strip B */}
            <div className="bg-white/95 backdrop-blur-xs border-b border-[#e5e5e7] px-4 py-2.5 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#86868b] uppercase">Tahun B:</span>
                <select
                  value={yearB}
                  onChange={(e) => setYearB(Number(e.target.value))}
                  className="bg-[#f5f5f7] border border-[#e5e5e7] rounded-lg px-2.5 py-1 text-xs font-bold text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] cursor-pointer"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y} {y === 2015 ? '(El Niño Super)' : y === 2019 ? '(El Niño Moderat)' : y === 2021 ? '(La Niña Basah)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mini Stats */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-baseline gap-1">
                  <span className="text-[#86868b]">Hotspot:</span>
                  <strong className="num text-[#1d1d1f]">{statsB.count.toLocaleString()}</strong>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[#86868b]">Energi:</span>
                  <strong className="num text-orange-600">{statsB.totalFrp.toLocaleString()} MW</strong>
                </div>
              </div>
            </div>

            {/* Map Container B */}
            <div ref={mapBRef} className="flex-1 w-full h-full min-h-[220px]" />
          </div>

        </div>

        {/* Bottom Comparative Insight Bar */}
        <div className="bg-white border-t border-[#e5e5e7] px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-[#6e6e73]">
            <strong>{language === 'id' ? 'Analisis Delta' : 'Delta Analysis'}: </strong>
            {statsA.count > statsB.count ? (
              <span>
                Tahun <strong>{yearA}</strong> memiliki <strong>{(statsA.count - statsB.count).toLocaleString()}</strong> lebih banyak titik panas dibanding {yearB} (+{Math.round(((statsA.count - statsB.count) / Math.max(1, statsB.count)) * 100)}%).
              </span>
            ) : (
              <span>
                Tahun <strong>{yearB}</strong> memiliki <strong>{(statsB.count - statsA.count).toLocaleString()}</strong> lebih banyak titik panas dibanding {yearA} (+{Math.round(((statsB.count - statsA.count) / Math.max(1, statsA.count)) * 100)}%).
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-[#86868b]">
            <span>Sensors: MODIS + VIIRS Harmonized</span>
            <span>Grid: 5.5 km</span>
          </div>
        </div>

      </div>
    </div>
  );
};
