<div align="center">

  <img src="public/terra_harmonia_transparent.svg" alt="Terra Harmonia Logo" width="120" height="120" />

  # Terra Harmonia
  ### Multi-Decadal Earth Observation Satellite Harmonization & Wildfire Intelligence Platform
  ### Platform Harmonisasi Satelit Observasi Bumi & Intelijen Kebakaran Hutan Multi-Dekade

  [![NASA Space Apps Challenge](https://img.shields.io/badge/NASA_Space_Apps-2026_Global_Challenge-0B3D91?style=for-the-badge&logo=nasa&logoColor=white)](https://www.spaceappschallenge.org/)
  [![Challenge Category](https://img.shields.io/badge/Challenge-MODIS_&_VIIRS_Harmonization-EA580C?style=for-the-badge)](https://www.spaceappschallenge.org/)
  [![Live Satellite Data](https://img.shields.io/badge/Data_Feed-NASA_FIRMS_&_Open--Meteo-10B981?style=for-the-badge)](https://firms.modaps.eosdis.nasa.gov/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

  <p align="center">
    <strong>[ <a href="#-english">English</a> | <a href="#-bahasa-indonesia">Bahasa Indonesia</a> ]</strong>
  </p>

</div>

---

# 🇬🇧 English

## Executive Summary

For over two decades, NASA Earth Observation satellites have tracked global active fire events:
1. **MODIS (Terra & Aqua)**: 1.0 km nadir resolution, operational since 2000.
2. **VIIRS (Suomi-NPP & NOAA-20)**: 375 m nadir resolution, operational since 2012.

Because VIIRS provides an observational ground footprint approximately **7 times smaller** than MODIS, a single contiguous wildfire front registers as **3 to 7 separate raw VIIRS detections**. 

Without mathematical and spatial harmonization, raw historical archives create a dangerous statistical artifact: **wildfire frequency appears to abruptly triple post-2012**. This distorts long-term climate baselines, fire regime analysis, and disaster mitigation resource allocation.

**Terra Harmonia** bridges this technological gap through **5.5 km equal-area spatial binning**, **cross-sensor Fire Radiative Power (FRP) radiometric calibration**, and **real-time meteorological telemetry integration**, providing environmental authorities with an authoritative multi-decade intelligence suite.

---

## Key Modules & Platform Capabilities

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                TERRA HARMONIA ARCHITECTURE                               │
├────────────────────────────┬────────────────────────────┬────────────────────────────────┤
│    🛰️ SENSOR HARMONIZATION  │    🗺️ GIS & INTELLIGENCE   │    🛡️ MITIGATION & PROGNOSIS   │
├────────────────────────────┼────────────────────────────┼────────────────────────────────┤
│ • 5.5 km Spatial Binning   │ • Hard Boundary Lock       │ • Live Open-Meteo Weather API  │
│ • FRP Cross-Calibration    │   (Indonesia Archipelago)  │ • BRGM Peatland TMAT Physics   │
│ • 26-Year Baseline Normal. │ • 2000-2026 Epoch Stepper  │ • 14-Day Multi-Variable Trend  │
│ • Multi-Sensor Footprint   │ • Split-Screen Dual Map    │ • 1-Click Executive SitRep PDF │
│   Interactive Simulator    │ • Custom Polygon Inspector │ • High-Performance Hotspots   │
└────────────────────────────┴────────────────────────────┴────────────────────────────────┘
```

### 1. Longitudinal Harmonization Engine
- **Equal-Area 5.5 km Grid Clustering**: Merges fragmented sub-pixel detections from overlapping orbits into unified physical fire events.
- **Empirical Radiometric Calibration**:
  $$\text{FRP}_{\text{calibrated}} = (\text{FRP}_{\text{MODIS}} \times 1.04) + (\text{FRP}_{\text{VIIRS}} \times 0.88)$$
- **Burning Activity Index (BAI)**: Normalizes cluster density and thermal radiative energy flux onto a standardized 0-100 severity scale.
- **Statistical Anomaly Detection**: Computes running 26-year historical weekly baselines to detect anomalous surges ($Z > 2.0\sigma$).

### 2. Indonesian Archipelago GIS & Intelligence Suite
- **Hard Boundary Lock**: Constrains map exploration strictly to the sovereign coordinates of Indonesia (`[-11.5° S, 94.0° E]` to `[6.5° N, 141.5° E]`) with `maxBoundsViscosity: 1.0` and `minZoom: 4`.
- **26-Year Historical Timeline**: Slider-free epoch controller with instant year steppers (`-1`, `+1`) and landmark climate anomaly presets (*2000 Baseline, 2015 Super El Niño, 2019 El Niño, 2023 El Niño, 2026 Live*).
- **Dual Map A/B Comparator**: Simultaneous side-by-side synchronized view comparing raw multi-sensor telemetry against calibrated clusters.
- **Peat Dome Polygon Inspector**: Interactive GeoJSON polygon drawing tool calculating instant area, total thermal output, and localized peat risk.
- **Web Speech AI Briefing**: Synthesizes real-time situation reports into natural voice audio for incident commanders.

### 3. Mitigation Hub & Operational Prognosis
- **Live Meteorological Telemetry**: Direct integration with Open-Meteo API for real-time temperature, relative humidity, wind speed, and Days Without Rain (HTH).
- **BRGM Peat Hydrology Physics**: Computes Groundwater Depth (TMAT) vs the critical -40 cm statutory limit, peat moisture content (%), burn depth (cm), and CO₂e emissions per hectare.
- **High-Performance Hotspot Explorer**: Instant in-memory chunking (24 items/page) with 1-click filter chips (*FRP ≥50MW, VIIRS 375m, MODIS 1km*) and instant search.
- **Direct 1-Click PDF SitRep Dossier**: Client-side high-resolution PDF generation via `jsPDF` and `html2canvas` formatted to official national standard.

### 4. Harmonization Laboratory & Sensor Physics
- **Interactive Spatial Sampling Demonstrator**: Real-time SVG canvas visually rendering how a physical fire front is sampled by MODIS 1 km pixels vs VIIRS 375 m pixels vs Terra Harmonia 5.5 km bins.
- **Sensor Specification Matrix**: Complete technical reference comparing NASA EOS (Terra/Aqua) and JPSS (Suomi-NPP/NOAA-20) satellite instrumentation.

---

## Tech Stack & Design Standards

| Layer | Technologies |
|---|---|
| **Core Framework** | React 18.3, TypeScript 5.7, Vite 6.1 |
| **Styling & Design System** | Tailwind CSS 3.4, Apple-Inspired Telemetry Aesthetics, 100% Slider-Free UX |
| **Mapping & GIS** | Leaflet 1.9, Esri World Imagery, CartoDB Voyager |
| **Data Visualization** | Recharts 3.10 (Multi-series Area, Composed Bar, Radial Pie, Sparklines) |
| **Document Generation** | jsPDF 4.2, html2canvas 1.4, DOMPurify |
| **Live APIs** | NASA FIRMS REST API, Open-Meteo Global Weather API |
| **Compliance** | Strict Anti-Slop Guidelines, WCAG AA Contrast, Full Bilingual (ID / EN) |

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Rangga11268/TerraHarmonia.git
cd TerraHarmonia

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build for production
npm run build
```

---

<br />

# 🇮🇩 Bahasa Indonesia

## Ringkasan Eksekutif

Selama lebih dari dua dekade, satelit observasi bumi NASA telah memantau kebakaran hutan dan lahan (karhutla) secara global:
1. **MODIS (Terra & Aqua)**: Resolusi 1.0 km pada nadir, beroperasi sejak tahun 2000.
2. **VIIRS (Suomi-NPP & NOAA-20)**: Resolusi 375 m pada nadir, beroperasi sejak akhir 2011/2012.

Karena ukuran piksel VIIRS sekitar **7 kali lebih kecil** dibandingkan MODIS, satu front kebakaran yang sama di lapangan sering kali terdeteksi sebagai **3 hingga 7 titik terpisah oleh sensor VIIRS**.

Tanpa harmonisasi matematis dan spasial, arsip historis mentah memicu ilusi statistik yang berbahaya: **seolah-olah frekuensi kebakaran melonjak 3x lipat pasca-2012**. Hal ini mendistorsi garis dasar (*baseline*) iklim jangka panjang, analisis tren kebakaran, dan alokasi sumber daya pemadaman darurat.

**Terra Harmonia** menyelesaikan disparitas teknologi ini melalui **pengelompokan spasial equal-area 5.5 km**, **kalibrasi radiometrik daya radiasi api (FRP)**, dan **integrasi telemetri cuaca live**, memberikan platform intelijen multi-dekade yang presisi dan tervalidasi bagi otoritas lingkungan hidup.

---

## Arsitektur & Kemampuan Utama Platform

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                STRUKTUR TERRA HARMONIA                                   │
├────────────────────────────┬────────────────────────────┬────────────────────────────────┤
│    🛰️ HARMONISASI SENSOR    │     🗺️ GIS & INTELIJEN     │    🛡️ MITIGASI & PROGNOSIS     │
├────────────────────────────┼────────────────────────────┼────────────────────────────────┤
│ • Spatial Binning 5.5 km   │ • Penguncian Batas Peta    │ • Cuaca Live Open-Meteo API    │
│ • Kalibrasi Radiometri FRP │   (Khusus Kepulauan RI)    │ • Model Fisika TMAT BRGM       │
│ • Normalisasi Tren 26 Thn  │ • Stepper Tahun 2000-2026  │ • Grafik Prognosis 14 Hari     │
│ • Simulator Interaktif     │ • Split-Screen Peta Ganda  │ • Download Dokumen SitRep PDF  │
│   Footprint Spasial Sensor │ • Inspektur Poligon Gambut │ • Explorer Titik Panas Cepat   │
└────────────────────────────┴────────────────────────────┴────────────────────────────────┘
```

### 1. Mesin Harmonisasi Lintas-Dekade
- **Spatial Binning Equal-Area 5.5 km**: Menyatukan titik-titik sub-piksel terfragmentasi dari berbagai orbit satelit ke dalam satu klaster fisik yang koheren.
- **Kalibrasi Radiometrik Empiris**:
  $$\text{FRP}_{\text{terkalibrasi}} = (\text{FRP}_{\text{MODIS}} \times 1.04) + (\text{FRP}_{\text{VIIRS}} \times 0.88)$$
- **Indeks Aktivitas Pembakaran (BAI)**: Menstandarkan kerapatan titik dan daya radiasi energi termal ke dalam skala keparahan 0-100.
- **Deteksi Anomali Statistik**: Menghitung rata-rata bergerak historis 26 tahun tiap minggu kalender untuk mendeteksi lonjakan ekstrem ($Z > 2.0\sigma$).

### 2. Suite GIS & Intelijen Kepulauan Indonesia
- **Penguncian Batas Kedaulatan Peta (*Hard Boundary Lock*)**: Membatasi navigasi peta secara ketat hanya pada wilayah kedaulatan Indonesia (`[-11.5° LS, 94.0° BT]` hingga `[6.5° LU, 141.5° BT]`) dengan `maxBoundsViscosity: 1.0` dan `minZoom: 4` (pengguna tidak bisa menggeser keluar dari Indonesia).
- **Timeline Historis 26 Tahun Bebas Slider**: Navigasi tahunan menggunakan tombol stepper (`-1`, `+1`) dan tombol pintas anomali iklim (*2000 Baseline, 2015 Super El Niño, 2019 El Niño, 2023 El Niño, 2026 Live*).
- **Komparasi Peta Ganda A/B**: Tampilan layar terbagi (*split-screen*) sinkron untuk membandingkan data mentah sensor vs data terharmonisasi.
- **Inspektur Poligon Kubah Gambut**: Fitur gambar GeoJSON poligon interaktif untuk menghitung luas area, total pelepasan energi radiasi termal, dan risiko spesifik kubah gambut.
- **Briefing Suara AI (Web Speech API)**: Membacakan laporan situasi intelejen terkini dalam bentuk audio untuk komandan operasi lapangan.

### 3. Hub Mitigasi & Prognosis Operasional Lapangan
- **Telemetri Cuaca Live**: Integrasi langsung dengan Open-Meteo API untuk data suhu, kelembapan udara (RH), kecepatan angin, dan Hari Tanpa Hujan (HTH).
- **Fisika Hidrologi Gambut BRGM**: Menghitung Tinggi Muka Air Tanah (TMAT) terhadap ambang batas kritis -40 cm BRGM/KLHK, Kadar Air Gambut (%), estimasi kedalaman bakar (cm), dan potensi emisi CO₂e per hektar.
- **Explorer Titik Panas Berperforma Tinggi**: Sistem pemuatan data cepat (24 item per halaman) dengan chip filter 1-klik (*FRP ≥50MW, VIIRS 375m, MODIS 1km*) dan pencarian instan tanpa *lag*.
- **Download Langsung PDF Laporan Situasi (SitRep)**: Pembuatan dokumen PDF resmi beresolusi tinggi langsung di peramban via `jsPDF` dan `html2canvas` berstandar A4 nasional.

### 4. Laboratorium Harmonisasi & Fisika Sensor
- **Simulator Footprint Sensor Interaktif (SVG Visualizer)**: Visualisasi grafis langsung yang memperlihatkan bagaimana sebuah kebakaran fisik dideteksi oleh piksel MODIS 1 km vs sub-piksel VIIRS 375 m vs grid 5.5 km Terra Harmonia.
- **Matriks Spesifikasi Teknis Satelit**: Tabel perbandingan lengkap spesifikasi instrumen satelit NASA EOS (Terra/Aqua) dan JPSS (Suomi-NPP/NOAA-20).

---

## Panduan Instalasi & Penggunaan

### Prasyarat
- Node.js (versi 18.0.0 atau lebih tinggi)
- npm atau yarn

### Langkah Pemasangan

```bash
# 1. Kloning repositori
git clone https://github.com/Rangga11268/TerraHarmonia.git
cd TerraHarmonia

# 2. Pasang dependensi
npm install

# 3. Jalankan server pengembangan lokal
npm run dev

# 4. Bangun versi produksi
npm run build
```

---

## Tim & Sumber Data Terbuka

- **Kategori Tantangan**: NASA Space Apps Challenge 2026: *Harmonization of MODIS and VIIRS Hot Spots*
- **Nama Tim**: Terra Harmonia
- **Peserta**: Darell Rangga
- **Sumber Data Terbuka**:
  - NASA FIRMS (Fire Information for Resource Management System)
  - Arsip Sensor Satelit MODIS (Terra & Aqua)
  - Arsip Sensor Satelit VIIRS (Suomi-NPP & NOAA-20)
  - Model Prakiraan Cuaca Global Open-Meteo
  - Parameter Hidrologi Badan Restorasi Gambut dan Mangrove (BRGM)

---

<div align="center">
  <p>Didedikasikan untuk memajukan sains observasi bumi, transparansi data lingkungan hidup, dan pencegahan kebakaran lahan gambut di Indonesia.</p>
  <sub>Terra Harmonia © 2026. Dibangun dengan telemetri terbuka NASA Earth Observation.</sub>
</div>
