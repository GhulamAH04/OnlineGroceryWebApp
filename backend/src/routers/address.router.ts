import { Router } from "express";
import { GetAllAddressByUserIdController } from "../controllers/address.controller";
const router = Router();

// read
router.get("/:userId", GetAllAddressByUserIdController);

export default router;
