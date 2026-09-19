import React, { useState } from 'react';
import { Logo } from './Logo';
import { Language, translations } from '../data/translations';
import { Menu, X } from 'lucide-react';

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

  const navItems = [
    { id: 'overview' as NavTab, label: t.navOverview },
    { id: 'lab' as NavTab, label: t.navLab },
    { id: 'mitigation' as NavTab, label: t.navMitigation },
    { id: 'data-hub' as NavTab, label: t.navData },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#e5e5e7] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between gap-4">
          
          {/* Brand */}
          <div className="flex items-center cursor-pointer" onClick={() => onSelectTab('overview')}>
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links (Apple Style Clean Typography) */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`text-[13px] font-medium transition-colors relative py-1 ${
                    isActive
                      ? 'text-[#1d1d1f] font-semibold'
                      : 'text-[#86868b] hover:text-[#1d1d1f]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-[#1d1d1f] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            
            {/* Live Indicator */}
            {isLiveSync && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-[#1d1d1f]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                NASA FIRMS Live
              </span>
            )}

            {/* Language Switch */}
            <div className="flex items-center bg-[#e5e5ea] rounded-full p-0.5 text-[11px] font-medium">
              <button
                onClick={() => onToggleLanguage('en')}
                className={`px-2 py-0.5 rounded-full transition-all ${
                  language === 'en'
                    ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
                    : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onToggleLanguage('id')}
                className={`px-2 py-0.5 rounded-full transition-all ${
                  language === 'id'
                    ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
                    : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                ID
              </button>
            </div>

            {/* Team Dossier Text Button */}
            <button
              onClick={onOpenTeam}
              className="text-[12px] font-medium text-[#0071e3] hover:underline px-1 py-1"
            >
              {t.team}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#1d1d1f] min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden bg-black/20 backdrop-blur-xs pt-12 flex flex-col">
          <div className="bg-white border-b border-[#e5e5e7] p-4 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition min-h-[44px] ${
                    isActive
                      ? 'bg-[#f5f5f7] text-[#1d1d1f] font-semibold'
                      : 'text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
