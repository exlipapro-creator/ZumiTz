import React, { useState } from 'react';
import {
  X,
  Plus,
  ArrowRightLeft,
  TrendingDown,
  TrendingUp,
  Calendar,
  Wallet as WalletIcon,
  Tag,
  Check,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { TransactionType } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    t,
    wallets,
    categories,
    addTransaction,
    transferFunds,
    settings,
  } = useFinance();

  const [type, setType] = useState<TransactionType>('expense');
  const [amountStr, setAmountStr] = useState<string>('');
  const [walletId, setWalletId] = useState<string>(wallets[0]?.id || '');
  const [targetWalletId, setTargetWalletId] = useState<string>(wallets[1]?.id || '');
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || '');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [feeStr, setFeeStr] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [tag, setTag] = useState<string>('');

  if (!isOpen) return null;

  const quickAmounts = [5000, 10000, 30000, 50000, 100000];

  const handleAddQuickAmount = (val: number) => {
    const current = parseInt(amountStr.replace(/[^0-9]/g, ''), 10) || 0;
    setAmountStr(String(current + val));
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income') {
      const incCat = categories.find((c) => c.type === 'income');
      if (incCat) setCategoryId(incCat.id);
    } else if (newType === 'expense') {
      const expCat = categories.find((c) => c.type === 'expense');
      if (expCat) setCategoryId(expCat.id);
    }
  };

  // Estimate Tanzania mobile money tozo/fee based on transfer amount
  const handleCalculateTozo = () => {
    const amount = parseInt(amountStr, 10) || 0;
    if (amount <= 0) return;
    let fee = 0;
    if (amount <= 1000) fee = 100;
    else if (amount <= 5000) fee = 250;
    else if (amount <= 10000) fee = 450;
    else if (amount <= 20000) fee = 700;
    else if (amount <= 50000) fee = 1100;
    else if (amount <= 100000) fee = 1800;
    else if (amount <= 300000) fee = 2800;
    else fee = 3500;
    setFeeStr(String(fee));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountStr.replace(/[^0-9.]/g, ''));
    if (!amount || amount <= 0) {
      alert('Tafadhali weka kiasi sahihi cha fedha.');
      return;
    }

    const fee = parseFloat(feeStr.replace(/[^0-9.]/g, '')) || 0;

    if (type === 'transfer') {
      if (walletId === targetWalletId) {
        alert('Tafadhali chagua pochi mbili tofauti kwa ajili ya uhamisho.');
        return;
      }
      const success = transferFunds(walletId, targetWalletId, amount, fee, note);
      if (success) {
        onClose();
        resetForm();
      }
      return;
    }

    const success = addTransaction({
      type,
      amount,
      currency: 'TZS',
      walletId,
      categoryId,
      fee: fee > 0 ? fee : undefined,
      date,
      note,
      tag: tag || undefined,
      memberId: '',
    });

    if (success) {
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setAmountStr('');
    setFeeStr('');
    setNote('');
    setTag('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const availableCategories = categories.filter((c) =>
    type === 'transfer' ? true : c.type === type
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div
        className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in slide-in-from-bottom duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-bold text-text">
            {type === 'expense'
              ? 'Weka Matumizi'
              : type === 'income'
              ? 'Weka Mapato'
              : 'Hamisha Fedha'}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:text-text hover:bg-surface-raised cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Type Selector Tabs */}
        <div className="px-5 pt-3">
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-surface-raised p-1 border border-border">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-expense text-white shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <TrendingDown size={14} />
              <span>Matumizi</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-income text-white shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <TrendingUp size={14} />
              <span>Mapato</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('transfer')}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                type === 'transfer'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <ArrowRightLeft size={14} />
              <span>Uhamisho</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 flex-1">
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">
              Kiasi (Tanzanian Shillings)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm font-bold text-text-muted">
                TSh
              </span>
              <input
                type="number"
                inputMode="numeric"
                required
                placeholder="0"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="w-full rounded-2xl border border-border bg-surface-raised py-3.5 pl-14 pr-4 font-mono text-2xl font-bold tracking-tight text-text placeholder:text-text-faint focus:border-primary focus:outline-none tabular-nums"
              />
            </div>

            {/* Quick Tanzania Shillings Chips */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {quickAmounts.map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => handleAddQuickAmount(q)}
                  className="rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] font-mono font-medium text-text-muted hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
                >
                  +{q >= 1000 ? `${q / 1000}k` : q}
                </button>
              ))}
            </div>
          </div>

          {/* Wallets */}
          {type === 'transfer' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Kutoka (From)
                </label>
                <select
                  value={walletId}
                  onChange={(e) => setWalletId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-raised p-2.5 text-xs font-medium text-text focus:border-primary focus:outline-none"
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Kwenda (To)
                </label>
                <select
                  value={targetWalletId}
                  onChange={(e) => setTargetWalletId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-raised p-2.5 text-xs font-medium text-text focus:border-primary focus:outline-none"
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Pochi / Akaunti ya Kulipia
              </label>
              <select
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-raised p-2.5 text-xs font-medium text-text focus:border-primary focus:outline-none"
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} (TSh {w.balance.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category Picker (if not transfer) */}
          {type !== 'transfer' && (
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Kundi la Matumizi / Mapato
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
                {availableCategories.map((c) => {
                  const isSelected = categoryId === c.id;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setCategoryId(c.id)}
                      className={`flex items-center gap-2 rounded-xl p-2 text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-primary-soft text-primary font-semibold'
                          : 'border-border bg-surface hover:bg-surface-raised text-text-muted'
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="text-xs truncate">
                        {settings.language === 'sw' ? c.nameSw : c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tozo / Fee & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-text-muted">Tozo / Ada (TSh)</label>
                <button
                  type="button"
                  onClick={handleCalculateTozo}
                  className="text-[10px] text-primary hover:underline cursor-pointer"
                >
                  Kadiria Tozo
                </button>
              </div>
              <input
                type="number"
                placeholder="0"
                value={feeStr}
                onChange={(e) => setFeeStr(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-raised p-2.5 font-mono text-xs text-text focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Tarehe</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-raised p-2.5 text-xs text-text focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Notes and Tag */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Maelezo / Risiti (Hiari)
              </label>
              <input
                type="text"
                placeholder="Mfano: Umeme LUKU, Chakula sokoni, Mafuta Puma..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-raised p-2.5 text-xs text-text placeholder:text-text-faint focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Lebo ya Haraka
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['LUKU', 'Kariakoo', 'Daladala', 'Vicoba', 'Bili', 'Ada', 'Familia'].map((tVal) => (
                  <button
                    type="button"
                    key={tVal}
                    onClick={() => setTag(tag === tVal ? '' : tVal)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer border ${
                      tag === tVal
                        ? 'border-primary bg-primary text-white'
                        : 'border-border bg-surface text-text-muted hover:text-text'
                    }`}
                  >
                    #{tVal}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-primary text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.99] transition-transform cursor-pointer"
            >
              <Check size={18} />
              <span>Hifadhi Muamala</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
