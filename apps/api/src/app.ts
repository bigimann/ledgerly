// apps/api/src/app.ts

import express, { Application } from "express";
import cors from "cors";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import routes from "./routes";

const app: Application = express();

// MIDDLEWARE

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (env.ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ROUTES

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Ledgerly API is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api", routes);

// ERROR HANDLING

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
