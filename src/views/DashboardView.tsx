import React, { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowRightLeft,
  ChevronRight,
  Zap,
  Wallet as WalletIcon,
  ShieldCheck,
  Smartphone,
  Eye,
  EyeOff,
  Building2,
  Calendar,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface DashboardViewProps {
  onOpenQuickAdd: () => void;
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenQuickAdd,
  onNavigate,
}) => {
  const {
    t,
    wallets,
    categories,
    transactions,
    savingsGoals,
    formatMoney,
    activeMember,
    settings,
    togglePrivacyMode,
  } = useFinance();

  // Calculate totals
  const totalBalance = useMemo(() => {
    return wallets.reduce((sum, w) => sum + w.balance, 0);
  }, [wallets]);

  // Current month income & expenses
  const { currentMonthIncome, currentMonthExpense } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    transactions.forEach((tx) => {
      if (tx.type === 'income') {
        inc += tx.amount;
      } else if (tx.type === 'expense') {
        exp += tx.amount + (tx.fee || 0);
      }
    });
    return { currentMonthIncome: inc, currentMonthExpense: exp };
  }, [transactions]);

  const netSavings = currentMonthIncome - currentMonthExpense;
  const savingsRate =
    currentMonthIncome > 0 ? Math.round((netSavings / currentMonthIncome) * 100) : 0;

  // Time of day greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t('dashGreetingMorning')
      : hour < 17
      ? t('dashGreetingAfternoon')
      : t('dashGreetingEvening');

  // Recent 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12">
      {/* Header Greeting & Member pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span>Kaya ya Kibada, Dar es Salaam</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{activeMember.role}</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-text mt-0.5">
            {greeting}, {activeMember.name.split(' ')[0]}
          </h1>
        </div>

        {/* Quick action triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePrivacyMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
              settings.privacyMode
                ? 'border-primary/50 bg-primary/10 text-primary'
                : 'border-border bg-surface hover:bg-surface-raised text-text-muted'
            }`}
            title="Hali ya Usiri kwenye Daladala"
          >
            {settings.privacyMode ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{settings.privacyMode ? 'Fungua Salio' : 'Ficha (Daladala)'}</span>
          </button>

          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-medium shadow-sm hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Rekodi</span>
          </button>
        </div>
      </div>

      {/* Hero Total Balance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-hover p-6 sm:p-7 text-white shadow-xl shadow-primary/20">
        {/* Glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-xs sm:text-sm font-medium text-white/80">
                {t('dashTotalBalance')}
              </p>
              {settings.privacyMode && (
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white">
                  Imefichwa
                </span>
              )}
            </div>
            <p className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white tabular-nums">
              {formatMoney(totalBalance)}
            </p>
            <p className="text-xs text-white/70 pt-1">
              Kwenye pochi {wallets.length} (Vodacom M-Pesa, CRDB, NMB, Tigo, Cash)
            </p>
          </div>

          {/* Quick Shortcuts inside Card */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenQuickAdd}
              className="flex items-center gap-2 rounded-xl bg-white text-primary px-4 py-2.5 text-xs font-bold shadow-xs hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>Weka Muamala</span>
            </button>
            <button
              onClick={() => onNavigate('wallets')}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 backdrop-blur-sm text-white px-3.5 py-2.5 text-xs font-semibold hover:bg-white/25 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowRightLeft size={14} />
              <span>Hamisha</span>
            </button>
          </div>
        </div>
      </div>

      {/* Income / Expense Stats Split */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Income Card */}
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-text-muted mb-2">
            <span className="font-medium">{t('dashMonthlyIncome')}</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-income/10 text-income">
              <TrendingUp size={14} />
            </div>
          </div>
          <p className="font-mono text-lg sm:text-2xl font-bold text-income tabular-nums">
            {formatMoney(currentMonthIncome)}
          </p>
          <p className="text-[11px] text-text-faint mt-1">Mshahara, Mauzo & UTT</p>
        </div>

        {/* Expense Card */}
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-text-muted mb-2">
            <span className="font-medium">{t('dashMonthlyExpense')}</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-expense/10 text-expense">
              <TrendingDown size={14} />
            </div>
          </div>
          <p className="font-mono text-lg sm:text-2xl font-bold text-expense tabular-nums">
            {formatMoney(currentMonthExpense)}
          </p>
          <p className="text-[11px] text-text-faint mt-1">LUKU, Kodi, Sokoni & Mafuta</p>
        </div>

        {/* Net Savings & Rate (Desktop or col-span-2 on mobile) */}
        <div className="col-span-2 lg:col-span-1 rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-text-muted mb-2">
            <span className="font-medium">{t('dashNetSavings')}</span>
            <span className="font-mono font-bold text-primary text-xs">
              {savingsRate}% ya mapato
            </span>
          </div>
          <p className="font-mono text-lg sm:text-2xl font-bold text-text tabular-nums">
            {formatMoney(netSavings)}
          </p>
          {/* Progress bar */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Wallets & Accounts Quick Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-text flex items-center gap-1.5">
            <WalletIcon size={16} className="text-primary" />
            <span>{t('dashMyWallets')}</span>
          </h2>
          <button
            onClick={() => onNavigate('wallets')}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>{t('dashSeeAll')}</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {wallets.map((w) => (
            <div
              key={w.id}
              className="rounded-2xl border border-border bg-surface p-3.5 space-y-2 hover:border-primary/40 transition-colors shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: w.color }}
                />
                <span className="text-[10px] font-mono text-text-faint">
                  {w.accountNumber}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-text truncate">{w.name}</p>
                <p className="font-mono text-sm font-bold text-text mt-0.5 tabular-nums">
                  {formatMoney(w.balance)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column: Budget Status & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Budget Progress */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text flex items-center gap-1.5">
              <Zap size={16} className="text-goals" />
              <span>{t('dashBudgetOverview')}</span>
            </h2>
            <button
              onClick={() => onNavigate('budget')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Dhibiti Bajeti</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 space-y-3 shadow-xs">
            {categories
              .filter((c) => c.type === 'expense' && c.monthlyBudget > 0)
              .slice(0, 4)
              .map((c) => {
                const spent = transactions
                  .filter((tx) => tx.categoryId === c.id && tx.type === 'expense')
                  .reduce((sum, tx) => sum + tx.amount, 0);
                const percent = Math.round((spent / c.monthlyBudget) * 100);
                const isOver = spent > c.monthlyBudget;

                return (
                  <div key={c.id} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: c.color }}
                        />
                        <span className="font-medium text-text">
                          {settings.language === 'sw' ? c.nameSw : c.name}
                        </span>
                      </div>
                      <div className="font-mono tabular-nums text-text-muted">
                        <span className={isOver ? 'text-expense font-bold' : 'text-text'}>
                          {formatMoney(spent)}
                        </span>
                        <span className="text-text-faint"> / {formatMoney(c.monthlyBudget)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOver ? 'bg-expense' : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Right: Recent Transactions List */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text">
              {t('dashRecentTransactions')}
            </h2>
            <button
              onClick={() => onNavigate('transactions')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>{t('dashSeeAll')}</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-2 shadow-xs divide-y divide-border">
            {recentTransactions.map((tx) => {
              const cat = categories.find((c) => c.id === tx.categoryId);
              const wallet = wallets.find((w) => w.id === tx.walletId);
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2.5 hover:bg-surface-raised rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: cat?.color || '#6366F1' }}
                    >
                      {cat?.nameSw?.[0] || 'M'}
                    </span>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-text truncate max-w-[170px] sm:max-w-[240px]">
                        {tx.note || cat?.nameSw || 'Muamala'}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                        <span>{wallet?.name || 'Pochi'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{tx.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-mono text-xs sm:text-sm font-bold tabular-nums ${
                        isIncome ? 'text-income' : 'text-expense'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatMoney(tx.amount)}
                    </p>
                    {tx.fee && tx.fee > 0 && (
                      <p className="text-[10px] font-mono text-text-faint">
                        Tozo: {formatMoney(tx.fee)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Savings Goals Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-text flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-savings" />
            <span>{t('dashSavingsGoals')}</span>
          </h2>
          <button
            onClick={() => onNavigate('savings')}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>{t('dashSeeAll')}</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {savingsGoals.map((g) => {
            const percent = Math.round((g.currentAmount / g.targetAmount) * 100);
            return (
              <div
                key={g.id}
                className="rounded-2xl border border-border bg-surface p-4 space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text truncate">
                    {settings.language === 'sw' ? g.nameSw : g.name}
                  </span>
                  <span className="font-mono text-xs font-bold text-savings">{percent}%</span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-mono font-bold text-text tabular-nums">
                    {formatMoney(g.currentAmount)}
                  </span>
                  <span className="font-mono text-text-faint tabular-nums">
                    {formatMoney(g.targetAmount)}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
                  <div
                    className="h-full rounded-full bg-savings transition-all"
                    style={{ width: `${Math.min(100, percent)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
