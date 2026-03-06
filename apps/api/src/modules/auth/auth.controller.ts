// apps/api/src/modules/auth/auth.controller.ts

import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { SUCCESS_MESSAGES } from "@ledgerly/shared";
import { HTTP_STATUS } from "../../config/constants";

const authService = new AuthService();

export class AuthController {
  /**
   * Register new user
   * POST /api/auth/register
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      await authService.logout(refreshToken);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      // User is attached by auth middleware
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          error: "Unauthorized",
        });
      }

      // This will be implemented when we create user service
      // For now, just return the JWT payload
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: req.user,
      });
    } catch (error) {
      next(error);
    }
  }
}
