import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Wallet,
  Category,
  Transaction,
  SavingsGoal,
  DebtItem,
  RecurringBill,
  HouseholdMember,
  UserSettings,
  AuditLogEntry,
  ThemeMode,
  AccentColor,
  Language,
  CurrencyCode,
  AuthUser,
} from '../types';
import {
  INITIAL_WALLETS,
  INITIAL_CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_DEBTS,
  INITIAL_RECURRING_BILLS,
  INITIAL_MEMBERS,
  INITIAL_SETTINGS,
  INITIAL_AUDIT_LOG,
} from '../data/initialData';
import { translations } from '../i18n';

interface FinanceContextType {
  // State
  wallets: Wallet[];
  categories: Category[];
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  debts: DebtItem[];
  recurringBills: RecurringBill[];
  members: HouseholdMember[];
  settings: UserSettings;
  auditLog: AuditLogEntry[];
  isLocked: boolean;

  // Auth State
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => void;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string; error?: string }>;

  // i18n
  t: (key: keyof typeof translations['sw']) => string;

  // Notification Toast System (Replaces browser alert in iframe environment)
  toast: { id: string; message: string; type: 'error' | 'success' | 'info' } | null;
  notify: (message: string, type?: 'error' | 'success' | 'info') => void;
  clearToast: () => void;

  // Actions - Transactions
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => boolean;
  updateTransaction: (tx: Transaction) => boolean;
  deleteTransaction: (id: string) => boolean;

  // Actions - Wallets
  addWallet: (wallet: Omit<Wallet, 'id'>) => boolean;
  updateWallet: (wallet: Wallet) => boolean;
  deleteWallet: (id: string) => boolean;
  transferFunds: (sourceWalletId: string, targetWalletId: string, amount: number, fee: number, note: string) => boolean;

  // Actions - Categories
  updateCategoryBudget: (id: string, budget: number) => boolean;

  // Actions - Goals
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => boolean;
  depositToGoal: (goalId: string, amount: number, walletId: string) => boolean;

  // Actions - Debts
  addDebt: (debt: Omit<DebtItem, 'id'>) => boolean;
  settleDebt: (debtId: string) => boolean;

  // Settings & Customization
  setLanguage: (lang: Language) => void;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
  setBaseCurrency: (curr: CurrencyCode) => void;
  togglePrivacyMode: () => void;
  setPinSecurity: (enabled: boolean, pin?: string) => void;
  unlockAppWithPin: (pin: string) => boolean;
  lockApp: () => void;
  setActiveMember: (memberId: string) => void;

  // Data management
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;
  resetAllData: () => void;

  // Formatter & Helpers
  formatMoney: (amount: number, customCurrency?: CurrencyCode) => string;
  activeMember: HouseholdMember;
  canEdit: boolean;
  isAdmin: boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEY = 'zumi_tanzania_data_v1';

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial from localStorage or defaults
  const [wallets, setWallets] = useState<Wallet[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_wallets`);
      return saved ? JSON.parse(saved) : INITIAL_WALLETS;
    } catch {
      return INITIAL_WALLETS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_categories`);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_transactions`);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_goals`);
      return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
    } catch {
      return INITIAL_SAVINGS_GOALS;
    }
  });

  const [debts, setDebts] = useState<DebtItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_debts`);
      return saved ? JSON.parse(saved) : INITIAL_DEBTS;
    } catch {
      return INITIAL_DEBTS;
    }
  });

  const [recurringBills, setRecurringBills] = useState<RecurringBill[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_bills`);
      return saved ? JSON.parse(saved) : INITIAL_RECURRING_BILLS;
    } catch {
      return INITIAL_RECURRING_BILLS;
    }
  });

  const [members, setMembers] = useState<HouseholdMember[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_members`);
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOG;
    } catch {
      return INITIAL_AUDIT_LOG;
    }
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = Boolean(currentUser);

  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return settings.pinSecurityEnabled;
  });

  const [toast, setToast] = useState<{ id: string; message: string; type: 'error' | 'success' | 'info' } | null>(null);

  const notify = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 4500);
  };

  const clearToast = () => setToast(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_wallets`, JSON.stringify(wallets));
      localStorage.setItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
      localStorage.setItem(`${STORAGE_KEY}_transactions`, JSON.stringify(transactions));
      localStorage.setItem(`${STORAGE_KEY}_goals`, JSON.stringify(savingsGoals));
      localStorage.setItem(`${STORAGE_KEY}_debts`, JSON.stringify(debts));
      localStorage.setItem(`${STORAGE_KEY}_bills`, JSON.stringify(recurringBills));
      localStorage.setItem(`${STORAGE_KEY}_members`, JSON.stringify(members));
      localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
      localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLog));
      if (currentUser) {
        localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(`${STORAGE_KEY}_user`);
      }
    } catch (e) {
      console.error('Failed to sync to localStorage', e);
    }
  }, [wallets, categories, transactions, savingsGoals, debts, recurringBills, members, settings, auditLog, currentUser]);

  // Apply Theme & Accent to document element
  useEffect(() => {
    const root = document.documentElement;
    // Theme
    if (settings.theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    }

    // Accent
    if (settings.accent && settings.accent !== 'default') {
      root.setAttribute('data-accent', settings.accent);
    } else {
      root.removeAttribute('data-accent');
    }
  }, [settings.theme, settings.accent]);

  // Helper for audit logging
  const logAudit = (action: string, details: string) => {
    const activeM = members.find((m) => m.id === settings.activeMemberId) || members[0];
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      actorName: activeM.name,
      details,
    };
    setAuditLog((prev) => [newEntry, ...prev.slice(0, 49)]);
  };

  // Active member and permissions
  const activeMember = useMemo(() => {
    return members.find((m) => m.id === settings.activeMemberId) || members[0];
  }, [members, settings.activeMemberId]);

  const isAdmin = activeMember.role === 'admin';
  const canEdit = activeMember.role === 'admin' || activeMember.role === 'contributor';

  // i18n lookup
  const t = (key: keyof typeof translations['sw']): string => {
    const lang = settings.language;
    return translations[lang][key] || translations['sw'][key] || String(key);
  };

  // Money Formatter with Privacy Blur
  const formatMoney = (amount: number, customCurrency?: CurrencyCode): string => {
    if (settings.privacyMode) {
      return '••••••';
    }
    const curr = customCurrency || settings.baseCurrency;
    const rounded = Math.round(amount);
    const formatted = rounded.toLocaleString('en-US');

    if (curr === 'TZS') {
      return `TSh ${formatted}`;
    }
    if (curr === 'USD') {
      return `$${(amount / 2680).toFixed(2)}`;
    }
    if (curr === 'KES') {
      return `KSh ${(amount / 20.75).toFixed(0)}`;
    }
    return `${curr} ${formatted}`;
  };

  // Transaction Actions
  const addTransaction = (txData: Omit<Transaction, 'id' | 'createdAt'>): boolean => {
    if (!canEdit) {
      alert('Huna ruhusa ya kurekodi muamala. Wasiliana na mkuu wa kaya.');
      return false;
    }

    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      createdAt: new Date().toISOString(),
      memberId: activeMember.id,
    };

    // Update wallet balances
    setWallets((prev) =>
      prev.map((w) => {
        if (newTx.type === 'expense' && w.id === newTx.walletId) {
          const totalDeduction = newTx.amount + (newTx.fee || 0);
          return { ...w, balance: Math.max(0, w.balance - totalDeduction) };
        }
        if (newTx.type === 'income' && w.id === newTx.walletId) {
          return { ...w, balance: w.balance + newTx.amount };
        }
        return w;
      })
    );

    setTransactions((prev) => [newTx, ...prev]);
    logAudit(
      'TX_CREATE',
      `${newTx.type.toUpperCase()}: ${formatMoney(newTx.amount)} - ${newTx.note || 'Bila maelezo'}`
    );
    return true;
  };

  const updateTransaction = (updatedTx: Transaction): boolean => {
    if (!canEdit) return false;
    setTransactions((prev) => prev.map((t) => (t.id === updatedTx.id ? updatedTx : t)));
    logAudit('TX_UPDATE', `Ilisasishwa muamala ID: ${updatedTx.id}`);
    return true;
  };

  const deleteTransaction = (id: string): boolean => {
    if (!isAdmin) {
      alert('Msimamizi wa kaya pekee (Admin) ndiye anayeweza kufuta muamala.');
      return false;
    }
    const target = transactions.find((t) => t.id === id);
    if (!target) return false;

    // Rollback wallet balance
    setWallets((prev) =>
      prev.map((w) => {
        if (target.type === 'expense' && w.id === target.walletId) {
          return { ...w, balance: w.balance + target.amount + (target.fee || 0) };
        }
        if (target.type === 'income' && w.id === target.walletId) {
          return { ...w, balance: Math.max(0, w.balance - target.amount) };
        }
        return w;
      })
    );

    setTransactions((prev) => prev.filter((t) => t.id !== id));
    logAudit('TX_DELETE', `Muamala ulifutwa: ${target.note} (${formatMoney(target.amount)})`);
    return true;
  };

  // Wallet Transfer
  const transferFunds = (
    sourceWalletId: string,
    targetWalletId: string,
    amount: number,
    fee: number,
    note: string
  ): boolean => {
    if (!canEdit) return false;
    const source = wallets.find((w) => w.id === sourceWalletId);
    const target = wallets.find((w) => w.id === targetWalletId);

    if (!source || !target) return false;
    if (source.balance < amount + fee) {
      alert(`Salio la ${source.name} halitoshi kufanya uhamisho huu wa ${formatMoney(amount + fee)}`);
      return false;
    }

    // Deduct from source and add to target
    setWallets((prev) =>
      prev.map((w) => {
        if (w.id === sourceWalletId) {
          return { ...w, balance: w.balance - (amount + fee) };
        }
        if (w.id === targetWalletId) {
          return { ...w, balance: w.balance + amount };
        }
        return w;
      })
    );

    // Record transfer transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'transfer',
      amount,
      currency: 'TZS',
      walletId: sourceWalletId,
      targetWalletId,
      fee,
      date: new Date().toISOString().split('T')[0],
      note: note || `Uhamisho: ${source.name} kwenda ${target.name}`,
      tag: 'Uhamisho',
      categoryId: 'c-food',
      memberId: activeMember.id,
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);
    logAudit(
      'TRANSFER',
      `Kutoka ${source.name} kwenda ${target.name}: ${formatMoney(amount)} (Tozo: ${formatMoney(fee)})`
    );
    return true;
  };

  const addWallet = (walletData: Omit<Wallet, 'id'>): boolean => {
    if (!isAdmin) return false;
    const newWallet: Wallet = {
      ...walletData,
      id: `w-${Date.now()}`,
    };
    setWallets((prev) => [...prev, newWallet]);
    logAudit('WALLET_ADD', `Akaunti mpya imeongezwa: ${newWallet.name}`);
    return true;
  };

  const updateWallet = (wallet: Wallet): boolean => {
    if (!isAdmin) return false;
    setWallets((prev) => prev.map((w) => (w.id === wallet.id ? wallet : w)));
    logAudit('WALLET_UPDATE', `Akaunti ilisasishwa: ${wallet.name}`);
    return true;
  };

  const deleteWallet = (id: string): boolean => {
    if (!isAdmin) return false;
    if (wallets.length <= 1) {
      alert('Lazima kuwepo na angalau pochi moja kwenye mfumo.');
      return false;
    }
    const target = wallets.find((w) => w.id === id);
    setWallets((prev) => prev.filter((w) => w.id !== id));
    logAudit('WALLET_DELETE', `Pochi ilifutwa: ${target?.name}`);
    return true;
  };

  const updateCategoryBudget = (id: string, budget: number): boolean => {
    if (!isAdmin) {
      alert('Msimamizi wa kaya tu ndiye anayeweza kurekebisha viwango vya bajeti.');
      return false;
    }
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, monthlyBudget: Math.max(0, budget) } : c))
    );
    const cat = categories.find((c) => c.id === id);
    logAudit('BUDGET_UPDATE', `Bajeti ya ${cat?.nameSw || cat?.name} iliwekwa kuwa ${formatMoney(budget)}`);
    return true;
  };

  const addSavingsGoal = (goalData: Omit<SavingsGoal, 'id'>): boolean => {
    if (!canEdit) return false;
    const newGoal: SavingsGoal = {
      ...goalData,
      id: `g-${Date.now()}`,
    };
    setSavingsGoals((prev) => [...prev, newGoal]);
    logAudit('GOAL_ADD', `Lengo la akiba liliongezwa: ${newGoal.nameSw || newGoal.name}`);
    return true;
  };

  const depositToGoal = (goalId: string, amount: number, walletId: string): boolean => {
    if (!canEdit) return false;
    const wallet = wallets.find((w) => w.id === walletId);
    if (!wallet || wallet.balance < amount) {
      alert('Salio la pochi halitoshi kuweka akiba hii.');
      return false;
    }

    // Deduct wallet
    setWallets((prev) =>
      prev.map((w) => (w.id === walletId ? { ...w, balance: w.balance - amount } : w))
    );

    // Increment goal
    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g))
    );

    const goal = savingsGoals.find((g) => g.id === goalId);

    // Record transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'expense',
      amount,
      currency: 'TZS',
      categoryId: 'c-invest',
      walletId,
      date: new Date().toISOString().split('T')[0],
      note: `Akiba: ${goal?.nameSw || goal?.name}`,
      tag: 'Akiba',
      memberId: activeMember.id,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    logAudit('GOAL_DEPOSIT', `Akiba iliwekwa kwenye ${goal?.nameSw}: ${formatMoney(amount)}`);
    return true;
  };

  const addDebt = (debtData: Omit<DebtItem, 'id'>): boolean => {
    if (!canEdit) return false;
    const newDebt: DebtItem = {
      ...debtData,
      id: `d-${Date.now()}`,
    };
    setDebts((prev) => [...prev, newDebt]);
    logAudit('DEBT_ADD', `Deni liliongezwa: ${newDebt.person} (${formatMoney(newDebt.amount)})`);
    return true;
  };

  const settleDebt = (debtId: string): boolean => {
    if (!canEdit) return false;
    setDebts((prev) =>
      prev.map((d) => (d.id === debtId ? { ...d, status: 'settled' } : d))
    );
    const d = debts.find((item) => item.id === debtId);
    logAudit('DEBT_SETTLED', `Deni lililipwa: ${d?.person}`);
    return true;
  };

  // Settings Actions
  const setLanguage = (lang: Language) => {
    setSettings((prev) => ({ ...prev, language: lang }));
  };

  const setTheme = (theme: ThemeMode) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const setAccent = (accent: AccentColor) => {
    setSettings((prev) => ({ ...prev, accent }));
  };

  const setBaseCurrency = (curr: CurrencyCode) => {
    setSettings((prev) => ({ ...prev, baseCurrency: curr }));
  };

  const togglePrivacyMode = () => {
    setSettings((prev) => ({ ...prev, privacyMode: !prev.privacyMode }));
  };

  const setPinSecurity = (enabled: boolean, pin?: string) => {
    setSettings((prev) => ({
      ...prev,
      pinSecurityEnabled: enabled,
      pinCode: pin || prev.pinCode || '1234',
    }));
    logAudit('SECURITY_PIN', enabled ? 'PIN ya usalama iliwezeshwa' : 'PIN ilizimwa');
  };

  const unlockAppWithPin = (pin: string): boolean => {
    if (pin === settings.pinCode) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const lockApp = () => {
    if (settings.pinSecurityEnabled) {
      setIsLocked(true);
    }
  };

  const setActiveMember = (memberId: string) => {
    setSettings((prev) => ({ ...prev, activeMemberId: memberId }));
    const m = members.find((x) => x.id === memberId);
    logAudit('USER_SWITCH', `Mtumiaji anayetumia mfumo sasa ni: ${m?.name}`);
  };

  // JSON Export & Import
  const exportDataJson = (): string => {
    const fullState = {
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      wallets,
      categories,
      transactions,
      savingsGoals,
      debts,
      recurringBills,
      members,
      settings,
      auditLog,
    };
    return JSON.stringify(fullState, null, 2);
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.wallets && parsed.transactions && parsed.categories) {
        setWallets(parsed.wallets);
        setCategories(parsed.categories);
        setTransactions(parsed.transactions);
        if (parsed.savingsGoals) setSavingsGoals(parsed.savingsGoals);
        if (parsed.debts) setDebts(parsed.debts);
        if (parsed.members) setMembers(parsed.members);
        if (parsed.settings) setSettings(parsed.settings);
        logAudit('DATA_IMPORT', 'Data ya kumbukumbu imerejeshwa kutoka faili la JSON');
        return true;
      }
      return false;
    } catch (e) {
      console.error('Invalid JSON import', e);
      return false;
    }
  };

  const resetAllData = () => {
    setWallets(INITIAL_WALLETS);
    setCategories(INITIAL_CATEGORIES);
    setTransactions(INITIAL_TRANSACTIONS);
    setSavingsGoals(INITIAL_SAVINGS_GOALS);
    setDebts(INITIAL_DEBTS);
    setRecurringBills(INITIAL_RECURRING_BILLS);
    setMembers(INITIAL_MEMBERS);
    setSettings(INITIAL_SETTINGS);
    setAuditLog(INITIAL_AUDIT_LOG);
    setIsLocked(false);
    logAudit('SYSTEM_RESET', 'Data zote zimerejeshwa kama mwanzo');
  };

  const loginWithEmail = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Tafadhali weka barua pepe sahihi.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Nenosiri lazima liwe na angalau herufi 6.' };
    }

    // Simulate authentication network latency
    await new Promise((resolve) => setTimeout(resolve, 350));

    const username = email.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = username.charAt(0).toUpperCase() + username.slice(1);
    const user: AuthUser = {
      id: `usr_${Date.now()}`,
      name: formattedName,
      email: email.trim().toLowerCase(),
      role: 'admin',
      plan: 'premium',
      isGuest: false,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(user);
    logAudit('AUTH_LOGIN', `Akaunti ya ${email} imeingia kwenye mfumo.`);
    return { success: true };
  };

  const registerWithEmail = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!name || name.trim().length < 2) {
      return { success: false, error: 'Tafadhali weka jina lako kamili.' };
    }
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Tafadhali weka barua pepe sahihi.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Nenosiri lazima liwe na angalau herufi 6.' };
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    const user: AuthUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim(),
      role: 'admin',
      plan: 'premium',
      isGuest: false,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(user);
    setMembers((prev) => {
      const exists = prev.find((m) => m.name.toLowerCase() === user.name.toLowerCase());
      if (exists) return prev;
      return [
        {
          id: `mem_${Date.now()}`,
          name: user.name,
          role: 'admin',
          avatarBg: 'bg-primary text-white',
          phone: user.phone || '+255 754 000 000',
        },
        ...prev,
      ];
    });

    logAudit('AUTH_REGISTER', `Akaunti mpya ya ${email} imefunguliwa.`);
    return { success: true };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const user: AuthUser = {
      id: `usr_google_${Date.now()}`,
      name: 'Juma Baraka',
      email: 'juma.baraka@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'admin',
      plan: 'premium',
      isGuest: false,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    logAudit('AUTH_GOOGLE', 'Mtumiaji ameingia kwa Google OAuth.');
    return { success: true };
  };

  const loginAsGuest = () => {
    const user: AuthUser = {
      id: 'usr_guest_tz',
      name: 'Mgeni wa Zumi (Demo)',
      email: 'demo.tanzania@gozumi.app',
      role: 'admin',
      plan: 'premium',
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    logAudit('AUTH_GUEST', 'Mtumiaji ameingia kwa Hali ya Mgeni (Demo ya Haraka).');
  };

  const logout = () => {
    if (currentUser) {
      logAudit('AUTH_LOGOUT', `Mtumiaji ${currentUser.name} ametoka kwenye akaunti.`);
    }
    setCurrentUser(null);
  };

  const resetPassword = async (
    email: string
  ): Promise<{ success: boolean; message: string; error?: string }> => {
    if (!email || !email.includes('@')) {
      return { success: false, message: '', error: 'Tafadhali andika barua pepe yako kwanza.' };
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      success: true,
      message: 'Tumekutumia kiungo cha kurejesha nenosiri kwenye barua pepe yako.',
    };
  };

  return (
    <FinanceContext.Provider
      value={{
        wallets,
        categories,
        transactions,
        savingsGoals,
        debts,
        recurringBills,
        members,
        settings,
        auditLog,
        isLocked,
        currentUser,
        isAuthenticated,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginAsGuest,
        logout,
        resetPassword,
        toast,
        notify,
        clearToast,
        t,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addWallet,
        updateWallet,
        deleteWallet,
        transferFunds,
        updateCategoryBudget,
        addSavingsGoal,
        depositToGoal,
        addDebt,
        settleDebt,
        setLanguage,
        setTheme,
        setAccent,
        setBaseCurrency,
        togglePrivacyMode,
        setPinSecurity,
        unlockAppWithPin,
        lockApp,
        setActiveMember,
        exportDataJson,
        importDataJson,
        resetAllData,
        formatMoney,
        activeMember,
        canEdit,
        isAdmin,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
