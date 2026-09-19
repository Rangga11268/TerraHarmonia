import React, { useState } from 'react';
import { Logo } from './Logo';
import { Language, translations } from '../data/translations';
import { Menu, X, Sun, Moon } from 'lucide-react';

export type NavTab = 'overview' | 'lab' | 'mitigation' | 'data-hub' | 'team';

interface NavbarProps {
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenTeam?: () => void;
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
  isLiveSync = false,
  theme = 'light',
  onToggleTheme,
}) => {
  const t = translations[language];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview' as NavTab, label: t.navOverview },
    { id: 'lab' as NavTab, label: t.navLab },
    { id: 'mitigation' as NavTab, label: t.navMitigation },
    { id: 'data-hub' as NavTab, label: t.navData },
    { id: 'team' as NavTab, label: t.navTeam },
  ];

  return (
    <>
      <header className="sticky top-0 z-[1000] bg-white/85 dark:bg-[#111827]/85 backdrop-blur-xl border-b border-[#e5e5e7] dark:border-[#1f2937] transition-all w-full">
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

            {/* Dark / Light Theme Toggle Button */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="p-1.5 sm:p-2 rounded-full text-[#6e6e73] dark:text-[#9ca3af] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#1f2937] transition border border-[#e5e5e7] dark:border-[#374151] flex items-center justify-center min-w-[36px] min-h-[36px] cursor-pointer"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 text-[#515154] hover:-rotate-12 transition-transform" />
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
          <div className="bg-white dark:bg-[#111827] border-b border-[#e5e5e7] dark:border-[#1f2937] p-4 space-y-1 shadow-xl animate-in slide-in-from-top-2 duration-150">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium transition min-h-[44px] cursor-pointer ${
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
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
