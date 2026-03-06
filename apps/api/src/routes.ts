import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import transactionRoutes from "./modules/transactions/transaction.routes";
import reportRoutes from "./modules/reports/report.routes";

const router = Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/reports", reportRoutes);
router.use("/transactions", transactionRoutes);

// Placeholder route
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Ledgerly API v1.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      transactions: "/api/transactions",
      calendar: "/api/calendar",
      reports: "/api/reports",
    },
  });
});

export default router;
