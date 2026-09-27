import React, { useState } from 'react';
import { Lock, Delete, ShieldAlert } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const SecurityPinModal: React.FC = () => {
  const { isLocked, unlockAppWithPin, settings } = useFinance();
  const [pinInput, setPinInput] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  if (!isLocked) return null;

  const handleDigit = (digit: string) => {
    if (pinInput.length < 4) {
      const next = pinInput + digit;
      setPinInput(next);
      setHasError(false);

      if (next.length === 4) {
        const success = unlockAppWithPin(next);
        if (!success) {
          setHasError(true);
          setTimeout(() => {
            setPinInput('');
            setHasError(false);
          }, 600);
        }
      }
    }
  };

  const handleDelete = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setHasError(false);
  };

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 backdrop-blur-md p-4">
      <div className="w-full max-w-xs text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Lock size={28} />
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight text-text">Zumi Tanzania</h2>
          <p className="text-xs text-text-muted mt-1">
            Weka PIN yako ya tarakimu 4 kufungua akaunti ya kaya
          </p>
        </div>

        {/* 4 dots */}
        <div className={`flex justify-center gap-4 py-2 ${hasError ? 'animate-shake' : ''}`}>
          {[0, 1, 2, 3].map((i) => {
            const filled = pinInput.length > i;
            return (
              <span
                key={i}
                className={`h-4 w-4 rounded-full border-2 transition-all ${
                  hasError
                    ? 'border-expense bg-expense'
                    : filled
                    ? 'border-primary bg-primary scale-110'
                    : 'border-border bg-surface'
                }`}
              />
            );
          })}
        </div>

        {hasError && (
          <p className="text-xs font-semibold text-expense flex items-center justify-center gap-1">
            <ShieldAlert size={14} /> PIN sio sahihi, jaribu tena.
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {digits.map((d, index) => {
            if (d === '') return <div key={index} />;
            if (d === 'del') {
              return (
                <button
                  key={index}
                  onClick={handleDelete}
                  className="flex h-14 items-center justify-center rounded-2xl text-text-muted hover:text-text hover:bg-surface-raised active:scale-95 transition-all cursor-pointer"
                  title="Futa tarakimu"
                >
                  <Delete size={22} />
                </button>
              );
            }
            return (
              <button
                key={index}
                onClick={() => handleDigit(d)}
                className="flex h-14 items-center justify-center rounded-2xl border border-border bg-surface text-xl font-mono font-bold text-text hover:bg-surface-raised active:scale-95 active:bg-primary/10 transition-all cursor-pointer shadow-xs"
              >
                {d}
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-text-faint">
          PIN ya awali ni <span className="font-mono font-semibold text-text">1234</span>
        </p>
      </div>
    </div>
  );
};
