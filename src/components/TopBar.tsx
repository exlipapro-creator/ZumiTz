import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Globe,
  Shield,
  User,
  LogOut,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  ExternalLink,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface TopBarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentTab, onNavigate, onOpenAuth }) => {
  const {
    t,
    settings,
    togglePrivacyMode,
    setLanguage,
    lockApp,
    activeMember,
    currentUser,
    isAuthenticated,
    logout,
  } = useFinance();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isLanding = currentTab === 'landing';

  const appNavLinks = [
    { id: 'dashboard', label: t('navOverview') },
    { id: 'transactions', label: t('navTransactions') },
    { id: 'budget', label: t('navBudget') },
    { id: 'wallets', label: t('navWallets') },
    { id: 'savings', label: t('navSavings') },
    { id: 'converter', label: t('navConverter') },
    { id: 'household', label: t('navHousehold') },
    { id: 'settings', label: t('navSettings') },
  ];

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    onNavigate('landing');
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-surface/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6">
        {/* Zone 1: Logo Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'landing')}
            className="flex items-center gap-2 group text-left cursor-pointer focus-visible:outline-none"
            title="Zumi Tanzania"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white font-display font-bold text-lg shadow-xs transition-transform group-hover:scale-105">
              Z
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-xl font-bold tracking-tight text-text">
                Zumi
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                TZ 🇹🇿
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        {!isLanding ? (
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {appNavLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-primary-soft text-primary font-semibold'
                      : 'text-text-muted hover:text-text hover:bg-surface-raised'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-text-muted">
            <a href="#features" className="hover:text-text transition-colors">
              Vipengele
            </a>
            <a href="#household" className="hover:text-text transition-colors">
              Kaya ya Pamoja
            </a>
            <a href="#pricing" className="hover:text-text transition-colors">
              Mipango & Bei
            </a>
            <a href="#faq" className="hover:text-text transition-colors">
              Maswali (FAQ)
            </a>
          </nav>
        )}

        {/* Zone 3: Actions & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Privacy Stealth Toggle (In App only) */}
          {!isLanding && (
            <button
              onClick={togglePrivacyMode}
              className={`flex h-9 w-9 sm:w-auto sm:px-2.5 items-center justify-center gap-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                settings.privacyMode
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border bg-surface hover:bg-surface-raised text-text-muted'
              }`}
              title={settings.privacyMode ? 'Fungua Salio' : t('stealthModeDesc')}
            >
              {settings.privacyMode ? <EyeOff size={16} /> : <Eye size={16} />}
              <span className="hidden md:inline">
                {settings.privacyMode ? 'Usiri: Umewashwa' : 'Usiri'}
              </span>
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(settings.language === 'sw' ? 'en' : 'sw')}
            className="flex h-9 items-center gap-1 rounded-lg border border-border bg-surface px-2.5 text-xs font-medium text-text-muted hover:text-text hover:bg-surface-raised transition-colors cursor-pointer"
            title="Badili Lugha / Switch Language"
          >
            <Globe size={14} />
            <span className="uppercase font-mono text-[11px] font-bold">
              {settings.language}
            </span>
          </button>

          {/* Conditional Auth Actions */}
          {isLanding && !isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="h-9 px-3.5 rounded-xl text-xs font-semibold text-text hover:bg-surface-raised transition-colors cursor-pointer"
              >
                {t('authSignIn')}
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="h-9 px-3.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                {t('landingCtaPrimary')}
              </button>
            </div>
          ) : isLanding && isAuthenticated ? (
            <button
              onClick={() => onNavigate('dashboard')}
              className="h-9 px-4 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LayoutDashboard size={14} />
              <span>Nenda kwenye App</span>
            </button>
          ) : (
            /* In-App User Profile Dropdown */
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex h-9 items-center gap-2 rounded-xl border border-border bg-surface pl-2 pr-2.5 text-xs font-medium text-text hover:bg-surface-raised transition-colors cursor-pointer"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold">
                  {currentUser?.name ? currentUser.name[0].toUpperCase() : activeMember.name[0]}
                </span>
                <span className="hidden sm:inline max-w-[100px] truncate text-xs font-medium">
                  {currentUser?.name || activeMember.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} className="text-text-muted" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-11 z-40 w-56 rounded-2xl border border-border bg-surface p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-border/80 mb-1">
                      <p className="text-xs font-bold text-text truncate">
                        {currentUser?.name || activeMember.name}
                      </p>
                      <p className="text-[11px] text-text-muted truncate">
                        {currentUser?.email || 'Akaunti ya Ndani'}
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <span className="rounded-full bg-income-soft px-2 py-0.5 text-[9px] font-bold text-income">
                          {currentUser?.plan === 'premium' ? 'Zumi Premium 🇹🇿' : 'Mpango wa Bure'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onNavigate('landing');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-muted hover:text-text hover:bg-surface-raised rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <ExternalLink size={14} />
                      <span>Kuhusu Zumi (Landing)</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onNavigate('household');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-muted hover:text-text hover:bg-surface-raised rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <User size={14} />
                      <span>Kaya na Wanafamilia</span>
                    </button>

                    {settings.pinSecurityEnabled && (
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          lockApp();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-muted hover:text-text hover:bg-surface-raised rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <Lock size={14} />
                        <span>Funga App kwa PIN</span>
                      </button>
                    )}

                    <div className="my-1 border-t border-border/80" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-expense hover:bg-expense-soft/50 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>{t('authSignOut')}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
