import React, { useState } from 'react';
import { 
  FlaskConical, 
  Layers, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  AlertCircle, 
  Info,
  Scale,
  RefreshCw,
  Binary
} from 'lucide-react';
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
  // MODIS pixel footprint grows with scan angle: 1km -> ~2.0km at 45 deg
  const modisPixelArea = Math.round(1.0 * (1 + 0.025 * simScanAngle) * 10) / 10;
  // VIIRS pixel footprint grows slower due to 3:1 aggregation: 375m -> ~750m
  const viirsPixelArea = Math.round(0.14 * (1 + 0.012 * simScanAngle) * 100) / 100;

  // Raw detections simulated
  const fireGroundArea = Math.PI * Math.pow(simFireRadius, 2); // km2
  const estimatedTotalMW = Math.round(fireGroundArea * simFireIntensity);

  // Raw counts
  const simulatedModisRawCount = Math.max(1, Math.round(fireGroundArea / (modisPixelArea * 0.9)));
  const simulatedViirsRawCount = Math.max(1, Math.round(fireGroundArea / (viirsPixelArea * 1.8)));
  const rawRatio = (simulatedViirsRawCount / simulatedModisRawCount).toFixed(1);

  // Harmonized binning output (5.5 km equal-area equalized grid)
  const harmonizedBinCount = Math.max(1, Math.ceil(fireGroundArea / 6.2));
  const calibratedEnergyOutput = estimatedTotalMW;

  return (
    <div className="space-y-6">
      
      {/* Hero Banner: Science Overview */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'id' ? 'Laboratorium Kalibrasi Sensor' : 'Sensor Harmonization Lab'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {language === 'id'
              ? 'Mengapa Satelit Baru Membuat Kebakaran Tampak Naik 3x Lipat?'
              : 'Why New Satellites Cause Fire Counts to Artificially Triple'}
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            {language === 'id'
              ? 'Pada tahun 2012, instrumen VIIRS (resolusi 375m) diluncurkan untuk melengkapi MODIS (resolusi 1km). Karena ukuran piksel VIIRS 7.1x lebih kecil, kebakaran yang sama dipecah menjadi jauh lebih banyak titik deteksi. Lab ini mendemonstrasikan algoritma koreksi spasial 5.5 km Terra Harmonia yang mengembalikan kebenaran fisik energi panas.'
              : 'In 2012, NASA deployed the VIIRS sensor (375m resolution) alongside MODIS (1km). Because VIIRS pixels are 7.1x smaller, the same fire is detected across multiple adjacent sub-pixels. This interactive lab demonstrates Terra Harmonia\'s 5.5 km spatial binning algorithm that restores true physical heat energy across decades.'}
          </p>
        </div>
      </div>

      {/* Interactive Physics & Overlap Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Controls Card */}
        <div className="lg:col-span-5 bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="section-title-bar flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              {language === 'id' ? 'Simulator Parameter Kebakaran' : 'Fire Simulation Parameters'}
            </h3>
            <Sliders className="w-4 h-4 text-amber-600" />
          </div>

          <div className="space-y-4 text-xs">
            {/* Radius Slider */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>{language === 'id' ? 'Radius Front Kebakaran' : 'Fire Front Radius'}:</span>
                <span className="font-bold text-amber-600 num">{simFireRadius} km</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={simFireRadius}
                onChange={(e) => setSimFireRadius(parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-[11px] text-zinc-400">Luas tanah terbakar: {fireGroundArea.toFixed(1)} km²</span>
            </div>

            {/* Heat Intensity Slider */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>{language === 'id' ? 'Intensitas Panas (FRP)' : 'FRP Heat Intensity'}:</span>
                <span className="font-bold text-amber-600 num">{simFireIntensity} MW/km²</span>
              </div>
              <input
                type="range"
                min="20"
                max="150"
                step="5"
                value={simFireIntensity}
                onChange={(e) => setSimFireIntensity(parseInt(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-[11px] text-zinc-400">Total energi radiasi riil: {estimatedTotalMW.toLocaleString()} MW</span>
            </div>

            {/* Scan Angle */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>{language === 'id' ? 'Sudut Lintasan Satelit (Nadir)' : 'Satellite Scan Angle'}:</span>
                <span className="font-bold text-teal-700 num">{simScanAngle}&deg;</span>
              </div>
              <input
                type="range"
                min="0"
                max="55"
                step="1"
                value={simScanAngle}
                onChange={(e) => setSimScanAngle(parseInt(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <span className="text-[11px] text-zinc-400">Efek pemuaian piksel di tepi sapuan satelit (bow-tie distortion)</span>
            </div>
          </div>

          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'id' ? 'Karakteristik Sensor' : 'Sensor Pixel Area'}:</span>
            </div>
            <div className="flex justify-between text-zinc-600 text-[11px]">
              <span>MODIS (Terra/Aqua):</span>
              <strong className="text-slate-800 num">{modisPixelArea} km² / piksel</strong>
            </div>
            <div className="flex justify-between text-zinc-600 text-[11px]">
              <span>VIIRS (Suomi-NPP/NOAA):</span>
              <strong className="text-teal-700 num">{viirsPixelArea} km² / piksel (7x lebih rapat)</strong>
            </div>
          </div>
        </div>

        {/* Live Simulation Output Card */}
        <div className="lg:col-span-7 bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-5">
          <div>
            <div className="section-title-bar flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="font-bold text-sm text-slate-900">
                {language === 'id' ? 'Hasil Simulasi: Mentah vs Terharmonisasi' : 'Simulation: Raw vs Harmonized Output'}
              </h3>
              <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-semibold border border-amber-200">
                {rawRatio}x Overcount Ratio
              </span>
            </div>

            {/* Side-by-side comparison */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Raw Flawed View */}
              <div className="p-4 rounded-xl bg-red-50/60 border border-red-200/80">
                <span className="text-[11px] font-bold text-red-700 uppercase tracking-wide block">
                  {language === 'id' ? 'Deteksi Mentah (Sensor Terpisah)' : 'Uncorrected Raw Counts'}
                </span>
                
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600">MODIS (1 km):</span>
                    <span className="text-lg font-bold text-slate-900 num">{simulatedModisRawCount} titik</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600">VIIRS (375 m):</span>
                    <span className="text-lg font-bold text-red-600 num">{simulatedViirsRawCount} titik</span>
                  </div>
                </div>

                <p className="text-[11px] text-red-800/80 mt-3 pt-2 border-t border-red-200/60 leading-tight">
                  {language === 'id'
                    ? '⚠️ Membandingkan tahun 2005 (hanya MODIS) dan 2018 (MODIS+VIIRS) secara mentah akan menghasilkan kesimpulan keliru bahwa kebakaran melonjak tajam.'
                    : '⚠️ Comparing 2005 (MODIS only) with 2018 (MODIS+VIIRS) without correction falsely concludes that fire frequency tripled.'}
                </p>
              </div>

              {/* TerraHarmonia Calibrated View */}
              <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/80">
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wide block flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  {language === 'id' ? 'Terra Harmonia (Terkoreksi)' : 'Harmonized Equal-Area Grid'}
                </span>

                <div className="mt-3 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600">Klaster Spasial 5.5 km:</span>
                    <span className="text-lg font-bold text-teal-700 num">{harmonizedBinCount} klaster</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-600">Energi Panas Terkalibrasi:</span>
                    <span className="text-lg font-bold text-slate-900 num">{calibratedEnergyOutput.toLocaleString()} MW</span>
                  </div>
                </div>

                <p className="text-[11px] text-teal-800/90 mt-3 pt-2 border-t border-teal-200/60 leading-tight">
                  {language === 'id'
                    ? '✅ Titik-titik sub-piksel digabungkan ke kisi sama-luas 5.5 km. Nilai 2000 s/d 2026 kini dapat dibandingkan secara adil dan valid ilmiah.'
                    : '✅ Multi-pixel duplicates merged into 5.5 km equal-area bins. 2000 to 2026 records are now scientifically comparable.'}
                </p>
              </div>
            </div>
          </div>

          {/* Mathematical Proof Box */}
          <div className="p-3.5 rounded-xl bg-zinc-900 text-zinc-100 text-xs font-mono space-y-1">
            <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
              Formula Kalibrasi Spasial Terra Harmonia
            </div>
            <div className="text-zinc-300 py-1 overflow-x-auto text-[11px]">
              BAI = min(100, (N_clusters_5.5km * 1.85) + (FRP_calibrated / 1500) * 45)
            </div>
            <div className="text-[10px] text-zinc-400">
              Dimana FRP_calibrated = (FRP_MODIS * 1.04) + (FRP_VIIRS * 0.88)
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Specification Matrix */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="section-title-bar">
          <h3 className="font-bold text-sm text-slate-900">
            {language === 'id' ? 'Matriks Perbandingan Teknis Sensor NASA' : 'NASA Satellite Sensor Comparison Matrix'}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5 pr-4">Parameter</th>
                <th className="py-2.5 px-4">MODIS (Terra / Aqua)</th>
                <th className="py-2.5 px-4">VIIRS (Suomi-NPP / NOAA-20)</th>
                <th className="py-2.5 pl-4">Terra Harmonia Harmonized</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-slate-800">
              <tr>
                <td className="py-3 pr-4 font-semibold text-zinc-600">Masa Operasional</td>
                <td className="py-3 px-4 font-mono">2000 - Sekarang (26 Thn)</td>
                <td className="py-3 px-4 font-mono">2012 - Sekarang (14 Thn)</td>
                <td className="py-3 pl-4 font-bold text-amber-600 font-mono">2000 - 2026 (Unified)</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-zinc-600">Resolusi Spasial (Nadir)</td>
                <td className="py-3 px-4 font-mono">1.0 km × 1.0 km</td>
                <td className="py-3 px-4 font-mono">375 m × 375 m</td>
                <td className="py-3 pl-4 font-bold text-teal-700 font-mono">5.5 km Equal-Area Bin</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-zinc-600">Kanal Deteksi Termal</td>
                <td className="py-3 px-4">Band 21/22 (3.9 μm), Band 31 (11 μm)</td>
                <td className="py-3 px-4">I4 Band (3.74 μm), I5 Band (11.45 μm)</td>
                <td className="py-3 pl-4 font-medium text-slate-700">Dual-band cross-calibrated</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-zinc-600">Waktu Lintas Khatulistiwa</td>
                <td className="py-3 px-4 font-mono">10:30 & 13:30 LT</td>
                <td className="py-3 px-4 font-mono">13:30 LT</td>
                <td className="py-3 pl-4 font-medium text-slate-700">Diintegrasikan per minggu kalender</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
