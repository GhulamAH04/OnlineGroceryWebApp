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

router.use(authMiddleware);

router.get("/sales/month", authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"]), getSalesPerMonth);
router.get("/sales/category", authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"]), getSalesByCategory);
router.get("/sales/product", authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"]), getSalesByProduct);
router.get("/stock/summary", authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"]), getStockSummary);
router.get("/stock/detail", authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"]), getStockDetail);

export default router;


/*
// File: src/routes/report.routes.ts

import express from 'express';
import {
  getSalesReport,
  getStockReport,
} from '../controllers/reportSalesAdmin';
import { authMiddleware } from '../middlewares/authAdmin.middleware';
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware';

const router = express.Router();

router.use(authMiddleware, authorizeRoles(['SUPER_ADMIN', 'STORE_ADMIN']));

router.get('/sales', getSalesReport);
router.get('/stock', getStockReport);

export default router;
*/