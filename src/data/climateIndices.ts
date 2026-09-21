export interface ClimateIndexYear {
  year: number;
  oni: number; // Oceanic Niño Index (SST anomaly in Niño 3.4 region in °C)
  dmi: number; // Dipole Mode Index (Indian Ocean Dipole anomaly in °C)
  phase: 'El Niño' | 'La Niña' | 'Neutral' | 'Strong El Niño' | 'Extreme El Niño';
  iodPhase: 'Positive IOD' | 'Negative IOD' | 'Neutral IOD' | 'Extreme Positive IOD';
  droughtImpact: 'Extreme' | 'High' | 'Moderate' | 'Low' | 'Very Low';
  notes: string;
}

export const climateIndices26Years: ClimateIndexYear[] = [
  { year: 2000, oni: -0.7, dmi: -0.1, phase: 'La Niña', iodPhase: 'Neutral IOD', droughtImpact: 'Very Low', notes: 'Wet conditions across Sumatra and Kalimantan.' },
  { year: 2001, oni: -0.3, dmi: 0.1, phase: 'Neutral', iodPhase: 'Neutral IOD', droughtImpact: 'Low', notes: 'Near baseline conditions.' },
  { year: 2002, oni: 1.1, dmi: 0.3, phase: 'El Niño', iodPhase: 'Neutral IOD', droughtImpact: 'Moderate', notes: 'Moderate El Niño dry spell induced peat burning.' },
  { year: 2003, oni: 0.4, dmi: 0.2, phase: 'Neutral', iodPhase: 'Neutral IOD', droughtImpact: 'Low', notes: 'Moderate post-El Niño season.' },
  { year: 2004, oni: 0.7, dmi: 0.1, phase: 'El Niño', iodPhase: 'Neutral IOD', droughtImpact: 'Moderate', notes: 'Elevated fire detections in Riau.' },
  { year: 2005, oni: 0.3, dmi: 0.2, phase: 'Neutral', iodPhase: 'Neutral IOD', droughtImpact: 'Moderate', notes: 'Intense short dry spell in central Sumatra.' },
  { year: 2006, oni: 1.0, dmi: 0.8, phase: 'El Niño', iodPhase: 'Positive IOD', droughtImpact: 'High', notes: 'Co-occurrence of El Niño and Positive IOD caused severe peatland haze.' },
  { year: 2007, oni: -1.1, dmi: -0.2, phase: 'La Niña', iodPhase: 'Neutral IOD', droughtImpact: 'Very Low', notes: 'Strong La Niña wet season; minimal burning.' },
  { year: 2008, oni: -0.8, dmi: -0.3, phase: 'La Niña', iodPhase: 'Negative IOD', droughtImpact: 'Very Low', notes: 'High rainfall suppressed fire ignitions.' },
  { year: 2009, oni: 1.3, dmi: 0.2, phase: 'El Niño', iodPhase: 'Neutral IOD', droughtImpact: 'Moderate', notes: 'El Niño elevated dry conditions in South Sumatra.' },
  { year: 2010, oni: -1.4, dmi: -0.4, phase: 'La Niña', iodPhase: 'Negative IOD', droughtImpact: 'Very Low', notes: 'Historic "year without a dry season" across Indonesia.' },
  { year: 2011, oni: -0.9, dmi: 0.5, phase: 'La Niña', iodPhase: 'Positive IOD', droughtImpact: 'Low', notes: 'Conflicting climate drivers stabilized conditions.' },
  { year: 2012, oni: -0.3, dmi: 0.4, phase: 'Neutral', iodPhase: 'Positive IOD', droughtImpact: 'Low', notes: 'VIIRS launched (S-NPP); sensor calibration baseline starts.' },
  { year: 2013, oni: -0.4, dmi: -0.2, phase: 'Neutral', iodPhase: 'Neutral IOD', droughtImpact: 'Moderate', notes: 'Localized June flash fire event in Riau province.' },
  { year: 2014, oni: 0.5, dmi: 0.2, phase: 'Neutral', iodPhase: 'Neutral IOD', droughtImpact: 'Moderate', notes: 'Developing El Niño conditions.' },
  { year: 2015, oni: 2.6, dmi: 0.7, phase: 'Extreme El Niño', iodPhase: 'Positive IOD', droughtImpact: 'Extreme', notes: 'Catastrophic Super El Niño with severe drought and subterranean peat fires emitting >1.6 Gt CO2e.' },
  { year: 2016, oni: -0.5, dmi: -0.5, phase: 'La Niña', iodPhase: 'Negative IOD', droughtImpact: 'Very Low', notes: 'Post-disaster wet conditions; BRGM peat agency established.' },
  { year: 2017, oni: -0.6, dmi: 0.1, phase: 'La Niña', iodPhase: 'Neutral IOD', droughtImpact: 'Very Low', notes: 'High canal water levels; minimal fires.' },
  { year: 2018, oni: 0.8, dmi: 0.3, phase: 'El Niño', iodPhase: 'Neutral IOD', droughtImpact: 'Moderate', notes: 'Moderate dry conditions mitigated by canal blocks.' },
  { year: 2019, oni: 0.8, dmi: 1.2, phase: 'El Niño', iodPhase: 'Extreme Positive IOD', droughtImpact: 'Extreme', notes: 'Record-breaking Positive IOD drove intense desiccating winds and catastrophic fires across Kalimantan.' },
  { year: 2020, oni: -1.0, dmi: -0.2, phase: 'La Niña', iodPhase: 'Neutral IOD', droughtImpact: 'Very Low', notes: 'Triple-dip La Niña begins; very low fire counts.' },
  { year: 2021, oni: -1.0, dmi: -0.3, phase: 'La Niña', iodPhase: 'Negative IOD', droughtImpact: 'Very Low', notes: 'Abundant rainfall; natural peat recharge.' },
  { year: 2022, oni: -1.0, dmi: -0.4, phase: 'La Niña', iodPhase: 'Negative IOD', droughtImpact: 'Very Low', notes: 'Continued La Niña; fire activity remains suppressed.' },
  { year: 2023, oni: 2.0, dmi: 1.1, phase: 'Strong El Niño', iodPhase: 'Extreme Positive IOD', droughtImpact: 'High', notes: 'Resurgence of drought conditions; partial canal block mitigation active.' },
  { year: 2024, oni: 0.4, dmi: 0.1, phase: 'Neutral', iodPhase: 'Neutral IOD', droughtImpact: 'Low', notes: 'Transition to neutral ENSO; stable moisture levels.' },
  { year: 2025, oni: -0.4, dmi: -0.1, phase: 'Neutral', iodPhase: 'Neutral IOD', droughtImpact: 'Low', notes: 'Moderate rainfall baseline; monitored via harmonized grid.' },
  { year: 2026, oni: 0.1, dmi: 0.0, phase: 'Neutral', iodPhase: 'Neutral IOD', droughtImpact: 'Low', notes: 'Live NASA FIRMS feed integration active.' },
];

export function getClimateYearData(year: number): ClimateIndexYear {
  const found = climateIndices26Years.find((d) => d.year === year);
  return found || climateIndices26Years[climateIndices26Years.length - 1];
}
