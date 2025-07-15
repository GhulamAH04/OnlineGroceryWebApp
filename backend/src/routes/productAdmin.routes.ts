// File: src/routes/productAdmin.routes.ts

import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productAdmin.controller';
import { upload } from '../middlewares/fileUpload.middleware';
import { authMiddleware } from '../middlewares/authAdmin.middleware';
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post(
  '/',
  authMiddleware,
  authorizeRoles(['SUPER_ADMIN']),
  upload.array('images', 3),
  createProduct
);

router.put(
  '/:id',
  authMiddleware,
  authorizeRoles(['SUPER_ADMIN']),
  upload.array('images', 3),
  updateProduct
);

router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles(['SUPER_ADMIN']),
  deleteProduct
);

export default router;
