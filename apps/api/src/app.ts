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

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowedOrigins = env.ALLOWED_ORIGINS;

      if (allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
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
