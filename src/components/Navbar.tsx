import React, { useState } from 'react';
import { Logo } from './Logo';
import { Language, translations } from '../data/translations';
import { Menu, X, Sun, Moon, Sparkles } from 'lucide-react';

export type NavTab = 'story' | 'overview' | 'lab' | 'mitigation' | 'data-hub' | 'team';
export type ThemeMode = 'system' | 'light' | 'dark';

interface NavbarProps {
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenTeam?: () => void;
  onOpenTour?: () => void;
  isLiveSync?: boolean;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  activeTab,
  onSelectTab,
  onOpenTeam,
  onOpenTour,
  isLiveSync = false,
  theme = 'light',
  onToggleTheme,
}) => {
  const t = translations[language];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'story' as NavTab, label: t.navStory },
    { id: 'overview' as NavTab, label: t.navOverview },
    { id: 'lab' as NavTab, label: t.navLab },
    { id: 'mitigation' as NavTab, label: t.navMitigation },
    { id: 'data-hub' as NavTab, label: t.navData },
    { id: 'team' as NavTab, label: t.navTeam },
  ];

  const themeLabel = theme === 'dark'
    ? (language === 'id' ? 'Ganti ke Mode Terang' : 'Switch to Light Mode')
    : (language === 'id' ? 'Ganti ke Mode Gelap' : 'Switch to Dark Mode');

  return (
    <>
      <header className="print:hidden sticky top-0 z-[1000] bg-white/85 dark:bg-[#111827]/85 backdrop-blur-xl border-b border-[#e5e5e7] dark:border-[#1f2937] transition-all w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-13 sm:h-14 flex items-center justify-between gap-4">
          
          {/* Brand */}
          <div className="flex items-center cursor-pointer shrink-0" onClick={() => onSelectTab('overview')}>
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links (Apple Style Clean Typography) */}
          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`text-[13px] font-medium transition-colors relative py-1.5 cursor-pointer ${
                    isActive
                      ? 'text-[#1d1d1f] dark:text-white font-semibold'
                      : 'text-[#86868b] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-[9px] left-0 right-0 h-[2px] bg-[#1d1d1f] dark:bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            
            {/* Live Indicator */}
            {isLiveSync && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-[#1d1d1f] dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                NASA FIRMS Live
              </span>
            )}

            {/* Direct Dark / Light Theme Toggle Button */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                aria-label={themeLabel}
                title={themeLabel}
                className="p-1.5 sm:p-2 rounded-full text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#1f2937] transition border border-[#e5e5e7] dark:border-[#374151] flex items-center justify-center min-w-[36px] min-h-[36px] cursor-pointer group"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 text-[#515154] group-hover:-rotate-12 transition-transform" />
                )}
              </button>
            )}

            {/* Language Switch */}
            <div className="flex items-center bg-[#e5e5ea] dark:bg-[#1f2937] rounded-full p-0.5 text-[11px] font-medium">
              <button
                onClick={() => onToggleLanguage('en')}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white dark:bg-[#374151] text-[#1d1d1f] dark:text-white shadow-xs font-semibold'
                    : 'text-[#86868b] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onToggleLanguage('id')}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  language === 'id'
                    ? 'bg-white dark:bg-[#374151] text-[#1d1d1f] dark:text-white shadow-xs font-semibold'
                    : 'text-[#86868b] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                ID
              </button>
            </div>

            {/* 30-Sec Science Briefing Tour Button */}
            {onOpenTour && (
              <button
                onClick={onOpenTour}
                className="hidden lg:inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-all cursor-pointer shadow-2xs"
                title={language === 'id' ? 'Buka Ringkasan Ilmiah 30 Detik (Pintasan: ?)' : 'Open 30-Second Science Briefing (Shortcut: ?)'}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.scienceTourBtn}</span>
                <kbd className="hidden xl:inline text-[9px] font-mono px-1 py-0.2 rounded bg-white dark:bg-[#111827] border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200">
                  ?
                </kbd>
              </button>
            )}

            {/* Team Tab Quick Link */}
            <button
              onClick={() => onSelectTab('team')}
              className={`text-[12px] font-medium px-2.5 py-1 rounded-full transition-all hidden sm:inline-block cursor-pointer ${
                activeTab === 'team'
                  ? 'bg-[#1d1d1f] dark:bg-white text-white dark:text-[#111827] font-semibold'
                  : 'text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#1f2937]'
              }`}
            >
              {language === 'id' ? 'Tentang Tim' : 'About Team'}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#1d1d1f] dark:text-white min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[1001] md:hidden bg-black/40 backdrop-blur-xs pt-14 flex flex-col">
          <div className="bg-white dark:bg-[#111827] border-b border-[#e5e5e7] dark:border-[#1f2937] p-4 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-150">
            {/* Tour & Nav Items */}
            {onOpenTour && (
              <button
                onClick={() => {
                  onOpenTour();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition min-h-[40px] cursor-pointer bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t.scienceTourBtn}</span>
                </div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider">
                  {language === 'id' ? 'Ringkasan 30 Detik' : '30-Sec Briefing'}
                </span>
              </button>
            )}

            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition min-h-[40px] cursor-pointer ${
                      isActive
                        ? 'bg-[#f5f5f7] dark:bg-[#1f2937] text-[#1d1d1f] dark:text-white font-semibold'
                        : 'text-[#86868b] dark:text-[#9ca3af] hover:bg-[#f5f5f7] dark:hover:bg-[#1f2937] hover:text-[#1d1d1f] dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile Theme & Language Bar */}
            <div className="pt-3 border-t border-[#e5e5e7] dark:border-[#1f2937] flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-[#86868b] dark:text-[#9ca3af]">
                {language === 'id' ? 'Tema Tampilan:' : 'Theme Mode:'}
              </span>

              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition border border-[#e5e5e7] dark:border-[#374151] bg-[#f5f5f7] dark:bg-[#1f2937] text-[#1d1d1f] dark:text-white"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'id' ? 'Mode Gelap (Aktif)' : 'Dark (Active)'}</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{language === 'id' ? 'Mode Terang (Aktif)' : 'Light (Active)'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
