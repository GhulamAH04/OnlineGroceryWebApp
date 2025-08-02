// OnlineGroceryWebApp/backend/src/routes/admin.routes.ts
// === FILE: src/routes/admin.routes.ts ===

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

// Gunakan proteksi secara eksplisit per-route
router.get("/branches", authMiddleware, authorizeRoles(['SUPER_ADMIN']), getAllBranches);
router.get("/", authMiddleware, authorizeRoles(['SUPER_ADMIN']), getAllAdmins);
router.post("/", authMiddleware, authorizeRoles(['SUPER_ADMIN']), createStoreAdmin);
router.put("/:id", authMiddleware, authorizeRoles(['SUPER_ADMIN']), updateStoreAdmin);
router.delete("/:id", authMiddleware, authorizeRoles(['SUPER_ADMIN']), deleteStoreAdmin);

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