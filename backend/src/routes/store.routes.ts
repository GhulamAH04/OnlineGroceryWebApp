import { Router } from "express";
import {
  AddNewStoreController,
  AssignStoreAdminController,
  DeleteStoreController,
  getAllStoresController,
  UpdateStoreController,
} from "../controllers/store.controller";
import { RoleGuard, VerifyToken } from "../middlewares/authUser.middleware";
const router = Router();

router.get("/", VerifyToken, RoleGuard("SUPER_ADMIN"), getAllStoresController);
router.post("/", VerifyToken, RoleGuard("SUPER_ADMIN"), AddNewStoreController);
router.put(
  "/:id",
  VerifyToken,
  RoleGuard("SUPER_ADMIN"),
  UpdateStoreController
);
router.patch(
  "/:id",
  VerifyToken,
  RoleGuard("SUPER_ADMIN"),
  AssignStoreAdminController
);
router.delete(
  "/:id",
  VerifyToken,
  RoleGuard("SUPER_ADMIN"),
  DeleteStoreController
);

export default router;
