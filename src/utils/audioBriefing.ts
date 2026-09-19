/**
 * TerraHarmonia Voice Audio Briefing
 * Native Web Speech API synthesis for hands-free command center situation updates.
 */

import { AOIRegion } from '../engine/harmonizer';
import { Language } from '../data/translations';

let isSpeaking = false;

export function speakSituationBriefing(
  aoi: AOIRegion,
  hotspotCount: number,
  anomalyCount: number,
  language: Language,
  onStateChange?: (speaking: boolean) => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    alert('Web Speech API tidak didukung pada browser ini.');
    return;
  }

  const synth = window.speechSynthesis;

  // If already speaking, stop and reset
  if (synth.speaking || isSpeaking) {
    synth.cancel();
    isSpeaking = false;
    if (onStateChange) onStateChange(false);
    return;
  }

  let text = '';
  if (language === 'id') {
    text = `Laporan Situasi Terra Harmonia. Wilayah pengamatan aktif: ${aoi.name}, bioma ${aoi.biome}. Terdeteksi ${hotspotCount} titik panas dengan ${anomalyCount} minggu anomali historis. Status kewaspadaan kebakaran gambut berada pada level siaga. Disarankan pemantauan tinggi muka air tanah dan patroli sekat kanal secara intensif.`;
  } else {
    text = `Terra Harmonia Situation Briefing. Active region: ${aoi.name}, biome ${aoi.biome}. Detected ${hotspotCount} hotspot records with ${anomalyCount} historical anomaly weeks. Peatland fire alert level is elevated. Ground water level monitoring and canal block patrols are advised.`;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === 'id' ? 'id-ID' : 'en-US';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    isSpeaking = true;
    if (onStateChange) onStateChange(true);
  };

  utterance.onend = () => {
    isSpeaking = false;
    if (onStateChange) onStateChange(false);
  };

  utterance.onerror = () => {
    isSpeaking = false;
    if (onStateChange) onStateChange(false);
  };

  synth.speak(utterance);
}

export function stopSpeakingBriefing(onStateChange?: (speaking: boolean) => void) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    if (onStateChange) onStateChange(false);
  }
}
