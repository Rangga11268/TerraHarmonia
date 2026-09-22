import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Play,
  Pause,
  ArrowRight,
  Volume2,
  VolumeX,
  Crosshair,
  Radio,
  Layers,
  Sparkles,
  Compass,
} from 'lucide-react';
import { Language } from '../data/translations';

interface CinematicIntroTourProps {
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  isOpen: boolean;
  onClose: () => void;
  onEnterApp?: () => void;
}

// Indonesian landmass key coordinates (accurate vectorized polygons for 3D sphere projection)
const INDONESIA_POLYGONS = [
  // Sumatra
  [
    [5.5, 95.3], [4.2, 97.8], [2.8, 98.7], [1.5, 100.2], [-0.5, 101.5],
    [-2.5, 103.8], [-4.2, 105.8], [-5.8, 106.0], [-5.2, 104.5], [-3.8, 102.2],
    [-1.2, 100.0], [0.8, 98.5], [2.8, 97.0], [5.5, 95.3]
  ],
  // Kalimantan (Borneo)
  [
    [4.2, 117.5], [2.8, 118.5], [1.2, 117.8], [-1.0, 117.2], [-3.5, 116.8],
    [-4.0, 114.5], [-3.2, 111.5], [-1.8, 109.2], [0.5, 108.8], [2.0, 109.8],
    [4.0, 115.2], [4.2, 117.5]
  ],
  // Java
  [
    [-6.0, 106.0], [-6.2, 107.5], [-6.8, 108.8], [-7.2, 111.5], [-7.5, 114.2],
    [-8.5, 114.0], [-8.2, 111.5], [-7.8, 108.5], [-6.8, 105.5], [-6.0, 106.0]
  ],
  // Sulawesi
  [
    [1.5, 125.0], [0.8, 122.5], [0.0, 120.0], [-1.5, 119.5], [-3.5, 119.2],
    [-5.5, 119.8], [-5.2, 120.5], [-3.8, 120.5], [-2.5, 121.8], [-3.8, 122.5],
    [-5.0, 122.8], [-3.5, 123.5], [-1.2, 123.8], [0.8, 124.8], [1.5, 125.0]
  ],
  // Papua (Indonesian sector)
  [
    [-0.5, 131.0], [-1.5, 133.0], [-2.5, 135.0], [-3.8, 138.5], [-4.0, 141.0],
    [-9.0, 141.0], [-8.0, 138.5], [-5.5, 137.0], [-4.5, 135.5], [-3.0, 133.5],
    [-1.5, 130.5], [-0.5, 131.0]
  ]
];

// Indonesian peat fire hotspots with ground coordinates
const PEAT_HOTSPOTS = [
  { name: 'Kalteng Peat Dome', lat: -2.8, lon: 113.8, province: 'Kalimantan Tengah' },
  { name: 'Riau Peat Reservoir', lat: 1.2, lon: 101.8, province: 'Riau' },
  { name: 'Sumsel OKI Peatland', lat: -3.4, lon: 105.2, province: 'Sumatera Selatan' },
  { name: 'Kalbar Kubu Raya', lat: -0.2, lon: 109.4, province: 'Kalimantan Barat' },
  { name: 'Papua Mappi Peat', lat: -6.8, lon: 139.5, province: 'Papua Selatan' },
];

export const CinematicIntroTour: React.FC<CinematicIntroTourProps> = ({
  language,
  onToggleLanguage,
  isOpen,
  onClose,
  onEnterApp,
}) => {
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [isWarping, setIsWarping] = useState<boolean>(false);
  const [warpProgress, setWarpProgress] = useState<number>(0); // 0 to 1
  const [sensorMode, setSensorMode] = useState<'modis' | 'viirs' | 'harmonized'>('harmonized');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number>(0);
  const warpStartRef = useRef<number>(0);

  // Orbital Camera 3D State
  const cameraRef = useRef({
    yaw: 115 * (Math.PI / 180), // Centered on Indonesia (115° E)
    pitch: 4 * (Math.PI / 180),
    targetYaw: 115 * (Math.PI / 180),
    targetPitch: 4 * (Math.PI / 180),
    zoom: 1.0,
    targetZoom: 1.0,
    orbitAngle: 0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
  });

  const STAGE_DURATION_MS = 7500; // 7.5 seconds per narrative phase

  // 4 Minimalist Mission Briefing Phases
  const missionPhases = [
    {
      id: 'phase_crisis',
      phaseNum: '01',
      codeName: 'TROPICAL PEATLAND CRISIS',
      titleId: '26 Tahun Krisis Asap & Pembakaran Lahan Gambut Tropis',
      titleEn: '26 Years of Indonesian Peat Wildfire & Transboundary Haze',
      taglineId: 'Kubah gambut tropis menyimpan 57 Gt karbon. Kebakaran bawah tanah saat El Niño melepaskan 1.75 Gt emisi gas rumah kaca.',
      taglineEn: 'Tropical peat stores 57 Gt carbon. Underground smoldering during extreme droughts releases historic greenhouse emissions.',
      telemetryLogId: 'TELEMETRI: Super El Niño 2015 melepaskan 1.75 Gt CO2e ke atmosfer Asia Tenggara.',
      telemetryLogEn: 'TELEMETRY: 2015 Super El Niño anomaly emitted 1.75 Gt CO2e across Southeast Asia.',
      stats: [
        { labelId: 'Emisi 2015', labelEn: '2015 Carbon', value: '1.75 Gt CO2e' },
        { labelId: 'Kubah Gambut', labelEn: 'Peat Domes', value: '14.9M Ha' },
        { labelId: 'Kedalaman Gambut', labelEn: 'Max Depth', value: language === 'id' ? 'Hingga 12 m' : 'Up to 12 m' },
      ],
      sensorView: 'modis' as const,
      cameraTarget: { yaw: 115 * (Math.PI / 180), pitch: 6 * (Math.PI / 180), zoom: 1.05 },
    },
    {
      id: 'phase_disruption',
      phaseNum: '02',
      codeName: 'NASA SENSOR DISRUPTION',
      titleId: 'Paradoks Pergeseran Sensor: Lonjakan Semu 300%',
      titleEn: 'The Satellite Shift Paradox: 300% Artificial Spike',
      taglineId: 'Peralihan dari MODIS (1 km) ke VIIRS (375 m) memecah 1 titik api menjadi 5 sampai 9 titik akibat resolusi optik 7x lebih rapat.',
      taglineEn: 'Transition from MODIS (1 km) to VIIRS (375 m) fractures 1 continuous fire front into 5 to 9 discrete hotspots.',
      telemetryLogId: 'PERINGATAN SENSOR: Lonjakan data mentah pasca-2012 adalah artefak optik ukuran piksel sensor.',
      telemetryLogEn: 'SENSOR WARNING: Post-2012 raw detection surge is an optical footprint pixel artifact.',
      stats: [
        { labelId: 'Piksel MODIS', labelEn: 'MODIS Pixel', value: '1,000 m' },
        { labelId: 'Piksel VIIRS', labelEn: 'VIIRS Pixel', value: '375 m' },
        { labelId: 'Faktor Pecahan', labelEn: 'Overcount', value: '5-9x Multiplier' },
      ],
      sensorView: 'viirs' as const,
      cameraTarget: { yaw: 108 * (Math.PI / 180), pitch: 2 * (Math.PI / 180), zoom: 1.15 },
    },
    {
      id: 'phase_harmonizer',
      phaseNum: '03',
      codeName: 'TERRA HARMONIA ENGINE',
      titleId: 'Harmonisasi Spasial 5.5 km & Stefan-Boltzmann FRP',
      titleEn: '5.5 km Equal-Area Grid & Stefan-Boltzmann Calibration',
      taglineId: 'Terra Harmonia merekonsiliasi seluruh data MODIS & VIIRS ke dalam grid 5.5 km dengan kalibrasi daya termal radiasi Megawatt.',
      taglineEn: 'Terra Harmonia reconciles MODIS & VIIRS into 5.5 km equal-area cells with Stefan-Boltzmann Megawatt thermal weighting.',
      telemetryLogId: 'ALGORITMA AKTIF: Overcount 100% terkoreksi. Rekaman 26 tahun tersinkronisasi secara homogen.',
      telemetryLogEn: 'ALGORITHM ACTIVE: 100% overcount eliminated. 26-year climatology record synchronized.',
      stats: [
        { labelId: 'Grid Spasial', labelEn: 'Spatial Grid', value: '5.5 km Cell' },
        { labelId: 'Koreksi Overcount', labelEn: 'Overcount Fixed', value: '100%' },
        { labelId: 'Basis Standar', labelEn: 'Standard', value: 'NASA FIRMS' },
      ],
      sensorView: 'harmonized' as const,
      cameraTarget: { yaw: 114 * (Math.PI / 180), pitch: -3 * (Math.PI / 180), zoom: 1.2 },
    },
    {
      id: 'phase_field',
      phaseNum: '04',
      codeName: 'RAPID FRONTLINE ACTION',
      titleId: 'Dari Sains Antariksa ke Aksi Cepat Manggala Agni',
      titleEn: 'From Orbital Science to Manggala Agni Frontline Action',
      taglineId: 'Deteksi satelit terhubung dengan status Muka Air Gambut (TMAG < -40 cm), estimasi emisi karbon, dan format disposisi WhatsApp.',
      taglineEn: 'Orbital telemetry bridges statutory Peat Water Table depths (TMAG < -40 cm), carbon emissions, and WhatsApp brigade dispatch.',
      telemetryLogId: 'OPERASIONAL: Integrasi ambang batas BRGM dan transmisi koordinat pemadaman ke regu darat.',
      telemetryLogEn: 'OPERATIONAL: BRGM statutory threshold integration and ground brigade dispatch pipeline.',
      stats: [
        { labelId: 'Ambang Kritis', labelEn: 'Critical TMAG', value: '-40 cm' },
        { labelId: 'Format Disposisi', labelEn: 'Dispatch', value: 'WhatsApp / SMS' },
        { labelId: 'Standar GIS', labelEn: 'GIS Format', value: 'GeoJSON / RFC' },
      ],
      sensorView: 'harmonized' as const,
      cameraTarget: { yaw: 118 * (Math.PI / 180), pitch: -1 * (Math.PI / 180), zoom: 1.25 },
    },
  ];

  // Sound Synthesizer via Web Audio API
  const playTelemetryBeep = useCallback((freq = 880, type: OscillatorType = 'sine', duration = 0.08) => {
    if (!isAudioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }, [isAudioEnabled]);

  // Stage Selection
  const handleSelectStage = (index: number) => {
    if (isWarping) return;
    setCurrentStage(index);
    setProgress(0);
    const phase = missionPhases[index];
    setSensorMode(phase.sensorView);
    cameraRef.current.targetYaw = phase.cameraTarget.yaw;
    cameraRef.current.targetPitch = phase.cameraTarget.pitch;
    cameraRef.current.targetZoom = phase.cameraTarget.zoom;
    playTelemetryBeep(700 + index * 100, 'sine', 0.08);
  };

  // Auto-play timer
  useEffect(() => {
    if (!isOpen || !isAutoPlaying || isWarping) return;

    const tickMs = 50;
    const progressStep = (tickMs / STAGE_DURATION_MS) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentStage((curr) => {
            if (curr < missionPhases.length - 1) {
              const next = curr + 1;
              const phase = missionPhases[next];
              setSensorMode(phase.sensorView);
              cameraRef.current.targetYaw = phase.cameraTarget.yaw;
              cameraRef.current.targetPitch = phase.cameraTarget.pitch;
              cameraRef.current.targetZoom = phase.cameraTarget.zoom;
              playTelemetryBeep(850, 'sine', 0.08);
              return next;
            } else {
              triggerLaunchWarp();
              return curr;
            }
          });
          return 0;
        }
        return prev + progressStep;
      });
    }, tickMs);

    return () => clearInterval(interval);
  }, [isOpen, isAutoPlaying, isWarping, missionPhases, playTelemetryBeep]);

  // Butter-Smooth 60FPS Supersonic Warp Transition
  const triggerLaunchWarp = () => {
    if (isWarping) return;
    setIsWarping(true);
    setIsAutoPlaying(false);
    warpStartRef.current = performance.now();
    playTelemetryBeep(440, 'sine', 0.4);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        triggerLaunchWarp();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        if (currentStage < missionPhases.length - 1) {
          handleSelectStage(currentStage + 1);
        } else {
          triggerLaunchWarp();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentStage > 0) handleSelectStage(currentStage - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStage, isWarping]);

  // 3D Canvas Physics & Rendering Loop
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = (canvas.width = window.innerWidth * dpr);
    let height = (canvas.height = window.innerHeight * dpr);

    const handleResize = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.width = window.innerWidth * dpr;
      height = canvasRef.current.height = window.innerHeight * dpr;
    };
    window.addEventListener('resize', handleResize);

    // 350 Stars in 3D Coordinate Space
    const stars = Array.from({ length: 350 }, () => ({
      x: (Math.random() - 0.5) * 2500,
      y: (Math.random() - 0.5) * 2500,
      z: Math.random() * 1200 + 100,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      pulseSpeed: Math.random() * 0.03 + 0.01,
    }));

    let animationTime = 0;

    const render = (time: number) => {
      animationTime += 0.012;
      const cam = cameraRef.current;

      // Smooth Warp Calculation (1200ms cubic ease-in-out)
      let currentWarpP = 0;
      if (isWarping) {
        const elapsed = time - warpStartRef.current;
        const duration = 1200;
        const rawP = Math.min(1, elapsed / duration);
        // Ease In-Out Cubic
        currentWarpP = rawP < 0.5 ? 4 * rawP * rawP * rawP : 1 - Math.pow(-2 * rawP + 2, 3) / 2;
        setWarpProgress(currentWarpP);

        cam.targetZoom = 1.0 + currentWarpP * 14.0;
        cam.targetYaw = 114 * (Math.PI / 180);
        cam.targetPitch = -1.5 * (Math.PI / 180);

        if (rawP >= 1) {
          try {
            localStorage.setItem('terra_harmonia_intro_seen', 'true');
          } catch (e) {}
          if (onEnterApp) onEnterApp();
          onClose();
          return;
        }
      }

      // Smooth camera interpolation (LERP)
      cam.yaw += (cam.targetYaw - cam.yaw) * 0.06;
      cam.pitch += (cam.targetPitch - cam.pitch) * 0.06;
      cam.zoom += (cam.targetZoom - cam.zoom) * 0.06;
      cam.orbitAngle += 0.006;

      // Auto slow yaw if not dragging
      if (!cam.isDragging && !isWarping) {
        cam.targetYaw += 0.0005;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Deep Space Canvas Background
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 50 * dpr,
        width / 2, height / 2, Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, '#040b1e');
      bgGrad.addColorStop(0.55, '#020617');
      bgGrad.addColorStop(1, '#000208');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Render 3D Starfield with Warp Streaks
      ctx.save();
      const centerX = width / 2;
      const centerY = height / 2;

      stars.forEach((star) => {
        const k = (450 * dpr) / Math.max(10, star.z - currentWarpP * 1100);
        const px = centerX + star.x * k;
        const py = centerY + star.y * k;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const brightness = Math.sin(animationTime * star.pulseSpeed * 10) * 0.25 + 0.75;
          ctx.fillStyle = `rgba(224, 242, 254, ${star.alpha * brightness})`;

          if (isWarping && currentWarpP > 0.05) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(1, currentWarpP * 1.5)})`;
            ctx.lineWidth = star.size * dpr * (1 + currentWarpP * 2);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(
              px + (px - centerX) * 0.3 * currentWarpP,
              py + (py - centerY) * 0.3 * currentWarpP
            );
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.arc(px, py, star.size * dpr, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
      ctx.restore();

      // 3. Globe Geometry (Centered, Unobstructed)
      const globeRadius = Math.min(width, height) * 0.34 * cam.zoom;
      const globeX = width / 2;
      const globeY = height / 2;

      // 4. Atmospheric Rayleigh Scattering Glow
      const atmosGrad = ctx.createRadialGradient(
        globeX, globeY, globeRadius * 0.88,
        globeX, globeY, globeRadius * 1.38
      );
      atmosGrad.addColorStop(0, 'rgba(14, 165, 233, 0.40)');
      atmosGrad.addColorStop(0.35, 'rgba(11, 61, 145, 0.25)');
      atmosGrad.addColorStop(0.75, 'rgba(30, 58, 138, 0.08)');
      atmosGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = atmosGrad;
      ctx.beginPath();
      ctx.arc(globeX, globeY, globeRadius * 1.38, 0, Math.PI * 2);
      ctx.fill();

      // 5. Earth Sphere Base with Day/Night Ocean
      ctx.save();
      ctx.beginPath();
      ctx.arc(globeX, globeY, globeRadius, 0, Math.PI * 2);
      ctx.clip();

      const oceanGrad = ctx.createRadialGradient(
        globeX - globeRadius * 0.35, globeY - globeRadius * 0.35, globeRadius * 0.1,
        globeX, globeY, globeRadius
      );
      oceanGrad.addColorStop(0, '#0a3a60');
      oceanGrad.addColorStop(0.5, '#0b2447');
      oceanGrad.addColorStop(1, '#020b18');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(globeX - globeRadius, globeY - globeRadius, globeRadius * 2, globeRadius * 2);

      // Helper for 3D Spherical Coordinate Projection
      const project3D = (latDeg: number, lonDeg: number) => {
        const lat = (latDeg * Math.PI) / 180;
        const lon = (lonDeg * Math.PI) / 180;
        const relLon = lon - cam.yaw;

        const x3D = Math.cos(lat) * Math.sin(relLon);
        const y3D = Math.sin(lat) * Math.cos(cam.pitch) - Math.cos(lat) * Math.sin(cam.pitch) * Math.cos(relLon);
        const z3D = Math.sin(lat) * Math.sin(cam.pitch) + Math.cos(lat) * Math.cos(cam.pitch) * Math.cos(relLon);

        return {
          x: globeX + x3D * globeRadius,
          y: globeY - y3D * globeRadius,
          visible: z3D > -0.1,
          z: z3D,
        };
      };

      // 6. Draw Lat/Lon Graticule Rings
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 1 * dpr;

      // Parallels (Latitudes)
      [-40, -20, 0, 20, 40].forEach((lat) => {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 4) {
          const pt = project3D(lat, lon);
          if (pt.visible) {
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      });

      // Meridians (Longitudes)
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -80; lat <= 80; lat += 4) {
          const pt = project3D(lat, lon);
          if (pt.visible) {
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // 7. Draw Indonesian Landmass Polygons (Emerald/Forest Vector Islands)
      INDONESIA_POLYGONS.forEach((poly) => {
        ctx.beginPath();
        let first = true;
        let anyVisible = false;

        poly.forEach(([lat, lon]) => {
          const pt = project3D(lat, lon);
          if (pt.visible) {
            anyVisible = true;
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          }
        });

        if (anyVisible) {
          ctx.closePath();
          ctx.fillStyle = 'rgba(5, 150, 105, 0.85)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(110, 231, 183, 0.8)';
          ctx.lineWidth = 1.4 * dpr;
          ctx.stroke();
        }
      });

      // 8. Render Peatland Fire Hotspot Clusters
      PEAT_HOTSPOTS.forEach((spot, i) => {
        const pt = project3D(spot.lat, spot.lon);
        if (pt.visible) {
          const pulse = (animationTime * 2.8 + i * 1.4) % 3;
          const waveRadius = (4 + pulse * 14) * dpr;
          const waveAlpha = Math.max(0, 1 - pulse / 3);

          if (sensorMode === 'modis') {
            // MODIS 1km Single Broad Circle
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, waveRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(249, 115, 22, ${waveAlpha * 0.9})`;
            ctx.lineWidth = 2 * dpr;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4.5 * dpr, 0, Math.PI * 2);
            ctx.fillStyle = '#f97316';
            ctx.fill();
          } else if (sensorMode === 'viirs') {
            // VIIRS 375m Multi-point Cluster
            const offsets = [
              [0, 0], [4 * dpr, -3 * dpr], [-5 * dpr, 3 * dpr], [3 * dpr, 4 * dpr], [-4 * dpr, -4 * dpr]
            ];
            offsets.forEach(([ox, oy]) => {
              ctx.beginPath();
              ctx.arc(pt.x + ox, pt.y + oy, 2.5 * dpr, 0, Math.PI * 2);
              ctx.fillStyle = '#ef4444';
              ctx.fill();
            });

            ctx.beginPath();
            ctx.arc(pt.x, pt.y, waveRadius * 0.8, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(239, 68, 68, ${waveAlpha * 0.8})`;
            ctx.lineWidth = 1.5 * dpr;
            ctx.stroke();
          } else {
            // Harmonized 5.5km Equal-Area Hexagon Mesh
            ctx.beginPath();
            for (let a = 0; a < 6; a++) {
              const angle = (a * Math.PI) / 3;
              const hx = pt.x + Math.cos(angle) * (13 * dpr);
              const hy = pt.y + Math.sin(angle) * (13 * dpr);
              if (a === 0) ctx.moveTo(hx, hy);
              else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.fillStyle = 'rgba(14, 165, 233, 0.4)';
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.8 * dpr;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 3.5 * dpr, 0, Math.PI * 2);
            ctx.fillStyle = '#fbbf24';
            ctx.fill();
          }

          // Reticle Label
          ctx.font = `${Math.round(9 * dpr)}px monospace`;
          ctx.fillStyle = '#f8fafc';
          ctx.fillText(spot.province, pt.x + 10 * dpr, pt.y - 4 * dpr);
        }
      });

      // Shading: Edge Horizon Terminator
      const edgeShade = ctx.createRadialGradient(
        globeX, globeY, globeRadius * 0.7,
        globeX, globeY, globeRadius
      );
      edgeShade.addColorStop(0, 'rgba(0, 0, 0, 0)');
      edgeShade.addColorStop(0.85, 'rgba(2, 6, 23, 0.45)');
      edgeShade.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
      ctx.fillStyle = edgeShade;
      ctx.fillRect(globeX - globeRadius, globeY - globeRadius, globeRadius * 2, globeRadius * 2);

      ctx.restore(); // Restore from globe clip

      // 9. Draw 3D Satellite Orbits & Volumetric Scanning Cones

      // Orbit 1: NASA Terra MODIS (Blue Orbit, Alt 705 km)
      const orbitTerraRadius = globeRadius * 1.40;
      const terraAngle = cam.orbitAngle * 1.5;
      const terraSatX = globeX + Math.cos(terraAngle) * orbitTerraRadius;
      const terraSatY = globeY + Math.sin(terraAngle) * (orbitTerraRadius * 0.38);

      // Orbit 2: Suomi-NPP VIIRS (Green Orbit, Alt 824 km)
      const orbitViirsRadius = globeRadius * 1.60;
      const viirsAngle = (cam.orbitAngle * 1.25) + Math.PI;
      const viirsSatX = globeX + Math.cos(viirsAngle) * orbitViirsRadius;
      const viirsSatY = globeY + Math.sin(viirsAngle) * (orbitViirsRadius * 0.44);

      // Render Orbit Ellipse Paths
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.35)';
      ctx.lineWidth = 1 * dpr;
      ctx.setLineDash([4 * dpr, 4 * dpr]);
      ctx.beginPath();
      ctx.ellipse(globeX, globeY, orbitTerraRadius, orbitTerraRadius * 0.38, -0.2, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
      ctx.beginPath();
      ctx.ellipse(globeX, globeY, orbitViirsRadius, orbitViirsRadius * 0.44, 0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Volumetric Laser Sensor Beams to Indonesian Ground Target
      const targetPt = project3D(-1.5, 114.0); // Central Kalimantan Ground Target
      if (targetPt.visible) {
        // Terra Laser Cone
        ctx.beginPath();
        ctx.moveTo(terraSatX, terraSatY);
        ctx.lineTo(targetPt.x - 20 * dpr, targetPt.y);
        ctx.lineTo(targetPt.x + 20 * dpr, targetPt.y);
        ctx.closePath();
        const terraBeam = ctx.createLinearGradient(terraSatX, terraSatY, targetPt.x, targetPt.y);
        terraBeam.addColorStop(0, 'rgba(59, 130, 246, 0.55)');
        terraBeam.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
        ctx.fillStyle = terraBeam;
        ctx.fill();

        // VIIRS Laser Cone
        ctx.beginPath();
        ctx.moveTo(viirsSatX, viirsSatY);
        ctx.lineTo(targetPt.x - 12 * dpr, targetPt.y + 6 * dpr);
        ctx.lineTo(targetPt.x + 12 * dpr, targetPt.y + 6 * dpr);
        ctx.closePath();
        const viirsBeam = ctx.createLinearGradient(viirsSatX, viirsSatY, targetPt.x, targetPt.y);
        viirsBeam.addColorStop(0, 'rgba(16, 185, 129, 0.55)');
        viirsBeam.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
        ctx.fillStyle = viirsBeam;
        ctx.fill();
      }

      // Satellite 1: EOS-AM1 Terra
      ctx.save();
      ctx.translate(terraSatX, terraSatY);
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(-6 * dpr, -4 * dpr, 12 * dpr, 8 * dpr);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-18 * dpr, -2 * dpr, 10 * dpr, 4 * dpr);
      ctx.fillRect(8 * dpr, -2 * dpr, 10 * dpr, 4 * dpr);
      ctx.beginPath();
      ctx.arc(0, 0, 10 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.fill();
      ctx.restore();

      ctx.font = `bold ${Math.round(9 * dpr)}px monospace`;
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('TERRA MODIS (1km) [705 km SSO]', terraSatX + 16 * dpr, terraSatY - 4 * dpr);

      // Satellite 2: Suomi-NPP VIIRS
      ctx.save();
      ctx.translate(viirsSatX, viirsSatY);
      ctx.fillStyle = '#059669';
      ctx.fillRect(-5 * dpr, -5 * dpr, 10 * dpr, 10 * dpr);
      ctx.fillStyle = '#34d399';
      ctx.fillRect(-16 * dpr, -2 * dpr, 9 * dpr, 4 * dpr);
      ctx.fillRect(7 * dpr, -2 * dpr, 9 * dpr, 4 * dpr);
      ctx.beginPath();
      ctx.arc(0, 0, 12 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(52, 211, 153, 0.25)';
      ctx.fill();
      ctx.restore();

      ctx.font = `bold ${Math.round(9 * dpr)}px monospace`;
      ctx.fillStyle = '#34d399';
      ctx.fillText('SUOMI-NPP VIIRS (375m) [824 km SSO]', viirsSatX + 16 * dpr, viirsSatY - 4 * dpr);

      // 10. Flash / Bloom overlay on final warp dive
      if (isWarping && currentWarpP > 0.4) {
        ctx.fillStyle = `rgba(224, 242, 254, ${(currentWarpP - 0.4) * 1.6})`;
        ctx.fillRect(0, 0, width, height);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, sensorMode, isWarping]);

  // Interactive Orbit Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    cameraRef.current.isDragging = true;
    cameraRef.current.lastMouseX = e.clientX;
    cameraRef.current.lastMouseY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cameraRef.current.isDragging) return;
    const deltaX = e.clientX - cameraRef.current.lastMouseX;
    const deltaY = e.clientY - cameraRef.current.lastMouseY;
    cameraRef.current.lastMouseX = e.clientX;
    cameraRef.current.lastMouseY = e.clientY;

    cameraRef.current.targetYaw -= deltaX * 0.005;
    cameraRef.current.targetPitch += deltaY * 0.005;
    cameraRef.current.targetPitch = Math.max(-1.0, Math.min(1.0, cameraRef.current.targetPitch));
  };

  const handleMouseUp = () => {
    cameraRef.current.isDragging = false;
  };

  if (!isOpen) return null;

  const current = missionPhases[currentStage];

  const modalContent = (
    <div
      className="fixed inset-0 z-[100000] bg-[#020617] text-slate-100 flex flex-col justify-between font-sans select-none overflow-hidden animate-in fade-in duration-300"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* 3D WebGL / Canvas Orbital Viewport */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
      />

      {/* Top Aerospace Minimal Header */}
      <header className="relative z-30 h-16 px-4 sm:px-8 flex items-center justify-between bg-gradient-to-b from-[#020617]/90 via-[#020617]/60 to-transparent pointer-events-auto">
        
        {/* Brand Lockup: NASA Meatball × Terra Harmonia */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-[#0b1b36] border border-blue-500/40 p-1 flex items-center justify-center shadow-lg shadow-blue-950">
              <img
                src="/terra_harmonia_transparent.svg"
                alt="Terra Harmonia"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-slate-500 font-mono text-xs">×</span>
            <div className="w-7 h-7 rounded-full overflow-hidden shadow-md shadow-blue-950 shrink-0">
              <img
                src="/nasa_meatball.svg"
                alt="NASA"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-tight">Terra Harmonia</span>
              <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-700/60">
                NASA SPACE APPS 2026
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              ORBITAL CLIMATOLOGY ENGINE // INDONESIAN PEATLAND WILDFIRE
            </p>
          </div>
        </div>

        {/* Top Right Mission Control Tools */}
        <div className="flex items-center gap-2.5">
          
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={() => {
              const next = !isAudioEnabled;
              setIsAudioEnabled(next);
              if (next) playTelemetryBeep(660, 'sine', 0.1);
            }}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition cursor-pointer text-xs"
            title={isAudioEnabled ? 'Mute Audio' : 'Enable Mission Sound'}
          >
            {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5 text-blue-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {/* Auto-Play Toggle */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            disabled={isWarping}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition cursor-pointer text-xs flex items-center gap-1.5"
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5 text-blue-400" /> : <Play className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline font-medium text-[11px]">{isAutoPlaying ? 'Auto' : 'Paused'}</span>
          </button>

          {/* Bilingual Switcher */}
          <div className="flex items-center bg-slate-900/80 rounded-xl p-0.5 border border-slate-700/80 text-xs font-semibold">
            <button
              onClick={() => onToggleLanguage('en')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] ${
                language === 'en' ? 'bg-[#0b3d91] text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onToggleLanguage('id')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] ${
                language === 'id' ? 'bg-[#0b3d91] text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              ID
            </button>
          </div>

          {/* Launch Mission Button */}
          <button
            onClick={triggerLaunchWarp}
            disabled={isWarping}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0b3d91] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all border border-blue-500/40 shadow-lg shadow-blue-950/60 cursor-pointer shrink-0"
          >
            <span>{language === 'id' ? 'Buka Platform' : 'Engage Mission'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </header>

      {/* Top Floating Live Coordinates (Minimalist HUD) */}
      <div className="relative z-20 px-6 sm:px-12 pointer-events-none flex justify-between items-start">
        <div className="text-[10px] font-mono text-slate-400 space-y-0.5 bg-[#020617]/60 backdrop-blur-xs p-2 rounded-lg border border-slate-800/40 inline-block">
          <div className="text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>GEO TARGET: INDONESIA PEAT DOME</span>
          </div>
          <div>COORDINATES: 0.7893° S, 113.9213° E</div>
        </div>

        {/* Live Interactive Sensor Filter Toggle */}
        <div className="pointer-events-auto flex items-center gap-1 bg-[#020617]/80 backdrop-blur-md rounded-xl p-1 border border-slate-800 text-[11px] font-mono">
          <button
            onClick={() => setSensorMode('modis')}
            className={`px-2.5 py-1 rounded-lg cursor-pointer transition ${sensorMode === 'modis' ? 'bg-orange-600 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'}`}
          >
            MODIS (1km)
          </button>
          <button
            onClick={() => setSensorMode('viirs')}
            className={`px-2.5 py-1 rounded-lg cursor-pointer transition ${sensorMode === 'viirs' ? 'bg-red-600 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'}`}
          >
            VIIRS (375m)
          </button>
          <button
            onClick={() => setSensorMode('harmonized')}
            className={`px-2.5 py-1 rounded-lg cursor-pointer transition ${sensorMode === 'harmonized' ? 'bg-sky-600 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'}`}
          >
            5.5km Equal-Area
          </button>
        </div>
      </div>

      {/* Sleek Floating Bottom Mission Briefing & Console (Clean, Uncluttered, Non-Blocking) */}
      <div className="relative z-30 px-4 sm:px-8 pb-4 pointer-events-auto flex flex-col items-center space-y-3">
        
        {/* Sleek Minimalist Mission Storyline Banner */}
        <div className="w-full max-w-4xl bg-[#030919]/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-4 shadow-2xl space-y-2">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800/80">
                PHASE {current.phaseNum}
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                {language === 'id' ? current.titleId : current.titleEn}
              </h2>
            </div>
            
            {/* Minimal Metric Badges */}
            <div className="flex items-center gap-2">
              {current.stats.map((stat, idx) => (
                <div key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  <span className="text-slate-400 font-semibold">{language === 'id' ? stat.labelId : stat.labelEn}: </span>
                  <span className="text-white font-bold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {language === 'id' ? current.taglineId : current.taglineEn}
          </p>

        </div>

        {/* Phase Navigation Buttons & Timeline Progress Bar */}
        <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
          
          {/* 4 Quick Phase Selectors */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {missionPhases.map((phase, idx) => {
              const isActive = idx === currentStage;
              return (
                <button
                  key={phase.id}
                  onClick={() => handleSelectStage(idx)}
                  disabled={isWarping}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#0b3d91] text-white border border-blue-400 shadow-md shadow-blue-950'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>{phase.phaseNum}</span>
                  <span className="hidden md:inline text-[11px] font-sans font-medium">
                    {idx === 0
                      ? language === 'id' ? 'Krisis Gambut' : 'Peat Crisis'
                      : idx === 1
                      ? language === 'id' ? 'Pergeseran Sensor' : 'Sensor Shift'
                      : idx === 2
                      ? language === 'id' ? 'Harmonisasi 5.5km' : '5.5km Engine'
                      : language === 'id' ? 'Mitigasi Lapangan' : 'Field Action'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Timeline Progress Bar */}
          <div className="flex items-center gap-2.5 w-full sm:w-60">
            <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400 shrink-0">
              {currentStage + 1} / {missionPhases.length}
            </span>
          </div>

        </div>

      </div>

    </div>
  );

  return createPortal(modalContent, document.body);
};
