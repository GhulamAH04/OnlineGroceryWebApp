// === FILE: backend/src/routes/discount.routes.ts ===

import express from "express";
import {
  getDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "../controllers/discountProduct.controller";
import { authMiddleware } from "../middlewares/authAdmin.middleware";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware";

const router = express.Router();

// === READ (GET): boleh diakses oleh SUPER_ADMIN dan STORE_ADMIN ===
router.get(
  "/",
  authMiddleware,
  authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"]),
  getDiscounts
);

// === CREATE: hanya boleh diakses oleh SUPER_ADMIN ===
router.post(
  "/",
  authMiddleware,
  authorizeRoles(["SUPER_ADMIN"]),
  createDiscount
);

// === UPDATE: hanya boleh diakses oleh SUPER_ADMIN ===
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles(["SUPER_ADMIN"]),
  updateDiscount
);

// === DELETE: hanya boleh diakses oleh SUPER_ADMIN ===
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(["SUPER_ADMIN"]),
  deleteDiscount
);

export default router;
