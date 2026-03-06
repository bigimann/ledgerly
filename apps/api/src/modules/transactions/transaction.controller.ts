// apps/api/src/modules/entries/entry.controller.ts

import { Request, Response, NextFunction } from "express";
import { TransactionService } from "./transaction.service";
import { SUCCESS_MESSAGES, TransactionType } from "@ledgerly/shared";
import { HTTP_STATUS } from "../../config/constants";

const transactionService = new TransactionService();

export class TransactionController {
  /**
   * Create new transaction
   * POST /api/entries
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const transaction = await transactionService.createTransaction(
        userId,
        req.body,
      );

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.TRANSACTION_CREATED,
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all transactions for user
   * GET /api/entries
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { type, startDate, endDate, category } = req.query;

      const filters: any = {};

      if (type) {
        filters.type = type as TransactionType;
      }
      if (startDate) {
        filters.startDate = new Date(startDate as string);
      }
      if (endDate) {
        filters.endDate = new Date(endDate as string);
      }
      if (category) {
        filters.category = category as string;
      }

      const transactions = await transactionService.getTransactions(
        userId,
        filters,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: transactions,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get transaction by ID
   * GET /api/entries/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;

      const transaction = await transactionService.getTransactionById(
        userId,
        id,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update transaction
   * PATCH /api/entries/:id
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;

      const transaction = await transactionService.updateTransaction(
        userId,
        id,
        req.body,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.TRANSACTION_UPDATED,
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete transaction
   * DELETE /api/entries/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;

      await transactionService.deleteTransaction(userId, id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.TRANSACTION_DELETED,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get deleted transactions
   * GET /api/entries/deleted
   */
  async getDeleted(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const transactions =
        await transactionService.getDeletedTransactions(userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: transactions,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get monthly summary
   * GET /api/entries/summary/month/:year/:month
   */
  async getMonthlySummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const year = parseInt(req.params.year as string);
      const month = parseInt(req.params.month as string);

      const summary = await transactionService.getMonthlySummary(
        userId,
        year,
        month,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get daily summary for calendar view
   * GET /api/entries/calendar/:year/:month
   */
  async getCalendar(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const year = parseInt(req.params.year as string);
      const month = parseInt(req.params.month as string);

      const dailySummary = await transactionService.getMonthDailySummary(
        userId,
        year,
        month,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: dailySummary,
      });
    } catch (error) {
      next(error);
    }
  }
}
