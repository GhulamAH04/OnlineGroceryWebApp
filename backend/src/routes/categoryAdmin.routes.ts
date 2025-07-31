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

// === READ: SUPER_ADMIN & STORE_ADMIN ===
router.get(
  "/",
  authMiddleware,
  authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"]),
  getAllCategories
);

// === CREATE/UPDATE/DELETE: SUPER_ADMIN Only ===
router.post("/", authMiddleware, authorizeRoles(["SUPER_ADMIN"]), createCategory);
router.put("/:id", authMiddleware, authorizeRoles(["SUPER_ADMIN"]), updateCategory);
router.delete("/:id", authMiddleware, authorizeRoles(["SUPER_ADMIN"]), deleteCategory);

export default router;
