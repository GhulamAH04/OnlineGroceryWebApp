import { Router } from "express";
import { EditUserByIdController, GetMainAddressController } from "../controllers/user.controller";
const router = Router();

router.get("/address/main/:userId", GetMainAddressController);
router.put("/:id", EditUserByIdController);

export default router;
