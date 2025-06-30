// File: src/routes/inventory.routes.ts

import express from 'express';
import {
  getInventory,
  updateInventory,
} from '../controllers/inventory.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware';

const router = express.Router();

// ADMIN Only
router.use(authMiddleware, authorizeRoles(['SUPER_ADMIN', 'STORE_ADMIN']));

router.get('/', getInventory);
router.post('/', updateInventory);

export default router;
