import React, { useState } from 'react';
import {
  Wallet as WalletIcon,
  Plus,
  ArrowRightLeft,
  Smartphone,
  Copy,
  Check,
  Building2,
  Coins,
  Trash2,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Wallet, WalletProvider } from '../types';

export const WalletsView: React.FC = () => {
  const {
    t,
    wallets,
    addWallet,
    deleteWallet,
    transferFunds,
    formatMoney,
    isAdmin,
  } = useFinance();

  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Transfer form state
  const [fromWalletId, setFromWalletId] = useState(wallets[0]?.id || '');
  const [toWalletId, setToWalletId] = useState(wallets[1]?.id || '');
  const [amountStr, setAmountStr] = useState('');
  const [feeStr, setFeeStr] = useState('');
  const [noteStr, setNoteStr] = useState('');

  // Add wallet form state
  const [newName, setNewName] = useState('');
  const [newProvider, setNewProvider] = useState<WalletProvider>('mpesa');
  const [newAccNumber, setNewAccNumber] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const [newColor, setNewColor] = useState('#2B4FC7');

  const ussdCodes = [
    { name: 'Vodacom M-Pesa', code: '*150*00#', color: '#E60000' },
    { name: 'Tigo Pesa (Yas)', code: '*150*01#', color: '#00377B' },
    { name: 'Airtel Money', code: '*150*60#', color: '#DC2626' },
    { name: 'HaloPesa (Halotel)', code: '*150*88#', color: '#EA580C' },
    { name: 'CRDB SimBanking', code: '*150*03#', color: '#00843D' },
    { name: 'NMB Mkononi', code: '*150*66#', color: '#D97706' },
  ];

  const handleCopyUssd = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountStr.replace(/[^0-9.]/g, '')) || 0;
    const fee = parseFloat(feeStr.replace(/[^0-9.]/g, '')) || 0;
    if (amount <= 0) {
      alert('Tafadhali weka kiasi halali.');
      return;
    }
    if (fromWalletId === toWalletId) {
      alert('Chagua akaunti mbili tofauti.');
      return;
    }
    const success = transferFunds(fromWalletId, toWalletId, amount, fee, noteStr);
    if (success) {
      setIsTransferOpen(false);
      setAmountStr('');
      setFeeStr('');
      setNoteStr('');
    }
  };

  const handleAddWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const bal = parseFloat(newBalance.replace(/[^0-9.]/g, '')) || 0;
    addWallet({
      name: newName,
      provider: newProvider,
      accountNumber: newAccNumber || 'Akaunti',
      balance: bal,
      currency: 'TZS',
      color: newColor,
    });
    setIsAddOpen(false);
    setNewName('');
    setNewAccNumber('');
    setNewBalance('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text">
            {t('walletTitle')}
          </h1>
          <p className="text-xs text-text-muted mt-0.5">{t('walletSubtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTransferOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface text-text hover:bg-surface-raised text-xs font-medium transition-colors cursor-pointer"
          >
            <ArrowRightLeft size={14} />
            <span>{t('walletTransferBtn')}</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-medium shadow-sm hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>{t('walletAddAccount')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Wallets Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map((w) => {
          return (
            <div
              key={w.id}
              className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5 space-y-4 hover:border-primary/40 transition-colors shadow-xs group"
            >
              {/* Top Row: Provider Color Badge & Account Num */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: w.color }}
                  />
                  <span className="text-xs font-semibold text-text uppercase tracking-wider">
                    {w.provider.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-text-muted">
                  <span>{w.accountNumber}</span>
                  {isAdmin && wallets.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Una uhakika unataka kufuta pochi ya ${w.name}?`)) {
                          deleteWallet(w.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-expense cursor-pointer"
                      title="Futa Pochi"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Balance */}
              <div>
                <p className="text-xs text-text-muted">{w.name}</p>
                <p className="font-mono text-xl sm:text-2xl font-bold text-text mt-0.5 tabular-nums">
                  {formatMoney(w.balance)}
                </p>
              </div>

              {/* Footer action */}
              <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-text-muted">
                <span>Fedha halisi</span>
                <button
                  onClick={() => {
                    setFromWalletId(w.id);
                    setIsTransferOpen(true);
                  }}
                  className="text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ArrowRightLeft size={12} />
                  <span>Hamisha</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tanzania USSD Service Codes Helper */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-3">
        <div>
          <h2 className="text-sm font-bold text-text flex items-center gap-2">
            <Smartphone size={16} className="text-primary" />
            <span>{t('walletQuickUssd')}</span>
          </h2>
          <p className="text-xs text-text-muted mt-0.5">{t('walletUssdDesc')}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
          {ussdCodes.map((u) => {
            const isCopied = copiedCode === u.code;
            return (
              <button
                key={u.code}
                onClick={() => handleCopyUssd(u.code)}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-surface-raised hover:bg-surface text-center transition-all cursor-pointer group"
                title={`Nakili msimbo ${u.code}`}
              >
                <span
                  className="h-2 w-2 rounded-full mb-1"
                  style={{ backgroundColor: u.color }}
                />
                <span className="text-[11px] font-semibold text-text truncate max-w-full">
                  {u.name.split(' ')[0]}
                </span>
                <span className="font-mono text-xs font-bold text-primary mt-0.5">
                  {u.code}
                </span>
                <span className="text-[9px] text-text-muted mt-1 flex items-center gap-0.5">
                  {isCopied ? (
                    <span className="text-income font-bold flex items-center gap-0.5">
                      <Check size={10} /> Imenakiliwa
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5">
                      <Copy size={10} /> Nakili
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Transfer Funds Modal */}
      {isTransferOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-text">
              Hamisha Fedha (M-Pesa / Tigo / CRDB / NMB)
            </h2>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">
                    Kutoka Pochi
                  </label>
                  <select
                    value={fromWalletId}
                    onChange={(e) => setFromWalletId(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface-raised p-2.5 text-xs text-text focus:outline-none"
                  >
                    {wallets.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({formatMoney(w.balance)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">
                    Kwenda Pochi
                  </label>
                  <select
                    value={toWalletId}
                    onChange={(e) => setToWalletId(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface-raised p-2.5 text-xs text-text focus:outline-none"
                  >
                    {wallets.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Kiasi cha Kuhamisha (TSh)
                </label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-raised p-2.5 font-mono text-base font-bold text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Tozo ya Muamala (TSh)
                </label>
                <input
                  type="number"
                  placeholder="0 (Mfano tozo ya kutoa)"
                  value={feeStr}
                  onChange={(e) => setFeeStr(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-raised p-2.5 font-mono text-xs text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Maelezo (Hiari)
                </label>
                <input
                  type="text"
                  placeholder="Sababu ya uhamisho"
                  value={noteStr}
                  onChange={(e) => setNoteStr(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-raised p-2.5 text-xs text-text focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTransferOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-text hover:bg-surface-raised cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary-hover active:scale-95 cursor-pointer"
                >
                  Hamisha Sasa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Wallet Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-text">{t('walletAddAccount')}</h2>
            <form onSubmit={handleAddWallet} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Jina la Akaunti / Pochi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Mfano: NBC Benki, Airtel Money, Pochi ya Akiba"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-raised p-2.5 text-xs text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Aina ya Mtoa Huduma
                </label>
                <select
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value as WalletProvider)}
                  className="w-full rounded-xl border border-border bg-surface-raised p-2.5 text-xs text-text focus:outline-none"
                >
                  <option value="mpesa">Vodacom M-Pesa</option>
                  <option value="tigo_pesa">Tigo Pesa</option>
                  <option value="airtel_money">Airtel Money</option>
                  <option value="halopesa">HaloPesa</option>
                  <option value="crdb">CRDB Bank</option>
                  <option value="nmb">NMB Bank</option>
                  <option value="nbc">NBC Bank</option>
                  <option value="cash">Pesa Taslimu (Cash)</option>
                  <option value="vicoba">VICOBA / Kikundi cha Akiba</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Namba ya Simu au Akaunti
                </label>
                <input
                  type="text"
                  placeholder="+255 7... au 015..."
                  value={newAccNumber}
                  onChange={(e) => setNewAccNumber(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-raised p-2.5 text-xs text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Salio la Kuanzia (TSh)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-raised p-2.5 font-mono text-xs text-text focus:outline-none"
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
                  Ongeza Pochi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
