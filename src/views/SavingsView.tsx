import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  ArrowUpRight,
  Calendar,
  PiggyBank,
  Check,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { SavingsGoal } from '../types';

export const SavingsView: React.FC = () => {
  const {
    t,
    savingsGoals,
    wallets,
    addSavingsGoal,
    depositToGoal,
    formatMoney,
    canEdit,
    settings,
  } = useFinance();

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositWalletId, setDepositWalletId] = useState(wallets[0]?.id || '');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNameSw, setNewNameSw] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newDeadline, setNewDeadline] = useState('2026-12-31');
  const [newNotes, setNewNotes] = useState('');

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;
    const amount = parseFloat(depositAmount.replace(/[^0-9.]/g, '')) || 0;
    if (amount <= 0) return;
    const success = depositToGoal(selectedGoal.id, amount, depositWalletId);
    if (success) {
      setIsDepositOpen(false);
      setDepositAmount('');
      setSelectedGoal(null);
    }
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(newTarget.replace(/[^0-9.]/g, '')) || 0;
    if (target <= 0) return;
    addSavingsGoal({
      name: newName || newNameSw,
      nameSw: newNameSw || newName,
      targetAmount: target,
      currentAmount: 0,
      deadline: newDeadline,
      icon: 'Target',
      color: '#0D9488',
      notes: newNotes,
    });
    setIsAddOpen(false);
    setNewName('');
    setNewNameSw('');
    setNewTarget('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text">
            {t('savingsTitle')}
          </h1>
          <p className="text-xs text-text-muted mt-0.5">{t('savingsSubtitle')}</p>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-medium shadow-sm hover:bg-primary-hover active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus size={15} />
            <span>{t('savingsAddGoal')}</span>
          </button>
        )}
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savingsGoals.map((g) => {
          const percent = Math.round((g.currentAmount / g.targetAmount) * 100);
          const remaining = Math.max(0, g.targetAmount - g.currentAmount);

          return (
            <div
              key={g.id}
              className="rounded-2xl border border-border bg-surface p-5 space-y-4 hover:border-primary/40 transition-colors shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-white text-xs font-bold"
                    style={{ backgroundColor: g.color }}
                  >
                    <ShieldCheck size={18} />
                  </span>
                  <span className="font-mono text-xs font-bold text-savings px-2 py-0.5 rounded-full bg-savings-soft">
                    {percent}%
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-text">
                    {settings.language === 'sw' ? g.nameSw : g.name}
                  </h3>
                  {g.notes && <p className="text-xs text-text-muted mt-0.5">{g.notes}</p>}
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-mono text-sm font-bold text-text tabular-nums">
                      {formatMoney(g.currentAmount)}
                    </span>
                    <span className="font-mono text-xs text-text-faint tabular-nums">
                      Lengo: {formatMoney(g.targetAmount)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-raised">
                    <div
                      className="h-full rounded-full bg-savings transition-all"
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-text-muted space-y-0.5 pt-1">
                  <p>
                    Imebaki kufikia lengo:{' '}
                    <span className="font-mono font-semibold text-text">
                      {formatMoney(remaining)}
                    </span>
                  </p>
                  <p className="flex items-center gap-1 text-text-faint">
                    <Calendar size={12} />
                    <span>Ukomo: {g.deadline}</span>
                  </p>
                </div>
              </div>

              {canEdit && (
                <div className="pt-2 border-t border-border">
                  <button
                    onClick={() => {
                      setSelectedGoal(g);
                      setIsDepositOpen(true);
                    }}
                    className="w-full py-2 rounded-xl bg-primary-soft text-primary hover:bg-primary hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowUpRight size={14} />
                    <span>Weka Akiba kwenye Lengo</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Deposit to Goal Modal */}
      {isDepositOpen && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-text">
              Weka Akiba: {settings.language === 'sw' ? selectedGoal.nameSw : selectedGoal.name}
            </h2>
            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Kiasi cha Kuweka (TSh)
                </label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-raised p-2.5 font-mono text-base font-bold text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Toa Pesa Kutoka Pochi
                </label>
                <select
                  value={depositWalletId}
                  onChange={(e) => setDepositWalletId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-raised p-2.5 text-xs text-text focus:outline-none"
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({formatMoney(w.balance)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDepositOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-text hover:bg-surface-raised cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary-hover active:scale-95 cursor-pointer"
                >
                  Weka Sasa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Goal Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-text">{t('savingsAddGoal')}</h2>
            <form onSubmit={handleAddGoal} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Jina la Lengo (Kiswahili)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Mfano: Kiwanja Kibaha, Gari, Ujenzi"
                  value={newNameSw}
                  onChange={(e) => setNewNameSw(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-raised p-2.5 text-xs text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Lengo la Fedha (TSh)
                </label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-raised p-2.5 font-mono text-xs text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Tarehe ya Ukomo
                </label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-raised p-2.5 text-xs text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Maelezo ya Ziada
                </label>
                <input
                  type="text"
                  placeholder="Mfano: Mfuko wa UTT AMIS au benki"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-raised p-2.5 text-xs text-text focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-text hover:bg-surface-raised cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary-hover active:scale-95 cursor-pointer"
                >
                  Ongeza Lengo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
