import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  onSuccess,
}) => {
  const {
    t,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    loginAsGuest,
    resetPassword,
  } = useFinance();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        onSuccess?.();
        onClose();
      } else {
        setErrorMsg(res.error || 'Imeshindikana kuingia na Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSignIn = () => {
    loginAsGuest();
    onSuccess?.();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === 'forgot') {
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Tafadhali andika barua pepe yako sahihi kwanza.');
        return;
      }
      setIsLoading(true);
      try {
        const res = await resetPassword(email.trim());
        if (res.success) {
          setSuccessMsg(res.message);
        } else {
          setErrorMsg(res.error || 'Imeshindikana kutuma kiungo cha kurejesha.');
        }
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMsg('Tafadhali weka jina lako kamili.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Tafadhali weka barua pepe sahihi.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Nenosiri lazima liwe na angalau herufi 6.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Nenosiri uliloingiza halilingani.');
        return;
      }

      setIsLoading(true);
      try {
        const res = await registerWithEmail(name, email, password, phone);
        if (res.success) {
          onSuccess?.();
          onClose();
        } else {
          setErrorMsg(res.error || 'Imeshindikana kusajili akaunti.');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Login
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Tafadhali weka barua pepe sahihi.');
        return;
      }
      if (!password) {
        setErrorMsg('Tafadhali ingiza nenosiri lako.');
        return;
      }

      setIsLoading(true);
      try {
        const res = await loginWithEmail(email, password);
        if (res.success) {
          onSuccess?.();
          onClose();
        } else {
          setErrorMsg(res.error || 'Barua pepe au nenosiri si sahihi.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient accent */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-income/10 blur-3xl" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-border/70 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white font-bold font-display shadow-xs text-sm">
              Z
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-sm tracking-tight text-text">Zumi</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  Tanzania 🇹🇿
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-surface-raised hover:text-text transition-colors cursor-pointer"
            aria-label="Funga"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 max-h-[85vh] overflow-y-auto">
          {/* Header titles */}
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text">
              {mode === 'login' && t('authLoginTitle')}
              {mode === 'register' && t('authRegisterTitle')}
              {mode === 'forgot' && t('authLoginForgot')}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-text-muted leading-relaxed">
              {mode === 'login' && t('authLoginSubtitle')}
              {mode === 'register' && t('authRegisterSubtitle')}
              {mode === 'forgot' && t('authLoginForgotPrompt')}
            </p>
          </div>

          {/* Alert messages */}
          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-expense-soft/80 border border-expense/20 p-3 text-xs text-expense font-medium animate-in fade-in">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-income-soft/80 border border-income/20 p-3 text-xs text-income font-medium animate-in fade-in">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Social Google OAuth Simulation Button */}
          {mode !== 'forgot' && (
            <div className="space-y-3 mb-5">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-border bg-surface hover:bg-surface-raised active:scale-[0.99] text-text font-medium text-xs sm:text-sm shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin text-text-muted" />
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>{isLoading ? t('authGoogleRedirecting') : t('authGoogleContinue')}</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-border/80" />
                <span className="relative bg-surface px-3 text-[11px] uppercase tracking-wider text-text-muted">
                  {t('authEmailDivider')}
                </span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name for register */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Jina Kamili
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('authNamePlaceholder')}
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-border bg-bg/60 text-xs sm:text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {/* Phone Number for register */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Nambari ya Simu (M-Pesa / Tigo Pesa)
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('authPhonePlaceholder')}
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-border bg-bg/60 text-xs sm:text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Barua Pepe</label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('authEmailPlaceholder')}
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-border bg-bg/60 text-xs sm:text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-text-muted">Nenosiri</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-[11px] font-medium text-primary hover:underline cursor-pointer"
                    >
                      {t('authLoginForgot')}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('authPasswordPlaceholder')}
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-bg/60 text-xs sm:text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password for register */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Thibitisha Nenosiri
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('authConfirmPasswordPlaceholder')}
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-border bg-bg/60 text-xs sm:text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-2 rounded-xl bg-primary text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-primary/25 hover:bg-primary-hover active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              <span>
                {mode === 'login' && (isLoading ? t('authLoginSubmitting') : t('authLoginSubmit'))}
                {mode === 'register' &&
                  (isLoading ? t('authRegisterSubmitting') : t('authRegisterSubmit'))}
                {mode === 'forgot' &&
                  (isLoading ? t('authLoginSubmitting') : t('authLoginResetSubmit'))}
              </span>
              {!isLoading && <ArrowRight size={15} />}
            </button>
          </form>

          {/* Instant Demo Guest Mode button */}
          <div className="mt-5 pt-4 border-t border-border/80">
            <button
              type="button"
              onClick={handleGuestSignIn}
              className="w-full p-3 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 active:scale-[0.99] text-left transition-all cursor-pointer group flex items-start gap-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Sparkles size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm font-semibold text-text group-hover:text-primary transition-colors">
                    {t('authGuestBtn')}
                  </p>
                  <span className="rounded-full bg-income-soft text-income px-2 py-0.5 text-[10px] font-bold">
                    Demo
                  </span>
                </div>
                <p className="text-[11px] text-text-muted mt-0.5 leading-snug">
                  {t('authGuestDesc')}
                </p>
              </div>
            </button>
          </div>

          {/* Switch mode links */}
          <div className="mt-5 text-center text-xs text-text-muted">
            {mode === 'login' && (
              <p>
                {t('authLoginNoAccount')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="font-semibold text-primary hover:underline cursor-pointer"
                >
                  {t('authSignUp')}
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p>
                {t('authRegisterHasAccount')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="font-semibold text-primary hover:underline cursor-pointer"
                >
                  {t('authSignIn')}
                </button>
              </p>
            )}

            {mode === 'forgot' && (
              <p>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="font-semibold text-primary hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  ← Rudi kwenye Kuingia (Back to sign in)
                </button>
              </p>
            )}
          </div>

          {/* Legal / Privacy note */}
          <p className="mt-5 text-center text-[10px] text-text-faint leading-tight">
            {t('authLegalPrefix')}{' '}
            <span className="underline hover:text-text cursor-pointer">{t('authLegalTerms')}</span>{' '}
            {t('authLegalAnd')}{' '}
            <span className="underline hover:text-text cursor-pointer">{t('authLegalPrivacy')}</span>{' '}
            {t('authLegalSuffix')}
          </p>
        </div>
      </div>
    </div>
  );
};
