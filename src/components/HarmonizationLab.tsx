import React, { useState } from 'react';
import { Sliders, Info, ShieldCheck } from 'lucide-react';
import { Language } from '../data/translations';

interface HarmonizationLabProps {
  language: Language;
}

export const HarmonizationLab: React.FC<HarmonizationLabProps> = ({ language }) => {
  // Interactive Simulation State
  const [simFireRadius, setSimFireRadius] = useState<number>(1.8); // km
  const [simFireIntensity, setSimFireIntensity] = useState<number>(65); // MW/km2
  const [simScanAngle, setSimScanAngle] = useState<number>(24); // degrees off nadir

  // Physics calculation
  const modisPixelArea = Math.round(1.0 * (1 + 0.025 * simScanAngle) * 10) / 10;
  const viirsPixelArea = Math.round(0.14 * (1 + 0.012 * simScanAngle) * 100) / 100;

  const fireGroundArea = Math.PI * Math.pow(simFireRadius, 2);
  const estimatedTotalMW = Math.round(fireGroundArea * simFireIntensity);

  const simulatedModisRawCount = Math.max(1, Math.round(fireGroundArea / (modisPixelArea * 0.9)));
  const simulatedViirsRawCount = Math.max(1, Math.round(fireGroundArea / (viirsPixelArea * 1.8)));
  const rawRatio = (simulatedViirsRawCount / simulatedModisRawCount).toFixed(1);

  const harmonizedBinCount = Math.max(1, Math.ceil(fireGroundArea / 6.2));
  const calibratedEnergyOutput = estimatedTotalMW;

  return (
    <div className="w-full space-y-6">
      
      {/* Editorial Header (No capsule pills) */}
      <div className="space-y-2 pt-2 pb-4 border-b border-[#e5e5e7]">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
          {language === 'id' ? 'Metodologi & Fisika Satelit' : 'Methodology & Sensor Physics'}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight">
          {language === 'id'
            ? 'Mengapa Pergantian Sensor Membuat Titik Api Tampak Naik 3x Lipat?'
            : 'Why Satellite Sensor Shifts Artificially Inflate Fire Counts'}
        </h1>
        <p className="text-sm text-[#6e6e73] max-w-3xl leading-relaxed">
          {language === 'id'
            ? 'Pada 2012, NASA mengoperasikan VIIRS (resolusi 375m) berdampingan dengan MODIS (1km). Karena ukuran piksel VIIRS 7 kali lebih kecil, satu kebakaran yang sama terdeteksi sebagai banyak titik terpisah. Algoritma Terra Harmonia mengelompokkan deteksi ke dalam grid 5.5 km untuk mengembalikan perbandingan historis yang valid.'
            : 'In 2012, NASA deployed the VIIRS sensor (375m resolution) alongside MODIS (1km). With 7x smaller pixel footprints, a single fire front registers as multiple adjacent detections. Terra Harmonia resolves this via 5.5 km spatial binning to preserve scientific continuity across 26 years.'}
        </p>
      </div>

      {/* Interactive Simulation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Controls Card (Clean White) */}
        <div className="lg:col-span-5 bg-white border border-[#e5e5e7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm text-[#1d1d1f]">
              {language === 'id' ? 'Parameter Front Kebakaran' : 'Fire Front Parameters'}
            </h2>
            <Sliders className="w-4 h-4 text-[#86868b]" />
          </div>

          <div className="space-y-4 text-xs">
            {/* Radius Slider */}
            <div>
              <div className="flex justify-between text-[#1d1d1f] mb-1 font-medium">
                <span>{language === 'id' ? 'Radius Area Terbakar' : 'Fire Front Radius'}:</span>
                <span className="font-bold num">{simFireRadius} km</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={simFireRadius}
                onChange={(e) => setSimFireRadius(parseFloat(e.target.value))}
                className="w-full accent-[#1d1d1f] cursor-pointer"
              />
              <span className="text-[11px] text-[#86868b]">Luas permukaan: {fireGroundArea.toFixed(1)} km²</span>
            </div>

            {/* Heat Intensity Slider */}
            <div>
              <div className="flex justify-between text-[#1d1d1f] mb-1 font-medium">
                <span>{language === 'id' ? 'Intensitas Radiasi (FRP)' : 'FRP Intensity'}:</span>
                <span className="font-bold num">{simFireIntensity} MW/km²</span>
              </div>
              <input
                type="range"
                min="20"
                max="150"
                step="5"
                value={simFireIntensity}
                onChange={(e) => setSimFireIntensity(parseInt(e.target.value))}
                className="w-full accent-[#1d1d1f] cursor-pointer"
              />
              <span className="text-[11px] text-[#86868b]">Total daya radiasi: {estimatedTotalMW.toLocaleString()} MW</span>
            </div>

            {/* Scan Angle */}
            <div>
              <div className="flex justify-between text-[#1d1d1f] mb-1 font-medium">
                <span>{language === 'id' ? 'Sudut Pengamatan (Off-Nadir)' : 'Scan Angle'}:</span>
                <span className="font-bold num">{simScanAngle}&deg;</span>
              </div>
              <input
                type="range"
                min="0"
                max="55"
                step="1"
                value={simScanAngle}
                onChange={(e) => setSimScanAngle(parseInt(e.target.value))}
                className="w-full accent-[#1d1d1f] cursor-pointer"
              />
              <span className="text-[11px] text-[#86868b]">Distorsi ukuran piksel di tepi sapuan instrumen satelit</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#f5f5f7] rounded-xl border border-[#e5e5e7] text-xs space-y-1.5">
            <div className="font-semibold text-[#1d1d1f] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#6e6e73]" />
              <span>{language === 'id' ? 'Spesifikasi Footprint Sensor' : 'Sensor Footprint Area'}:</span>
            </div>
            <div className="flex justify-between text-[#6e6e73] text-[11px]">
              <span>MODIS (Terra/Aqua):</span>
              <span className="font-medium text-[#1d1d1f] num">{modisPixelArea} km² / piksel</span>
            </div>
            <div className="flex justify-between text-[#6e6e73] text-[11px]">
              <span>VIIRS (Suomi-NPP/NOAA):</span>
              <span className="font-medium text-[#1d1d1f] num">{viirsPixelArea} km² / piksel</span>
            </div>
          </div>
        </div>

        {/* Output Comparison Card (Clean Neutral White) */}
        <div className="lg:col-span-7 bg-white border border-[#e5e5e7] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e5e7]">
              <h2 className="font-semibold text-sm text-[#1d1d1f]">
                {language === 'id' ? 'Perbandingan Hasil Deteksi' : 'Detection Output Comparison'}
              </h2>
              <span className="text-xs font-semibold text-[#6e6e73]">
                Rasio Bias: {rawRatio}x
              </span>
            </div>

            {/* Clean White Subcards */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Raw Uncorrected */}
              <div className="p-4 rounded-xl border border-[#e5e5e7] bg-[#fbfbfd]">
                <div className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wider mb-2">
                  {language === 'id' ? 'Deteksi Mentah' : 'Uncorrected Raw'}
                </div>
                
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#86868b]">MODIS (1 km):</span>
                    <span className="text-base font-bold text-[#1d1d1f] num">{simulatedModisRawCount} titik</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#86868b]">VIIRS (375 m):</span>
                    <span className="text-base font-bold text-[#1d1d1f] num">{simulatedViirsRawCount} titik</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#86868b] mt-3 pt-2 border-t border-[#e5e5e7] leading-relaxed">
                  {language === 'id'
                    ? 'Tanpa kalibrasi, tahun 2018 (MODIS+VIIRS) keliru diinterpretasikan memiliki frekuensi kebakaran 3x lebih banyak daripada 2005 (MODIS).'
                    : 'Without correction, post-2012 multi-sensor records falsely suggest dramatic increases in fire frequency due to higher camera resolution.'}
                </p>
              </div>

              {/* Harmonized */}
              <div className="p-4 rounded-xl border border-[#1d1d1f]/15 bg-white shadow-xs">
                <div className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider mb-2 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1d1d1f]" />
                  <span>{language === 'id' ? 'Terra Harmonia (Terkalibrasi)' : 'Harmonized 5.5 km'}</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#6e6e73]">Klaster Spasial:</span>
                    <span className="text-base font-bold text-[#1d1d1f] num">{harmonizedBinCount} klaster</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#6e6e73]">Energi Radiasi:</span>
                    <span className="text-base font-bold text-[#1d1d1f] num">{calibratedEnergyOutput.toLocaleString()} MW</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#6e6e73] mt-3 pt-2 border-t border-[#e5e5e7] leading-relaxed">
                  {language === 'id'
                    ? 'Titik ganda disatukan ke kisi 5.5 km, menghasilkan indeks aktivitas pembakaran (BAI) yang konsisten dan setara secara fisik.'
                    : 'Sub-pixel duplicates are combined into 5.5 km equal-area bins, producing a scientifically uniform metric from 2000 to 2026.'}
                </p>
              </div>
            </div>
          </div>

          {/* Clean Scientific Formula */}
          <div className="p-3.5 rounded-xl bg-[#f5f5f7] border border-[#e5e5e7] text-xs font-mono space-y-1">
            <div className="text-[10px] text-[#6e6e73] uppercase tracking-wider font-semibold">
              Formula Indeks Aktivitas Pembakaran (BAI)
            </div>
            <div className="text-[#1d1d1f] font-semibold text-[11px]">
              BAI = min(100, (N_klaster_5.5km * 1.85) + (FRP_kalibrasi / 1500) * 45)
            </div>
            <div className="text-[10px] text-[#86868b]">
              FRP_kalibrasi = (FRP_MODIS * 1.04) + (FRP_VIIRS * 0.88)
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Specification Matrix */}
      <div className="bg-white border border-[#e5e5e7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="font-semibold text-sm text-[#1d1d1f]">
          {language === 'id' ? 'Spesifikasi Teknis Sensor NASA' : 'NASA Sensor Technical Specifications'}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#e5e5e7] text-[#86868b] font-medium uppercase text-[10px]">
                <th className="py-2.5 pr-4">Parameter</th>
                <th className="py-2.5 px-4">MODIS (Terra / Aqua)</th>
                <th className="py-2.5 px-4">VIIRS (Suomi-NPP / NOAA)</th>
                <th className="py-2.5 pl-4">Terra Harmonia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e7] text-[#1d1d1f]">
              <tr>
                <td className="py-3 pr-4 font-medium text-[#6e6e73]">Masa Operasional</td>
                <td className="py-3 px-4 num">2000 – Sekarang</td>
                <td className="py-3 px-4 num">2012 – Sekarang</td>
                <td className="py-3 pl-4 font-semibold num">2000 – 2026 (26 Tahun)</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-[#6e6e73]">Resolusi Spasial (Nadir)</td>
                <td className="py-3 px-4 num">1.0 km × 1.0 km</td>
                <td className="py-3 px-4 num">375 m × 375 m</td>
                <td className="py-3 pl-4 font-semibold num">5.5 km Equal-Area Grid</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-[#6e6e73]">Kanal Deteksi Termal</td>
                <td className="py-3 px-4">3.9 μm, 11 μm</td>
                <td className="py-3 px-4">3.74 μm, 11.45 μm</td>
                <td className="py-3 pl-4 font-semibold">Dual-band harmonized</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-[#6e6e73]">Waktu Lintas Khatulistiwa</td>
                <td className="py-3 px-4 num">10:30 & 13:30 LT</td>
                <td className="py-3 px-4 num">13:30 LT</td>
                <td className="py-3 pl-4 font-semibold">Mingguan terpadu</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
