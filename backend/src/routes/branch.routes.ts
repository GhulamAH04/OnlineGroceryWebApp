import { Router } from "express";
import { getAllBranches } from "../controllers/branch.controller";
import { authMiddleware } from "../middlewares/authAdmin.middleware";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  authorizeRoles(["SUPER_ADMIN", "STORE_ADMIN"]),
  getAllBranches
);

export default router;
