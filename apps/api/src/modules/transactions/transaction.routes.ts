// apps/api/src/modules/entries/entry.routes.ts

import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { validate } from "../../middlewares/validate.middleware";
import { authenticate } from "../../middlewares/auth.middleware";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "@ledgerly/shared";

const router = Router();
const entryController = new TransactionController();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/entries
 * @desc    Create new transaction
 * @access  Private
 */
router.post("/", validate(createTransactionSchema), entryController.create);

/**
 * @route   GET /api/entries
 * @desc    Get all transactions (with optional filters)
 * @access  Private
 */
router.get("/", entryController.getAll);

/**
 * @route   GET /api/entries/summary/month/:year/:month
 * @desc    Get monthly summary
 * @access  Private
 */
router.get("/summary/month/:year/:month", entryController.getMonthlySummary);

/**
 * @route   GET /api/entries/calendar/:year/:month
 * @desc    Get calendar view (daily summary for month)
 * @access  Private
 */
router.get("/calendar/:year/:month", entryController.getCalendar);

/**
 * @route   GET /api/transactions/deleted
 * @desc    Get deleted transactions (history)
 * @access  Private
 */
router.get("/deleted", entryController.getDeleted);

/**
 * @route   GET /api/entries/:id
 * @desc    Get transaction by ID
 * @access  Private
 */
router.get("/:id", entryController.getById);

/**
 * @route   PATCH /api/entries/:id
 * @desc    Update transaction
 * @access  Private
 */
router.patch("/:id", validate(updateTransactionSchema), entryController.update);

/**
 * @route   DELETE /api/entries/:id
 * @desc    Delete transaction
 * @access  Private
 */
router.delete("/:id", entryController.delete);

export default router;
