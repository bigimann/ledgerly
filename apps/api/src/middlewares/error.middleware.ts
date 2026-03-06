import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@ledgerly/db";
import { HTTP_STATUS } from "../config/constants";

// Custom error class
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: "Validation Error",
      message: "Invalid input data",
      details: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (err.code === "P2002") {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        error: "Conflict",
        message: "A record with this data already exists",
      });
    }

    // Record not found
    if (err.code === "P2025") {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Not Found",
        message: "The requested resource was not found",
      });
    }
  }

  // Custom app errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      message: err.message,
    });
  }

  // Default server error
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
  });
};
