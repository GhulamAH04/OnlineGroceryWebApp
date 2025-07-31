// File: backend/src/routes/reportSalesAdmin.ts

import express from "express";
import {
  getSalesPerMonth,
  getSalesByCategory,
  getSalesByProduct,
  getStockSummary,
  getStockDetail,
} from "../controllers/reportSalesAdmin";
import { authMiddleware } from "../middlewares/authAdmin.middleware";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware";

const router = express.Router();

// ✅ Semua request di bawah ini hanya untuk SUPER_ADMIN & STORE_ADMIN (read-only)
router.use(authMiddleware);

router.get("/sales/month", authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"]), getSalesPerMonth);
router.get("/sales/category", authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"]), getSalesByCategory);
router.get("/sales/product", authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"]), getSalesByProduct);
router.get("/stock/summary", authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"]), getStockSummary);
router.get("/stock/detail", authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"]), getStockDetail);

export default router;
