import { RawHotspot, PRESET_AOIS, AOIRegion } from '../engine/harmonizer';

// Deterministic pseudo-random generator
function pr(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

/**
 * Peatland fire cluster coordinates per AOI (NASA FIRMS historical ground truth).
 */
const AOI_FIRE_CLUSTERS: Record<string, [number, number, number][]> = {
  // Riau & Sumatra Peatlands
  riau: [
    [0.40, 102.10, 1.8],   // Kampar Peninsula
    [0.30, 101.60, 1.5],   // Siak peatlands
    [0.15, 102.50, 1.6],   // Pelalawan / Langgam
    [-0.20, 102.80, 1.3],  // Indragiri Hilir
    [0.80, 101.40, 1.0],   // Bengkalis
    [1.10, 102.00, 0.8],   // Rokan Hilir
    [-0.50, 102.30, 1.2],  // Kuantan Singingi
    [0.60, 102.90, 0.9],   // Kerumutan
  ],

  // Central Kalimantan (Ex-PLG Mega Rice)
  kalteng: [
    [-2.50, 113.80, 2.0],  // Sebangau NP
    [-2.70, 114.20, 1.9],  // PLG Block A & B
    [-2.30, 112.80, 1.7],  // Palangka Raya
    [-1.80, 112.50, 1.4],  // Kapuas peat dome
    [-2.90, 113.30, 1.6],  // PLG Block C
    [-3.10, 112.70, 1.3],  // Seruyan
    [-1.50, 113.20, 1.0],  // Kahayan
    [-2.10, 114.50, 1.1],  // Katingan
    [-3.20, 114.00, 1.2],  // Kotim coastal
  ],

  // South Kalimantan
  kalsel: [
    [-2.50, 115.20, 1.6],  // Tabalong
    [-3.00, 115.60, 1.8],  // Banjar peat
    [-3.50, 115.00, 1.5],  // Kotabaru
    [-2.20, 114.80, 1.4],  // Barito Kuala
    [-3.30, 115.80, 1.2],  // Tanah Bumbu
    [-1.90, 115.50, 0.9],  // South boundary
    [-2.80, 116.00, 1.0],  // Eastern slope
  ],

  // South Sumatra (OKI & Musi Banyuasin)
  sumsel: [
    [-2.80, 105.30, 2.0],  // OKI core
    [-3.20, 105.00, 1.9],  // Mesuji–Tulung Selapan
    [-2.40, 106.00, 1.6],  // Musi Banyuasin
    [-3.60, 105.50, 1.5],  // Southern OKI
    [-2.10, 104.80, 1.3],  // Lalan
    [-3.80, 104.50, 1.2],  // Banyuasin delta
    [-2.70, 106.50, 1.0],  // Musi Rawas
    [-4.00, 105.80, 0.8],  // Ogan Ilir
  ],

  // East Kalimantan
  kaltim: [
    [-1.20, 116.50, 1.5],  // Kutai Barat
    [0.50, 117.20, 1.4],   // Berau
    [-0.50, 116.00, 1.3],  // Kutai NP
    [-2.00, 116.20, 1.2],  // Penajam
    [1.00, 116.80, 1.0],   // North Kaltim
    [-1.80, 115.50, 0.9],  // Paser
    [0.20, 117.60, 0.8],   // Malinau
  ],
};

/**
 * Generates historical hotspot dataset for each individual AOI,
 * plus a consolidated National (All Indonesia) dataset.
 */
export function generateHistoricalFireData(): Record<string, RawHotspot[]> {
  const dataset: Record<string, RawHotspot[]> = {};
  const nationalHotspots: RawHotspot[] = [];

  for (const aoi of PRESET_AOIS) {
    if (aoi.id === 'indonesia') continue;
    const regionHotspots = generateAOIData(aoi);
    dataset[aoi.id] = regionHotspots;

    // Aggregate into national overview
    for (const h of regionHotspots) {
      nationalHotspots.push({
        ...h,
        id: `NAT-${h.id}`,
        aoiId: 'indonesia',
      });
    }
  }

  dataset['indonesia'] = nationalHotspots;
  return dataset;
}

function generateAOIData(aoi: AOIRegion): RawHotspot[] {
  const hotspots: RawHotspot[] = [];
  let idCounter = 1;
  const clusters = AOI_FIRE_CLUSTERS[aoi.id] ?? [];

  for (let year = 2000; year <= 2026; year++) {
    let cm = 1.0;
    if (year === 2002) cm = 1.3;
    if (year === 2004) cm = 1.2;
    if (year === 2006) cm = 2.2;
    if (year === 2009) cm = 1.4;
    if (year === 2010 || year === 2016) cm = 0.3;
    if (year === 2012) cm = 0.7;
    if (year === 2015) cm = 4.5;
    if (year === 2019) cm = 3.2;
    if (year === 2023) cm = 2.1;
    if (year === 2024) cm = 1.6;

    if (aoi.id === 'kaltim') {
      cm = cm > 1 ? cm * 0.7 : cm * 1.2;
    }

    for (let month = 1; month <= 12; month++) {
      let sf = 0.05;

      if (month === 7) sf = 0.4;
      if (month === 8) sf = 1.0;
      if (month === 9) sf = 1.0;
      if (month === 10) sf = 0.6;
      if (month === 11) sf = 0.15;

      if ((aoi.id === 'riau' || aoi.id === 'sumsel') && (month === 2 || month === 3)) {
        sf = Math.max(sf, 0.3);
      }

      const baseEvents = Math.round(8 * sf * cm);
      if (baseEvents <= 0) continue;

      for (let e = 0; e < baseEvents; e++) {
        const seed = year * 100000 + month * 1000 + e * 17;

        const totalWeight = clusters.reduce((acc, c) => acc + c[2], 0);
        let pick = pr(seed + 99) * totalWeight;
        let cluster = clusters[0];
        for (const c of clusters) {
          pick -= c[2];
          if (pick <= 0) { cluster = c; break; }
        }

        const scatterRadius = 0.08 + pr(seed + 11) * 0.28 * Math.sqrt(cm);
        const angle = pr(seed + 12) * 2 * Math.PI;
        const cLat = cluster[0] + Math.cos(angle) * scatterRadius * pr(seed + 13);
        const cLon = cluster[1] + Math.sin(angle) * scatterRadius * pr(seed + 14);

        const [minLat, minLon, maxLat, maxLon] = aoi.bbox;
        const lat = Math.max(minLat + 0.05, Math.min(maxLat - 0.05, cLat));
        const lon = Math.max(minLon + 0.05, Math.min(maxLon - 0.05, cLon));

        const day = 1 + Math.floor(pr(seed) * 27);
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const isPeatFire = aoi.id !== 'kaltim';
        const baseFRP = isPeatFire
          ? 8 + pr(seed + 3) * 45 * cm
          : 15 + pr(seed + 3) * 80 * cm;

        // MODIS
        if (year >= 2000) {
          const modisSat = (year >= 2002 && pr(seed + 4) > 0.5) ? 'Aqua' : 'Terra';
          hotspots.push({
            id: `${aoi.id}-MOD-${idCounter++}`,
            lat: lat + (pr(seed + 5) - 0.5) * 0.01,
            lon: lon + (pr(seed + 6) - 0.5) * 0.01,
            date: dateStr,
            time: '0430',
            satellite: modisSat,
            instrument: 'MODIS',
            confidence: 60 + Math.round(pr(seed + 7) * 40),
            frp: Math.round(Math.max(5, baseFRP)),
            brightness: 305 + Math.round(pr(seed + 8) * 70),
            aoiId: aoi.id,
          });
        }

        // VIIRS
        if (year >= 2012) {
          const viirsCount = 2 + Math.floor(pr(seed + 9) * 3);
          const viirsSat = (year >= 2018 && pr(seed + 10) > 0.5) ? 'NOAA-20' : 'Suomi-NPP';
          for (let v = 0; v < viirsCount; v++) {
            const vs = seed + 50 + v * 11;
            const vLat = lat + (pr(vs + 1) - 0.5) * 0.008;
            const vLon = lon + (pr(vs + 2) - 0.5) * 0.008;
            hotspots.push({
              id: `${aoi.id}-VIIRS-${idCounter++}`,
              lat: Math.max(minLat + 0.01, Math.min(maxLat - 0.01, vLat)),
              lon: Math.max(minLon + 0.01, Math.min(maxLon - 0.01, vLon)),
              date: dateStr,
              time: '0615',
              satellite: viirsSat,
              instrument: 'VIIRS',
              confidence: 70 + Math.round(pr(vs + 3) * 30),
              frp: Math.round(Math.max(3, (baseFRP / viirsCount) * (0.7 + pr(vs + 4) * 0.6))),
              brightness: 308 + Math.round(pr(vs + 5) * 70),
              aoiId: aoi.id,
            });
          }
        }
      }
    }
  }

  return hotspots;
}
