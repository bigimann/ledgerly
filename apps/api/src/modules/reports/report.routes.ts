import { Router } from "express";
import { ReportController } from "./report.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();
const reportController = new ReportController();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/reports/monthly/:year/:month
 * @desc    Get monthly report with income/expense breakdown
 * @access  Private
 */
router.get("/monthly/:year/:month", reportController.getMonthly);

/**
 * @route   GET /api/reports/annual/:year
 * @desc    Get annual report with full breakdown and tax calculation
 * @access  Private
 */
router.get("/annual/:year", reportController.getAnnual);

/**
 * @route   GET /api/reports/tax/:year
 * @desc    Get tax summary for a specific year
 * @query   rent - Annual rent paid (optional, for rent relief)
 * @access  Private
 */
router.get("/tax/:year", reportController.getTaxSummary);

/**
 * @route   GET /api/reports/ytd
 * @desc    Get year-to-date summary with projections
 * @access  Private
 */
router.get("/ytd", reportController.getYTD);

export default router;
