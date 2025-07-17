
// File: src/routes/admin.routes.ts
import express from 'express';
import {
  getAllAdmins,
  createStoreAdmin,
  updateStoreAdmin,
  deleteStoreAdmin,
} from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/authAdmin.middleware';
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware';

const router = express.Router();

router.use(authMiddleware, authorizeRoles(['SUPER_ADMIN']));

router.get('/', getAllAdmins);
router.post('/', createStoreAdmin);
router.put('/:id', updateStoreAdmin);
router.delete('/:id', deleteStoreAdmin);

export default router;
