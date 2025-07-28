import { Router } from "express";
import { AddNewStoreController, AssignStoreAdminController, DeleteStoreController, getAllStoresController, UpdateStoreController } from "../controllers/store.controller";
const router = Router();

router.get("/", getAllStoresController);
router.post("/", AddNewStoreController);
router.put("/:id", UpdateStoreController);
router.patch("/:id", AssignStoreAdminController);
router.delete("/:id", DeleteStoreController);

export default router;
