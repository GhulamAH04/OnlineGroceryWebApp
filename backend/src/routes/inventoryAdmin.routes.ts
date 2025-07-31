// === FILE: backend/src/routes/inventoryAdmin.routes.ts ===

import express from "express";
import {
  getInventory,
  updateInventory,
} from "../controllers/inventoryProduct.controller";
import { authMiddleware } from "../middlewares/authAdmin.middleware";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware";

const router = express.Router();

// === READ: Boleh diakses oleh SUPER_ADMIN dan STORE_ADMIN ===
router.get(
  "/",
  authMiddleware,
  authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"]),
  getInventory
);

// === UPDATE: Hanya boleh dilakukan oleh SUPER_ADMIN ===
router.post(
  "/",
  authMiddleware,
  authorizeRoles(["SUPER_ADMIN"]),
  updateInventory
);

export default router;
