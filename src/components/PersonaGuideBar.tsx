import React from 'react';
import { Language } from '../data/translations';
import { Shield, Flame, Microscope, Trees, Compass } from 'lucide-react';
import { NavTab } from './Navbar';
import { OverviewViewMode } from './DashboardControlBar';

export type UserPersona = 'all' | 'commander' | 'patrol' | 'researcher' | 'concession';

interface PersonaGuideBarProps {
  language: Language;
  activePersona: UserPersona;
  onSelectPersona: (persona: UserPersona) => void;
  onNavigateTab: (tab: NavTab) => void;
  onSelectOverviewView: (view: OverviewViewMode) => void;
}

export const PersonaGuideBar: React.FC<PersonaGuideBarProps> = ({
  language,
  activePersona,
  onSelectPersona,
  onNavigateTab,
  onSelectOverviewView,
}) => {
  const personas = [
    {
      id: 'all' as UserPersona,
      icon: Compass,
      labelId: 'Umum & Semua Fitur',
      labelEn: 'General & All Tools',
      descId: 'Navigasi bebas seluruh modul intelijen 26 tahun Terra Harmonia.',
      descEn: 'Full open navigation across all 26-year Terra Harmonia modules.',
      action: () => {
        onSelectPersona('all');
      },
    },
    {
      id: 'commander' as UserPersona,
      icon: Shield,
      labelId: 'Komando Darurat (BNPB / KLHK)',
      labelEn: 'Command & Policy (BNPB / KLHK)',
      descId: 'Fokus: Peringatan anomali ekstrem, feed satelit 24 jam, dan dossier SitRep A4 siap cetak.',
      descEn: 'Focus: Extreme anomaly alerts, 24-hr satellite feeds, and print-ready SitRep dossier.',
      action: () => {
        onSelectPersona('commander');
        onNavigateTab('overview');
        onSelectOverviewView('main');
      },
    },
    {
      id: 'patrol' as UserPersona,
      icon: Flame,
      labelId: 'Satgas Patroli (Manggala Agni / MPA)',
      labelEn: 'Field Patrol (Manggala Agni / MPA)',
      descId: 'Fokus: Pantau muka air tanah gambut (TMAG < -40 cm), sekat kanal, dan nota dinas patroli.',
      descEn: 'Focus: Groundwater table depth (TMAG < -40 cm), canal blocking, and dispatch memo.',
      action: () => {
        onSelectPersona('patrol');
        onNavigateTab('mitigation');
      },
    },
    {
      id: 'researcher' as UserPersona,
      icon: Microscope,
      labelId: 'Peneliti Iklim & Sains Geospasial',
      labelEn: 'Climate Scientists & Researchers',
      descId: 'Fokus: Kalibrasi FRP, resolusi 5.5 km, normalisasi pergeseran sensor, dan komparasi 2 tahun.',
      descEn: 'Focus: FRP cross-calibration, 5.5 km equal-area binning, and dual-year delta analytics.',
      action: () => {
        onSelectPersona('researcher');
        onNavigateTab('lab');
      },
    },
    {
      id: 'concession' as UserPersona,
      icon: Trees,
      labelId: 'Auditor Konsesi & ESG Sawit/HTI',
      labelEn: 'Concession & ESG Forest Auditor',
      descId: 'Fokus: Audit titik api historis di batas konsesi custom GeoJSON & estimasi emisi karbon.',
      descEn: 'Focus: Point-in-polygon historical fire audit in custom GeoJSON & carbon accounting.',
      action: () => {
        onSelectPersona('concession');
        onNavigateTab('overview');
        onSelectOverviewView('polygon');
      },
    },
  ];

  const currentPersonaObj = personas.find((p) => p.id === activePersona) || personas[0];

  return (
    <div className="bg-white border border-[#e5e5e7] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 transition-all">
      
      {/* Persona Header & Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#86868b] shrink-0">
            {language === 'id' ? 'Sesuaikan Peran Pengguna:' : 'Tailor by Target Role:'}
          </span>
        </div>

        {/* Segmented Persona Buttons */}
        <div className="flex items-center bg-[#f5f5f7] border border-[#e5e5e7] rounded-xl p-1 gap-1 overflow-x-auto">
          {personas.map((p) => {
            const isSelected = activePersona === p.id;
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={p.action}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1d1d1f] text-white shadow-xs'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{language === 'id' ? p.labelId.split(' (')[0] : p.labelEn.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Role Mission Helper Strip */}
      <div className="px-3.5 py-2 rounded-xl bg-[#fbfbfd] border border-[#e5e5e7] flex items-center justify-between gap-3 text-xs text-[#515154]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
          <span>
            <strong className="text-[#1d1d1f]">
              {language === 'id' ? currentPersonaObj.labelId : currentPersonaObj.labelEn}:
            </strong>{' '}
            {language === 'id' ? currentPersonaObj.descId : currentPersonaObj.descEn}
          </span>
        </div>

        <span className="hidden sm:inline text-[11px] text-[#86868b] shrink-0 font-medium">
          {language === 'id' ? 'Standar Operasional NASA & KLHK' : 'NASA & National Standard'}
        </span>
      </div>

    </div>
  );
};
