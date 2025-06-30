// File: src/routes/report.routes.ts

import express from 'express';
import {
  getSalesReport,
  getStockReport,
} from '../controllers/report.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware';

const router = express.Router();

router.use(authMiddleware, authorizeRoles(['SUPER_ADMIN', 'STORE_ADMIN']));

router.get('/sales', getSalesReport);
router.get('/stock', getStockReport);

export default router;
