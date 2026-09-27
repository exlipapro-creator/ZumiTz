import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Laptop,
  Palette,
  Globe,
  Lock,
  Download,
  Upload,
  RotateCcw,
  Check,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { ThemeMode, AccentColor, Language } from '../types';

export const SettingsView: React.FC = () => {
  const {
    t,
    settings,
    setLanguage,
    setTheme,
    setAccent,
    togglePrivacyMode,
    setPinSecurity,
    exportDataJson,
    importDataJson,
    resetAllData,
    isAdmin,
  } = useFinance();

  const [pinInput, setPinInput] = useState(settings.pinCode || '1234');
  const [pinSuccessMsg, setPinSuccessMsg] = useState(false);

  const accents: { id: AccentColor; label: string; color: string }[] = [
    { id: 'default', label: t('settingsAccentDefault'), color: '#2B4FC7' },
    { id: 'ocean', label: t('settingsAccentOcean'), color: '#0D9488' },
    { id: 'violet', label: t('settingsAccentViolet'), color: '#7C5CD1' },
    { id: 'pink', label: t('settingsAccentPink'), color: '#DB2777' },
    { id: 'slate', label: t('settingsAccentSlate'), color: '#475569' },
  ];

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length === 4 && /^\d+$/.test(pinInput)) {
      setPinSecurity(true, pinInput);
      setPinSuccessMsg(true);
      setTimeout(() => setPinSuccessMsg(false), 2000);
    } else {
      alert('Tafadhali weka tarakimu 4 za nambari pekee.');
    }
  };

  const handleExport = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zumi_tanzania_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importDataJson(content);
        if (ok) {
          alert('Data imerejeshwa kikamilifu!');
        } else {
          alert('Faili halina muundo sahihi wa Zumi JSON.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text">
          {t('settingsTitle')}
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          Badili muonekano, lugha, usalama na hifadhi data zako
        </p>
      </div>

      {/* Language Section */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-text flex items-center gap-2">
          <Globe size={16} className="text-primary" />
          <span>{t('settingsLanguage')}</span>
        </h2>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            onClick={() => setLanguage('sw')}
            className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              settings.language === 'sw'
                ? 'border-primary bg-primary-soft text-primary'
                : 'border-border bg-surface text-text hover:bg-surface-raised'
            }`}
          >
            <span>Kiswahili (Tanzania) 🇹🇿</span>
            {settings.language === 'sw' && <Check size={16} />}
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              settings.language === 'en'
                ? 'border-primary bg-primary-soft text-primary'
                : 'border-border bg-surface text-text hover:bg-surface-raised'
            }`}
          >
            <span>English (International)</span>
            {settings.language === 'en' && <Check size={16} />}
          </button>
        </div>
      </div>

      {/* Theme Mode Section */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-text flex items-center gap-2">
          <Sun size={16} className="text-primary" />
          <span>{t('settingsTheme')}</span>
        </h2>
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {[
            { id: 'light', label: t('settingsThemeLight'), icon: Sun },
            { id: 'dark', label: t('settingsThemeDark'), icon: Moon },
            { id: 'system', label: t('settingsThemeSystem'), icon: Laptop },
          ].map((th) => {
            const Icon = th.icon;
            const isSelected = settings.theme === th.id;
            return (
              <button
                key={th.id}
                onClick={() => setTheme(th.id as ThemeMode)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary-soft text-primary font-bold shadow-xs'
                    : 'border-border bg-surface text-text-muted hover:text-text hover:bg-surface-raised'
                }`}
              >
                <Icon size={18} />
                <span>{th.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Color Section */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-text flex items-center gap-2">
          <Palette size={16} className="text-primary" />
          <span>{t('settingsAccent')}</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {accents.map((acc) => {
            const isSelected = settings.accent === acc.id;
            return (
              <button
                key={acc.id}
                onClick={() => setAccent(acc.id)}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 bg-surface shadow-xs font-bold text-text'
                    : 'border-border bg-surface text-text-muted hover:bg-surface-raised'
                }`}
              >
                <span
                  className="h-4 w-4 rounded-full shrink-0"
                  style={{ backgroundColor: acc.color }}
                />
                <span className="truncate">{acc.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daladala Stealth & Privacy Mode */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-text flex items-center gap-2">
              <EyeOff size={16} className="text-primary" />
              <span>{t('stealthMode')} (Daladala Stealth)</span>
            </h2>
            <p className="text-xs text-text-muted">{t('stealthModeDesc')}</p>
          </div>
          <button
            onClick={togglePrivacyMode}
            className={`h-6 w-11 rounded-full transition-colors relative cursor-pointer ${
              settings.privacyMode ? 'bg-primary' : 'bg-surface-raised border border-border'
            }`}
          >
            <span
              className={`h-4 w-4 rounded-full bg-white transition-transform block absolute top-1 ${
                settings.privacyMode ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Security PIN Section */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-text flex items-center gap-2">
              <Lock size={16} className="text-primary" />
              <span>{t('settingsSecurity')}</span>
            </h2>
            <p className="text-xs text-text-muted">
              Weka namba ya siri (PIN) kulinda akaunti inapofunguliwa
            </p>
          </div>
          <button
            onClick={() => setPinSecurity(!settings.pinSecurityEnabled)}
            className={`h-6 w-11 rounded-full transition-colors relative cursor-pointer ${
              settings.pinSecurityEnabled ? 'bg-primary' : 'bg-surface-raised border border-border'
            }`}
          >
            <span
              className={`h-4 w-4 rounded-full bg-white transition-transform block absolute top-1 ${
                settings.pinSecurityEnabled ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>

        {settings.pinSecurityEnabled && (
          <form onSubmit={handleSavePin} className="pt-2 border-t border-border flex flex-wrap items-center gap-3">
            <div className="w-36">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="1234"
                className="w-full rounded-xl border border-border bg-surface-raised p-2.5 font-mono text-center text-sm font-bold tracking-widest text-text focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover active:scale-95 cursor-pointer"
            >
              Hifadhi PIN
            </button>
            {pinSuccessMsg && (
              <span className="text-xs text-income font-medium flex items-center gap-1">
                <Check size={14} /> PIN imehifadhiwa!
              </span>
            )}
          </form>
        )}
      </div>

      {/* Data Backup & Portability */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-text flex items-center gap-2">
            <Shield size={16} className="text-primary" />
            <span>{t('settingsBackup')}</span>
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Data zako zote zinahifadhiwa kwenye kifaa hiki. Unaweza kupakua nakala salama wakati wowote.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-raised text-xs font-semibold text-text transition-colors cursor-pointer"
          >
            <Download size={15} />
            <span>{t('settingsExportJson')}</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-raised text-xs font-semibold text-text transition-colors cursor-pointer">
            <Upload size={15} />
            <span>{t('settingsImportJson')}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          {isAdmin && (
            <button
              onClick={() => {
                if (confirm(t('settingsResetConfirm'))) {
                  resetAllData();
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-expense/30 text-expense hover:bg-expense-soft text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw size={15} />
              <span>{t('settingsResetData')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
