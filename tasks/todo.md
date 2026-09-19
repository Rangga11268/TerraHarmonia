# Task List: Terra Harmonia — Burning Activity Calendar

- [ ] **Task 1: Core Data Model & Sample Historical Hotspots**
  - Buat generator/dataset `data/hotspots.json` berisi data time-series satelit MODIS & VIIRS 2000-2026 untuk area Indonesia (Riau, Kalteng) dan area komparasi global.
  - Verifikasi: Struktur data valid JSON dengan atribut latitude, longitude, acq_date, satellite, instrument, frp, confidence.

- [ ] **Task 2: Sensor Harmonization & Anomaly Engine**
  - Implementasikan algoritma kalibrasi sensor di `js/harmonizer.js` (Spatial binning 0.01°, FRP cross-normalization, Z-score historical anomaly).
  - Verifikasi: Menghasilkan indeks aktivitas kebakaran terstandarisasi per minggu/bulan per AOI tanpa lonjakan palsu pasca-2012.

- [ ] **Task 3: Interactive Mission Control UI Shell & Map**
  - Buat `index.html` dan `css/style.css` dengan desain gelap NASA Earth Observation Command Center.
  - Integrasikan Leaflet.js dengan Carto Dark basemap dan bounding box selector AOI di `js/map.js`.
  - Verifikasi: Halaman termuat di browser dengan peta interaktif dan responsive layout.

- [ ] **Task 4: Burning Activity Calendar Heatmap**
  - Bangun matriks kalender interaktif di `js/calendar.js` (Tahun 2000-2026 x 52 Minggu / 12 Bulan).
  - Tambahkan color-scale gradien termal (low, moderate, critical, extreme).
  - Verifikasi: Kalender menampilkan visualisasi tren historis dan tooltip detail per cell.

- [ ] **Task 5: Critical Period Detection & Anomaly Alerts**
  - Buat modul deteksi otomatis periode kritis (misal: "Peak Season: Weeks 32-41") dan indikator early warning lonjakan anomali kebakaran.
  - Verifikasi: Banner peringatan muncul saat memilih tahun/minggu dengan tingkat kebakaran anomali tinggi (misal: El Niño 2015/2019).

- [ ] **Task 6: Raw vs Harmonized Comparison Tool**
  - Buat toggle/slider perbandingan interaktif: "Raw Sensor Data (Split/Biased)" vs "Terra Harmonia (Calibrated)".
  - Verifikasi: Memperlihatkan secara visual bukti bahwa bias resolusi telah terpecahkan sesuai kriteria juri NASA.
