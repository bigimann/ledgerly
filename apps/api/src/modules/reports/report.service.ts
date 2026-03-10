import { prisma } from "@ledgerly/db";
import { TransactionType } from "@ledgerly/shared";
import {
  calculatePIT,
  calculateRentRelief,
  TaxCalculator,
} from "@ledgerly/tax-engine";

const taxCalculator = new TaxCalculator("nigeria");

export class ReportService {
  /**
   * Get monthly report with income/expense breakdown
   */
  async getMonthlyReport(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        deletedAt: null,
      },
    });

    // Calculate totals by category
    const incomeByCategory: Record<string, number> = {};
    const expenseByCategory: Record<string, number> = {};
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction: any) => {
      const amount = Number(transaction.amount);

      if (transaction.type === TransactionType.INCOME) {
        totalIncome += amount;
        incomeByCategory[transaction.category] =
          (incomeByCategory[transaction.category] || 0) + amount;
      } else {
        totalExpense += amount;
        expenseByCategory[transaction.category] =
          (expenseByCategory[transaction.category] || 0) + amount;
      }
    });

    return {
      month: `${year}-${String(month).padStart(2, "0")}`,
      year,
      income: {
        total: totalIncome,
        byCategory: incomeByCategory,
      },
      expense: {
        total: totalExpense,
        byCategory: expenseByCategory,
      },
      net: totalIncome - totalExpense,
      transactionCount: transactions.length,
    };
  }

  /**
   * Get annual report with full breakdown
   */
  async getAnnualReport(userId: string, year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        deletedAt: null,
      },
    });

    // Initialize accumulators
    const incomeByCategory: Record<string, number> = {};
    const expenseByCategory: Record<string, number> = {};
    const incomeByMonth: Record<string, number> = {};
    const expenseByMonth: Record<string, number> = {};

    let totalIncome = 0;
    let totalExpense = 0;
    let taxExemptIncome = 0;

    transactions.forEach((transaction: any) => {
      const amount = Number(transaction.amount);
      const monthKey = transaction.date.toISOString().substring(0, 7); // YYYY-MM

      if (transaction.type === TransactionType.INCOME) {
        totalIncome += amount;

        // Track tax-exempt income
        if (transaction.isTaxExempt) {
          taxExemptIncome += amount;
        }

        // By category
        incomeByCategory[transaction.category] =
          (incomeByCategory[transaction.category] || 0) + amount;

        // By month
        incomeByMonth[monthKey] = (incomeByMonth[monthKey] || 0) + amount;
      } else {
        totalExpense += amount;

        // By category
        expenseByCategory[transaction.category] =
          (expenseByCategory[transaction.category] || 0) + amount;

        // By month
        expenseByMonth[monthKey] = (expenseByMonth[monthKey] || 0) + amount;
      }
    });

    // Calculate tax (simplified - no rent data for now)
    const rentRelief = 0; // Or get from user settings
    const taxableIncome = Math.max(
      0,
      totalIncome - taxExemptIncome - rentRelief,
    );
    const taxCalculation = calculatePIT(taxableIncome);

    return {
      year,
      income: {
        total: totalIncome,
        byCategory: incomeByCategory,
        byMonth: incomeByMonth,
      },
      expense: {
        total: totalExpense,
        byCategory: expenseByCategory,
        byMonth: expenseByMonth,
      },
      net: totalIncome - totalExpense,
      tax: {
        year,
        totalIncome,
        totalExpense,
        taxExemptIncome,
        rentRelief,
        taxableIncome: taxCalculation.taxableIncome,
        estimatedTax: taxCalculation.totalTax,
        netIncome: totalIncome - taxCalculation.totalTax,
        effectiveRate: taxCalculation.effectiveRate,
        bands: taxCalculation.bands,
      },
      transactionCount: transactions.length,
    };
  }

  /**
   * Get tax summary for a specific year
   */
  async getTaxSummary(
    userId: string,
    year: number,
    annualRentPaid: number = 0,
  ) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        deletedAt: null,
        type: TransactionType.INCOME,
      },
    });

    let totalIncome = 0;
    let taxExemptIncome = 0;

    transactions.forEach((transaction: any) => {
      const amount = Number(transaction.amount);
      totalIncome += amount;

      if (transaction.isTaxExempt) {
        taxExemptIncome += amount;
      }
    });

    // Calculate rent relief
    const rentRelief = calculateRentRelief(annualRentPaid);

    // Calculate taxable income (income - exempt - relief)
    const taxableIncome = Math.max(
      0,
      totalIncome - taxExemptIncome - rentRelief,
    );

    // Calculate tax using the new simplified function
    const taxCalculation = calculatePIT(taxableIncome);

    return {
      year,
      totalIncome,
      taxExemptIncome,
      rentRelief,
      taxableIncome: taxCalculation.taxableIncome,
      estimatedTax: taxCalculation.totalTax,
      netIncome: totalIncome - taxCalculation.totalTax,
      effectiveRate: taxCalculation.effectiveRate,
      bands: taxCalculation.bands,
      disclaimer: taxCalculator.getDisclaimer(),
      methodology: taxCalculator.getMethodology(),
    };
  }

  /**
   * Get year-to-date summary
   */
  async getYTDSummary(userId: string) {
    const now = new Date();
    const year = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const startDate = new Date(year, 0, 1);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: now,
        },
        deletedAt: null,
      },
    });

    let totalIncome = 0;
    let totalExpense = 0;
    let taxExemptIncome = 0;

    transactions.forEach((transaction: any) => {
      const amount = Number(transaction.amount);

      if (transaction.type === TransactionType.INCOME) {
        totalIncome += amount;
        if (transaction.isTaxExempt) {
          taxExemptIncome += amount;
        }
      } else {
        totalExpense += amount;
      }
    });

    // Project annual income based on current month
    const monthsRemaining = 12 - currentMonth;
    const averageMonthly = totalIncome / currentMonth;
    const projectedAnnualIncome =
      totalIncome + averageMonthly * monthsRemaining;

    // Calculate projected tax on annual income
    const projectedTaxableIncome = Math.max(
      0,
      projectedAnnualIncome - taxExemptIncome,
    );
    const projectedTaxCalc = calculatePIT(projectedTaxableIncome);

    return {
      year,
      currentMonth,
      ytdIncome: totalIncome,
      ytdExpense: totalExpense,
      ytdNet: totalIncome - totalExpense,
      taxExemptIncome,
      projectedAnnualIncome,
      projectedAnnualTax: projectedTaxCalc.totalTax,
      projectedNetIncome: projectedAnnualIncome - projectedTaxCalc.totalTax,
    };
  }
}
