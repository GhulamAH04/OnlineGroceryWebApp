import { Router } from "express";
import { AddNewStoreController, getAllStoresController } from "../controllers/store.controller";
const router = Router();

router.get("/", getAllStoresController);
router.post("/", AddNewStoreController);

export default router;
