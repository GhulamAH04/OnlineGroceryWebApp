import { Router } from "express";
import { AddNewStoreController, DeleteStoreController, getAllStoresController } from "../controllers/store.controller";
const router = Router();

router.get("/", getAllStoresController);
router.post("/", AddNewStoreController);
router.delete("/:id", DeleteStoreController);

export default router;
