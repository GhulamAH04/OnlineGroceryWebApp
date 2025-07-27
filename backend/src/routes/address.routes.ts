import { Router } from "express";
import { AddNewAddressController, EditAddressByIdController, GetAllAddressByUserIdController } from "../controllers/address.controller";
const router = Router();

router.get("/:userId", GetAllAddressByUserIdController);
router.put("/:id", EditAddressByIdController);
router.post("/", AddNewAddressController);

export default router;
