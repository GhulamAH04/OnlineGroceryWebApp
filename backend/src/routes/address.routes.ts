import { Router } from "express";
import { AddNewAddressController, EditAddressByIdController, GetAllAddressByUserIdController } from "../controllers/address.controller";
import { VerifyToken } from "../middlewares/authUser.middleware";
const router = Router();

router.get("/:userId", VerifyToken, GetAllAddressByUserIdController);
router.put("/:id", VerifyToken, EditAddressByIdController);
router.post("/", VerifyToken, AddNewAddressController);

export default router;
