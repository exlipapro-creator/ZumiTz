import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Printer,
  Trash2,
  TrendingDown,
  TrendingUp,
  ArrowRightLeft,
  Plus,
  Tag,
  Calendar,
  X,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { TransactionType } from '../types';

interface TransactionsViewProps {
  onOpenQuickAdd: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ onOpenQuickAdd }) => {
  const {
    t,
    transactions,
    categories,
    wallets,
    members,
    deleteTransaction,
    formatMoney,
    isAdmin,
    settings,
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [walletFilter, setWalletFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      // Type
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      // Wallet
      if (walletFilter !== 'all' && tx.walletId !== walletFilter) return false;
      // Category
      if (categoryFilter !== 'all' && tx.categoryId !== categoryFilter) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const cat = categories.find((c) => c.id === tx.categoryId);
        const matchNote = tx.note?.toLowerCase().includes(q);
        const matchCat =
          cat?.name.toLowerCase().includes(q) || cat?.nameSw.toLowerCase().includes(q);
        const matchTag = tx.tag?.toLowerCase().includes(q);
        if (!matchNote && !matchCat && !matchTag) return false;
      }
      return true;
    });
  }, [transactions, typeFilter, walletFilter, categoryFilter, searchQuery, categories]);

  // Aggregate stats for filtered view
  const { totalIn, totalOut, net } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    filtered.forEach((tx) => {
      if (tx.type === 'income') inc += tx.amount;
      if (tx.type === 'expense') exp += tx.amount + (tx.fee || 0);
    });
    return { totalIn: inc, totalOut: exp, net: inc - exp };
  }, [filtered]);

  // Real CSV Export
  const handleExportCsv = () => {
    const headers = ['ID', 'Date', 'Type', 'Category', 'Wallet', 'Amount (TZS)', 'Fee (TZS)', 'Note', 'Member'];
    const rows = filtered.map((tx) => {
      const cat = categories.find((c) => c.id === tx.categoryId);
      const wal = wallets.find((w) => w.id === tx.walletId);
      const mem = members.find((m) => m.id === tx.memberId);
      return [
        tx.id,
        tx.date,
        tx.type,
        `"${cat?.nameSw || cat?.name || ''}"`,
        `"${wal?.name || ''}"`,
        tx.amount,
        tx.fee || 0,
        `"${tx.note || ''}"`,
        `"${mem?.name || ''}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zumi_tanzania_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text">
            {t('txTitle')}
          </h1>
          <p className="text-xs text-text-muted mt-0.5">{t('txSubtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface text-text hover:bg-surface-raised text-xs font-medium transition-colors cursor-pointer"
            title="Pakua CSV kwa ajili ya Excel"
          >
            <Download size={14} />
            <span>CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface text-text hover:bg-surface-raised text-xs font-medium transition-colors cursor-pointer"
            title="Chapisha ripoti"
          >
            <Printer size={14} />
            <span>Chapisha</span>
          </button>

          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-medium shadow-sm hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>{t('txAddTransaction')}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-border bg-surface p-4 space-y-3 shadow-xs">
        {/* Search Input */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder={t('txSearchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-raised py-2.5 pl-10 pr-4 text-xs text-text placeholder:text-text-faint focus:border-primary focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {/* Type Segmented Control */}
          <div className="inline-flex rounded-xl bg-surface-raised p-1 border border-border">
            {(['all', 'expense', 'income', 'transfer'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setTypeFilter(mode)}
                className={`px-3 py-1 font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                  typeFilter === mode
                    ? 'bg-surface text-text font-bold shadow-xs'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {mode === 'all'
                  ? t('txAll')
                  : mode === 'expense'
                  ? t('txExpense')
                  : mode === 'income'
                  ? t('txIncome')
                  : t('txTransfer')}
              </button>
            ))}
          </div>

          {/* Wallet dropdown filter */}
          <select
            value={walletFilter}
            onChange={(e) => setWalletFilter(e.target.value)}
            className="rounded-xl border border-border bg-surface px-2.5 py-1.5 text-xs text-text focus:border-primary focus:outline-none"
          >
            <option value="all">Pochi Zote (All Wallets)</option>
            {wallets.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          {/* Category dropdown filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-border bg-surface px-2.5 py-1.5 text-xs text-text focus:border-primary focus:outline-none"
          >
            <option value="all">Makundi Yote (All Categories)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {settings.language === 'sw' ? c.nameSw : c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Aggregate Stats for Current Filter */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-surface p-3 text-center">
          <p className="text-[10px] text-text-muted">Mapato Yaliyochujwa</p>
          <p className="font-mono text-xs sm:text-base font-bold text-income mt-0.5 tabular-nums">
            +{formatMoney(totalIn)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-3 text-center">
          <p className="text-[10px] text-text-muted">Matumizi Yaliyochujwa</p>
          <p className="font-mono text-xs sm:text-base font-bold text-expense mt-0.5 tabular-nums">
            -{formatMoney(totalOut)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-3 text-center">
          <p className="text-[10px] text-text-muted">Mizania ya Kipindi</p>
          <p
            className={`font-mono text-xs sm:text-base font-bold mt-0.5 tabular-nums ${
              net >= 0 ? 'text-primary' : 'text-expense'
            }`}
          >
            {formatMoney(net)}
          </p>
        </div>
      </div>

      {/* Transactions List Ledger */}
      <div className="rounded-2xl border border-border bg-surface shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-text-muted space-y-2">
            <p className="text-sm font-medium">{t('txNoResults')}</p>
            <p className="text-xs text-text-faint">
              Jaribu kubadilisha maneno ya utafutaji au weka muamala mpya.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((tx) => {
              const cat = categories.find((c) => c.id === tx.categoryId);
              const wallet = wallets.find((w) => w.id === tx.walletId);
              const targetWallet = tx.targetWalletId
                ? wallets.find((w) => w.id === tx.targetWalletId)
                : null;
              const mem = members.find((m) => m.id === tx.memberId);
              const isIncome = tx.type === 'income';
              const isTransfer = tx.type === 'transfer';

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-surface-raised transition-colors group"
                >
                  {/* Left: Icon & Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-white text-xs font-bold shrink-0 shadow-xs"
                      style={{
                        backgroundColor: isTransfer
                          ? 'var(--color-primary)'
                          : cat?.color || '#6366F1',
                      }}
                    >
                      {isTransfer ? (
                        <ArrowRightLeft size={16} />
                      ) : isIncome ? (
                        <TrendingUp size={16} />
                      ) : (
                        <TrendingDown size={16} />
                      )}
                    </span>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-bold text-text truncate">
                          {tx.note || (settings.language === 'sw' ? cat?.nameSw : cat?.name) || 'Muamala'}
                        </p>
                        {tx.tag && (
                          <span className="text-[10px] text-primary bg-primary-soft px-1.5 py-0.5 rounded font-medium shrink-0">
                            #{tx.tag}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-text-muted">
                        <span>
                          {isTransfer
                            ? `${wallet?.name} ➔ ${targetWallet?.name}`
                            : wallet?.name}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{tx.date}</span>
                        {mem && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-text-faint">{mem.name.split(' ')[0]}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Delete Action */}
                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <div>
                      <p
                        className={`font-mono text-xs sm:text-base font-bold tabular-nums ${
                          isIncome
                            ? 'text-income'
                            : isTransfer
                            ? 'text-primary'
                            : 'text-expense'
                        }`}
                      >
                        {isIncome ? '+' : isTransfer ? '' : '-'}
                        {formatMoney(tx.amount)}
                      </p>
                      {tx.fee && tx.fee > 0 && (
                        <p className="text-[10px] font-mono text-text-faint">
                          Tozo: {formatMoney(tx.fee)}
                        </p>
                      )}
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          if (confirm(t('txConfirmDelete'))) {
                            deleteTransaction(tx.id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-text-muted hover:text-expense hover:bg-expense-soft transition-all cursor-pointer"
                        title={t('txDelete')}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
