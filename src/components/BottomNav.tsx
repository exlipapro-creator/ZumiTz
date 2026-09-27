import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Plus,
  PieChart,
  WalletCards,
  PiggyBank,
  Settings,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenQuickAdd: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onNavigate,
  onOpenQuickAdd,
}) => {
  const { t, canEdit } = useFinance();

  const tabs = [
    { id: 'dashboard', label: t('navOverview'), icon: LayoutDashboard },
    { id: 'transactions', label: t('navTransactions'), icon: Receipt },
    { id: 'budget', label: t('navBudget'), icon: PieChart },
    { id: 'wallets', label: t('navWallets'), icon: WalletCards },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md pb-safe">
      <div className="relative mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {/* Left 2 Tabs */}
        {tabs.slice(0, 2).map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 cursor-pointer transition-colors ${
                isActive ? 'text-primary' : 'text-text-muted hover:text-text'
              }`}
            >
              <Icon size={20} className={isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'} />
              <span className={`text-[10px] tracking-tight mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Center Elevate Action (+) Button */}
        <div className="relative -top-2 flex flex-col items-center">
          <button
            onClick={onOpenQuickAdd}
            disabled={!canEdit}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform disabled:opacity-50 cursor-pointer"
            title="Weka Muamala Mpya"
            aria-label="Weka Muamala Mpya"
          >
            <Plus size={24} className="stroke-[2.5]" />
          </button>
          <span className="text-[9px] font-medium text-text-muted mt-0.5">Weka</span>
        </div>

        {/* Right 2 Tabs */}
        {tabs.slice(2, 4).map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 cursor-pointer transition-colors ${
                isActive ? 'text-primary' : 'text-text-muted hover:text-text'
              }`}
            >
              <Icon size={20} className={isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'} />
              <span className={`text-[10px] tracking-tight mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
