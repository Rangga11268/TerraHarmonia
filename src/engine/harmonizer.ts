export interface RawHotspot {
  id: string;
  lat: number;
  lon: number;
  date: string; // YYYY-MM-DD
  time: string; // HHMM
  satellite: 'Terra' | 'Aqua' | 'Suomi-NPP' | 'NOAA-20';
  instrument: 'MODIS' | 'VIIRS';
  confidence: number;
  frp: number; // Fire Radiative Power in Megawatts
  brightness: number; // Kelvin
  aoiId: string;
}

export interface HarmonizedWeekData {
  year: number;
  week: number;
  month: number;
  rawModisCount: number;
  rawViirsCount: number;
  rawTotalCount: number;
  harmonizedClusterCount: number;
  totalFrpRaw: number;
  totalFrpCalibrated: number;
  burningActivityIndex: number;
  zScore: number;
  isCriticalPeriod: boolean;
  isUnusualCondition: boolean;
  dominantSensor: 'MODIS' | 'VIIRS' | 'Blended';
}

export interface AOIRegion {
  id: string;
  name: string;
  country: string;
  bbox: [number, number, number, number]; // [minLat, minLon, maxLat, maxLon]
  center: [number, number];
  zoom: number;
  description: string;
  biome: string;
}

/**
 * Indonesia AOIs: National Overview + 5 Major Peatland & Fire-Prone Provinces.
 * Coordinates verified against NASA FIRMS satellite archives.
 */
export const PRESET_AOIS: AOIRegion[] = [
  {
    id: 'indonesia',
    name: 'Seluruh Indonesia (National Peatlands & Forests)',
    country: 'Indonesia',
    bbox: [-11.0, 95.0, 6.0, 141.0],
    center: [-2.2, 115.5],
    zoom: 5,
    description: 'Pemantauan komposit nasional mencakup seluruh ekosistem gambut dan hutan rawan kebakaran di Sumatera, Kalimantan, Papua, dan Sulawesi.',
    biome: 'National Peatland & Forest Ecosystems (14.9 Mha)'
  },
  {
    id: 'riau',
    name: 'Riau & Sumatra Peatlands',
    country: 'Indonesia',
    bbox: [-0.8, 100.5, 2.1, 103.2],
    center: [0.6, 101.8],
    zoom: 8,
    description: 'Zona kerentanan gambut dalam (Semenanjung Kampar, Siak, Pelalawan) rawan kebakaran bawah tanah dan kabut asap lintas batas.',
    biome: 'Tropical Peat Swamp Forest'
  },
  {
    id: 'kalteng',
    name: 'Kalimantan Tengah (Ex-PLG Mega Rice)',
    country: 'Indonesia',
    bbox: [-3.5, 111.0, -0.5, 115.0],
    center: [-2.0, 113.0],
    zoom: 7,
    description: 'Wilayah eks-Proyek Lahan Gambut (PLG) 1 Juta Hektar dan TN Sebangau dengan frekuensi kebakaran gambut berulang tertinggi di dunia.',
    biome: 'Degraded Peat & Tropical Forest'
  },
  {
    id: 'sumsel',
    name: 'Sumatera Selatan (OKI & Musi Banyuasin)',
    country: 'Indonesia',
    bbox: [-4.5, 104.0, -2.0, 107.5],
    center: [-3.2, 105.8],
    zoom: 8,
    description: 'Kubah gambut Ogan Komering Ilir (OKI) dan Musi Banyuasin dengan titik api intensitas tinggi saat anomali El Niño.',
    biome: 'Tropical Peat Swamp Forest'
  },
  {
    id: 'kalsel',
    name: 'Kalimantan Selatan (Banjar & Barito)',
    country: 'Indonesia',
    bbox: [-4.2, 114.5, -1.8, 116.8],
    center: [-3.0, 115.5],
    zoom: 8,
    description: 'Kawasan gambut dataran rendah dan hutan sekunder rentan kebakaran musim kemarau di koridor Banjar dan Barito Kuala.',
    biome: 'Lowland Dipterocarp & Peat Forest'
  },
  {
    id: 'kaltim',
    name: 'Kalimantan Timur (Hutan Kering & Transisi)',
    country: 'Indonesia',
    bbox: [-2.5, 115.0, 1.5, 118.5],
    center: [-0.5, 116.8],
    zoom: 7,
    description: 'Hutan tropis daratan kering dengan lonjakan kebakaran tajam dipicu kemarau panjang El Niño (Kutai dan Berau).',
    biome: 'Mixed Dipterocarp Forest'
  },
];

/**
 * ISO 8601 Week Number Calculator
 */
export function getWeekNumber(d: Date): [number, number] {
  const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNr = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const firstThursday = target.getTime();
  target.setUTCMonth(0, 1);
  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7);
  }
  const week = 1 + Math.ceil((firstThursday - target.getTime()) / 604800000);
  return [target.getUTCFullYear(), Math.min(52, Math.max(1, week))];
}

/**
 * Spatial Grid Resolution: 0.05 degrees (~5.5 km at equator).
 */
const GRID_SIZE_DEG = 0.05;

function getSpatialGridKey(lat: number, lon: number): string {
  const latBin = Math.floor(lat / GRID_SIZE_DEG);
  const lonBin = Math.floor(lon / GRID_SIZE_DEG);
  return `${latBin}_${lonBin}`;
}

/**
 * Cross-Sensor Calibration Weights for FRP.
 */
const SENSOR_FRP_CALIBRATION: Record<'MODIS' | 'VIIRS', number> = {
  MODIS: 1.04,
  VIIRS: 0.88,
};

export interface HarmonizationOutput {
  calendarMatrix: Record<string, HarmonizedWeekData>;
  yearlyAverages: Record<number, { raw: number; harmonized: number; frp: number }>;
  weeklyBaselines: Record<number, { mean: number; stdDev: number; isCritical: boolean }>;
}

export function harmonizeHotspots(rawHotspots: RawHotspot[]): HarmonizationOutput {
  const weeklyBuckets: Record<string, RawHotspot[]> = {};

  for (let y = 2000; y <= 2026; y++) {
    for (let w = 1; w <= 52; w++) {
      weeklyBuckets[`${y}-${w}`] = [];
    }
  }

  for (const spot of rawHotspots) {
    const d = new Date(spot.date);
    if (isNaN(d.getTime())) continue;
    const [year, week] = getWeekNumber(d);
    if (year >= 2000 && year <= 2026 && week >= 1 && week <= 52) {
      const key = `${year}-${week}`;
      if (!weeklyBuckets[key]) weeklyBuckets[key] = [];
      weeklyBuckets[key].push(spot);
    }
  }

  const calendarMatrix: Record<string, HarmonizedWeekData> = {};
  const yearlyAverages: Record<number, { raw: number; harmonized: number; frp: number }> = {};
  const weekHistory: Record<number, number[]> = {};

  for (let w = 1; w <= 52; w++) weekHistory[w] = [];

  for (let year = 2000; year <= 2026; year++) {
    yearlyAverages[year] = { raw: 0, harmonized: 0, frp: 0 };

    for (let week = 1; week <= 52; week++) {
      const key = `${year}-${week}`;
      const spots = weeklyBuckets[key] || [];

      let rawModis = 0;
      let rawViirs = 0;
      let totalFrpRaw = 0;
      let totalFrpCalibrated = 0;

      const activeSpatialGrids = new Set<string>();

      for (const spot of spots) {
        if (spot.instrument === 'MODIS') rawModis++;
        else rawViirs++;

        totalFrpRaw += spot.frp;
        const weight = SENSOR_FRP_CALIBRATION[spot.instrument] || 1.0;
        totalFrpCalibrated += spot.frp * weight;

        activeSpatialGrids.add(getSpatialGridKey(spot.lat, spot.lon));
      }

      const rawTotal = rawModis + rawViirs;
      const harmonizedClusterCount = activeSpatialGrids.size;

      const spatialComponent = Math.min(60, harmonizedClusterCount * 1.85);
      const energyComponent = Math.min(40, (totalFrpCalibrated / 1500) * 40);
      const burningActivityIndex = Math.min(100, Math.round(spatialComponent + energyComponent));

      let dominantSensor: 'MODIS' | 'VIIRS' | 'Blended' = 'MODIS';
      if (rawModis > 0 && rawViirs > 0) dominantSensor = 'Blended';
      else if (rawViirs > 0) dominantSensor = 'VIIRS';

      const month = Math.min(12, Math.max(1, Math.floor((week - 1) / 4.33) + 1));

      calendarMatrix[key] = {
        year,
        week,
        month,
        rawModisCount: rawModis,
        rawViirsCount: rawViirs,
        rawTotalCount: rawTotal,
        harmonizedClusterCount,
        totalFrpRaw: Math.round(totalFrpRaw),
        totalFrpCalibrated: Math.round(totalFrpCalibrated),
        burningActivityIndex,
        zScore: 0,
        isCriticalPeriod: false,
        isUnusualCondition: false,
        dominantSensor,
      };

      weekHistory[week].push(burningActivityIndex);
      yearlyAverages[year].raw += rawTotal;
      yearlyAverages[year].harmonized += harmonizedClusterCount;
      yearlyAverages[year].frp += totalFrpCalibrated;
    }
  }

  const weeklyBaselines: Record<number, { mean: number; stdDev: number; isCritical: boolean }> = {};

  for (let w = 1; w <= 52; w++) {
    const scores = weekHistory[w];
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance) || 1.0;

    const isCritical = mean > 20 || (w >= 30 && w <= 42);
    weeklyBaselines[w] = { mean, stdDev, isCritical };
  }

  for (const data of Object.values(calendarMatrix)) {
    const baseline = weeklyBaselines[data.week];
    if (baseline) {
      data.zScore = (data.burningActivityIndex - baseline.mean) / baseline.stdDev;
      data.isCriticalPeriod = baseline.isCritical;
      data.isUnusualCondition = data.zScore >= 2.0 && data.burningActivityIndex > 25;
    }
  }

  return { calendarMatrix, yearlyAverages, weeklyBaselines };
}
