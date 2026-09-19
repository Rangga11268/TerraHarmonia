import { RawHotspot, PRESET_AOIS, AOIRegion } from '../engine/harmonizer';

// Deterministic Pseudo-Random Generator (seeded)
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Generates realistic historical active fire records (2000 - 2026)
 * honoring sensor launch dates:
 * - MODIS Terra: 2000+
 * - MODIS Aqua: 2002+
 * - VIIRS Suomi-NPP: 2012+
 * - VIIRS NOAA-20: 2018+
 */
export function generateHistoricalFireData(): Record<string, RawHotspot[]> {
  const dataset: Record<string, RawHotspot[]> = {};

  for (const aoi of PRESET_AOIS) {
    dataset[aoi.id] = generateAOIData(aoi);
  }

  return dataset;
}

function generateAOIData(aoi: AOIRegion): RawHotspot[] {
  const hotspots: RawHotspot[] = [];
  let idCounter = 1;

  for (let year = 2000; year <= 2026; year++) {
    // Determine climate drivers (e.g. El Niño mega-fire years)
    let climateMultiplier = 1.0;
    if (aoi.country === 'Indonesia') {
      if (year === 2006) climateMultiplier = 2.4;
      if (year === 2015) climateMultiplier = 4.2; // Massive 2015 El Nino peat fires
      if (year === 2019) climateMultiplier = 3.3; // 2019 Southeast Asia haze
      if (year === 2023) climateMultiplier = 2.1;
      if (year === 2024) climateMultiplier = 1.8;
      if (year === 2010 || year === 2016) climateMultiplier = 0.4; // La Nina wet years
    } else if (aoi.id === 'california') {
      if (year === 2017) climateMultiplier = 2.5;
      if (year === 2018) climateMultiplier = 3.6; // Camp Fire / Mendocino
      if (year === 2020) climateMultiplier = 4.5; // Gigafire year
      if (year === 2021) climateMultiplier = 3.2; // Dixie Fire
    } else if (aoi.id === 'newsouthwales') {
      if (year === 2019 || year === 2020) climateMultiplier = 4.8; // Black Summer
    } else if (aoi.id === 'amazon') {
      if (year === 2005 || year === 2010 || year === 2019 || year === 2020) climateMultiplier = 2.8;
    }

    for (let month = 1; month <= 12; month++) {
      // Seasonal factor (Dry season vs Wet season)
      let seasonalFactor = 0.1;

      if (aoi.country === 'Indonesia') {
        // Peak dry season: July (7) to October (10)
        if (month >= 7 && month <= 10) {
          seasonalFactor = month === 8 || month === 9 ? 1.0 : 0.65;
        } else if (month === 2 || month === 3) {
          seasonalFactor = 0.35; // Riau secondary dry season
        }
      } else if (aoi.id === 'california') {
        // Peak California wildfire: July to November
        if (month >= 7 && month <= 11) {
          seasonalFactor = month >= 8 && month <= 10 ? 1.0 : 0.6;
        }
      } else if (aoi.id === 'newsouthwales') {
        // Australian summer: December to February
        if (month === 12 || month === 1 || month === 2) seasonalFactor = 1.0;
        else if (month === 11 || month === 3) seasonalFactor = 0.45;
      } else if (aoi.id === 'amazon') {
        if (month >= 7 && month <= 10) seasonalFactor = 1.0;
      }

      // Base events in this month
      const baseEvents = Math.round(12 * seasonalFactor * climateMultiplier);
      if (baseEvents <= 0) continue;

      for (let e = 0; e < baseEvents; e++) {
        const seed = year * 10000 + month * 100 + e;
        const day = 1 + Math.floor(pseudoRandom(seed) * 27);
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // Cluster center coordinate inside AOI bounding box
        const [minLat, minLon, maxLat, maxLon] = aoi.bbox;
        const cLat = minLat + pseudoRandom(seed + 1) * (maxLat - minLat);
        const cLon = minLon + pseudoRandom(seed + 2) * (maxLon - minLon);

        const baseFRP = 15 + pseudoRandom(seed + 3) * 65 * climateMultiplier;

        // 1. MODIS Detection (Available 2000+)
        if (year >= 2000) {
          const modisSat = (year >= 2002 && pseudoRandom(seed + 4) > 0.5) ? 'Aqua' : 'Terra';
          hotspots.push({
            id: `MODIS-${idCounter++}`,
            lat: cLat + (pseudoRandom(seed + 5) - 0.5) * 0.02,
            lon: cLon + (pseudoRandom(seed + 6) - 0.5) * 0.02,
            date: dateStr,
            time: '0430',
            satellite: modisSat,
            instrument: 'MODIS',
            confidence: 60 + Math.round(pseudoRandom(seed + 7) * 40),
            frp: Math.round(baseFRP),
            brightness: 310 + Math.round(pseudoRandom(seed + 8) * 60),
            aoiId: aoi.id
          });
        }

        // 2. VIIRS Detections (Available 2012+)
        // Because of 375m resolution, one MODIS event generates 2 to 6 VIIRS pixel hits!
        if (year >= 2012) {
          const viirsCount = 2 + Math.floor(pseudoRandom(seed + 9) * 4);
          const viirsSat = (year >= 2018 && pseudoRandom(seed + 10) > 0.5) ? 'NOAA-20' : 'Suomi-NPP';

          for (let v = 0; v < viirsCount; v++) {
            const vSeed = seed + 50 + v * 7;
            hotspots.push({
              id: `VIIRS-${idCounter++}`,
              lat: cLat + (pseudoRandom(vSeed + 1) - 0.5) * 0.015,
              lon: cLon + (pseudoRandom(vSeed + 2) - 0.5) * 0.015,
              date: dateStr,
              time: '0615',
              satellite: viirsSat,
              instrument: 'VIIRS',
              confidence: 70 + Math.round(pseudoRandom(vSeed + 3) * 30),
              frp: Math.round((baseFRP / viirsCount) * (0.8 + pseudoRandom(vSeed + 4) * 0.4)),
              brightness: 315 + Math.round(pseudoRandom(vSeed + 5) * 65),
              aoiId: aoi.id
            });
          }
        }
      }
    }
  }

  return hotspots;
}
