// File: backend/src/routes/store.routes.ts

import { Router } from "express";
import {
  AddNewStoreController,
  AssignStoreAdminController,
  DeleteStoreController,
  getAllStoresController,
  UpdateStoreController,
} from "../controllers/store.controller";

import { authMiddleware } from "../middlewares/authAdmin.middleware";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware";

const router = Router();

// === Semua route butuh autentikasi
router.use(authMiddleware);

// === GET: Boleh SUPER_ADMIN & STORE_ADMIN (read-only)
router.get("/", authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"]), getAllStoresController);

// === POST/PUT/PATCH/DELETE: Hanya SUPER_ADMIN
router.post("/", authorizeRoles(["SUPER_ADMIN"]), AddNewStoreController);
router.put("/:id", authorizeRoles(["SUPER_ADMIN"]), UpdateStoreController);
router.patch("/:id", authorizeRoles(["SUPER_ADMIN"]), AssignStoreAdminController);
router.delete("/:id", authorizeRoles(["SUPER_ADMIN"]), DeleteStoreController);

export default router;



/*
// NAHALIL
import { Router } from "express";
import { AddNewStoreController, AssignStoreAdminController, DeleteStoreController, getAllStoresController, UpdateStoreController } from "../controllers/store.controller";
const router = Router();

router.get("/", getAllStoresController);
router.post("/", AddNewStoreController);
router.put("/:id", UpdateStoreController);
router.patch("/:id", AssignStoreAdminController);
router.delete("/:id", DeleteStoreController);

export default router;

*/
/* rekomendasi 

// === FILE: src/routes/store.routes.ts ===

import { Router } from "express";
import {
  AddNewStoreController,
  AssignStoreAdminController,
  DeleteStoreController,
  getAllStoresController,
  UpdateStoreController,
  getAllBranchesForDropdown,
} from "../controllers/store.controller";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware";

const router = Router();

// === ROUTES UNTUK SUPER ADMIN (Manajemen Store) ===
router.get("/", authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"])
, getAllStoresController);
router.post("/", authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"])
, AddNewStoreController);
router.put("/:id", authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"])
, UpdateStoreController);
router.patch("/:id", authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"])
, AssignStoreAdminController);
router.delete("/:id", authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"])
, DeleteStoreController);

// === ROUTE UNTUK DROPDOWN CABANG (SUPER_ADMIN & STORE_ADMIN) ===
router.get("/all", authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"])
, getAllBranchesForDropdown);

export default router;



*/