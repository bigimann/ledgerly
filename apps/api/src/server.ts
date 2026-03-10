import app from "./app";
import { env, validateEnv } from "./config/env";
import { disconnect } from "@ledgerly/db";

validateEnv();

const server = app.listen(env.PORT, () => {
  const baseUrl =
    env.NODE_ENV === "production"
      ? process.env.RENDER_EXTERNAL_URL ||
        process.env.API_URL ||
        `http://localhost:${env.PORT}`
      : `http://localhost:${env.PORT}`;

  console.log(`\n🚀 Ledgerly API Server`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✓ Environment: ${env.NODE_ENV}`);
  console.log(`✓ Server: ${baseUrl}`);
  console.log(`✓ Health: ${baseUrl}/health`);
  console.log(`✓ API: ${baseUrl}/api`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});

let isShuttingDown = false;

const gracefulShutdown = async (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`\n${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    console.log("✓ HTTP server closed");

    await disconnect();
    console.log("✓ Database connection closed");

    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("UNHANDLED_REJECTION");
});
