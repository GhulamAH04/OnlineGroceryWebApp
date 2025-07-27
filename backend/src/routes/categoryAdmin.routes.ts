// File: backend/src/routes/categoryAdmin.routes.ts

import { Router } from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryProductAdmin.controller";
import { authMiddleware } from "../middlewares/authAdmin.middleware";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware";

const router = Router();

// Terapkan middleware untuk semua route di bawah ini
router.use(authMiddleware, authorizeRoles(["SUPER_ADMIN"]));

// === Routes ===
router.get("/", getAllCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;