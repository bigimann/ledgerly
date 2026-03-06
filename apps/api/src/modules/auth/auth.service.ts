// apps/api/src/modules/auth/auth.service.ts

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@ledgerly/db";
import {
  RegisterInput,
  LoginInput,
  AuthResponse,
  JWTPayload,
  ERROR_MESSAGES,
} from "@ledgerly/shared";
import { env } from "../../config/env";
import { AppError } from "../../middlewares/error.middleware";
import { HTTP_STATUS } from "../../config/constants";

export class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterInput): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError(HTTP_STATUS.CONFLICT, ERROR_MESSAGES.USER_EXISTS);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
      tokens,
    };
  }

  /**
   * Login user
   */
  async login(data: LoginInput): Promise<AuthResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.INVALID_CREDENTIALS
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.INVALID_CREDENTIALS
      );
    }

    // Generate tokens
    const tokens = await this.generateTokens({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
      tokens,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        env.JWT_REFRESH_SECRET
      ) as JWTPayload;

      // Check if refresh token exists in database
      const tokenRecord = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!tokenRecord) {
        throw new AppError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGES.TOKEN_INVALID
        );
      }

      // Check if token is expired
      if (tokenRecord.expiresAt < new Date()) {
        // Delete expired token
        await prisma.refreshToken.delete({
          where: { id: tokenRecord.id },
        });

        throw new AppError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGES.TOKEN_EXPIRED
        );
      }

      // Generate new access token
      const accessToken = this.generateAccessToken({
        userId: decoded.userId,
        email: decoded.email,
      });

      return { accessToken };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGES.TOKEN_INVALID
        );
      }
      throw error;
    }
  }

  /**
   * Logout user (invalidate refresh token)
   */
  async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  /**
   * Generate access and refresh tokens
   */
  private async generateTokens(payload: JWTPayload) {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    // Calculate expiry date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Save refresh token to database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  // Generate access token (short-lived)
  private generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(
      { userId: payload.userId, email: payload.email },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRY }
    );
  }

  // Generate refresh token (long-lived)
  private generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(
      { userId: payload.userId, email: payload.email },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRY }
    );
  }
}
