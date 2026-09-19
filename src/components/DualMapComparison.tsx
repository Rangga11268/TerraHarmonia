import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AOIRegion, RawHotspot } from '../engine/harmonizer';
import { Language, translations } from '../data/translations';
import { Split, RefreshCw } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DualMapComparisonProps {
  language: Language;
  selectedAOI: AOIRegion;
  allHotspots: RawHotspot[];
}

export const DualMapComparison: React.FC<DualMapComparisonProps> = ({
  language,
  selectedAOI,
  allHotspots,
}) => {
  const t = translations[language];
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
    };
  }, [selectedAOI, isSyncMove]);

  // Re-center when AOI changes
  useEffect(() => {
    if (leafletMapA.current) {
      leafletMapA.current.setView(selectedAOI.center, selectedAOI.zoom);
    }
    if (leafletMapB.current) {
      leafletMapB.current.setView(selectedAOI.center, selectedAOI.zoom);
    }
  }, [selectedAOI]);

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
          ${language === 'id' ? 'Tgl' : 'Date'}: ${h.date || h.time}
        </div>`
      );
      circle.addTo(layerGroupA.current!);
    });
  }, [hotspotsA, language]);

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
          ${language === 'id' ? 'Tgl' : 'Date'}: ${h.date || h.time}
        </div>`
      );
      circle.addTo(layerGroupB.current!);
    });
  }, [hotspotsB, language]);

  const years = Array.from({ length: 27 }, (_, i) => 2000 + i);

  return (
    <div className="bg-white border border-[#e5e5e7] rounded-2xl shadow-xs overflow-hidden space-y-0 transition-all">
      
      {/* Section Header */}
      <div className="px-5 py-4 border-b border-[#e5e5e7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fbfbfd]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl border border-[#e5e5e7] text-[#1d1d1f]">
            <Split className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">
              {language === 'id' ? 'Komparasi Spasial Lintas Waktu' : 'Cross-Temporal Spatial Comparison'}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#1d1d1f] tracking-tight">
              {language === 'id' ? 'Komparasi Spasial Dua Tahun Berdampingan' : 'Side-by-Side Dual-Year Spatial Comparison'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSyncMove(!isSyncMove)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
              isSyncMove
                ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                : 'bg-white text-[#6e6e73] border-[#e5e5e7] hover:border-[#1d1d1f]'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>
              {isSyncMove
                ? language === 'id' ? 'Sinkron Gerak Aktif' : 'Sync Move Locked'
                : language === 'id' ? 'Sinkron Lepas' : 'Independent Move'}
            </span>
          </button>
        </div>
      </div>

      {/* Dual Viewport Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-b border-[#e5e5e7]">
        
        {/* Pane A */}
        <div className="border-b lg:border-b-0 lg:border-r border-[#e5e5e7] flex flex-col min-h-[380px] sm:min-h-[440px]">
          {/* Controls Bar A */}
          <div className="bg-white px-4 py-3 border-b border-[#e5e5e7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#86868b] uppercase">
                {language === 'id' ? 'Tahun A:' : 'Year A:'}
              </span>
              <select
                value={yearA}
                onChange={(e) => setYearA(Number(e.target.value))}
                className="bg-[#f5f5f7] border border-[#e5e5e7] rounded-lg px-3 py-1.5 text-xs font-bold text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] cursor-pointer min-h-[36px]"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y} {y === 2015 ? (language === 'id' ? '(El Niño Super)' : '(Super El Niño)') : y === 2019 ? (language === 'id' ? '(El Niño Moderat)' : '(Moderate El Niño)') : y === 2021 ? (language === 'id' ? '(La Niña Basah)' : '(Wet La Niña)') : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div>
                <span className="text-[#86868b]">{language === 'id' ? 'Titik: ' : 'Points: '}</span>
                <strong className="num text-[#1d1d1f]">{statsA.count.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-[#86868b]">FRP: </span>
                <strong className="num text-orange-600">{statsA.totalFrp.toLocaleString()} MW</strong>
              </div>
            </div>
          </div>

          {/* Map Container A */}
          <div ref={mapARef} className="flex-1 w-full h-full min-h-[320px]" />
        </div>

        {/* Pane B */}
        <div className="flex flex-col min-h-[380px] sm:min-h-[440px]">
          {/* Controls Bar B */}
          <div className="bg-white px-4 py-3 border-b border-[#e5e5e7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#86868b] uppercase">
                {language === 'id' ? 'Tahun B:' : 'Year B:'}
              </span>
              <select
                value={yearB}
                onChange={(e) => setYearB(Number(e.target.value))}
                className="bg-[#f5f5f7] border border-[#e5e5e7] rounded-lg px-3 py-1.5 text-xs font-bold text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] cursor-pointer min-h-[36px]"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y} {y === 2015 ? (language === 'id' ? '(El Niño Super)' : '(Super El Niño)') : y === 2019 ? (language === 'id' ? '(El Niño Moderat)' : '(Moderate El Niño)') : y === 2021 ? (language === 'id' ? '(La Niña Basah)' : '(Wet La Niña)') : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div>
                <span className="text-[#86868b]">{language === 'id' ? 'Titik: ' : 'Points: '}</span>
                <strong className="num text-[#1d1d1f]">{statsB.count.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-[#86868b]">FRP: </span>
                <strong className="num text-orange-600">{statsB.totalFrp.toLocaleString()} MW</strong>
              </div>
            </div>
          </div>

          {/* Map Container B */}
          <div ref={mapBRef} className="flex-1 w-full h-full min-h-[320px]" />
        </div>

      </div>

      {/* Comparative Analytical Summary Footer */}
      <div className="px-5 py-3.5 bg-[#fbfbfd] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="text-[#3a3a3c] leading-relaxed">
          <strong className="font-semibold text-[#1d1d1f]">
            {language === 'id' ? 'Kesimpulan Analisis Spasial: ' : 'Spatial Synthesis: '}
          </strong>
          {statsA.count > statsB.count ? (
            <span>
              {language === 'id'
                ? `Tahun ${yearA} mengalami aktivitas pembakaran ${(statsA.count - statsB.count).toLocaleString()} titik lebih banyak dibandingkan ${yearB} (+${Math.round(((statsA.count - statsB.count) / Math.max(1, statsB.count)) * 100)}%).`
                : `Year ${yearA} recorded ${(statsA.count - statsB.count).toLocaleString()} more fire detections than ${yearB} (+${Math.round(((statsA.count - statsB.count) / Math.max(1, statsB.count)) * 100)}%).`}
            </span>
          ) : (
            <span>
              {language === 'id'
                ? `Tahun ${yearB} mengalami aktivitas pembakaran ${(statsB.count - statsA.count).toLocaleString()} titik lebih banyak dibandingkan ${yearA} (+${Math.round(((statsB.count - statsA.count) / Math.max(1, statsA.count)) * 100)}%).`
                : `Year ${yearB} recorded ${(statsB.count - statsA.count).toLocaleString()} more fire detections than ${yearA} (+${Math.round(((statsB.count - statsA.count) / Math.max(1, statsA.count)) * 100)}%).`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-[#86868b] text-[11px] shrink-0">
          <span>Grid: 5.5 km Harmonized</span>
          <span>MODIS + VIIRS Data Sync</span>
        </div>
      </div>

    </div>
  );
};
