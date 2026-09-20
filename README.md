<div align="center">

  <img src="public/terra_harmonia_transparent.svg" alt="Terra Harmonia Logo" width="120" height="120" />

  # Terra Harmonia
  ### Multi-Decadal Earth Observation Satellite Harmonization & Wildfire Intelligence Platform

  [![NASA Space Apps Challenge](https://img.shields.io/badge/NASA_Space_Apps-2026_Global_Challenge-0B3D91?style=for-the-badge&logo=nasa&logoColor=white)](https://www.spaceappschallenge.org/)
  [![Challenge Category](https://img.shields.io/badge/Challenge-MODIS_&_VIIRS_Harmonization-EA580C?style=for-the-badge)](https://www.spaceappschallenge.org/)
  [![Live Satellite Data](https://img.shields.io/badge/Data_Feed-NASA_FIRMS_&_Open--Meteo-10B981?style=for-the-badge)](https://firms.modaps.eosdis.nasa.gov/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

  <p align="center">
    <strong>Eliminating 14-Year Multi-Sensor Granularity Disparities to Restore Continuous 26-Year Wildfire Baselines (2000-2026) across Indonesian Peatland Ecosystems.</strong>
  </p>

</div>

---

## Executive Summary

For over two decades, NASA Earth Observation satellites have tracked global active fire events:
1. **MODIS (Terra & Aqua)**: 1.0 km nadir resolution, operational since 2000.
2. **VIIRS (Suomi-NPP & NOAA-20)**: 375 m nadir resolution, operational since 2012.

Because VIIRS provides an observational ground footprint approximately **7 times smaller** than MODIS, a single contiguous wildfire front registers as **3 to 7 separate raw VIIRS detections**. 

Without mathematical and spatial harmonization, raw historical archives create a dangerous statistical artifact: **wildfire frequency appears to abruptly triple post-2012**. This distorts long-term climate baselines, fire regime analysis, and disaster mitigation resource allocation.

**Terra Harmonia** bridges this technological gap through **5.5 km equal-area spatial binning**, **cross-sensor Fire Radiative Power (FRP) radiometric calibration**, and **real-time hydrological telemetry integration**, providing environmental authorities with an authoritative multi-decade intelligence suite.

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

## Project Structure

```
src/
├── components/
│   ├── BurningCalendar.tsx     # 26-Year 52-week contribution matrix & climatology
│   ├── ComparisonMetrics.tsx   # Multi-sensor KPI disparity summary
│   ├── CriticalAlerts.tsx      # Early warning anomaly detection & CSV export
│   ├── DashboardControlBar.tsx # Region switcher, view mode switcher, audio briefing
│   ├── DataHub.tsx             # NASA FIRMS API integration & raw data inspector
│   ├── DualMapComparison.tsx   # Split-screen synchronized sensor comparison
│   ├── ExecutiveReport.tsx     # Official SitRep dossier & direct 1-click PDF download
│   ├── Footer.tsx              # Scientific documentation & NASA team credits
│   ├── FullMapModal.tsx        # Full-screen GIS viewer with timeline epoch scrubber
│   ├── HarmonizationLab.tsx    # Interactive sensor footprint & physics simulator
│   ├── Header.tsx              # Minimalist navbar & language switcher
│   ├── MapViewer.tsx           # Primary Leaflet map with Indonesia hard boundary lock
│   ├── MitigationCharts.tsx    # 14-day prognosis & peat hydrology Recharts suite
│   ├── MitigationHub.tsx       # Live weather, BRGM simulator & paginated hotspots
│   ├── NasaApiKeyModal.tsx     # Custom MAP_KEY settings for live NASA FIRMS feeds
│   ├── Navbar.tsx              # Clean top navigation with light/dark mode switch
│   ├── PeatlandSimulator.tsx   # BRGM TMAT water table & canal block physics engine
│   ├── PolygonInspector.tsx    # GeoJSON peat dome polygon drawing & analytics
│   ├── RiskForecast.tsx        # Composite Fire Risk Index & 14-day trajectory
│   ├── TeamPage.tsx            # Team identity & project methodology dossier
│   └── VisualAnalytics.tsx     # Longitudinal 26-year trend & seasonality charts
├── data/
│   ├── generator.ts            # Calibrated multi-decade satellite records
│   └── translations.ts         # Complete English & Indonesian dictionary
├── engine/
│   └── harmonizer.ts           # Spatial binning, FRP weighting, and Z-score engine
├── services/
│   ├── nasaFirmsApi.ts         # NASA FIRMS live satellite telemetry client
│   └── weatherApi.ts           # Open-Meteo live weather & forecast service
├── utils/
│   ├── audioBriefing.ts        # Web Speech API situation briefing synthesizer
│   └── locationResolver.ts     # GPS coordinate to Indonesian regency reverse lookup
├── App.tsx                     # Master state coordinator & route manager
└── index.css                   # Global Tailwind styles & .scrollbar-none utilities
```

---

## Quick Start

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn package manager

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Rangga11268/TerraHarmonia.git
cd TerraHarmonia

# 2. Install dependencies
npm install

# 3. Start the local development server
npm run dev
```

Visit `http://localhost:3000` (or Vite's assigned port) in your browser.

### Production Build & Verification

```bash
# Run TypeScript typecheck and compile Vite production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Team & Challenge Verification

- **Challenge Category**: NASA Space Apps Challenge 2026: *Harmonization of MODIS and VIIRS Hot Spots*
- **Team**: Terra Harmonia
- **Author**: Darell Rangga
- **Open Science Data Sources**: 
  - NASA FIRMS (Fire Information for Resource Management System)
  - MODIS Airborne/Spaceborne Sensor Archives (Terra & Aqua)
  - VIIRS Spaceborne Sensor Archives (Suomi-NPP & NOAA-20)
  - Open-Meteo Global Meteorological Forecast Model
  - Badan Restorasi Gambut dan Mangrove (BRGM) Technical Specifications

---

<div align="center">
  <p>Dedicated to advancing Earth observation science, environmental transparency, and peatland wildfire prevention.</p>
  <sub>Terra Harmonia © 2026. Built with open NASA Earth Observation telemetry.</sub>
</div>
