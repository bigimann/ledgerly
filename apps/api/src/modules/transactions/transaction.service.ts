import { prisma } from "@ledgerly/db";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  Transaction,
  ERROR_MESSAGES,
  isValidCategory,
  TransactionType,
} from "@ledgerly/shared";
import { AppError } from "../../middlewares/error.middleware";
import { HTTP_STATUS } from "../../config/constants";

export class TransactionService {
  /**
   * Create a new transaction
   */
  async createTransaction(
    userId: string,
    data: CreateTransactionInput,
  ): Promise<Transaction> {
    // Validate category for transaction type
    if (!isValidCategory(data.type, data.category)) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.INVALID_CATEGORY,
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount: data.amount,
        date: new Date(data.date),
        type: data.type,
        category: data.category,
        description: data.description,
        isRecurring: data.isRecurring || false,
        isTaxExempt: data.isTaxExempt || false,
      },
    });

    return {
      ...transaction,
      amount: Number(transaction.amount),
    } as Transaction;
  }

  /**
   * Get transaction by ID
   */
  async getTransactionById(
    userId: string,
    transactionId: string,
  ): Promise<Transaction> {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
        deletedAt: null,
      },
    });

    if (!transaction) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.TRANSACTION_NOT_FOUND,
      );
    }

    return {
      ...transaction,
      amount: Number(transaction.amount),
    } as Transaction;
  }

  /**
   * Get all transactions for user
   */
  async getTransactions(
    userId: string,
    filters?: {
      type?: TransactionType;
      startDate?: Date;
      endDate?: Date;
      category?: string;
    },
  ): Promise<Transaction[]> {
    const where: any = {
      userId,
      deletedAt: null,
    };

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.date.lte = filters.endDate;
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: {
        date: "desc",
      },
    });

    return transactions.map((t: { amount: any }) => ({
      ...t,
      amount: Number(t.amount),
    })) as Transaction[];
  }

  /**
   * Update transaction
   */
  async updateTransaction(
    userId: string,
    transactionId: string,
    data: UpdateTransactionInput,
  ): Promise<Transaction> {
    // Check if transaction exists and belongs to user
    await this.getTransactionById(userId, transactionId);

    const transaction = await prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.date && { date: new Date(data.date) }),
        ...(data.category && { category: data.category }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.isRecurring !== undefined && {
          isRecurring: data.isRecurring,
        }),
        ...(data.isTaxExempt !== undefined && {
          isTaxExempt: data.isTaxExempt,
        }),
      },
    });

    return {
      ...transaction,
      amount: Number(transaction.amount),
    } as Transaction;
  }

  /**
   * Delete transaction (soft delete)
   */
  async deleteTransaction(
    userId: string,
    transactionId: string,
  ): Promise<void> {
    // Try to soft delete the transaction
    const result = await prisma.transaction.updateMany({
      where: {
        id: transactionId,
        userId,
        deletedAt: null, // Only delete if not already deleted
      },
      data: {
        deletedAt: new Date(),
      },
    });

    if (result.count === 0) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.TRANSACTION_NOT_FOUND,
      );
    }
  }

  /**
 Get deleted transactions (for history)
 */
  async getDeletedTransactions(userId: string): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        deletedAt: { not: null },
      },
      orderBy: {
        deletedAt: "desc",
      },
    });

    return transactions.map((t: any) => ({
      ...t,
      amount: Number(t.amount),
    })) as Transaction[];
  }

  /**
   * Get transactions for a specific month
   */
  async getMonthTransactions(
    userId: string,
    year: number,
    month: number,
  ): Promise<Transaction[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return this.getTransactions(userId, { startDate, endDate });
  }

  /**
   * Get daily summary for a month (for calendar view)
   */
  async getMonthDailySummary(userId: string, year: number, month: number) {
    const transactions = await this.getMonthTransactions(userId, year, month);

    // Group by date
    const dailyMap = new Map<string, any>();

    transactions.forEach((transaction) => {
      const dateKey = transaction.date.toISOString().split("T")[0];

      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          date: dateKey,
          incomeTotal: 0,
          expenseTotal: 0,
          transactions: [],
        });
      }

      const dayData = dailyMap.get(dateKey);

      if (transaction.type === TransactionType.INCOME) {
        dayData.incomeTotal += Number(transaction.amount);
      } else {
        dayData.expenseTotal += Number(transaction.amount);
      }

      dayData.transactions.push(transaction);
    });

    return Array.from(dailyMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    );
  }

  /**
   * Get monthly summary
   */
  async getMonthlySummary(userId: string, year: number, month: number) {
    const transactions = await this.getMonthTransactions(userId, year, month);

    const summary = {
      month: `${year}-${String(month).padStart(2, "0")}`,
      totalIncome: 0,
      totalExpense: 0,
      netAmount: 0,
      transactionCount: transactions.length,
    };

    transactions.forEach((transaction) => {
      const amount = Number(transaction.amount);
      if (transaction.type === TransactionType.INCOME) {
        summary.totalIncome += amount;
      } else {
        summary.totalExpense += amount;
      }
    });

    summary.netAmount = summary.totalIncome - summary.totalExpense;

    return summary;
  }
}
