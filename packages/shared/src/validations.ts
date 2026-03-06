import { z } from "zod";
import { TransactionType } from "./enums";
import { LIMITS } from "./constants";

// AUTH VALIDATIONS

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(
      LIMITS.MIN_PASSWORD_LENGTH,
      `Password must be at least ${LIMITS.MIN_PASSWORD_LENGTH} characters`
    )
    .max(
      LIMITS.MAX_PASSWORD_LENGTH,
      `Password must not exceed ${LIMITS.MAX_PASSWORD_LENGTH} characters`
    ),
  firstName: z
    .string()
    .min(
      LIMITS.MIN_NAME_LENGTH,
      `First name must be at least ${LIMITS.MIN_NAME_LENGTH} characters`
    )
    .max(
      LIMITS.MAX_NAME_LENGTH,
      `First name must not exceed ${LIMITS.MAX_NAME_LENGTH} characters`
    ),
  lastName: z
    .string()
    .min(
      LIMITS.MIN_NAME_LENGTH,
      `Last name must be at least ${LIMITS.MIN_NAME_LENGTH} characters`
    )
    .max(
      LIMITS.MAX_NAME_LENGTH,
      `Last name must not exceed ${LIMITS.MAX_NAME_LENGTH} characters`
    ),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// TRANSACTION VALIDATIONS

export const createTransactionSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .min(LIMITS.MIN_AMOUNT, `Amount must be at least ₦${LIMITS.MIN_AMOUNT}`)
    .max(LIMITS.MAX_AMOUNT, `Amount cannot exceed ₦${LIMITS.MAX_AMOUNT}`),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.nativeEnum(TransactionType),
  category: z.string().min(1, "Category is required"),
  description: z
    .string()
    .max(
      LIMITS.MAX_DESCRIPTION_LENGTH,
      `Description must not exceed ${LIMITS.MAX_DESCRIPTION_LENGTH} characters`
    )
    .optional(),
  isRecurring: z.boolean().optional().default(false),
  isTaxExempt: z.boolean().optional().default(false),
});

export const updateTransactionSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .min(LIMITS.MIN_AMOUNT)
    .max(LIMITS.MAX_AMOUNT)
    .optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(), // Changed here too
  category: z.string().min(1).optional(),
  description: z.string().max(LIMITS.MAX_DESCRIPTION_LENGTH).optional(),
  isRecurring: z.boolean().optional(),
  isTaxExempt: z.boolean().optional(),
});

export const transactionIdSchema = z.object({
  id: z.string().cuid("Invalid transaction ID"),
});

// QUERY VALIDATIONS

export const dateRangeSchema = z.object({
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()),
});

export const monthQuerySchema = z.object({
  year: z.number().int().min(2020).max(2100),
  month: z.number().int().min(1).max(12),
});

export const yearQuerySchema = z.object({
  year: z.number().int().min(2020).max(2100),
});

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// TYPE EXPORTS (for TypeScript inference)

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type DateRangeInput = z.infer<typeof dateRangeSchema>;
export type MonthQueryInput = z.infer<typeof monthQuerySchema>;
export type YearQueryInput = z.infer<typeof yearQuerySchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
