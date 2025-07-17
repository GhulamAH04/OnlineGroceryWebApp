import { Router } from "express";
import { EditAddressByIdController, GetAllAddressByUserIdController } from "../controllers/address.controller";
const router = Router();

// read
router.get("/:userId", GetAllAddressByUserIdController);
router.put("/:id", EditAddressByIdController);

export default router;
