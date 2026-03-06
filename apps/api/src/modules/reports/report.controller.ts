import { Request, Response, NextFunction } from "express";
import { ReportService } from "./report.service";
import { HTTP_STATUS } from "../../config/constants";

const reportService = new ReportService();

export class ReportController {
  /**
   * Get monthly report
   * GET /api/reports/monthly/:year/:month
   */
  async getMonthly(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const year = parseInt(req.params.year as string);
      const month = parseInt(req.params.month as string);

      const report = await reportService.getMonthlyReport(userId, year, month);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get annual report
   * GET /api/reports/annual/:year
   */
  async getAnnual(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const year = parseInt(req.params.year as string);

      const report = await reportService.getAnnualReport(userId, year);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get tax summary for a year
   * GET /api/reports/tax/:year?rent=1200000
   */
  async getTaxSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const year = parseInt(req.params.year as string);
      const annualRent = req.query.rent
        ? parseFloat(req.query.rent as string)
        : 0;

      const summary = await reportService.getTaxSummary(
        userId,
        year,
        annualRent
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
   * Get year-to-date summary
   * GET /api/reports/ytd
   */
  async getYTD(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const summary = await reportService.getYTDSummary(userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }
}
