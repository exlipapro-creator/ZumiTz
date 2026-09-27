export type TransactionType = 'expense' | 'income' | 'transfer';

export type CurrencyCode = 'TZS' | 'USD' | 'KES';

export type WalletProvider =
  | 'mpesa'
  | 'tigo_pesa'
  | 'airtel_money'
  | 'halopesa'
  | 'crdb'
  | 'nmb'
  | 'nbc'
  | 'cash'
  | 'vicoba';

export interface Wallet {
  id: string;
  name: string;
  provider: WalletProvider;
  accountNumber: string;
  balance: number;
  currency: CurrencyCode;
  color: string;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameSw: string;
  icon: string;
  color: string;
  type: 'expense' | 'income';
  monthlyBudget: number; // in TZS
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: CurrencyCode;
  categoryId: string;
  walletId: string;
  targetWalletId?: string; // only for transfer
  fee?: number; // e.g. M-Pesa tozo
  date: string; // ISO format YYYY-MM-DD
  note: string;
  tag?: string;
  memberId: string;
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  nameSw: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
  notes?: string;
}

export interface DebtItem {
  id: string;
  person: string;
  amount: number;
  type: 'owe_them' | 'they_owe_me';
  dueDate: string;
  status: 'pending' | 'settled';
  notes?: string;
}

export interface RecurringBill {
  id: string;
  name: string;
  nameSw: string;
  amount: number;
  walletId: string;
  categoryId: string;
  dueDay: number; // 1-31
  frequency: 'monthly' | 'weekly' | 'yearly';
  active: boolean;
}

export type Role = 'admin' | 'contributor' | 'viewer';

export interface HouseholdMember {
  id: string;
  name: string;
  role: Role;
  avatarBg: string;
  phone?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'default' | 'ocean' | 'violet' | 'pink' | 'slate';
export type Language = 'sw' | 'en';

export interface UserSettings {
  language: Language;
  theme: ThemeMode;
  accent: AccentColor;
  baseCurrency: CurrencyCode;
  privacyMode: boolean; // hide numbers (••••••)
  pinSecurityEnabled: boolean;
  pinCode: string;
  activeMemberId: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actorName: string;
  details: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: Role;
  plan: 'free' | 'premium';
  isGuest?: boolean;
  createdAt: string;
}
