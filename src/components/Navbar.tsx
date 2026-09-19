import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Language, translations } from '../data/translations';
import { 
  Map, 
  FlaskConical, 
  ShieldAlert, 
  Database, 
  Menu, 
  X, 
  Award,
  Radio,
  ExternalLink
} from 'lucide-react';

export type NavTab = 'overview' | 'lab' | 'mitigation' | 'data-hub';

interface NavbarProps {
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenTeam: () => void;
  isLiveSync?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  activeTab,
  onSelectTab,
  onOpenTeam,
  isLiveSync = false,
}) => {
  const t = translations[language];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'overview' as NavTab, label: t.navOverview, icon: <Map className="w-3.5 h-3.5" /> },
    { id: 'lab' as NavTab, label: t.navLab, icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { id: 'mitigation' as NavTab, label: t.navMitigation, icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    { id: 'data-hub' as NavTab, label: t.navData, icon: <Database className="w-3.5 h-3.5" /> },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-xl border-b border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
            : 'bg-white/95 backdrop-blur-md border-b border-zinc-200/60'
        }`}
      >
        {/* Subtle top amber highlight hairline */}
        <div className="h-[2px] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 w-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand / Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('overview')}>
            <Logo size="md" variant="full" withGlow />
          </div>

          {/* Center: Apple-style Segmented Nav (Desktop) */}
          <nav className="hidden md:flex items-center p-1 bg-zinc-100/80 border border-zinc-200/70 rounded-full shadow-inner">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 min-h-[32px] ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm border border-zinc-200/60'
                      : 'text-zinc-600 hover:text-slate-900 hover:bg-zinc-200/50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={isActive ? 'text-amber-600' : 'text-zinc-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Quick Controls */}
          <div className="flex items-center gap-2">
            
            {/* Live NASA Satellite indicator pill */}
            {isLiveSync && (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-[11px] font-semibold text-teal-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600" />
                </span>
                <span>NASA FIRMS Live</span>
              </div>
            )}

            {/* Apple-style Language Switcher */}
            <div className="flex items-center bg-zinc-100/90 border border-zinc-200/80 rounded-full p-0.5 text-[11px] font-bold">
              <button
                onClick={() => onToggleLanguage('en')}
                className={`px-2.5 py-1 rounded-full transition-all min-h-[28px] ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-zinc-500 hover:text-slate-800'
                }`}
                aria-label="English Language"
              >
                EN
              </button>
              <button
                onClick={() => onToggleLanguage('id')}
                className={`px-2.5 py-1 rounded-full transition-all min-h-[28px] ${
                  language === 'id'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-zinc-500 hover:text-slate-800'
                }`}
                aria-label="Bahasa Indonesia"
              >
                ID
              </button>
            </div>

            {/* Team Dossier */}
            <button
              onClick={onOpenTeam}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] rounded-full bg-zinc-900 hover:bg-slate-800 text-white text-xs font-semibold transition shadow-xs focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.team}</span>
            </button>

            {/* Mobile Menu Toggle Button (>= 44px tap target) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 text-slate-700 hover:bg-zinc-200 transition"
              aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Apple-style Slide Down / Sheet) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden bg-slate-950/40 backdrop-blur-xs pt-16 flex flex-col">
          <div className="bg-white border-b border-zinc-200 p-4 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-2 mb-1">
              {language === 'id' ? 'Menu Navigasi' : 'Navigation Menu'}
            </div>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition min-h-[44px] ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 border border-amber-200/80 font-bold'
                      : 'text-slate-700 hover:bg-zinc-100'
                  }`}
                >
                  <span className={`p-2 rounded-lg ${isActive ? 'bg-amber-500 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  onOpenTeam();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 min-h-[44px] rounded-xl bg-zinc-900 text-white text-xs font-semibold"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>{t.team}</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
