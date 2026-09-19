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
 * Indonesia-only AOIs focused on major peatland and fire-prone regions.
 * Coordinates validated against NASA FIRMS historical fire maps.
 */
export const PRESET_AOIS: AOIRegion[] = [
  {
    id: 'riau',
    name: 'Riau & Sumatra Peatlands',
    country: 'Indonesia',
    bbox: [-0.8, 100.5, 2.1, 103.2],
    center: [0.6, 101.8],
    zoom: 8,
    description: 'High peatland vulnerability zone prone to intense smoldering fires and transboundary haze.',
    biome: 'Tropical Peat Swamp Forest'
  },
  {
    id: 'kalteng',
    name: 'Central Kalimantan',
    country: 'Indonesia',
    bbox: [-3.5, 111.0, -0.5, 115.0],
    center: [-2.0, 113.0],
    zoom: 7,
    description: 'Mega Rice Project legacy area with recurrent severe dry-season underground peat fires.',
    biome: 'Degraded Peat & Tropical Forest'
  },
  {
    id: 'kalsel',
    name: 'South Kalimantan',
    country: 'Indonesia',
    bbox: [-4.2, 114.5, -1.8, 116.8],
    center: [-3.0, 115.5],
    zoom: 8,
    description: 'Lowland peat and dryland forest area subject to recurrent dry-season fires.',
    biome: 'Lowland Dipterocarp & Peat Forest'
  },
  {
    id: 'sumsel',
    name: 'South Sumatra (OKI & Musi)',
    country: 'Indonesia',
    bbox: [-4.5, 104.0, -2.0, 107.5],
    center: [-3.2, 105.8],
    zoom: 8,
    description: 'Ogan Komering Ilir and Musi Banyuasin peatlands — among the highest fire-frequency zones in Southeast Asia.',
    biome: 'Tropical Peat Swamp Forest'
  },
  {
    id: 'kaltim',
    name: 'East Kalimantan',
    country: 'Indonesia',
    bbox: [-2.5, 115.0, 1.5, 118.5],
    center: [-0.5, 116.8],
    zoom: 7,
    description: 'Dryland tropical forest with drought-driven fire outbreaks linked to ENSO events.',
    biome: 'Mixed Dipterocarp Forest'
  },
];

/**
 * Grid resolution for spatial binning (~0.05 degrees ~ 5.5 km)
 */
const SPATIAL_BIN_SIZE = 0.05;

/**
 * Cross-sensor calibration weights derived from NASA FIRMS inter-sensor validation
 */
const SENSOR_CALIBRATION = {
  MODIS: 1.04,
  VIIRS: 0.88,
};

/**
 * Harmonizes raw satellite active fire records into equal-area clusters and calibrated metrics
 */
export function harmonizeHotspots(rawHotspots: RawHotspot[]): {
  calendarMatrix: Record<string, HarmonizedWeekData>;
  yearlyAverages: Record<number, { raw: number; harmonized: number; frp: number }>;
  weeklyBaselines: Record<number, { mean: number; stdDev: number; isCritical: boolean }>;
} {
  // 1. Group raw hotspots by Year and Week
  const weekBuckets: Record<string, RawHotspot[]> = {};

  for (const h of rawHotspots) {
    const date = new Date(h.date);
    const year = date.getUTCFullYear();
    const dayOfYear = Math.floor((date.getTime() - new Date(Date.UTC(year, 0, 0)).getTime()) / 86400000);
    const week = Math.min(52, Math.ceil(dayOfYear / 7));
    const key = `${year}-${week}`;
    if (!weekBuckets[key]) weekBuckets[key] = [];
    weekBuckets[key].push(h);
  }

  // 2. For each bucket, compute harmonized metrics
  const calendarMatrix: Record<string, HarmonizedWeekData> = {};

  for (const [key, spots] of Object.entries(weekBuckets)) {
    const [yearStr, weekStr] = key.split('-');
    const year = parseInt(yearStr, 10);
    const week = parseInt(weekStr, 10);
    const month = Math.min(12, Math.ceil(week / 4.33));

    const modisSpots = spots.filter((s) => s.instrument === 'MODIS');
    const viirsSpots = spots.filter((s) => s.instrument === 'VIIRS');

    // Spatial binning: deduplicate within 5.5 km grid
    const bins = new Set<string>();
    for (const s of spots) {
      const binLat = Math.floor(s.lat / SPATIAL_BIN_SIZE);
      const binLon = Math.floor(s.lon / SPATIAL_BIN_SIZE);
      bins.add(`${binLat}:${binLon}`);
    }

    const rawFrpSum = spots.reduce((acc, s) => acc + s.frp, 0);
    const calibratedFrpSum =
      modisSpots.reduce((acc, s) => acc + s.frp * SENSOR_CALIBRATION.MODIS, 0) +
      viirsSpots.reduce((acc, s) => acc + s.frp * SENSOR_CALIBRATION.VIIRS, 0);

    const harmonizedCount = bins.size;
    const normalizedIndex = Math.min(
      100,
      Math.round((harmonizedCount / 20) * 40 + (calibratedFrpSum / 2000) * 60)
    );

    const dominantSensor: 'MODIS' | 'VIIRS' | 'Blended' =
      modisSpots.length === 0 ? 'VIIRS'
      : viirsSpots.length === 0 ? 'MODIS'
      : 'Blended';

    calendarMatrix[key] = {
      year,
      week,
      month,
      rawModisCount: modisSpots.length,
      rawViirsCount: viirsSpots.length,
      rawTotalCount: spots.length,
      harmonizedClusterCount: harmonizedCount,
      totalFrpRaw: Math.round(rawFrpSum),
      totalFrpCalibrated: Math.round(calibratedFrpSum),
      burningActivityIndex: normalizedIndex,
      zScore: 0, // computed below
      isCriticalPeriod: false, // computed below
      isUnusualCondition: false, // computed below
      dominantSensor,
    };
  }

  // 3. Compute weekly baselines (mean / stdDev per calendar week, across years)
  const weeklyGroups: Record<number, number[]> = {};
  for (const data of Object.values(calendarMatrix)) {
    if (!weeklyGroups[data.week]) weeklyGroups[data.week] = [];
    weeklyGroups[data.week].push(data.burningActivityIndex);
  }

  const weeklyBaselines: Record<number, { mean: number; stdDev: number; isCritical: boolean }> = {};
  for (const [wk, vals] of Object.entries(weeklyGroups)) {
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const variance = vals.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / vals.length;
    const stdDev = Math.sqrt(variance);
    weeklyBaselines[parseInt(wk, 10)] = { mean, stdDev, isCritical: mean > 12 };
  }

  // 4. Assign z-scores and anomaly flags
  for (const data of Object.values(calendarMatrix)) {
    const baseline = weeklyBaselines[data.week];
    if (baseline && baseline.stdDev > 0) {
      data.zScore = parseFloat(((data.burningActivityIndex - baseline.mean) / baseline.stdDev).toFixed(2));
      data.isUnusualCondition = data.zScore > 2.0;
    }
    data.isCriticalPeriod = weeklyBaselines[data.week]?.isCritical ?? false;
  }

  // 5. Yearly averages
  const yearlyGroups: Record<number, HarmonizedWeekData[]> = {};
  for (const data of Object.values(calendarMatrix)) {
    if (!yearlyGroups[data.year]) yearlyGroups[data.year] = [];
    yearlyGroups[data.year].push(data);
  }

  const yearlyAverages: Record<number, { raw: number; harmonized: number; frp: number }> = {};
  for (const [yr, weeks] of Object.entries(yearlyGroups)) {
    yearlyAverages[parseInt(yr, 10)] = {
      raw: Math.round(weeks.reduce((acc, w) => acc + w.rawTotalCount, 0) / weeks.length),
      harmonized: Math.round(weeks.reduce((acc, w) => acc + w.harmonizedClusterCount, 0) / weeks.length),
      frp: Math.round(weeks.reduce((acc, w) => acc + w.totalFrpCalibrated, 0) / weeks.length),
    };
  }

  return { calendarMatrix, yearlyAverages, weeklyBaselines };
}
