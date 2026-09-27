import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Building2,
  TrendingUp,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const ConverterView: React.FC = () => {
  const { t, formatMoney } = useFinance();

  const [fromCurrency, setFromCurrency] = useState<'TZS' | 'USD' | 'KES' | 'EUR'>('USD');
  const [toCurrency, setToCurrency] = useState<'TZS' | 'USD' | 'KES' | 'EUR'>('TZS');
  const [amountStr, setAmountStr] = useState<string>('100');

  // Rates against 1 TZS
  const ratesToTZS: Record<'TZS' | 'USD' | 'KES' | 'EUR', number> = {
    TZS: 1,
    USD: 2680,
    KES: 20.75,
    EUR: 2890,
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const amount = parseFloat(amountStr) || 0;
  // Convert amount from fromCurrency to TZS, then to toCurrency
  const amountInTZS = amount * ratesToTZS[fromCurrency];
  const convertedResult = amountInTZS / ratesToTZS[toCurrency];

  const commercialBankRates = [
    { currency: 'USD / TZS', name: 'Dola ya Marekani', bot: '2,680.00', buy: '2,660.00', sell: '2,700.00' },
    { currency: 'KES / TZS', name: 'Shilingi ya Kenya', bot: '20.75', buy: '20.40', sell: '21.10' },
    { currency: 'EUR / TZS', name: 'Yuro ya Ulaya', bot: '2,890.00', buy: '2,860.00', sell: '2,920.00' },
    { currency: 'GBP / TZS', name: 'Pauni ya Uingereza', bot: '3,420.00', buy: '3,380.00', sell: '3,460.00' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text">
          {t('converterTitle')}
        </h1>
        <p className="text-xs text-text-muted mt-0.5">{t('converterSubtitle')}</p>
      </div>

      {/* Converter Card */}
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
          {/* From Input */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="block text-xs font-semibold text-text-muted">
              {t('converterFrom')}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="w-full rounded-2xl border border-border bg-surface-raised p-3.5 font-mono text-xl font-bold text-text focus:border-primary focus:outline-none tabular-nums"
                placeholder="0"
              />
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value as any)}
                className="rounded-2xl border border-border bg-surface-raised px-4 text-sm font-bold text-text focus:outline-none"
              >
                <option value="TZS">TZS</option>
                <option value="USD">USD</option>
                <option value="KES">KES</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center">
            <button
              onClick={handleSwap}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface hover:bg-surface-raised active:scale-95 text-text-muted hover:text-primary transition-all cursor-pointer shadow-xs"
              title="Badili pande / Swap"
            >
              <ArrowRightLeft size={18} />
            </button>
          </div>

          {/* To Output */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="block text-xs font-semibold text-text-muted">
              {t('converterTo')}
            </label>
            <div className="flex gap-2">
              <div className="w-full rounded-2xl border border-border bg-surface-raised p-3.5 font-mono text-xl font-bold text-primary flex items-center overflow-x-auto tabular-nums">
                {convertedResult.toLocaleString('en-US', {
                  maximumFractionDigits: toCurrency === 'TZS' ? 0 : 2,
                })}
              </div>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value as any)}
                className="rounded-2xl border border-border bg-surface-raised px-4 text-sm font-bold text-text focus:outline-none"
              >
                <option value="TZS">TZS</option>
                <option value="USD">USD</option>
                <option value="KES">KES</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Informational Rate Kicker */}
        <div className="flex items-center gap-2 rounded-2xl bg-surface-raised p-3.5 text-xs text-text-muted border border-border">
          <Info size={16} className="text-primary shrink-0" />
          <span>{t('converterRateNote')}</span>
        </div>
      </div>

      {/* Bank & Bureau Rates Table */}
      <div className="rounded-2xl border border-border bg-surface shadow-xs overflow-hidden space-y-3 p-5">
        <div>
          <h2 className="text-sm font-bold text-text flex items-center gap-2">
            <Building2 size={16} className="text-primary" />
            <span>Jedwali la Viwango vya Benki na Maduka ya Fedha (Tanzania)</span>
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Viwango elekezi vya CRDB, NMB na Benki Kuu ya Tanzania (BoT)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="border-b border-border bg-surface-raised text-text-muted">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Sarafu (Currency)</th>
                <th className="py-2.5 px-3 font-semibold">Jina</th>
                <th className="py-2.5 px-3 font-semibold text-right">Kiwango cha BoT</th>
                <th className="py-2.5 px-3 font-semibold text-right">Kununua (Buy)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Kuuza (Sell)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono tabular-nums text-text">
              {commercialBankRates.map((r, i) => (
                <tr key={i} className="hover:bg-surface-raised/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-text">{r.currency}</td>
                  <td className="py-3 px-3 font-sans text-text-muted">{r.name}</td>
                  <td className="py-3 px-3 text-right font-semibold text-primary">{r.bot}</td>
                  <td className="py-3 px-3 text-right text-income font-medium">{r.buy}</td>
                  <td className="py-3 px-3 text-right text-expense font-medium">{r.sell}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
