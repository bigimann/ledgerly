import app from "./app";
import { env, validateEnv } from "./config/env";
import { prisma, disconnect } from "@ledgerly/db";

// Validate environment variables
validateEnv();

// Start server
const server = app.listen(env.PORT, () => {
  console.log(`\n🚀 Ledgerly API Server`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✓ Environment: ${env.NODE_ENV}`);
  console.log(`✓ Server: http://localhost:${env.PORT}`);
  console.log(`✓ Health: http://localhost:${env.PORT}/health`);
  console.log(`✓ API: http://localhost:${env.PORT}/api`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    console.log("✓ HTTP server closed");

    await disconnect();
    console.log("✓ Database connection closed");

    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

// Handle termination signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("UNHANDLED_REJECTION");
});
