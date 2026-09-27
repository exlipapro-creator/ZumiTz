import React, { useState, useMemo } from 'react';
import {
  PieChart,
  AlertTriangle,
  Edit2,
  CheckCircle2,
  TrendingDown,
  Plus,
  Zap,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Category } from '../types';

export const BudgetView: React.FC = () => {
  const {
    t,
    categories,
    transactions,
    updateCategoryBudget,
    formatMoney,
    isAdmin,
    settings,
  } = useFinance();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [budgetInput, setBudgetInput] = useState<string>('');

  // Calculate monthly expense totals per category
  const expenseCategories = useMemo(() => {
    return categories
      .filter((c) => c.type === 'expense')
      .map((c) => {
        const spent = transactions
          .filter((tx) => tx.categoryId === c.id && tx.type === 'expense')
          .reduce((sum, tx) => sum + tx.amount, 0);
        const percent = c.monthlyBudget > 0 ? Math.round((spent / c.monthlyBudget) * 100) : 0;
        const remaining = c.monthlyBudget - spent;
        const isOver = spent > c.monthlyBudget && c.monthlyBudget > 0;
        return {
          ...c,
          spent,
          percent,
          remaining,
          isOver,
        };
      });
  }, [categories, transactions]);

  const { totalBudgeted, totalSpent } = useMemo(() => {
    const bud = expenseCategories.reduce((sum, c) => sum + c.monthlyBudget, 0);
    const sp = expenseCategories.reduce((sum, c) => sum + c.spent, 0);
    return { totalBudgeted: bud, totalSpent: sp };
  }, [expenseCategories]);

  const totalRemaining = totalBudgeted - totalSpent;
  const overallPercent = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

  const handleStartEdit = (cat: Category) => {
    if (!isAdmin) {
      alert('Msimamizi wa kaya pekee ndiye anayeweza kurekebisha bajeti.');
      return;
    }
    setEditingCategory(cat);
    setBudgetInput(String(cat.monthlyBudget));
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    const num = parseFloat(budgetInput.replace(/[^0-9.]/g, '')) || 0;
    updateCategoryBudget(editingCategory.id, num);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text">
          {t('budgetTitle')}
        </h1>
        <p className="text-xs text-text-muted mt-0.5">{t('budgetSubtitle')}</p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Budgeted */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
          <p className="text-xs text-text-muted">{t('budgetTotalBudgeted')}</p>
          <p className="font-mono text-xl sm:text-2xl font-bold text-text mt-1 tabular-nums">
            {formatMoney(totalBudgeted)}
          </p>
          <p className="text-[11px] text-text-faint mt-1">Makundi 10 ya matumizi ya kaya</p>
        </div>

        {/* Total Spent */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
          <p className="text-xs text-text-muted">{t('budgetTotalSpent')}</p>
          <p className="font-mono text-xl sm:text-2xl font-bold text-expense mt-1 tabular-nums">
            {formatMoney(totalSpent)}
          </p>
          <p className="text-[11px] text-text-faint mt-1">
            {overallPercent}% ya bajeti ya mwezi huu
          </p>
        </div>

        {/* Remaining */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
          <p className="text-xs text-text-muted">{t('budgetRemaining')}</p>
          <p
            className={`font-mono text-xl sm:text-2xl font-bold mt-1 tabular-nums ${
              totalRemaining >= 0 ? 'text-income' : 'text-expense'
            }`}
          >
            {formatMoney(totalRemaining)}
          </p>
          <p className="text-[11px] text-text-faint mt-1">
            {totalRemaining >= 0 ? 'Ipo salama' : 'Umezidi bajeti ya mwezi'}
          </p>
        </div>
      </div>

      {/* Overall Progress Meter */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-text">Matumizi Jumla ya Kaya</span>
          <span className="font-mono font-bold text-text">{overallPercent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-raised">
          <div
            className={`h-full rounded-full transition-all ${
              overallPercent > 100 ? 'bg-expense' : 'bg-primary'
            }`}
            style={{ width: `${Math.min(100, overallPercent)}%` }}
          />
        </div>
      </div>

      {/* Category Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {expenseCategories.map((c) => {
          return (
            <div
              key={c.id}
              className={`rounded-2xl border bg-surface p-4 sm:p-5 space-y-3 transition-colors shadow-xs ${
                c.isOver ? 'border-expense/50 bg-expense-soft/20' : 'border-border'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.nameSw[0]}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-text">
                      {settings.language === 'sw' ? c.nameSw : c.name}
                    </h3>
                    <p className="text-[10px] text-text-muted">
                      {c.isOver ? (
                        <span className="text-expense font-semibold flex items-center gap-1">
                          <AlertTriangle size={11} /> Umezidi bajeti
                        </span>
                      ) : (
                        <span className="text-income font-medium flex items-center gap-1">
                          <CheckCircle2 size={11} /> Ipo ndani ya mpango
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => handleStartEdit(c)}
                    className="p-1.5 rounded-lg border border-border text-text-muted hover:text-primary hover:bg-surface-raised transition-colors cursor-pointer"
                    title={t('budgetEdit')}
                  >
                    <Edit2 size={14} />
                  </button>
                )}
              </div>

              {/* Numbers */}
              <div className="flex items-baseline justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="text-[10px] text-text-muted">Iliyotumika</p>
                  <p className="font-mono text-sm font-bold text-text tabular-nums">
                    {formatMoney(c.spent)}
                  </p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-[10px] text-text-muted">Kiwango cha Bajeti</p>
                  <p className="font-mono text-sm font-semibold text-text-muted tabular-nums">
                    {formatMoney(c.monthlyBudget)}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
                <div
                  className={`h-full rounded-full transition-all ${
                    c.isOver ? 'bg-expense' : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(100, c.percent)}%` }}
                />
              </div>

              {/* Footer info */}
              <div className="flex items-center justify-between text-[11px] text-text-muted pt-0.5">
                <span>
                  {c.isOver
                    ? `Imezidi: ${formatMoney(Math.abs(c.remaining))}`
                    : `Imebaki: ${formatMoney(c.remaining)}`}
                </span>
                <span className="font-mono font-bold text-text">{c.percent}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Budget Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-text">
              Badili Bajeti ya {settings.language === 'sw' ? editingCategory.nameSw : editingCategory.name}
            </h2>
            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Kiwango cha Mwezi (TSh)
                </label>
                <input
                  type="number"
                  required
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-raised p-3 font-mono text-base font-bold text-text focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-text hover:bg-surface-raised cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary-hover active:scale-95 cursor-pointer"
                >
                  Hifadhi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
