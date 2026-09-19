# Terra Harmonia — Engineering Plan Document

## Objective
Build a web application that harmonizes 20+ years of satellite fire records (MODIS 1km and VIIRS 375m) into a unified Burning Activity Calendar, enabling early warning, historical pattern analysis, and critical period detection for selected Areas of Interest (AOI).

## Target Architecture
- Client-side Single Page Application (HTML5, Vanilla JS ES6+, CSS3)
- Mapping: Leaflet with Carto Dark Matter tiles
- Charts & Heatmaps: Canvas-based matrix heatmap + Chart.js for time-series trends
- Data: Structured GeoJSON / JSON containing standardized NASA FIRMS historical hotspots

## Checkpoints
- Checkpoint 1 (Tasks 1-2): Data pipeline & harmonization mathematics functional
- Checkpoint 2 (Tasks 3-4): Interactive map & calendar matrix rendering in browser
- Checkpoint 3 (Tasks 5-6): Alerts, anomaly detection, and raw vs harmonized comparison verified
