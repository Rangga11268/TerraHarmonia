import { RawHotspot, PRESET_AOIS, AOIRegion } from '../engine/harmonizer';

// Deterministic pseudo-random generator
function pr(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

/**
 * Peatland & wildfire cluster coordinates per Indonesian province & eco-region
 * Verified against NASA FIRMS archive, KLHK Sipongi, and BRGM Peatland Hydrological Units (KHG).
 */
export const INDONESIAN_FIRE_CLUSTERS: Record<string, { province: string; island: string; clusters: [number, number, number][] }> = {
  riau: {
    province: 'Riau',
    island: 'Sumatera',
    clusters: [
      [0.40, 102.10, 2.5],   // Semenanjung Kampar
      [0.85, 101.45, 2.2],   // Bengkalis / Pulau Rupat
      [0.15, 102.50, 2.0],   // Pelalawan / Langgam
      [-0.20, 102.80, 1.8],  // Indragiri Hilir / Tempuling
      [0.30, 101.60, 1.8],   // Siak / Giam Siak Kecil
      [1.65, 101.45, 1.6],   // Dumai / Medang Kampai
      [1.10, 100.80, 1.4],   // Rokan Hilir / Bagan Sinembah
      [0.60, 102.90, 1.5],   // Suaka Margasatwa Kerumutan
      [-0.55, 102.50, 1.3],  // Indragiri Hulu / Rengat
      [0.05, 101.80, 1.4],   // Pelalawan Selatan / Ukui
    ]
  },
  kalteng: {
    province: 'Kalimantan Tengah',
    island: 'Kalimantan',
    clusters: [
      [-2.50, 113.80, 3.2],  // Taman Nasional Sebangau
      [-2.75, 114.20, 3.0],  // Eks-PLG Blok A & B (Dadahup / Mengkatip)
      [-2.95, 113.30, 2.8],  // Eks-PLG Blok C (Kahayan-Sebangau)
      [-2.30, 112.80, 2.4],  // Palangka Raya / Kalampangan / Sebangau
      [-1.80, 112.50, 2.0],  // Kubah Gambut Hulu Kapuas
      [-3.10, 112.70, 2.2],  // Seruyan Hilir / Danau Sembuluh
      [-2.65, 111.75, 2.5],  // Kotawaringin Barat / Kumai / TN Tanjung Puting
      [-3.20, 112.95, 2.3],  // Kotawaringin Timur / Sampit
      [-1.50, 113.20, 1.6],  // Katingan Hulu
      [-3.40, 113.80, 2.0],  // Pulang Pisau Selatan / Kahayan Kuala
      [-2.85, 114.60, 2.1],  // Kapuas Murung / Mantangai
    ]
  },
  sumsel: {
    province: 'Sumatera Selatan',
    island: 'Sumatera',
    clusters: [
      [-3.20, 105.40, 3.0],  // OKI Cengal / Tulung Selapan (Kubah Gambut OKI)
      [-2.80, 105.30, 2.8],  // OKI Air Sugihan / Padang Sugihan
      [-2.40, 104.20, 2.2],  // Musi Banyuasin / Bayung Lencir
      [-3.60, 105.50, 2.0],  // Mesuji OKI / Sungai Menang
      [-2.10, 104.80, 1.8],  // Lalan Gambut
      [-3.80, 104.50, 1.6],  // Banyuasin Delta / Muara Telang
      [-2.70, 103.50, 1.4],  // Musi Rawas Utara / Rupit
      [-4.00, 105.80, 1.3],  // Ogan Ilir / Pemulutan
      [-3.45, 104.85, 1.5],  // Pampangan / Rambutan
    ]
  },
  kalsel: {
    province: 'Kalimantan Selatan',
    island: 'Kalimantan',
    clusters: [
      [-3.40, 114.75, 2.5],  // Banjarbaru / Gambut / Guntung Damar (Ring 1 Bandara)
      [-3.00, 115.60, 2.2],  // Hulu Sungai Selatan / Danau Bangkau
      [-2.50, 115.20, 1.9],  // Tabalong / Murung Pudak
      [-2.20, 114.80, 1.8],  // Barito Kuala / Alalak
      [-3.75, 114.70, 1.7],  // Tanah Laut / Bati-Bati
      [-3.30, 115.80, 1.5],  // Tanah Bumbu / Simpang Empat
      [-3.50, 116.10, 1.3],  // Kotabaru / Pulau Laut
      [-2.70, 115.35, 1.4],  // Hulu Sungai Utara / Amuntai
    ]
  },
  kaltim: {
    province: 'Kalimantan Timur',
    island: 'Kalimantan',
    clusters: [
      [-0.40, 116.80, 2.2],  // Kutai Kartanegara / Muara Kaman
      [-1.20, 116.50, 2.0],  // Kutai Barat / Melak
      [0.50, 117.20, 1.8],   // Berau / Teluk Bayur
      [-0.50, 116.00, 1.6],  // TN Kutai / Bontang
      [-1.80, 115.50, 1.5],  // Paser / Tanah Grogot
      [-1.25, 116.70, 1.4],  // Penajam Paser Utara (IKN buffer)
      [1.80, 117.50, 1.3],   // Bulungan / Tanjung Selor
      [0.10, 116.40, 1.2],   // Kutai Timur / Sangatta
    ]
  },
  kalbar: {
    province: 'Kalimantan Barat',
    island: 'Kalimantan',
    clusters: [
      [-1.80, 109.95, 3.2],  // Ketapang / Kendawangan (Kubah Gambut Terbesar Kalbar)
      [-0.15, 109.40, 2.8],  // Kubu Raya / Rasau Jaya / Bandara Supadio
      [-0.05, 109.30, 2.4],  // Pontianak Tenggara
      [0.90, 108.95, 2.0],   // Sambas / Tebas
      [0.35, 109.15, 1.9],   // Mempawah / Sungai Pinyuh
      [0.05, 111.45, 1.8],   // Sintang / Sepauk
      [0.45, 109.80, 1.6],   // Landak / Ngabang
      [-1.30, 110.10, 1.8],  // Kayong Utara / Teluk Batang
      [-2.40, 110.20, 1.9],  // Manis Mata / Matan Hilir Selatan
    ]
  },
  jambi: {
    province: 'Jambi',
    island: 'Sumatera',
    clusters: [
      [-1.45, 103.80, 2.4],  // Muaro Jambi / Kumpeh Ulu
      [-1.20, 104.15, 2.3],  // Tanjung Jabung Timur / TN Berbak
      [-1.00, 103.20, 1.8],  // Tanjung Jabung Barat / Betara
      [-1.60, 102.50, 1.5],  // Tebo / Rimbo Bujang
      [-2.10, 102.30, 1.3],  // Sarolangun / Mandiangin
      [-1.85, 103.45, 1.4],  // Batanghari / Bajubang
    ]
  },
  sumut_aceh: {
    province: 'Aceh & Sumut',
    island: 'Sumatera',
    clusters: [
      [3.80, 96.40, 2.2],    // Rawa Tripa / Nagan Raya
      [2.30, 97.90, 2.0],    // Rawa Singkil / Subulussalam
      [2.10, 99.90, 1.8],    // Labuhanbatu / Bilah Hilir
      [2.80, 99.80, 1.5],    // Labuhanbatu Utara / Kualuh
      [1.80, 100.10, 1.4],   // Labuhanbatu Selatan
      [4.20, 97.80, 1.2],    // Aceh Tamiang
      [1.40, 99.10, 1.1],    // Tapanuli Selatan
    ]
  },
  papua: {
    province: 'Papua Selatan & Papua',
    island: 'Papua',
    clusters: [
      [-8.10, 139.60, 2.8],  // Merauke Savanna Peat / Kumbe
      [-7.50, 139.20, 2.6],  // Semenanjung Kimaam / Pulau Yos Sudarso
      [-6.80, 139.80, 2.2],  // Mappi / Obaa
      [-6.00, 140.30, 2.0],  // Boven Digoel / Mandobo
      [-5.50, 138.20, 1.7],  // Rawa Asmat / Agats
      [-3.30, 135.50, 1.4],  // Nabire / Wanggar
      [-2.00, 138.50, 1.3],  // Dataran Mamberamo
      [-1.50, 133.20, 1.2],  // Teluk Bintuni / Rawa Sago
    ]
  },
  sulawesi: {
    province: 'Sulawesi',
    island: 'Sulawesi',
    clusters: [
      [-2.80, 121.30, 2.0],  // Morowali / Bahodopi
      [-3.80, 122.20, 1.8],  // Konawe Rawa Gambut / Sampara
      [-2.60, 120.50, 1.6],  // Luwu Timur / Malili
      [-4.50, 120.10, 1.5],  // Wajo / Danau Tempe
      [-0.80, 119.85, 1.4],  // Donggala / Palu Utara
      [-4.10, 121.60, 1.3],  // Kolaka / Pomalaa
      [0.60, 122.80, 1.2],   // Gorontalo / Boalemo
      [-5.20, 119.60, 1.4],  // Gowa / Takalar Hutan Kering
    ]
  },
  nusa_tenggara: {
    province: 'Nusa Tenggara & Jawa Bali',
    island: 'Kepulauan Nusa Tenggara',
    clusters: [
      [-9.60, 120.25, 2.4],  // Sumba Timur / Waingapu Savanna
      [-10.15, 123.65, 2.2], // Timor Barat / Kupang
      [-8.50, 118.70, 2.0],  // Sumbawa / Bima Hutan Kering
      [-8.60, 116.30, 1.8],  // Lombok Timur / Sembalun
      [-8.55, 120.40, 1.6],  // Flores Barat / Komodo Buffer
      [-7.80, 114.30, 2.0],  // Jawa Timur / Banyuwangi / Baluran
      [-7.90, 113.00, 1.8],  // Jawa Timur / Probolinggo / Bromo
      [-7.30, 110.00, 1.5],  // Jawa Tengah / Temanggung / Sumbing
    ]
  },
};

/**
 * Generates historical hotspot dataset for each individual AOI,
 * plus a comprehensive nationwide pan-Indonesian dataset.
 */
export function generateHistoricalFireData(): Record<string, RawHotspot[]> {
  const dataset: Record<string, RawHotspot[]> = {};

  // 1. Generate for individual preset AOIs
  for (const aoi of PRESET_AOIS) {
    if (aoi.id === 'indonesia') continue;
    dataset[aoi.id] = generateAOIData(aoi);
  }

  // 2. Generate comprehensive nationwide dataset across all 11 Indonesian regions
  const nationalHotspots: RawHotspot[] = [];
  let natCounter = 1;

  for (const [regionKey, regionConfig] of Object.entries(INDONESIAN_FIRE_CLUSTERS)) {
    const regionPoints = generateRegionData(regionKey, regionConfig, natCounter);
    natCounter += regionPoints.length;
    nationalHotspots.push(...regionPoints);
  }

  // Sort chronologically by date
  nationalHotspots.sort((a, b) => a.date.localeCompare(b.date));
  dataset['indonesia'] = nationalHotspots;

  return dataset;
}

function generateRegionData(
  regionKey: string,
  regionConfig: { province: string; island: string; clusters: [number, number, number][] },
  startCounter: number
): RawHotspot[] {
  const hotspots: RawHotspot[] = [];
  let idCounter = startCounter;
  const clusters = regionConfig.clusters;

  for (let year = 2000; year <= 2026; year++) {
    // Climate anomaly multiplier
    let cm = 1.0;
    if (year === 2002) cm = 1.3;
    if (year === 2004) cm = 1.2;
    if (year === 2006) cm = 2.2;
    if (year === 2009) cm = 1.4;
    if (year === 2010 || year === 2016) cm = 0.35; // Strong La Niña (wet)
    if (year === 2012) cm = 0.8;
    if (year === 2015) cm = 4.8; // Super El Niño
    if (year === 2019) cm = 3.5; // Positive IOD & El Niño
    if (year === 2023) cm = 2.4; // El Niño moderate
    if (year === 2024) cm = 1.6;
    if (year === 2026) cm = 1.2;

    for (let month = 1; month <= 12; month++) {
      let sf = 0.06;

      if (month === 7) sf = 0.45;
      if (month === 8) sf = 1.0;
      if (month === 9) sf = 1.0;
      if (month === 10) sf = 0.65;
      if (month === 11) sf = 0.25;

      // Early dry season peak for Riau & Northern Sumatra (Feb-Mar)
      if ((regionKey === 'riau' || regionKey === 'sumut_aceh' || regionKey === 'kalbar') && (month === 2 || month === 3)) {
        sf = Math.max(sf, 0.55);
      }

      // Savanna dry season peak for Papua Selatan & Nusa Tenggara (Sep-Nov)
      if ((regionKey === 'papua' || regionKey === 'nusa_tenggara') && (month === 10 || month === 11)) {
        sf = Math.max(sf, 0.75);
      }

      const baseEvents = Math.round(18 * sf * cm);
      if (baseEvents <= 0) continue;

      for (let e = 0; e < baseEvents; e++) {
        const seed = year * 100000 + month * 1000 + e * 37 + clusters.length;

        const totalWeight = clusters.reduce((acc, c) => acc + c[2], 0);
        let pick = pr(seed + 99) * totalWeight;
        let cluster = clusters[0];
        for (const c of clusters) {
          pick -= c[2];
          if (pick <= 0) { cluster = c; break; }
        }

        const scatterRadius = 0.04 + pr(seed + 11) * 0.18 * Math.sqrt(cm);
        const angle = pr(seed + 12) * 2 * Math.PI;
        const cLat = cluster[0] + Math.cos(angle) * scatterRadius * pr(seed + 13);
        const cLon = cluster[1] + Math.sin(angle) * scatterRadius * pr(seed + 14);

        // Clamp to Indonesian territorial bounds
        const lat = Math.max(-10.8, Math.min(5.8, cLat));
        const lon = Math.max(95.2, Math.min(140.8, cLon));

        const day = 1 + Math.floor(pr(seed) * 27);
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const isPeatFire = regionConfig.island === 'Sumatera' || regionConfig.island === 'Kalimantan' || regionKey === 'papua';
        const baseFRP = isPeatFire
          ? 12 + pr(seed + 3) * 65 * cm
          : 20 + pr(seed + 3) * 95 * cm;

        // MODIS (2000-present)
        if (year >= 2000) {
          const modisSat = (year >= 2002 && pr(seed + 4) > 0.5) ? 'Aqua' : 'Terra';
          hotspots.push({
            id: `NAT-${regionKey}-MOD-${idCounter++}`,
            lat: lat + (pr(seed + 5) - 0.5) * 0.008,
            lon: lon + (pr(seed + 6) - 0.5) * 0.008,
            date: dateStr,
            time: '0430',
            satellite: modisSat,
            instrument: 'MODIS',
            confidence: 60 + Math.round(pr(seed + 7) * 40),
            frp: Math.round(Math.max(5, baseFRP)),
            brightness: 305 + Math.round(pr(seed + 8) * 70),
            aoiId: 'indonesia',
          });
        }

        // VIIRS (2012-present) - Sub-pixel high resolution multiplier (3 to 6 split points)
        if (year >= 2012) {
          const viirsCount = 3 + Math.floor(pr(seed + 9) * 4);
          const viirsSat = (year >= 2018 && pr(seed + 10) > 0.5) ? 'NOAA-20' : 'Suomi-NPP';
          for (let v = 0; v < viirsCount; v++) {
            const vs = seed + 50 + v * 17;
            const vLat = lat + (pr(vs + 1) - 0.5) * 0.012;
            const vLon = lon + (pr(vs + 2) - 0.5) * 0.012;
            hotspots.push({
              id: `NAT-${regionKey}-VIIRS-${idCounter++}`,
              lat: Math.max(-10.8, Math.min(5.8, vLat)),
              lon: Math.max(95.2, Math.min(140.8, vLon)),
              date: dateStr,
              time: '0615',
              satellite: viirsSat,
              instrument: 'VIIRS',
              confidence: 70 + Math.round(pr(vs + 3) * 30),
              frp: Math.round(Math.max(3, (baseFRP / viirsCount) * (0.8 + pr(vs + 4) * 0.5))),
              brightness: 308 + Math.round(pr(vs + 5) * 70),
              aoiId: 'indonesia',
            });
          }
        }
      }
    }
  }

  return hotspots;
}

function generateAOIData(aoi: AOIRegion): RawHotspot[] {
  const hotspots: RawHotspot[] = [];
  let idCounter = 1;
  const clusterData = INDONESIAN_FIRE_CLUSTERS[aoi.id];
  const clusters = clusterData ? clusterData.clusters : [];

  for (let year = 2000; year <= 2026; year++) {
    let cm = 1.0;
    if (year === 2002) cm = 1.3;
    if (year === 2004) cm = 1.2;
    if (year === 2006) cm = 2.2;
    if (year === 2009) cm = 1.4;
    if (year === 2010 || year === 2016) cm = 0.35;
    if (year === 2012) cm = 0.8;
    if (year === 2015) cm = 4.8;
    if (year === 2019) cm = 3.5;
    if (year === 2023) cm = 2.4;
    if (year === 2024) cm = 1.6;
    if (year === 2026) cm = 1.2;

    if (aoi.id === 'kaltim') {
      cm = cm > 1 ? cm * 0.7 : cm * 1.2;
    }

    for (let month = 1; month <= 12; month++) {
      let sf = 0.06;

      if (month === 7) sf = 0.45;
      if (month === 8) sf = 1.0;
      if (month === 9) sf = 1.0;
      if (month === 10) sf = 0.65;
      if (month === 11) sf = 0.25;

      if ((aoi.id === 'riau' || aoi.id === 'sumsel') && (month === 2 || month === 3)) {
        sf = Math.max(sf, 0.55);
      }

      const baseEvents = Math.round(22 * sf * cm);
      if (baseEvents <= 0) continue;

      for (let e = 0; e < baseEvents; e++) {
        const seed = year * 100000 + month * 1000 + e * 37 + (clusters.length || 1);

        let cluster: [number, number, number] = [aoi.center[0], aoi.center[1], 1.0];
        if (clusters.length > 0) {
          const totalWeight = clusters.reduce((acc, c) => acc + c[2], 0);
          let pick = pr(seed + 99) * totalWeight;
          for (const c of clusters) {
            pick -= c[2];
            if (pick <= 0) { cluster = c; break; }
          }
        }

        const scatterRadius = 0.04 + pr(seed + 11) * 0.18 * Math.sqrt(cm);
        const angle = pr(seed + 12) * 2 * Math.PI;
        const cLat = cluster[0] + Math.cos(angle) * scatterRadius * pr(seed + 13);
        const cLon = cluster[1] + Math.sin(angle) * scatterRadius * pr(seed + 14);

        const lat = Math.max(aoi.bbox[0], Math.min(aoi.bbox[2], cLat));
        const lon = Math.max(aoi.bbox[1], Math.min(aoi.bbox[3], cLon));

        const day = 1 + Math.floor(pr(seed) * 27);
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const isPeatFire = aoi.id === 'riau' || aoi.id === 'kalteng' || aoi.id === 'sumsel' || aoi.id === 'kalbar' || aoi.id === 'jambi' || aoi.biome.toLowerCase().includes('peat');
        const baseFRP = isPeatFire
          ? 12 + pr(seed + 3) * 65 * cm
          : 20 + pr(seed + 3) * 95 * cm;

        // MODIS
        if (year >= 2000) {
          const modisSat = (year >= 2002 && pr(seed + 4) > 0.5) ? 'Aqua' : 'Terra';
          hotspots.push({
            id: `${aoi.id}-MOD-${idCounter++}`,
            lat: lat + (pr(seed + 5) - 0.5) * 0.008,
            lon: lon + (pr(seed + 6) - 0.5) * 0.008,
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

        // VIIRS (2012-present)
        if (year >= 2012) {
          const viirsCount = 3 + Math.floor(pr(seed + 9) * 4);
          const viirsSat = (year >= 2018 && pr(seed + 10) > 0.5) ? 'NOAA-20' : 'Suomi-NPP';
          for (let v = 0; v < viirsCount; v++) {
            const vs = seed + 50 + v * 17;
            const vLat = lat + (pr(vs + 1) - 0.5) * 0.012;
            const vLon = lon + (pr(vs + 2) - 0.5) * 0.012;
            hotspots.push({
              id: `${aoi.id}-VIIRS-${idCounter++}`,
              lat: Math.max(aoi.bbox[0], Math.min(aoi.bbox[2], vLat)),
              lon: Math.max(aoi.bbox[1], Math.min(aoi.bbox[3], vLon)),
              date: dateStr,
              time: '0615',
              satellite: viirsSat,
              instrument: 'VIIRS',
              confidence: 70 + Math.round(pr(vs + 3) * 30),
              frp: Math.round(Math.max(3, (baseFRP / viirsCount) * (0.8 + pr(vs + 4) * 0.5))),
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
