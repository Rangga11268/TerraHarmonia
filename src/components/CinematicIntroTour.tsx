import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Play,
  Pause,
  ArrowRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Crosshair,
  Radio,
  Sliders,
  Compass,
  Layers,
  Sparkles,
  Maximize2,
  Globe2,
} from 'lucide-react';
import { Language } from '../data/translations';

interface CinematicIntroTourProps {
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  isOpen: boolean;
  onClose: () => void;
  onEnterApp?: () => void;
}

// Indonesian landmass key coordinates (simplified polygons for 3D sphere projection)
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
  { name: 'Kalteng Peat Dome', lat: -2.8, lon: 113.8, frp: 380, province: 'Kalimantan Tengah' },
  { name: 'Riau Peat Reservoir', lat: 1.2, lon: 101.8, frp: 290, province: 'Riau' },
  { name: 'Sumsel OKI Peatland', lat: -3.4, lon: 105.2, frp: 310, province: 'Sumatera Selatan' },
  { name: 'Kalbar Kubu Raya', lat: -0.2, lon: 109.4, frp: 220, province: 'Kalimantan Barat' },
  { name: 'Papua Mappi Peat', lat: -6.8, lon: 139.5, frp: 180, province: 'Papua Selatan' },
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
  const [warpFactor, setWarpFactor] = useState<number>(0);
  const [sensorMode, setSensorMode] = useState<'modis' | 'viirs' | 'harmonized'>('harmonized');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number>(0);

  // Orbital Camera 3D State
  const cameraRef = useRef({
    yaw: 115 * (Math.PI / 180), // Center on Indonesia (115° E)
    pitch: 5 * (Math.PI / 180), // Slight inclination
    targetYaw: 115 * (Math.PI / 180),
    targetPitch: 5 * (Math.PI / 180),
    zoom: 1.0,
    targetZoom: 1.0,
    orbitAngle: 0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
  });

  const STAGE_DURATION_MS = 8000; // 8 seconds per narrative phase

  // 4 Mission Control Briefing Phases
  const missionPhases = [
    {
      id: 'phase_crisis',
      phaseNum: '01',
      codeName: 'TROPICAL PEATLAND CRISIS',
      titleId: '26 Tahun Krisis Asap & Pembakaran Lahan Gambut Tropis',
      titleEn: '26 Years of Indonesian Peat Wildfire & Transboundary Haze',
      taglineId: 'Kubah gambut menyimpan 57 Gt karbon. Saat El Niño tiba, api membakar lapisan bawah tanah hingga belasan meter.',
      taglineEn: 'Tropical peat stores 57 Gt carbon. Under El Niño droughts, fires smolder deep underground, releasing historic greenhouse emissions.',
      telemetryLogId: 'TELEMETRI: Anomali El Niño 2015 melepaskan 1.75 Gt CO2e ke atmosfer Asia Tenggara.',
      telemetryLogEn: 'TELEMETRY: 2015 El Niño anomaly emitted 1.75 Gt CO2e across Southeast Asia.',
      stats: [
        { labelId: 'Emisi 2015', labelEn: '2015 Carbon', value: '1.75 Gt CO2e' },
        { labelId: 'Kubah Gambut', labelEn: 'Peat Domes', value: '14.9M Ha' },
        { labelId: 'Kedalaman', labelEn: 'Max Depth', value: language === 'id' ? 'Hingga 12 m' : 'Up to 12 m' },
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
      taglineId: 'Terra MODIS (1 km) digantikan Suomi-NPP VIIRS (375 m). Resolusi 7x lebih rapat memecah 1 kebakaran menjadi 5-9 titik terpisah.',
      taglineEn: 'Terra MODIS (1 km) joined by Suomi-NPP VIIRS (375 m). 7x finer footprint fractures 1 fire into 5 to 9 discrete points.',
      telemetryLogId: 'PERINGATAN SENSOR: Data mentah pasca-2012 melonjak secara artifisial akibat disparitas ukuran piksel optik.',
      telemetryLogEn: 'SENSOR WARNING: Post-2012 raw detections surged artificially due to optical footprint disparity.',
      stats: [
        { labelId: 'Piksel MODIS', labelEn: 'MODIS Pixel', value: '1,000 m' },
        { labelId: 'Piksel VIIRS', labelEn: 'VIIRS Pixel', value: '375 m' },
        { labelId: 'Faktor Pecahan', labelEn: 'Overcount', value: '5-9x Raw' },
      ],
      sensorView: 'viirs' as const,
      cameraTarget: { yaw: 108 * (Math.PI / 180), pitch: 2 * (Math.PI / 180), zoom: 1.2 },
    },
    {
      id: 'phase_harmonizer',
      phaseNum: '03',
      codeName: 'TERRA HARMONIA ENGINE',
      titleId: 'Harmonisasi Spasial 5.5 km & Stefan-Boltzmann FRP',
      titleEn: '5.5 km Equal-Area Grid & Stefan-Boltzmann Calibration',
      taglineId: 'Algoritma Terra Harmonia merekonsiliasi MODIS dan VIIRS ke dalam grid 5.5 km dengan pembobotan energi radiasi termal Megawatt.',
      taglineEn: 'Terra Harmonia reconciles MODIS and VIIRS into 5.5 km equal-area cells with Stefan-Boltzmann Megawatt thermal weighting.',
      telemetryLogId: 'ALGORITMA AKTIF: Overcount 100% terkoreksi. Rekaman 26 tahun (2000-2026) tersinkronisasi secara homogen.',
      telemetryLogEn: 'ALGORITHM ACTIVE: 100% overcount eliminated. 26-year record (2000-2026) calibrated homogenously.',
      stats: [
        { labelId: 'Grid Spasial', labelEn: 'Spatial Grid', value: '5.5 km Cell' },
        { labelId: 'Eliminasi Overcount', labelEn: 'Overcount Fixed', value: '100%' },
        { labelId: 'Basis Standar', labelEn: 'Standard', value: 'NASA FIRMS' },
      ],
      sensorView: 'harmonized' as const,
      cameraTarget: { yaw: 114 * (Math.PI / 180), pitch: -4 * (Math.PI / 180), zoom: 1.25 },
    },
    {
      id: 'phase_field',
      phaseNum: '04',
      codeName: 'RAPID FRONTLINE ACTION',
      titleId: 'Dari Sains Antariksa ke Patroli Lapangan Manggala Agni',
      titleEn: 'From Orbital Science to Manggala Agni Field Action',
      taglineId: 'Deteksi satelit terhubung dengan Tinggi Muka Air Gambut (TMAG < -40 cm), estimasi emisi karbon, dan generator disposisi WhatsApp.',
      taglineEn: 'Orbital telemetry bridges Peat Water Table depths (TMAG < -40 cm), carbon emissions, and automated WhatsApp brigade dispatch.',
      telemetryLogId: 'OPERASIONAL: Integrasi ambang BRGM dan pengiriman koordinat pemadaman bawah tanah ke regu darat.',
      telemetryLogEn: 'OPERATIONAL: BRGM threshold integration and frontline subsurface fire dispatch pipeline.',
      stats: [
        { labelId: 'Ambang TMAG', labelEn: 'Critical TMAG', value: '-40 cm' },
        { labelId: 'Format Disposisi', labelEn: 'Dispatch Pipeline', value: 'WhatsApp / SMS' },
        { labelId: 'Standar GIS', labelEn: 'GIS Format', value: 'GeoJSON / RFC' },
      ],
      sensorView: 'harmonized' as const,
      cameraTarget: { yaw: 118 * (Math.PI / 180), pitch: -2 * (Math.PI / 180), zoom: 1.35 },
    },
  ];

  // Sound Synthesizer via Web Audio API (No audio files needed)
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

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }, [isAudioEnabled]);

  // Stage Switcher
  const handleSelectStage = (index: number) => {
    if (isWarping) return;
    setCurrentStage(index);
    setProgress(0);
    const phase = missionPhases[index];
    setSensorMode(phase.sensorView);
    cameraRef.current.targetYaw = phase.cameraTarget.yaw;
    cameraRef.current.targetPitch = phase.cameraTarget.pitch;
    cameraRef.current.targetZoom = phase.cameraTarget.zoom;
    playTelemetryBeep(750 + index * 120, 'sine', 0.1);
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
              playTelemetryBeep(880, 'sine', 0.1);
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

  // Supersonic Launch Warp Sequence
  const triggerLaunchWarp = () => {
    if (isWarping) return;
    setIsWarping(true);
    setIsAutoPlaying(false);
    playTelemetryBeep(440, 'sawtooth', 0.4);

    let factor = 0;
    const warpTimer = setInterval(() => {
      factor += 4;
      setWarpFactor(factor);
      cameraRef.current.targetZoom += 0.25;

      if (factor >= 100) {
        clearInterval(warpTimer);
        try {
          localStorage.setItem('terra_harmonia_intro_seen', 'true');
        } catch (e) {}
        if (onEnterApp) onEnterApp();
        onClose();
      }
    }, 30);
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

  // 3D Canvas Orbital Physics Engine
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.width = window.innerWidth;
      height = canvasRef.current.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate 350 3D Starfield Particles
    const stars = Array.from({ length: 350 }, () => ({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * 1000 + 100,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      pulseSpeed: Math.random() * 0.03 + 0.01,
    }));

    let animationTime = 0;

    const render = () => {
      animationTime += 0.015;
      const cam = cameraRef.current;

      // Smooth camera interpolation (LERP)
      cam.yaw += (cam.targetYaw - cam.yaw) * 0.05;
      cam.pitch += (cam.targetPitch - cam.pitch) * 0.05;
      cam.zoom += (cam.targetZoom - cam.zoom) * 0.05;
      cam.orbitAngle += 0.008;

      // Auto slow rotation if not dragging
      if (!cam.isDragging && !isWarping) {
        cam.targetYaw += 0.0006;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Deep Space Cosmic Background
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 50,
        width / 2, height / 2, Math.max(width, height) * 0.75
      );
      bgGrad.addColorStop(0, '#040a1c');
      bgGrad.addColorStop(0.6, '#020617');
      bgGrad.addColorStop(1, '#000208');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Render 3D Starfield with Warp Streaks
      ctx.save();
      const centerX = width / 2;
      const centerY = height / 2;

      stars.forEach((star) => {
        // Perspective 3D projection
        const k = 400 / (star.z - (isWarping ? warpFactor * 8 : 0));
        const px = centerX + star.x * k;
        const py = centerY + star.y * k;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const brightness = Math.sin(animationTime * star.pulseSpeed * 10) * 0.25 + 0.75;
          ctx.fillStyle = `rgba(224, 242, 254, ${star.alpha * brightness})`;

          if (isWarping) {
            // Warp streak lines
            ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(1, warpFactor / 50)})`;
            ctx.lineWidth = star.size * 1.5;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(
              px + (px - centerX) * 0.15 * (warpFactor / 20),
              py + (py - centerY) * 0.15 * (warpFactor / 20)
            );
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.arc(px, py, star.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
      ctx.restore();

      // 3. Globe Center & Radius Calculation
      const globeRadius = Math.min(width, height) * 0.32 * cam.zoom;
      const globeX = width / 2;
      const globeY = height / 2 + 10;

      // 4. Atmospheric Rayleigh Scattering Limb Glow
      const atmosGrad = ctx.createRadialGradient(
        globeX, globeY, globeRadius * 0.85,
        globeX, globeY, globeRadius * 1.35
      );
      atmosGrad.addColorStop(0, 'rgba(14, 165, 233, 0.35)');
      atmosGrad.addColorStop(0.4, 'rgba(11, 61, 145, 0.22)');
      atmosGrad.addColorStop(0.8, 'rgba(30, 58, 138, 0.08)');
      atmosGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = atmosGrad;
      ctx.beginPath();
      ctx.arc(globeX, globeY, globeRadius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 5. Earth Sphere Base with Day/Night Terminator
      ctx.save();
      ctx.beginPath();
      ctx.arc(globeX, globeY, globeRadius, 0, Math.PI * 2);
      ctx.clip();

      // Ocean Gradient
      const oceanGrad = ctx.createRadialGradient(
        globeX - globeRadius * 0.3, globeY - globeRadius * 0.3, globeRadius * 0.1,
        globeX, globeY, globeRadius
      );
      oceanGrad.addColorStop(0, '#082f49');
      oceanGrad.addColorStop(0.5, '#0c213d');
      oceanGrad.addColorStop(1, '#020b18');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(globeX - globeRadius, globeY - globeRadius, globeRadius * 2, globeRadius * 2);

      // Helper for 3D Spherical Coordinate Projection
      const project3D = (latDeg: number, lonDeg: number) => {
        const lat = (latDeg * Math.PI) / 180;
        const lon = (lonDeg * Math.PI) / 180;

        // Relative longitude to camera yaw
        const relLon = lon - cam.yaw;

        // 3D vector rotation with pitch
        const x3D = Math.cos(lat) * Math.sin(relLon);
        const y3D = Math.sin(lat) * Math.cos(cam.pitch) - Math.cos(lat) * Math.sin(cam.pitch) * Math.cos(relLon);
        const z3D = Math.sin(lat) * Math.sin(cam.pitch) + Math.cos(lat) * Math.cos(cam.pitch) * Math.cos(relLon);

        return {
          x: globeX + x3D * globeRadius,
          y: globeY - y3D * globeRadius,
          visible: z3D > -0.1, // Front-facing hemisphere
          z: z3D,
        };
      };

      // 6. Draw Graticule Lines (Latitude & Longitude Grid)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 1;

      // Parallels (Latitudes)
      [-40, -20, 0, 20, 40].forEach((lat) => {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 5) {
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
        for (let lat = -80; lat <= 80; lat += 5) {
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

      // 7. Draw Indonesian Landmass Polygons (Sumatra, Kalimantan, Java, Sulawesi, Papua)
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
          ctx.fillStyle = 'rgba(6, 78, 59, 0.75)'; // Tropical forest green
          ctx.fill();
          ctx.strokeStyle = 'rgba(52, 211, 153, 0.6)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });

      // 8. Render Peatland Fire Hotspot Clusters with Dynamic Radiative Waves
      PEAT_HOTSPOTS.forEach((spot, i) => {
        const pt = project3D(spot.lat, spot.lon);
        if (pt.visible) {
          const pulse = (animationTime * 3 + i * 1.5) % 3;
          const waveRadius = 4 + pulse * 14;
          const waveAlpha = Math.max(0, 1 - pulse / 3);

          if (sensorMode === 'modis') {
            // MODIS 1km Footprint (Single broad infrared circle)
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, waveRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(234, 88, 12, ${waveAlpha * 0.9})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
            ctx.fillStyle = '#ea580c';
            ctx.fill();
          } else if (sensorMode === 'viirs') {
            // VIIRS 375m Multi-point split (5-9 points clustered)
            const offsets = [
              [0, 0], [4, -3], [-5, 3], [3, 4], [-4, -4], [6, 2], [-2, 6]
            ];
            offsets.forEach(([ox, oy]) => {
              ctx.beginPath();
              ctx.arc(pt.x + ox, pt.y + oy, 2.5, 0, Math.PI * 2);
              ctx.fillStyle = '#ef4444';
              ctx.fill();
            });

            ctx.beginPath();
            ctx.arc(pt.x, pt.y, waveRadius * 0.8, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(239, 68, 68, ${waveAlpha * 0.8})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          } else {
            // Harmonized 5.5km Equal-Area Hexagonal Mesh
            ctx.beginPath();
            for (let a = 0; a < 6; a++) {
              const angle = (a * Math.PI) / 3;
              const hx = pt.x + Math.cos(angle) * 12;
              const hy = pt.y + Math.sin(angle) * 12;
              if (a === 0) ctx.moveTo(hx, hy);
              else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.fillStyle = 'rgba(14, 165, 233, 0.35)';
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Core Stefan-Boltzmann Calibrated FRP Center
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#f59e0b';
            ctx.fill();
          }

          // Hotspot Target Reticle Label
          ctx.font = '9px monospace';
          ctx.fillStyle = '#f8fafc';
          ctx.fillText(spot.province, pt.x + 10, pt.y - 4);
        }
      });

      // Shading: Edge Darkening (Horizon Terminator)
      const edgeShade = ctx.createRadialGradient(
        globeX, globeY, globeRadius * 0.65,
        globeX, globeY, globeRadius
      );
      edgeShade.addColorStop(0, 'rgba(0, 0, 0, 0)');
      edgeShade.addColorStop(0.85, 'rgba(2, 6, 23, 0.45)');
      edgeShade.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
      ctx.fillStyle = edgeShade;
      ctx.fillRect(globeX - globeRadius, globeY - globeRadius, globeRadius * 2, globeRadius * 2);

      ctx.restore(); // Restore from globe clip

      // 9. Draw 3D Satellite Orbits & Laser Scanning Cones

      // Orbit 1: NASA Terra MODIS (Blue Orbit, Alt 705 km)
      const orbitTerraRadius = globeRadius * 1.42;
      const terraAngle = cam.orbitAngle * 1.6;
      const terraSatX = globeX + Math.cos(terraAngle) * orbitTerraRadius;
      const terraSatY = globeY + Math.sin(terraAngle) * (orbitTerraRadius * 0.38);

      // Orbit 2: Suomi-NPP VIIRS (Green Orbit, Alt 824 km)
      const orbitViirsRadius = globeRadius * 1.62;
      const viirsAngle = (cam.orbitAngle * 1.3) + Math.PI;
      const viirsSatX = globeX + Math.cos(viirsAngle) * orbitViirsRadius;
      const viirsSatY = globeY + Math.sin(viirsAngle) * (orbitViirsRadius * 0.45);

      // Render Orbit Paths
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.ellipse(globeX, globeY, orbitTerraRadius, orbitTerraRadius * 0.38, -0.2, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
      ctx.beginPath();
      ctx.ellipse(globeX, globeY, orbitViirsRadius, orbitViirsRadius * 0.45, 0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Volumetric Laser Sensor Beams to Indonesian Ground Target
      const targetPt = project3D(-1.5, 114.0); // Center Kalimantan Ground Target
      if (targetPt.visible) {
        // Terra Laser Cone
        ctx.beginPath();
        ctx.moveTo(terraSatX, terraSatY);
        ctx.lineTo(targetPt.x - 22, targetPt.y);
        ctx.lineTo(targetPt.x + 22, targetPt.y);
        ctx.closePath();
        const terraBeam = ctx.createLinearGradient(terraSatX, terraSatY, targetPt.x, targetPt.y);
        terraBeam.addColorStop(0, 'rgba(59, 130, 246, 0.6)');
        terraBeam.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
        ctx.fillStyle = terraBeam;
        ctx.fill();

        // VIIRS Laser Cone
        ctx.beginPath();
        ctx.moveTo(viirsSatX, viirsSatY);
        ctx.lineTo(targetPt.x - 14, targetPt.y + 6);
        ctx.lineTo(targetPt.x + 14, targetPt.y + 6);
        ctx.closePath();
        const viirsBeam = ctx.createLinearGradient(viirsSatX, viirsSatY, targetPt.x, targetPt.y);
        viirsBeam.addColorStop(0, 'rgba(16, 185, 129, 0.6)');
        viirsBeam.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
        ctx.fillStyle = viirsBeam;
        ctx.fill();
      }

      // Draw Satellite 1 (EOS-AM1 Terra)
      ctx.save();
      ctx.translate(terraSatX, terraSatY);
      // Satellite body
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(-6, -4, 12, 8);
      // Solar array wings
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-18, -2, 10, 4);
      ctx.fillRect(8, -2, 10, 4);
      // Glow halo
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.fill();
      ctx.restore();

      // Satellite 1 HUD Label
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('TERRA MODIS (1km) [705 km SSO]', terraSatX + 16, terraSatY - 4);

      // Draw Satellite 2 (Suomi-NPP VIIRS)
      ctx.save();
      ctx.translate(viirsSatX, viirsSatY);
      // Satellite body
      ctx.fillStyle = '#059669';
      ctx.fillRect(-5, -5, 10, 10);
      // Solar wings
      ctx.fillStyle = '#34d399';
      ctx.fillRect(-16, -2, 9, 4);
      ctx.fillRect(7, -2, 9, 4);
      // Glow halo
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(52, 211, 153, 0.25)';
      ctx.fill();
      ctx.restore();

      // Satellite 2 HUD Label
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#34d399';
      ctx.fillText('SUOMI-NPP VIIRS (375m) [824 km SSO]', viirsSatX + 16, viirsSatY - 4);

      // Request next animation frame
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, sensorMode, isWarping, warpFactor]);

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
    // Clamp pitch between -60° and +60°
    cameraRef.current.targetPitch = Math.max(-1.0, Math.min(1.0, cameraRef.current.targetPitch));
  };

  const handleMouseUp = () => {
    cameraRef.current.isDragging = false;
  };

  if (!isOpen) return null;

  const current = missionPhases[currentStage];

  const modalContent = (
    <div
      className="fixed inset-0 z-[100000] bg-[#020617] text-slate-100 flex flex-col font-sans select-none overflow-hidden animate-in fade-in duration-300"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* 3D WebGL / Canvas Space Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
      />

      {/* Top Aerospace Command Bar */}
      <header className="relative z-30 h-16 px-4 sm:px-8 flex items-center justify-between border-b border-slate-800/80 bg-[#060b18]/85 backdrop-blur-md">
        
        {/* Brand Lockup: NASA Insignia × Terra Harmonia */}
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
              MISSION TERMINAL: 26-YR INDONESIAN PEATLAND SATELLITE CLIMATOLOGY
            </p>
          </div>
        </div>

        {/* Top Right Mission Control Tools */}
        <div className="flex items-center gap-2.5">
          
          {/* Sound Synthesizer Audio Toggle */}
          <button
            onClick={() => {
              const next = !isAudioEnabled;
              setIsAudioEnabled(next);
              if (next) playTelemetryBeep(660, 'sine', 0.1);
            }}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition cursor-pointer text-xs"
            title={isAudioEnabled ? 'Mute Audio' : 'Enable Mission Sound'}
          >
            {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5 text-blue-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {/* Auto-Play Toggle */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            disabled={isWarping}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition cursor-pointer text-xs flex items-center gap-1.5"
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5 text-blue-400" /> : <Play className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline font-medium text-[11px]">{isAutoPlaying ? 'Auto' : 'Paused'}</span>
          </button>

          {/* Bilingual Switcher */}
          <div className="flex items-center bg-slate-900/90 rounded-xl p-0.5 border border-slate-700/80 text-xs font-semibold">
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

          {/* Quick Platform Launch Button */}
          <button
            onClick={triggerLaunchWarp}
            disabled={isWarping}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0b3d91] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all border border-blue-500/40 shadow-lg shadow-blue-950/60 cursor-pointer shrink-0"
          >
            <span>{language === 'id' ? 'Buka Platform' : 'Engage Mission'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </header>

      {/* Floating HUD Viewport (Top Left Overlay) */}
      <div className="relative z-20 pointer-events-none p-4 sm:p-8 flex flex-col justify-between flex-1">
        
        {/* Top HUD Mission Card */}
        <div className="max-w-xl bg-[#040916]/85 backdrop-blur-md border border-slate-800/90 p-5 rounded-2xl shadow-2xl space-y-3 pointer-events-auto">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-blue-400 px-2 py-0.5 rounded bg-blue-950 border border-blue-800/80">
                PHASE {current.phaseNum}
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-slate-300">
                {current.codeName}
              </span>
            </div>
            
            {/* Live Sensor View Selector */}
            <div className="flex items-center gap-1 bg-slate-950/90 rounded-lg p-0.5 border border-slate-800 text-[10px] font-mono">
              <button
                onClick={() => setSensorMode('modis')}
                className={`px-2 py-0.5 rounded cursor-pointer transition ${sensorMode === 'modis' ? 'bg-orange-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                MODIS
              </button>
              <button
                onClick={() => setSensorMode('viirs')}
                className={`px-2 py-0.5 rounded cursor-pointer transition ${sensorMode === 'viirs' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                VIIRS
              </button>
              <button
                onClick={() => setSensorMode('harmonized')}
                className={`px-2 py-0.5 rounded cursor-pointer transition ${sensorMode === 'harmonized' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                5.5km Grid
              </button>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
            {language === 'id' ? current.titleId : current.titleEn}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {language === 'id' ? current.taglineId : current.taglineEn}
          </p>

          {/* Key Metric Chips */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {current.stats.map((stat, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block truncate">
                  {language === 'id' ? stat.labelId : stat.labelEn}
                </span>
                <span className="text-xs sm:text-sm font-black text-white font-mono block mt-0.5 truncate">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Live Telemetry Stream Bar */}
          <div className="p-2 rounded-lg bg-slate-950/90 border border-slate-800 text-[10.5px] font-mono text-emerald-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">
              {language === 'id' ? current.telemetryLogId : current.telemetryLogEn}
            </span>
          </div>

        </div>

        {/* Floating Right HUD: Live Orbital Coordinates & Sensor Telemetry */}
        <div className="self-end max-w-xs bg-[#040916]/80 backdrop-blur-md border border-slate-800/80 p-3 rounded-xl shadow-xl space-y-1 text-[10px] font-mono text-slate-400 hidden md:block">
          <div className="flex justify-between text-slate-300 font-bold border-b border-slate-800 pb-1">
            <span>TARGET TELEMETRY</span>
            <span className="text-emerald-400">EOS-AM1 SYNC</span>
          </div>
          <div className="flex justify-between">
            <span>COORDINATES:</span>
            <span className="text-white">0.7893° S, 113.9213° E</span>
          </div>
          <div className="flex justify-between">
            <span>PEAT REGION:</span>
            <span className="text-white">KALIMANTAN & SUMATRA</span>
          </div>
          <div className="flex justify-between">
            <span>BRGM TMAG LEVEL:</span>
            <span className="text-red-400">-48 cm (CRITICAL)</span>
          </div>
          <div className="flex justify-between">
            <span>FRP RADIANT FLUX:</span>
            <span className="text-amber-400">342 MW (STEFAN-BOLTZMANN)</span>
          </div>
          <div className="text-[8.5px] text-slate-500 pt-0.5">
            [DRAG ORBIT TO ROTATE GLOBE 360°]
          </div>
        </div>

      </div>

      {/* Bottom Mission Flight Console & Scrubber */}
      <footer className="relative z-30 px-4 sm:px-8 py-3.5 border-t border-slate-800/80 bg-[#060b18]/95 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Phase Buttons (01 - 04) */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {missionPhases.map((phase, idx) => {
            const isActive = idx === currentStage;
            return (
              <button
                key={phase.id}
                onClick={() => handleSelectStage(idx)}
                disabled={isWarping}
                className={`flex-1 sm:flex-initial px-3 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#0b3d91] text-white border border-blue-400 shadow-md shadow-blue-950'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{phase.phaseNum}</span>
                <span className="hidden lg:inline text-[11px] font-sans font-medium">
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

        {/* Progress Timeline Scrubber */}
        <div className="flex items-center gap-3 w-full sm:w-72">
          <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-slate-400 shrink-0">
            {currentStage + 1} / {missionPhases.length}
          </span>
        </div>

      </footer>

      {/* Supersonic Launch Warp Overlay */}
      {isWarping && (
        <div className="absolute inset-0 z-50 bg-[#020617]/90 flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-200">
          <div className="relative z-10 flex flex-col items-center space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-full bg-[#0b3d91] border-2 border-blue-400 flex items-center justify-center shadow-2xl shadow-blue-500/50 animate-pulse">
              <Crosshair className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                {language === 'id' ? 'KUNCI TELEMETRI AKTIF' : 'TELEMETRY LOCKED: INDONESIA EQUATORIAL GRID'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-mono">
                {language === 'id' ? 'MEMASUKI SISTEM TERRA HARMONIA...' : 'ENTERING TERRA HARMONIA ENGINE...'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                COORD: 0.7893° S, 113.9213° E // 26-YEAR CLIMATOLOGY READY
              </p>
            </div>

            <div className="w-64 h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-75"
                style={{ width: `${warpFactor}%` }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );

  return createPortal(modalContent, document.body);
};
