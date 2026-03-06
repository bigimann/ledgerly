import { TransactionType } from "./enums";
import type { TaxBandCalculation } from "@ledgerly/tax-engine";

// USER TYPES

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
}

// AUTHENTICATION TYPES

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// TRANSACTION TYPES

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  date: Date;
  type: TransactionType;
  category: string;
  description?: string;
  isRecurring: boolean;
  isTaxExempt: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateTransactionDTO {
  amount: number;
  date: Date | string;
  type: TransactionType;
  category: string;
  description?: string;
  isRecurring?: boolean;
  isTaxExempt?: boolean;
}

export interface UpdateTransactionDTO {
  amount?: number;
  date?: Date | string;
  category?: string;
  description?: string;
  isRecurring?: boolean;
  isTaxExempt?: boolean;
}

// CALENDAR TYPES

export interface DayTransaction {
  date: string; // YYYY-MM-DD
  incomeTotal: number;
  expenseTotal: number;
  transactions: Transaction[];
}

export interface MonthSummary {
  month: string; // YYYY-MM
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  transactionCount: number;
  days: DayTransaction[];
}

// TAX TYPES

export interface TaxBand {
  band: number;
  amount: number;
  rate: number;
  tax: number;
}

export interface TaxCalculation {
  grossIncome: number;
  taxableIncome: number;
  totalTax: number;
  netIncome: number;
  effectiveRate: number;
  bands: TaxBand[];
}

export interface AnnualTaxSummary {
  year: number;
  totalIncome: number;
  totalExpense: number;
  taxExemptIncome: number;
  rentRelief: number;
  taxableIncome: number;
  estimatedTax: number;
  netIncome: number;
  effectiveRate: number;
  bands: TaxBandCalculation[];
}

// REPORT TYPES

export interface MonthlyReport {
  month: string;
  year: number;
  income: {
    total: number;
    byCategory: Record<string, number>;
  };
  expense: {
    total: number;
    byCategory: Record<string, number>;
  };
  net: number;
}

export interface AnnualReport {
  year: number;
  income: {
    total: number;
    byCategory: Record<string, number>;
    byMonth: Record<string, number>;
  };
  expense: {
    total: number;
    byCategory: Record<string, number>;
    byMonth: Record<string, number>;
  };
  net: number;
  tax: AnnualTaxSummary;
}

// API RESPONSE TYPES

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}
