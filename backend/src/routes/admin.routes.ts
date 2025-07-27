// OnlineGroceryWebApp/backend/src/routes/admin.routes.ts

import express from 'express';
import {
  getAllAdmins,
  createStoreAdmin,
  updateStoreAdmin,
  deleteStoreAdmin,
  getAllBranches,
} from '../controllers/admin.controller';

import { authMiddleware } from '../middlewares/authAdmin.middleware';
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware';

const router = express.Router();

// Middleware untuk semua route di bawah ini
router.use(authMiddleware, authorizeRoles(['SUPER_ADMIN']));

// ✅ Pindahkan ini ke atas sebelum route lain jika perlu, atau cukup pakai 1x middleware global
router.get("/branches", getAllBranches);

router.get("/", getAllAdmins);
router.post("/", createStoreAdmin);
router.put("/:id", updateStoreAdmin);
router.delete("/:id", deleteStoreAdmin);

export default router;


/*
// File: src/routes/admin.routes.ts
import express from 'express';
import {
  getAllAdmins,
  createStoreAdmin,
  updateStoreAdmin,
  deleteStoreAdmin,
  getAllBranches
} from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/authAdmin.middleware';
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware';

const router = express.Router();

router.use(authMiddleware, authorizeRoles(['SUPER_ADMIN']));
router.get("/branches", authMiddleware, authorizeRoles(['SUPER_ADMIN']), getAllBranches);


router.get('/', getAllAdmins);
router.post('/', createStoreAdmin);
router.put('/:id', updateStoreAdmin);
router.delete('/:id', deleteStoreAdmin);


export default router;
*/