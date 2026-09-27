import React, { useState } from 'react';
import {
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  AlertCircle,
  Repeat,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { DebtItem } from '../types';

export const DebtsView: React.FC = () => {
  const {
    t,
    debts,
    recurringBills,
    wallets,
    addDebt,
    settleDebt,
    formatMoney,
    canEdit,
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'receivables' | 'payables' | 'recurring'>('receivables');
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);

  // Form state
  const [person, setPerson] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [debtType, setDebtType] = useState<'owe_them' | 'they_owe_me'>('they_owe_me');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const receivables = debts.filter((d) => d.type === 'they_owe_me');
  const payables = debts.filter((d) => d.type === 'owe_them');

  const handleAddDebtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountStr.replace(/[^0-9.]/g, '')) || 0;
    if (!person.trim() || amount <= 0) return;

    addDebt({
      person,
      amount,
      type: debtType,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      status: 'pending',
      notes,
    });

    setIsAddDebtOpen(false);
    setPerson('');
    setAmountStr('');
    setNotes('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text">
            {t('debtsTitle')}
          </h1>
          <p className="text-xs text-text-muted mt-0.5">{t('debtsSubtitle')}</p>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsAddDebtOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-medium shadow-sm hover:bg-primary-hover active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus size={15} />
            <span>{t('debtsAdd')}</span>
          </button>
        )}
      </div>

      {/* Segmented Tabs */}
      <div className="flex rounded-xl bg-surface-raised p-1 border border-border max-w-md">
        <button
          onClick={() => setActiveTab('receivables')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'receivables'
              ? 'bg-surface text-text shadow-xs font-bold'
              : 'text-text-muted hover:text-text'
          }`}
        >
          {t('debtsICollect')} ({receivables.length})
        </button>
        <button
          onClick={() => setActiveTab('payables')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'payables'
              ? 'bg-surface text-text shadow-xs font-bold'
              : 'text-text-muted hover:text-text'
          }`}
        >
          {t('debtsIOwe')} ({payables.length})
        </button>
        <button
          onClick={() => setActiveTab('recurring')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'recurring'
              ? 'bg-surface text-text shadow-xs font-bold'
              : 'text-text-muted hover:text-text'
          }`}
        >
          Bili Fasta ({recurringBills.length})
        </button>
      </div>

      {/* Receivables List */}
      {activeTab === 'receivables' && (
        <div className="space-y-3">
          {receivables.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-12 text-center text-text-muted">
              Hakuna mtu anayekudai au uliyemkopesha kwa sasa.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {receivables.map((d) => (
                <div
                  key={d.id}
                  className="rounded-2xl border border-border bg-surface p-4 sm:p-5 space-y-3 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-income/10 text-income font-bold text-xs">
                          {d.person[0]}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-text">{d.person}</p>
                          <p className="text-[11px] text-text-muted flex items-center gap-1">
                            <Calendar size={12} />
                            <span>Tarehe ya makubaliano: {d.dueDate}</span>
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          d.status === 'settled'
                            ? 'bg-income-soft text-income'
                            : 'bg-primary-soft text-primary'
                        }`}
                      >
                        {d.status === 'settled' ? t('debtsSettled') : t('debtsPending')}
                      </span>
                    </div>

                    <div className="pt-1">
                      <p className="font-mono text-xl font-bold text-income tabular-nums">
                        +{formatMoney(d.amount)}
                      </p>
                      {d.notes && <p className="text-xs text-text-muted mt-1">{d.notes}</p>}
                    </div>
                  </div>

                  {canEdit && d.status === 'pending' && (
                    <button
                      onClick={() => settleDebt(d.id)}
                      className="w-full py-2 rounded-xl border border-income/30 bg-income/5 hover:bg-income hover:text-white text-income text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 size={14} />
                      <span>{t('debtsSettle')}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payables List */}
      {activeTab === 'payables' && (
        <div className="space-y-3">
          {payables.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-12 text-center text-text-muted">
              Huna madeni unayodaiwa na mtu au fundi kwa sasa.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {payables.map((d) => (
                <div
                  key={d.id}
                  className="rounded-2xl border border-border bg-surface p-4 sm:p-5 space-y-3 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-expense/10 text-expense font-bold text-xs">
                          {d.person[0]}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-text">{d.person}</p>
                          <p className="text-[11px] text-text-muted flex items-center gap-1">
                            <Clock size={12} />
                            <span>Kulipa kabla ya: {d.dueDate}</span>
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          d.status === 'settled'
                            ? 'bg-income-soft text-income'
                            : 'bg-expense-soft text-expense'
                        }`}
                      >
                        {d.status === 'settled' ? t('debtsSettled') : t('debtsPending')}
                      </span>
                    </div>

                    <div className="pt-1">
                      <p className="font-mono text-xl font-bold text-expense tabular-nums">
                        -{formatMoney(d.amount)}
                      </p>
                      {d.notes && <p className="text-xs text-text-muted mt-1">{d.notes}</p>}
                    </div>
                  </div>

                  {canEdit && d.status === 'pending' && (
                    <button
                      onClick={() => settleDebt(d.id)}
                      className="w-full py-2 rounded-xl bg-expense text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-expense/90 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 size={14} />
                      <span>Lipia na Kamilisha</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recurring Bills */}
      {activeTab === 'recurring' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recurringBills.map((b) => {
              const wallet = wallets.find((w) => w.id === b.walletId);
              return (
                <div
                  key={b.id}
                  className="rounded-2xl border border-border bg-surface p-4 sm:p-5 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                        <Repeat size={16} />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-text">{b.nameSw}</p>
                        <p className="text-[11px] text-text-muted">
                          Kila tarehe {b.dueDay} ya mwezi · {wallet?.name}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-income bg-income-soft px-2 py-0.5 rounded-full">
                      Inayofanya kazi
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="font-mono text-lg font-bold text-text tabular-nums">
                      {formatMoney(b.amount)}
                    </span>
                    <span className="text-xs text-text-muted capitalize">{b.frequency}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Debt Modal */}
      {isAddDebtOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-text">{t('debtsAdd')}</h2>
            <form onSubmit={handleAddDebtSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Aina ya Deni</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDebtType('they_owe_me')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                      debtType === 'they_owe_me'
                        ? 'border-income bg-income text-white'
                        : 'border-border text-text-muted'
                    }`}
                  >
                    Ninamdai Mtu
                  </button>
                  <button
                    type="button"
                    onClick={() => setDebtType('owe_them')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                      debtType === 'owe_them'
                        ? 'border-expense bg-expense text-white'
                        : 'border-border text-text-muted'
                    }`}
                  >
                    Ninanidaiwa
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Jina la Mtu / Fundi / Duka
                </label>
                <input
                  type="text"
                  required
                  placeholder="Mfano: Hamisi, Fundi Salum..."
                  value={person}
                  onChange={(e) => setPerson(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-raised p-2.5 text-xs text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Kiasi (TSh)</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-raised p-2.5 font-mono text-xs text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Tarehe ya Makubaliano / Ukomo
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-raised p-2.5 text-xs text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Maelezo</label>
                <input
                  type="text"
                  placeholder="Sababu ya deni au mkopo"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-raised p-2.5 text-xs text-text focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddDebtOpen(false)}
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
