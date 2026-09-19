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

export const PRESET_AOIS: AOIRegion[] = [
  {
    id: 'riau',
    name: 'Riau & Sumatra Peatlands',
    country: 'Indonesia',
    bbox: [-0.8, 100.5, 2.1, 103.2],
    center: [0.5, 101.8],
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
    description: 'Mega Rice Project legacy area with recurrent severe dry-season underground fires.',
    biome: 'Degraded Peat & Tropical Forest'
  },
  {
    id: 'amazon',
    name: 'Southern Amazon Arc',
    country: 'Brazil',
    bbox: [-12.0, -56.0, -8.0, -51.0],
    center: [-10.0, -53.5],
    zoom: 7,
    description: 'Deforestation frontier known as the Arc of Deforestation with agricultural burning.',
    biome: 'Amazonian Moist Forest'
  },
  {
    id: 'california',
    name: 'Sierra Nevada / North California',
    country: 'United States',
    bbox: [37.5, -122.5, 41.0, -119.5],
    center: [39.2, -121.0],
    zoom: 7,
    description: 'Temperate forest belt subject to climate-driven high-severity conflagrations.',
    biome: 'Mediterranean Mixed Conifer'
  },
  {
    id: 'newsouthwales',
    name: 'New South Wales Coastal Bush',
    country: 'Australia',
    bbox: [-36.5, 148.5, -31.5, 153.0],
    center: [-34.0, 150.8],
    zoom: 7,
    description: 'Black Summer mega-fire region characterized by pyrocumulonimbus thunderstorm fires.',
    biome: 'Eucalyptus Woodlands'
  }
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
    const d = new Date(h.date);
    const year = d.getUTCFullYear();
    const week = getISOWeek(d);
    const key = `${year}-${week}`;

    if (!weekBuckets[key]) {
      weekBuckets[key] = [];
    }
    weekBuckets[key].push(h);
  }

  // 2. Perform spatial clustering & FRP calibration per week
  const preliminaryData: Record<string, HarmonizedWeekData> = {};

  for (let year = 2000; year <= 2026; year++) {
    for (let week = 1; week <= 52; week++) {
      const key = `${year}-${week}`;
      const spots = weekBuckets[key] || [];

      let rawModis = 0;
      let rawViirs = 0;
      let rawFrpSum = 0;
      let calibratedFrpSum = 0;

      // Spatial bin set for deduplicating overlapping detections in 5.5km grid
      const occupiedBins = new Set<string>();

      for (const s of spots) {
        if (s.instrument === 'MODIS') rawModis++;
        else rawViirs++;

        rawFrpSum += s.frp;
        const calWeight = s.instrument === 'VIIRS' ? SENSOR_CALIBRATION.VIIRS : SENSOR_CALIBRATION.MODIS;
        calibratedFrpSum += s.frp * calWeight;

        // Spatial key rounded to bin size
        const bLat = Math.floor(s.lat / SPATIAL_BIN_SIZE);
        const bLon = Math.floor(s.lon / SPATIAL_BIN_SIZE);
        occupiedBins.add(`${bLat},${bLon}`);
      }

      const clusterCount = occupiedBins.size;
      const rawTotal = rawModis + rawViirs;

      // Harmonized Burning Activity Index (0 to 100)
      // Combines cluster area coverage + calibrated thermal energy
      const rawScore = clusterCount > 0 
        ? Math.log1p(calibratedFrpSum) * 3.8 + clusterCount * 0.85
        : 0;
      const burningActivityIndex = Math.min(100, Math.round(rawScore * 10) / 10);

      const dominantSensor: 'MODIS' | 'VIIRS' | 'Blended' =
        rawModis > 0 && rawViirs > 0 ? 'Blended' :
        rawViirs > 0 ? 'VIIRS' : 'MODIS';

      const month = Math.min(12, Math.max(1, Math.floor((week - 1) / 4.33) + 1));

      preliminaryData[key] = {
        year,
        week,
        month,
        rawModisCount: rawModis,
        rawViirsCount: rawViirs,
        rawTotalCount: rawTotal,
        harmonizedClusterCount: clusterCount,
        totalFrpRaw: Math.round(rawFrpSum),
        totalFrpCalibrated: Math.round(calibratedFrpSum),
        burningActivityIndex,
        zScore: 0,
        isCriticalPeriod: false,
        isUnusualCondition: false,
        dominantSensor
      };
    }
  }

  // 3. Compute 20-Year Baseline (2000 - 2020) for each of the 52 weeks
  const weeklyBaselines: Record<number, { mean: number; stdDev: number; isCritical: boolean }> = {};
  const allWeekAverages: number[] = [];

  for (let week = 1; week <= 52; week++) {
    const baselineScores: number[] = [];
    for (let year = 2000; year <= 2020; year++) {
      const key = `${year}-${week}`;
      if (preliminaryData[key]) {
        baselineScores.push(preliminaryData[key].burningActivityIndex);
      }
    }

    const n = baselineScores.length || 1;
    const mean = baselineScores.reduce((a, b) => a + b, 0) / n;
    const variance = baselineScores.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance) || 1.0;

    weeklyBaselines[week] = { mean, stdDev, isCritical: false };
    allWeekAverages.push(mean);
  }

  // Determine critical burning periods (top 25th percentile of seasonal averages)
  const sortedAvg = [...allWeekAverages].sort((a, b) => a - b);
  const criticalThreshold = sortedAvg[Math.floor(sortedAvg.length * 0.75)] || 15;

  for (let week = 1; week <= 52; week++) {
    if (weeklyBaselines[week].mean >= criticalThreshold && weeklyBaselines[week].mean > 8) {
      weeklyBaselines[week].isCritical = true;
    }
  }

  // 4. Calculate Z-Scores and anomaly flags
  const calendarMatrix: Record<string, HarmonizedWeekData> = {};
  const yearlyAverages: Record<number, { raw: number; harmonized: number; frp: number }> = {};

  for (let year = 2000; year <= 2026; year++) {
    let yearRaw = 0;
    let yearHarmonized = 0;
    let yearFrp = 0;

    for (let week = 1; week <= 52; week++) {
      const key = `${year}-${week}`;
      const item = preliminaryData[key];
      const baseline = weeklyBaselines[week];

      const zScore = (item.burningActivityIndex - baseline.mean) / (baseline.stdDev || 1);
      const isUnusual = zScore >= 2.0 && item.burningActivityIndex > 15;

      calendarMatrix[key] = {
        ...item,
        zScore: Math.round(zScore * 100) / 100,
        isCriticalPeriod: baseline.isCritical,
        isUnusualCondition: isUnusual
      };

      yearRaw += item.rawTotalCount;
      yearHarmonized += item.harmonizedClusterCount;
      yearFrp += item.totalFrpCalibrated;
    }

    yearlyAverages[year] = {
      raw: yearRaw,
      harmonized: yearHarmonized,
      frp: yearFrp
    };
  }

  return {
    calendarMatrix,
    yearlyAverages,
    weeklyBaselines
  };
}

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
