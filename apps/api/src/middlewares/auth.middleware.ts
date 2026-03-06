import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from "@ledgerly/shared";
import { env } from "../config/env";
import { AppError } from "./error.middleware";
import { HTTP_STATUS } from "../config/constants";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, "No token provided");
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JWTPayload;

    // Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError(HTTP_STATUS.UNAUTHORIZED, "Invalid token"));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError(HTTP_STATUS.UNAUTHORIZED, "Token expired"));
    }
    next(error);
  }
};
