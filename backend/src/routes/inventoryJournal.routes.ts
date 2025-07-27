// OnlineGroceryWebApp/backend/src/routes/inventoryJournal.routes.ts

import express from "express";
import {
  getAllInventoryJournals,
  createInventoryJournal,
  deleteInventoryJournal,
} from "../controllers/inventoryJournal.controller";
import { authMiddleware } from "../middlewares/authAdmin.middleware";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware";

const router = express.Router();

// ✅ Middleware diterapkan ke semua route
router.use(authMiddleware);

router.get(
  "/admin/inventory-journal",
  authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"]),
  getAllInventoryJournals
);

router.post(
  "/admin/inventory-journal",
  authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"]),
  createInventoryJournal
);

router.delete(
  "/admin/inventory-journal/:id",
  authorizeRoles(["SUPER_ADMIN"]),
  deleteInventoryJournal
);

export default router;
