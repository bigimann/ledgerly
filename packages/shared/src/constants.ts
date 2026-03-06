/**
 * Nigeria Tax Bands (2026 Tax Act - Effective January 1, 2026)
 * Based on new progressive tax structure
 */
export const NIGERIA_TAX_BANDS = [
  { band: 1, minAmount: 0, maxAmount: 800_000, rate: 0.0 },
  { band: 2, minAmount: 800_001, maxAmount: 3_000_000, rate: 0.15 },
  { band: 3, minAmount: 3_000_001, maxAmount: 12_000_000, rate: 0.18 },
  { band: 4, minAmount: 12_000_001, maxAmount: 25_000_000, rate: 0.21 },
  { band: 5, minAmount: 25_000_001, maxAmount: 50_000_000, rate: 0.23 },
  { band: 6, minAmount: 50_000_001, maxAmount: Infinity, rate: 0.25 },
] as const;

/**
 * Rent Relief (2026 Tax Act - Replaces CRA)
 * Lower of:
 * - 20% of annual rent paid
 * - ₦500,000 cap
 */
export const RENT_RELIEF_PERCENTAGE = 0.2;
export const RENT_RELIEF_CAP = 500000;

// DATE & TIME CONSTANTS

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

// CURRENCY

export const CURRENCY = {
  code: "NGN",
  symbol: "₦",
  name: "Nigerian Naira",
} as const;

// VALIDATION LIMITS

export const LIMITS = {
  // Transaction
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 999999999999.99, // ~₦1 trillion
  MAX_DESCRIPTION_LENGTH: 500,

  // User
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,

  // Pagination
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE_SIZE: 20,

  // Date ranges
  MAX_YEAR_RANGE: 10, // Max 10 years of data retrieval at once
} as const;

// ERROR MESSAGES

export const ERROR_MESSAGES = {
  // Auth
  INVALID_CREDENTIALS: "Invalid email or password",
  UNAUTHORIZED: "Unauthorized access",
  TOKEN_EXPIRED: "Token has expired",
  TOKEN_INVALID: "Invalid token",
  USER_EXISTS: "User with this email already exists",
  USER_NOT_FOUND: "User not found",

  // Transactions
  TRANSACTION_NOT_FOUND: "Transaction not found",
  INVALID_AMOUNT: "Invalid transaction amount",
  INVALID_DATE: "Invalid transaction date",
  INVALID_CATEGORY: "Invalid category for transaction type",

  // General
  VALIDATION_ERROR: "Validation error",
  SERVER_ERROR: "Internal server error",
  BAD_REQUEST: "Bad request",
  NOT_FOUND: "Resource not found",
} as const;

// SUCCESS MESSAGES

export const SUCCESS_MESSAGES = {
  // Auth
  REGISTER_SUCCESS: "Account created successfully",
  LOGIN_SUCCESS: "Logged in successfully",
  LOGOUT_SUCCESS: "Logged out successfully",

  // Transactions
  TRANSACTION_CREATED: "Transaction created successfully",
  TRANSACTION_UPDATED: "Transaction updated successfully",
  TRANSACTION_DELETED: "Transaction deleted successfully",

  // General
  SUCCESS: "Operation successful",
} as const;
