// File: backend/src/routes/inventoryJournal.routes.ts

import express from "express";
import {
  getAllInventoryJournals,
  createInventoryJournal,
  deleteInventoryJournal,
} from "../controllers/inventoryJournal.controller";
import { authMiddleware } from "../middlewares/authAdmin.middleware";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware";

const router = express.Router();

// ✅ Terapkan middleware auth ke semua route
router.use(authMiddleware);

// === GET: SUPER_ADMIN & STORE_ADMIN boleh lihat ===
router.get(
  "/",
  authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"]),
  getAllInventoryJournals
);

// === POST: hanya SUPER_ADMIN yang boleh tambah jurnal ===
router.post("/", authorizeRoles(["SUPER_ADMIN"]), createInventoryJournal);

// === DELETE: hanya SUPER_ADMIN yang boleh hapus jurnal ===
router.delete("/:id", authorizeRoles(["SUPER_ADMIN"]), deleteInventoryJournal);

export default router;
