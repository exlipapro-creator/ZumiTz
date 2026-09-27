import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Shield,
  Smartphone,
  EyeOff,
  Zap,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Wallet as WalletIcon,
  CreditCard,
  PieChart,
  Users,
  Check,
  Building2,
  Lock,
  Sparkles,
  Phone,
  PiggyBank,
  Receipt,
  Car,
  Utensils,
  GraduationCap,
  ShieldCheck,
  Star,
  Layers,
  ArrowUpRight,
  HelpCircle,
  Clock,
  DollarSign,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface LandingViewProps {
  onEnterApp: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onEnterApp, onOpenAuth }) => {
  const { t, formatMoney, settings, isAuthenticated, currentUser } = useFinance();
  const [animatedBalance, setAnimatedBalance] = useState<number>(2480500);
  const [phoneActiveTab, setPhoneActiveTab] = useState<'overview' | 'tx' | 'budget' | 'savings'>('overview');
  const [activeGoalIndex, setActiveGoalIndex] = useState<number>(0);
  const [activeMemberFilter, setActiveMemberFilter] = useState<string>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Interactive micro-logger widget state in Feature 1
  const [demoAmount, setDemoAmount] = useState<number>(25000);
  const [demoWallet, setDemoWallet] = useState<'mpesa' | 'tigo' | 'crdb'>('mpesa');
  const [demoCategory, setDemoCategory] = useState<'luku' | 'soko' | 'mafuta'>('luku');

  // Live balance fluctuation simulation matching Gozumi
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedBalance((prev) => prev + Math.round((Math.random() - 0.45) * 12000));
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const ledgerItems = [
    { label: 'Mshahara (CRDB Bank)', amount: '+TSh 1,850,000', positive: true, tag: 'Benki' },
    { label: 'LUKU Umeme (M-Pesa)', amount: '-TSh 35,000', positive: false, tag: 'Bili' },
    { label: 'Soko la Kariakoo', amount: '-TSh 68,000', positive: false, tag: 'Chakula' },
    { label: 'Mauzo ya Duka / Biashara', amount: '+TSh 320,000', positive: true, tag: 'Mapato' },
    { label: 'Akiba: Kiwanja Bagamoyo', amount: '+TSh 150,000', positive: true, tag: 'Uwekezaji' },
    { label: 'Mafuta ya Gari (Tigo Pesa)', amount: '-TSh 40,000', positive: false, tag: 'Usafiri' },
    { label: 'Ankara ya Maji DAWASA', amount: '-TSh 18,500', positive: false, tag: 'Bili' },
    { label: 'Mchango wa VICOBA', amount: '-TSh 30,000', positive: false, tag: 'Kikundi' },
    { label: 'Vifurushi vya Vodacom', amount: '-TSh 25,000', positive: false, tag: 'Mawasiliano' },
    { label: 'Freelance & Ushauri', amount: '+TSh 280,000', positive: true, tag: 'Mapato' },
  ];

  const doubleLedger = [...ledgerItems, ...ledgerItems];

  const goalsList = [
    {
      name: 'Kiwanja Bagamoyo',
      target: 15000000,
      saved: 10200000,
      icon: Building2,
      color: 'text-savings',
      bg: 'bg-savings-soft',
      deadline: 'Desemba 2026',
    },
    {
      name: 'Mfuko wa Dharura (Miezi 6)',
      target: 6000000,
      saved: 4500000,
      icon: ShieldCheck,
      color: 'text-primary',
      bg: 'bg-primary-soft',
      deadline: 'Juni 2026',
    },
    {
      name: 'Ada ya Watoto & Shule',
      target: 3500000,
      saved: 2900000,
      icon: GraduationCap,
      color: 'text-goals',
      bg: 'bg-goals-soft',
      deadline: 'Januari 2027',
    },
    {
      name: 'Hisa za UTT AMIS (Uwekezaji)',
      target: 5000000,
      saved: 3800000,
      icon: Sparkles,
      color: 'text-income',
      bg: 'bg-income-soft',
      deadline: 'Oktoba 2026',
    },
  ];

  const householdFeed = [
    {
      id: '1',
      member: 'Amina (Mke)',
      role: 'Msimamizi Mwenza',
      avatar: 'A',
      color: 'bg-pink-500',
      action: 'amelipia Vyakula vya Wiki (Shoppers)',
      amount: '-TSh 68,000',
      wallet: 'Vodacom M-Pesa',
      time: 'Dakika 15 zilizopita',
    },
    {
      id: '2',
      member: 'Juma (Mume)',
      role: 'Mkuu wa Kaya',
      avatar: 'J',
      color: 'bg-primary',
      action: 'amenunua Tokeni za Umeme LUKU',
      amount: '-TSh 50,000',
      wallet: 'CRDB SimBanking',
      time: 'Saa 2 zilizopita',
    },
    {
      id: '3',
      member: 'Zuberi (Kaka)',
      role: 'Mchangiaji',
      avatar: 'Z',
      color: 'bg-emerald-600',
      action: 'amechangia Ada ya Shule kwenye Akiba',
      amount: '+TSh 100,000',
      wallet: 'Tigo Pesa',
      time: 'Jana',
    },
  ];

  const filteredHousehold =
    activeMemberFilter === 'all'
      ? householdFeed
      : householdFeed.filter((item) => item.member.toLowerCase().includes(activeMemberFilter));

  const faqs = [
    {
      q: t('landingFaq1Q'),
      a: t('landingFaq1A'),
    },
    {
      q: t('landingFaq2Q'),
      a: t('landingFaq2A'),
    },
    {
      q: t('landingFaq3Q'),
      a: t('landingFaq3A'),
    },
    {
      q: t('landingFaq4Q'),
      a: t('landingFaq4A'),
    },
    {
      q: t('landingFaq5Q'),
      a: t('landingFaq5A'),
    },
  ];

  const testimonials = [
    {
      quote:
        'Kupanga bili ya LUKU, kodi ya nyumba na michango ya VICOBA haijawahi kuwa rahisi hivi. Mimi na mke wangu tunajua kila shilingi inapoenda.',
      author: 'Juma & Amina M.',
      role: 'Wazazi & Wafanyabiashara',
      location: 'Sinza, Dar es Salaam 🇹🇿',
      rating: 5,
    },
    {
      quote:
        'Hali ya Usiri (Daladala Stealth Mode) ni kiboko! Ninaweza kuangalia salio langu nikiwa kwenye mwendokasi bila mtu wa pembeni kuona tarakimu zangu.',
      author: 'Baraka E.',
      role: 'Afisa Teknolojia',
      location: 'Mwenge, Dar es Salaam 🇹🇿',
      rating: 5,
    },
    {
      quote:
        'Kuweka malengo ya akiba kwa ajili ya kiwanja chetu na hisa za UTT AMIS kulinipa nidhamu ya hali ya juu. Zumi inafanya kazi hata bila bando la intaneti!',
      author: 'Neema K.',
      role: 'Mjasiriamali & Mshauri wa Utalii',
      location: 'Njiro, Arusha 🇹🇿',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-primary/20 selection:text-primary">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 border-b border-border/80">
        {/* Ambient atmospheric lighting */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[650px] rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-40 h-[350px] w-[350px] rounded-full bg-savings/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left: Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Region Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-text-muted shadow-xs">
                <span className="h-2 w-2 rounded-full bg-income animate-pulse" />
                <span className="font-medium">Zumi Tanzania 🇹🇿</span>
                <span className="text-text-faint">•</span>
                <span className="text-text-faint">M-Pesa • Tigo Pesa • CRDB • NMB</span>
              </div>

              {/* Main Headline matching Gozumi */}
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text leading-[1.1] text-balance">
                <span>{t('landingHeroTitle')}</span>
              </h1>

              {/* Body */}
              <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {t('landingHeroSubtitle')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                {isAuthenticated ? (
                  <button
                    onClick={onEnterApp}
                    className="w-full sm:w-auto h-12 px-7 rounded-xl bg-primary text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{t('landingCtaGuest')}</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onOpenAuth('register')}
                      className="w-full sm:w-auto h-12 px-7 rounded-xl bg-primary text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
                    >
                      <span>{t('landingCtaPrimary')}</span>
                      <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={() => onOpenAuth('login')}
                      className="w-full sm:w-auto h-12 px-5 rounded-xl border border-border bg-surface text-text font-medium text-sm hover:bg-surface-raised active:scale-95 transition-all cursor-pointer"
                    >
                      {t('authSignIn')}
                    </button>
                  </>
                )}

                <a
                  href="#pricing"
                  className="w-full sm:w-auto h-12 px-5 rounded-xl border border-border/80 bg-surface/50 text-text-muted hover:text-text font-medium text-sm flex items-center justify-center hover:bg-surface-raised transition-all"
                >
                  {t('landingCtaSecondary')}
                </a>
              </div>

              {/* Trust Disclaimer */}
              <p className="text-xs text-text-muted flex items-center justify-center lg:justify-start gap-2 pt-1">
                <CheckCircle2 size={14} className="text-income shrink-0" />
                <span>{t('landingTrialNote')}</span>
              </p>

              {/* Social Proof Stats Bar */}
              <div className="pt-4 border-t border-border/60 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="font-display font-bold text-xl sm:text-2xl text-text">12,000+</div>
                  <div className="text-[11px] sm:text-xs text-text-muted">Kaya Tanzania</div>
                </div>
                <div>
                  <div className="font-display font-bold text-xl sm:text-2xl text-income">99.4%</div>
                  <div className="text-[11px] sm:text-xs text-text-muted">Kuridhika</div>
                </div>
                <div>
                  <div className="font-display font-bold text-xl sm:text-2xl text-primary">35%</div>
                  <div className="text-[11px] sm:text-xs text-text-muted">Akiba ya Mwezi</div>
                </div>
              </div>
            </div>

            {/* Right: Dynamic Interactive Phone Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[320px] sm:max-w-[340px]">
                {/* Glow under phone */}
                <div className="pointer-events-none absolute -inset-4 rounded-[3.5rem] bg-linear-to-b from-primary/30 to-savings/20 blur-2xl opacity-60" />

                {/* iPhone Bezel */}
                <div className="relative rounded-[2.8rem] border-[7px] border-zinc-800 bg-zinc-950 p-2.5 shadow-2xl">
                  {/* Dynamic Island */}
                  <div className="absolute left-1/2 top-3 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black flex items-center justify-end pr-2">
                    <span className="h-2 w-2 rounded-full bg-zinc-800" />
                  </div>

                  {/* Phone Screen Container */}
                  <div className="overflow-hidden rounded-[2.2rem] bg-bg border border-border/50 text-text p-4 min-h-[580px] flex flex-col justify-between">
                    {/* Top Phone Bar */}
                    <div>
                      <div className="flex items-center justify-between pt-4 pb-2 text-[11px] text-text-muted">
                        <span className="font-medium">9:41</span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">
                            TZ
                          </span>
                          <span className="text-[10px]">5G</span>
                        </div>
                      </div>

                      {/* Interactive Tab Switcher inside phone */}
                      <div className="flex items-center justify-around bg-surface border border-border/80 rounded-xl p-1 mb-3">
                        <button
                          onClick={() => setPhoneActiveTab('overview')}
                          className={`flex-1 py-1 text-[10px] font-medium rounded-lg transition-colors cursor-pointer ${
                            phoneActiveTab === 'overview'
                              ? 'bg-primary text-white font-semibold shadow-xs'
                              : 'text-text-muted hover:text-text'
                          }`}
                        >
                          Muhtasari
                        </button>
                        <button
                          onClick={() => setPhoneActiveTab('tx')}
                          className={`flex-1 py-1 text-[10px] font-medium rounded-lg transition-colors cursor-pointer ${
                            phoneActiveTab === 'tx'
                              ? 'bg-primary text-white font-semibold shadow-xs'
                              : 'text-text-muted hover:text-text'
                          }`}
                        >
                          Miamala
                        </button>
                        <button
                          onClick={() => setPhoneActiveTab('budget')}
                          className={`flex-1 py-1 text-[10px] font-medium rounded-lg transition-colors cursor-pointer ${
                            phoneActiveTab === 'budget'
                              ? 'bg-primary text-white font-semibold shadow-xs'
                              : 'text-text-muted hover:text-text'
                          }`}
                        >
                          Bajeti
                        </button>
                        <button
                          onClick={() => setPhoneActiveTab('savings')}
                          className={`flex-1 py-1 text-[10px] font-medium rounded-lg transition-colors cursor-pointer ${
                            phoneActiveTab === 'savings'
                              ? 'bg-primary text-white font-semibold shadow-xs'
                              : 'text-text-muted hover:text-text'
                          }`}
                        >
                          Akiba
                        </button>
                      </div>

                      {/* Screen Content based on selected tab */}
                      {phoneActiveTab === 'overview' && (
                        <div className="space-y-3">
                          {/* Live Balance Card */}
                          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary to-primary-hover p-4 text-white shadow-md">
                            <div className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/10 blur-xl" />
                            <p className="text-[11px] text-white/80 font-medium">Salio Lililopo (TSh)</p>
                            <p className="mt-1 font-display text-2xl font-bold tracking-tight tabular-nums">
                              TSh {animatedBalance.toLocaleString('en-US')}
                            </p>
                            <div className="mt-2.5 flex items-center gap-2 text-[10px] text-white/80">
                              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-300 animate-ping" />
                                M-Pesa • CRDB • NMB
                              </span>
                            </div>
                          </div>

                          {/* Income & Expense Split */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-xl border border-border bg-surface p-2.5">
                              <div className="flex items-center gap-1 text-[10px] text-text-muted mb-1">
                                <TrendingUp size={12} className="text-income" />
                                <span>Mapato</span>
                              </div>
                              <p className="text-xs font-bold text-income tabular-nums">+TSh 2,450,000</p>
                            </div>
                            <div className="rounded-xl border border-border bg-surface p-2.5">
                              <div className="flex items-center gap-1 text-[10px] text-text-muted mb-1">
                                <TrendingDown size={12} className="text-expense" />
                                <span>Matumizi</span>
                              </div>
                              <p className="text-xs font-bold text-expense tabular-nums">-TSh 607,500</p>
                            </div>
                          </div>

                          {/* Savings Goal Progress */}
                          <div className="rounded-xl border border-border bg-surface p-2.5">
                            <div className="flex items-center justify-between text-[10px] text-text-muted mb-1.5">
                              <span className="flex items-center gap-1">
                                <PiggyBank size={12} className="text-savings" />
                                <span>Meta: Kiwanja Bagamoyo</span>
                              </span>
                              <span className="font-bold text-text">68%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-surface-raised overflow-hidden">
                              <div className="h-full w-[68%] rounded-full bg-savings transition-all duration-500" />
                            </div>
                          </div>

                          {/* Recent Tanzanian Transactions Mini Feed */}
                          <div className="rounded-xl border border-border bg-surface p-2 space-y-1.5">
                            <p className="text-[10px] font-semibold text-text-muted px-1">Miamala ya Leo</p>
                            <div className="flex items-center justify-between text-[11px] px-1 py-0.5">
                              <span className="truncate text-text flex items-center gap-1.5">
                                <Zap size={11} className="text-amber-500" />
                                <span>LUKU Umeme</span>
                              </span>
                              <span className="font-semibold text-expense tabular-nums">-TSh 35,000</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] px-1 py-0.5">
                              <span className="truncate text-text flex items-center gap-1.5">
                                <Utensils size={11} className="text-income" />
                                <span>Shoppers Supermarket</span>
                              </span>
                              <span className="font-semibold text-expense tabular-nums">-TSh 45,000</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] px-1 py-0.5">
                              <span className="truncate text-text flex items-center gap-1.5">
                                <WalletIcon size={11} className="text-primary" />
                                <span>Mshahara Kampuni</span>
                              </span>
                              <span className="font-semibold text-income tabular-nums">+TSh 1,850,000</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {phoneActiveTab === 'tx' && (
                        <div className="space-y-2">
                          <p className="text-[11px] font-semibold text-text">Daftari la Miamala</p>
                          {ledgerItems.slice(0, 5).map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 rounded-xl bg-surface border border-border text-[11px]"
                            >
                              <div>
                                <p className="font-medium text-text truncate max-w-[140px]">{item.label}</p>
                                <span className="text-[9px] text-text-muted">{item.tag}</span>
                              </div>
                              <span
                                className={`font-bold tabular-nums ${
                                  item.positive ? 'text-income' : 'text-expense'
                                }`}
                              >
                                {item.amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {phoneActiveTab === 'budget' && (
                        <div className="space-y-2.5">
                          <p className="text-[11px] font-semibold text-text">Vikomo vya Bajeti</p>
                          <div className="p-2.5 rounded-xl bg-surface border border-border space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-text-muted">Vyakula & Soko</span>
                              <span className="font-semibold text-text">TSh 380k / 500k</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-surface-raised overflow-hidden">
                              <div className="h-full w-[76%] rounded-full bg-amber-500" />
                            </div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-surface border border-border space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-text-muted">LUKU, DAWASA & Umeme</span>
                              <span className="font-semibold text-text">TSh 85k / 150k</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-surface-raised overflow-hidden">
                              <div className="h-full w-[56%] rounded-full bg-income" />
                            </div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-surface border border-border space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-text-muted">Usafiri, Mafuta & Daladala</span>
                              <span className="font-semibold text-text">TSh 120k / 140k</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-surface-raised overflow-hidden">
                              <div className="h-full w-[85%] rounded-full bg-expense" />
                            </div>
                          </div>
                        </div>
                      )}

                      {phoneActiveTab === 'savings' && (
                        <div className="space-y-2">
                          <p className="text-[11px] font-semibold text-text">Malengo ya Akiba</p>
                          {goalsList.slice(0, 3).map((g, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-surface border border-border">
                              <div className="flex items-center justify-between text-[10px] mb-1">
                                <span className="font-semibold text-text">{g.name}</span>
                                <span className="font-bold text-income">
                                  {Math.round((g.saved / g.target) * 100)}%
                                </span>
                              </div>
                              <p className="text-[9px] text-text-muted">
                                TSh {(g.saved / 1000000).toFixed(1)}M kati ya {(g.target / 1000000).toFixed(1)}M
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Phone Dock */}
                    <div className="pt-2 border-t border-border/60 flex items-center justify-around text-text-muted">
                      <WalletIcon size={16} className="text-primary" />
                      <Receipt size={16} />
                      <PieChart size={16} />
                      <PiggyBank size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE LEDGER STREAM (Matching Gozumi's animated ledger marquee) */}
      <section className="py-6 border-b border-border/80 bg-surface/40 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 mb-2 text-center">
          <p className="text-xs uppercase tracking-wider font-semibold text-text-muted">
            Miamala ya Moja kwa Moja ya Watumiaji Tanzania 🇹🇿
          </p>
        </div>
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max gap-4 animate-ticker hover:[animation-play-state:paused] py-2">
            {doubleLedger.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-2 text-xs shadow-xs shrink-0"
              >
                <span className="font-medium text-text">{item.label}</span>
                <span
                  className={`font-mono font-bold tabular-nums ${
                    item.positive ? 'text-income' : 'text-expense'
                  }`}
                >
                  {item.amount}
                </span>
                <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[9px] text-text-muted">
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE 4 FEATURES (Interactive Feature Showcases) */}
      <section id="features" className="py-16 md:py-24 border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-text">
              {t('landingFeaturesTitle')}
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Iliyotengenezwa mahususi kurahisisha usimamizi wa pesa, pochi za simu, na bajeti ya kaya
              nchini Tanzania bila ugumu wowote.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1: Log in seconds with Interactive Micro-Logger */}
            <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-primary/40 transition-all">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5">
                  <Zap size={24} />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-text mb-2">
                  {t('landingFeature1Title')}
                </h3>
                <p className="text-xs sm:text-sm text-text-muted mb-6 leading-relaxed">
                  {t('landingFeature1Desc')}
                </p>
              </div>

              {/* Interactive Micro-logger widget */}
              <div className="rounded-2xl border border-border bg-bg/70 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-text-muted font-medium">
                  <span>Jaribu kurekodi sasa:</span>
                  <span className="text-primary font-semibold">TSh {demoAmount.toLocaleString('en-US')}</span>
                </div>

                {/* Amount quick chips */}
                <div className="flex items-center gap-1.5">
                  {[10000, 25000, 50000, 100000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setDemoAmount(amt)}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        demoAmount === amt
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-surface border border-border text-text hover:bg-surface-raised'
                      }`}
                    >
                      +{amt >= 1000 ? `${amt / 1000}k` : amt}
                    </button>
                  ))}
                </div>

                {/* Wallet selector */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    onClick={() => setDemoWallet('mpesa')}
                    className={`py-1.5 rounded-lg text-[10px] font-medium border text-center transition-all cursor-pointer ${
                      demoWallet === 'mpesa'
                        ? 'border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400 font-bold'
                        : 'border-border bg-surface text-text-muted'
                    }`}
                  >
                    Vodacom M-Pesa
                  </button>
                  <button
                    onClick={() => setDemoWallet('tigo')}
                    className={`py-1.5 rounded-lg text-[10px] font-medium border text-center transition-all cursor-pointer ${
                      demoWallet === 'tigo'
                        ? 'border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                        : 'border-border bg-surface text-text-muted'
                    }`}
                  >
                    Tigo Pesa
                  </button>
                  <button
                    onClick={() => setDemoWallet('crdb')}
                    className={`py-1.5 rounded-lg text-[10px] font-medium border text-center transition-all cursor-pointer ${
                      demoWallet === 'crdb'
                        ? 'border-green-600/50 bg-green-600/10 text-green-600 dark:text-green-400 font-bold'
                        : 'border-border bg-surface text-text-muted'
                    }`}
                  >
                    CRDB Bank
                  </button>
                </div>

                {/* Generated Preview Card */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-border/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-income" />
                    <span className="text-text font-medium">Tozo ya kutoa imehesabiwa:</span>
                  </div>
                  <span className="font-mono text-text-muted text-[11px]">
                    Tozo: TSh {demoAmount <= 30000 ? '950' : demoAmount <= 70000 ? '1,450' : '2,200'}
                  </span>
                </div>
              </div>
            </div>

            {/* Feature 2: Real Goals & Savings */}
            <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-savings/40 transition-all">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-savings/10 text-savings mb-5">
                  <PiggyBank size={24} />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-text mb-2">
                  {t('landingFeature2Title')}
                </h3>
                <p className="text-xs sm:text-sm text-text-muted mb-6 leading-relaxed">
                  {t('landingFeature2Desc')}
                </p>
              </div>

              {/* Interactive Goal Explorer */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {goalsList.map((goal, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveGoalIndex(idx)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        activeGoalIndex === idx
                          ? 'border-savings bg-savings-soft/40 shadow-xs ring-1 ring-savings/30'
                          : 'border-border bg-bg/50 hover:bg-surface-raised'
                      }`}
                    >
                      <p className="text-xs font-bold text-text truncate">{goal.name}</p>
                      <p className="text-[11px] text-savings font-semibold mt-1">
                        {Math.round((goal.saved / goal.target) * 100)}% Imefikiwa
                      </p>
                    </button>
                  ))}
                </div>

                {/* Active Goal Highlight */}
                {goalsList[activeGoalIndex] && (
                  <div className="rounded-2xl border border-border bg-bg/70 p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted">
                        Kiasi kilichotengwa: TSh {goalsList[activeGoalIndex].saved.toLocaleString('en-US')}
                      </span>
                      <span className="font-bold text-text">
                        Lengo: TSh {goalsList[activeGoalIndex].target.toLocaleString('en-US')}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-surface-raised overflow-hidden">
                      <div
                        className="h-full rounded-full bg-savings transition-all duration-500"
                        style={{
                          width: `${Math.round(
                            (goalsList[activeGoalIndex].saved / goalsList[activeGoalIndex].target) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-text-muted pt-1">
                      <span>Mwisho wa lengo: {goalsList[activeGoalIndex].deadline}</span>
                      <span className="text-savings font-semibold">Tenga TSh 150k mwezi huu</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Feature 3: Shared Household with Family RBAC */}
            <div id="household" className="rounded-3xl border border-border bg-surface p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-primary/40 transition-all">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5">
                  <Users size={24} />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-text mb-2">
                  {t('landingFeature3Title')}
                </h3>
                <p className="text-xs sm:text-sm text-text-muted mb-6 leading-relaxed">
                  {t('landingFeature3Desc')}
                </p>
              </div>

              {/* Interactive Household Feed */}
              <div className="rounded-2xl border border-border bg-bg/70 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-muted">Kaya ya Pamoja (Live Feed)</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveMemberFilter('all')}
                      className={`px-2 py-0.5 text-[10px] rounded-full transition-colors cursor-pointer ${
                        activeMemberFilter === 'all'
                          ? 'bg-primary text-white font-bold'
                          : 'bg-surface text-text-muted'
                      }`}
                    >
                      Wote
                    </button>
                    <button
                      onClick={() => setActiveMemberFilter('amina')}
                      className={`px-2 py-0.5 text-[10px] rounded-full transition-colors cursor-pointer ${
                        activeMemberFilter === 'amina'
                          ? 'bg-primary text-white font-bold'
                          : 'bg-surface text-text-muted'
                      }`}
                    >
                      Amina
                    </button>
                    <button
                      onClick={() => setActiveMemberFilter('juma')}
                      className={`px-2 py-0.5 text-[10px] rounded-full transition-colors cursor-pointer ${
                        activeMemberFilter === 'juma'
                          ? 'bg-primary text-white font-bold'
                          : 'bg-surface text-text-muted'
                      }`}
                    >
                      Juma
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {filteredHousehold.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-surface border border-border flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-[11px] font-bold ${item.color}`}
                        >
                          {item.avatar}
                        </span>
                        <div className="truncate">
                          <p className="text-text font-medium truncate">
                            <span className="font-bold">{item.member}</span> {item.action}
                          </p>
                          <span className="text-[10px] text-text-muted">
                            {item.wallet} • {item.time}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-expense shrink-0 tabular-nums">{item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature 4: Clear Reports & Tanzania Category Allocations */}
            <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-income/40 transition-all">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-income/10 text-income mb-5">
                  <PieChart size={24} />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-text mb-2">
                  {t('landingFeature4Title')}
                </h3>
                <p className="text-xs sm:text-sm text-text-muted mb-6 leading-relaxed">
                  {t('landingFeature4Desc')}
                </p>
              </div>

              {/* Tanzanian Category Breakdown Bars */}
              <div className="rounded-2xl border border-border bg-bg/70 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>Mchanganuo wa Matumizi ya Kaya</span>
                  <span className="font-semibold text-text">Mwezi Huu</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text font-medium">🛒 Vyakula na Soko la Kariakoo</span>
                      <span className="text-text font-bold">34% (TSh 450,000)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-surface-raised overflow-hidden">
                      <div className="h-full w-[34%] rounded-full bg-primary" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text font-medium">⚡ LUKU Umeme na Maji DAWASA</span>
                      <span className="text-text font-bold">22% (TSh 290,000)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-surface-raised overflow-hidden">
                      <div className="h-full w-[22%] rounded-full bg-amber-500" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text font-medium">⛽ Usafiri, Mafuta & Daladala</span>
                      <span className="text-text font-bold">18% (TSh 240,000)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-surface-raised overflow-hidden">
                      <div className="h-full w-[18%] rounded-full bg-red-500" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text font-medium">🤝 VICOBA na Michango ya Harusi</span>
                      <span className="text-text font-bold">14% (TSh 185,000)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-surface-raised overflow-hidden">
                      <div className="h-full w-[14%] rounded-full bg-savings" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPARISON MATRIX (Bure vs. Premium matching Gozumi) */}
      <section id="pricing" className="py-16 md:py-24 border-b border-border/80 bg-surface/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles size={14} />
              <span>Mipango Rahisi na Wazi</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-text">
              Bure Milele. Premium Unapoihitaji.
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Mpango wa bure hauna kikomo cha muda. Unapohitaji Kaya ya Pamoja, sarafu zote, na ripoti za kina,
              Premium inakupa nguvu kamili.
            </p>

            {/* Monthly / Yearly Switch */}
            <div className="pt-4 inline-flex items-center justify-center">
              <div className="flex items-center bg-surface border border-border p-1 rounded-2xl shadow-xs">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  Kila Mwezi
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    billingCycle === 'yearly'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  <span>Kila Mwaka</span>
                  <span className="rounded-full bg-income-soft text-income px-1.5 py-0.5 text-[9px] font-bold">
                    Okoa 36%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Free Card */}
            <div className="rounded-3xl border border-border bg-surface p-7 sm:p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-bold text-text">Mpango wa Bure (Free)</h3>
                  <span className="rounded-full bg-surface-raised px-2.5 py-1 text-xs font-semibold text-text-muted">
                    Bure Milele
                  </span>
                </div>
                <div className="mb-6">
                  <span className="font-display text-4xl font-extrabold text-text">TSh 0</span>
                  <span className="text-xs text-text-muted ml-2">/ mwezi</span>
                  <p className="text-xs text-text-muted mt-1">Inatosha kabisa kwa matumizi binafsi ya mtu mmoja.</p>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-text-muted mb-8">
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-income shrink-0" />
                    <span>Miamala isiyo na kikomo ya mapato na matumizi</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-income shrink-0" />
                    <span>Makundi ya msingi ya bajeti (LUKU, Vyakula, Usafiri)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-income shrink-0" />
                    <span>Pochi 2 (mfano: M-Pesa + Pesa Taslimu)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-income shrink-0" />
                    <span>Malengo 2 ya Akiba</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-income shrink-0" />
                    <span>Hali ya Usiri (Daladala Stealth Mode)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-income shrink-0" />
                    <span>Inafanya kazi bila bando la intaneti (PWA Offline)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenAuth('register')}
                className="w-full h-11 rounded-xl border border-border bg-surface hover:bg-surface-raised active:scale-95 text-text font-medium text-xs sm:text-sm transition-all cursor-pointer"
              >
                Anza Bila Malipo
              </button>
            </div>

            {/* Premium Card */}
            <div className="relative rounded-3xl border-2 border-primary bg-surface p-7 sm:p-8 flex flex-col justify-between shadow-xl shadow-primary/10">
              <div className="absolute -top-3.5 right-6 rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-white shadow-xs">
                Inayopendekezwa Zaidi
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-bold text-text">Zumi Premium</h3>
                  <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
                    Jaribio Siku 7 Bure
                  </span>
                </div>

                <div className="mb-6">
                  {billingCycle === 'monthly' ? (
                    <div>
                      <span className="font-display text-4xl font-extrabold text-text">TSh 25,000</span>
                      <span className="text-xs text-text-muted ml-2">/ mwezi</span>
                    </div>
                  ) : (
                    <div>
                      <span className="font-display text-4xl font-extrabold text-text">TSh 190,000</span>
                      <span className="text-xs text-text-muted ml-2">/ mwaka</span>
                      <p className="text-[11px] text-income font-medium mt-0.5">Sawa na TSh 15,800 kwa mwezi</p>
                    </div>
                  )}
                  <p className="text-xs text-text-muted mt-1">Kwa kaya, wanandoa, na biashara za nyumbani.</p>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-text-muted mb-8">
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-primary shrink-0" />
                    <span className="text-text font-medium">Kila kitu kilichomo kwenye mpango wa Bure</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-primary shrink-0" />
                    <span className="text-text font-medium">Kaya ya Pamoja (Wanafamilia wasio na kikomo)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-primary shrink-0" />
                    <span>Pochi na akaunti zote za benki bila kikomo</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-primary shrink-0" />
                    <span>Ubadilishaji wa sarafu zote (TZS, USD, KES, EUR)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-primary shrink-0" />
                    <span>Hesabu za tozo za simu na ripoti za PDF & CSV</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-primary shrink-0" />
                    <span>Usaidizi wa kipaumbele kwa WhatsApp na simu</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenAuth('register')}
                className="w-full h-11 rounded-xl bg-primary text-white font-medium text-xs sm:text-sm shadow-md shadow-primary/25 hover:bg-primary-hover active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Jaribu Siku 7 za Bure</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS FROM TANZANIA */}
      <section className="py-16 md:py-24 border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-text">
              Watumiaji Wetu Wanavyosema
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Tazama jinsi familia na watu binafsi kote Tanzania wanavyopanga maisha yao kupitia Zumi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((tItem, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-border bg-surface p-6 flex flex-col justify-between shadow-xs hover:border-border/80 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(tItem.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-text leading-relaxed italic mb-6">
                    "{tItem.quote}"
                  </p>
                </div>
                <div className="pt-4 border-t border-border/60">
                  <p className="font-bold text-xs sm:text-sm text-text">{tItem.author}</p>
                  <p className="text-[11px] text-text-muted">{tItem.role}</p>
                  <p className="text-[10px] text-primary font-medium mt-0.5">{tItem.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section id="faq" className="py-16 md:py-24 border-b border-border/80 bg-surface/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12 space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-text">
              {t('landingFaqTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Majibu ya maswali ya kawaida kuhusu usalama wa data zako na huduma za Zumi.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-surface overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-surface-raised transition-colors"
                  >
                    <span className="font-semibold text-xs sm:text-sm text-text">{faq.q}</span>
                    <span className="text-text-muted shrink-0">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-text-muted border-t border-border/40 pt-3 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION BANNER */}
      <section className="py-16 md:py-20 relative overflow-hidden bg-primary text-white">
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-income/20 blur-2xl" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-6 relative z-10">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
            Anza kupanga fedha za kaya yako leo
          </h2>
          <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto leading-relaxed">
            Jiunge na maelfu ya Watanzania wanaodhibiti bili za LUKU, miamala ya M-Pesa na malengo ya akiba
            bila hofu.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-white text-primary font-bold text-sm shadow-xl hover:bg-zinc-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t('landingCtaPrimary')}</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto h-12 px-6 rounded-xl border border-white/30 text-white font-medium text-sm hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              Gundua Demo Moja kwa Moja
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-12 border-t border-border bg-surface text-text-muted text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-border/60">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white font-display font-bold text-base">
                Z
              </span>
              <div>
                <p className="font-display font-bold text-sm text-text">Zumi Tanzania</p>
                <p className="text-[10px] text-text-muted">Usimamizi wa Fedha za Kaya na Pochi</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-text-muted">
              <a href="#features" className="hover:text-text transition-colors">
                Vipengele
              </a>
              <a href="#household" className="hover:text-text transition-colors">
                Kaya ya Pamoja
              </a>
              <a href="#pricing" className="hover:text-text transition-colors">
                Mipango & Bei
              </a>
              <a href="#faq" className="hover:text-text transition-colors">
                Maswali (FAQ)
              </a>
              <a href="mailto:habari@gozumi.app" className="hover:text-text transition-colors">
                Mawasiliano: habari@gozumi.app
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-text-faint">
            <p>
              © {new Date().getFullYear()} Zumi App. Imetengenezwa mahususi kwa ajili ya Tanzania 🇹🇿.
            </p>
            <p>
              Viwango vya sarafu vinafuata mwongozo rasmi wa Benki Kuu ya Tanzania (BoT).
            </p>
          </div>
        </div>
      </footer>

      {/* 9. FLOATING CTA TOAST (Matching Gozumi's landing.ctaToast) */}
      <div className="fixed bottom-6 right-6 z-40 max-w-xs animate-in slide-in-from-bottom-5 duration-300">
        <div className="flex items-center gap-3 p-3 bg-surface/95 backdrop-blur-md border border-border rounded-2xl shadow-xl">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-text truncate">Unataka kujaribu Zumi?</p>
            <p className="text-[10px] text-text-muted truncate">Siku 7 bure, hakuna kadi.</p>
          </div>
          <button
            onClick={() => onOpenAuth('register')}
            className="px-3 py-1.5 rounded-xl bg-primary text-white text-[11px] font-bold hover:bg-primary-hover transition-colors shrink-0 cursor-pointer"
          >
            Anza
          </button>
        </div>
      </div>
    </div>
  );
};
