

/*
// FILE: backend/src/routes/branchAdmin.routes.ts

import { Router } from "express";
import {
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  assignStoreAdmin,
} from "../controllers/branchAdmin.controller";
import { authMiddleware } from "../middlewares/authAdmin.middleware";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware";

const router = Router();

router.use(authMiddleware);
router.use(authorizeRoles(["SUPER_ADMIN"]));

router.get("/", getAllBranches);
router.post("/", createBranch);
router.put("/:id", updateBranch);
router.delete("/:id", deleteBranch);
router.patch("/:id", assignStoreAdmin); // ✅ assign store admin

export default router;
*/