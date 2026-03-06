// packages/db/src/client.ts

import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a singleton instance
export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// In development, save the instance to prevent hot-reload issues
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Graceful shutdown
export const disconnect = async () => {
  await prisma.$disconnect();
};

// Health check
export const healthCheck = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
};
