// File: src/routes/discount.routes.ts

import express from 'express';
import {
  getDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from '../controllers/discount.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware';

const router = express.Router();

// SUPER_ADMIN dan STORE_ADMIN bisa akses
router.use(authMiddleware, authorizeRoles(['SUPER_ADMIN', 'STORE_ADMIN']));

router.get('/', getDiscounts);
router.post('/', createDiscount);
router.put('/:id', updateDiscount);
router.delete('/:id', deleteDiscount);

export default router;
