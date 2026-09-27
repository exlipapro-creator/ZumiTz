import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { TransactionModal } from './components/TransactionModal';
import { SecurityPinModal } from './components/SecurityPinModal';
import { AuthModal } from './components/AuthModal';

// Views
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { TransactionsView } from './views/TransactionsView';
import { BudgetView } from './views/BudgetView';
import { WalletsView } from './views/WalletsView';
import { SavingsView } from './views/SavingsView';
import { DebtsView } from './views/DebtsView';
import { ConverterView } from './views/ConverterView';
import { HouseholdView } from './views/HouseholdView';
import { SettingsView } from './views/SettingsView';

function MainApp() {
  const { isAuthenticated, loginAsGuest, toast, clearToast } = useFinance();

  // If user is authenticated, start on dashboard; if guest/first visit, start on landing
  const [currentTab, setCurrentTab] = useState<string>(() => {
    return isAuthenticated ? 'dashboard' : 'landing';
  });

  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleEnterApp = () => {
    if (!isAuthenticated) {
      loginAsGuest();
    }
    setCurrentTab('dashboard');
  };

  const renderCurrentView = () => {
    switch (currentTab) {
      case 'landing':
        return (
          <LandingView
            onEnterApp={handleEnterApp}
            onOpenAuth={handleOpenAuth}
          />
        );
      case 'dashboard':
        return (
          <DashboardView
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        );
      case 'transactions':
        return <TransactionsView onOpenQuickAdd={() => setIsQuickAddOpen(true)} />;
      case 'budget':
        return <BudgetView />;
      case 'wallets':
        return <WalletsView />;
      case 'savings':
        return <SavingsView />;
      case 'debts':
        return <DebtsView />;
      case 'converter':
        return <ConverterView />;
      case 'household':
        return <HouseholdView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <DashboardView
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col font-sans transition-colors selection:bg-primary/20 selection:text-primary">
      {/* Top Bar with Brand Wordmark, Nav Links, DALADALA Stealth Mode, & Auth profile */}
      <TopBar
        currentTab={currentTab}
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full">{renderCurrentView()}</main>

      {/* Mobile Ergonomic Bottom Tab Bar (shown when not on landing page) */}
      {currentTab !== 'landing' && (
        <BottomNav
          currentTab={currentTab}
          onNavigate={(tab) => setCurrentTab(tab)}
          onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        />
      )}

      {/* Quick Transaction Action Modal */}
      <TransactionModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />

      {/* Authentication Modal (Sign In / Register / Google / Guest Instant Demo) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        defaultMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setCurrentTab('dashboard')}
      />

      {/* Security PIN Screen (Locks application if enabled until correct PIN is entered) */}
      <SecurityPinModal />

      {/* Floating System Toast */}
      {toast && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface border border-border shadow-2xl backdrop-blur-md animate-in slide-in-from-top-3 duration-200 max-w-sm">
          <div
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              toast.type === 'error'
                ? 'bg-expense ring-4 ring-expense/20'
                : toast.type === 'success'
                ? 'bg-income ring-4 ring-income/20'
                : 'bg-primary ring-4 ring-primary/20'
            }`}
          />
          <p className="text-xs sm:text-sm font-medium text-text flex-1">{toast.message}</p>
          <button
            onClick={clearToast}
            className="text-text-muted hover:text-text p-1 rounded-lg hover:bg-surface-raised cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <MainApp />
    </FinanceProvider>
  );
}
