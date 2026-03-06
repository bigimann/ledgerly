import dotenv from "dotenv";
import path from "path";
import type { StringValue } from "ms";

// Load .env from root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

interface EnvConfig {
  // Server
  PORT: number;
  NODE_ENV: string;

  // Database
  DATABASE_URL: string;

  // JWT
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRY: StringValue;
  JWT_REFRESH_EXPIRY: StringValue;

  // CORS
  ALLOWED_ORIGINS: string[];
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env: EnvConfig = {
  PORT: parseInt(getEnvVar("API_PORT", "4000"), 10),
  NODE_ENV: getEnvVar("NODE_ENV", "development"),

  DATABASE_URL: getEnvVar("DATABASE_URL"),

  JWT_ACCESS_SECRET: getEnvVar("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: getEnvVar("JWT_REFRESH_SECRET"),
  JWT_ACCESS_EXPIRY: getEnvVar("JWT_ACCESS_EXPIRY", "15m") as StringValue,
  JWT_REFRESH_EXPIRY: getEnvVar("JWT_REFRESH_EXPIRY", "7d") as StringValue,

  ALLOWED_ORIGINS: getEnvVar("ALLOWED_ORIGINS", "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim()),
};

// Validate environment on startup
export const validateEnv = (): void => {
  console.log("✓ Environment variables loaded successfully");
  console.log(`✓ Running in ${env.NODE_ENV} mode`);
  console.log(`✓ Server will run on port ${env.PORT}`);
};
