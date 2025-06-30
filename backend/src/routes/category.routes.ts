// File: src/routes/category.routes.ts

import express from 'express';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller';  
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware';


const router = express.Router();

router.use(authMiddleware, authorizeRoles(['SUPER_ADMIN']));

router.get('/', getAllCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
