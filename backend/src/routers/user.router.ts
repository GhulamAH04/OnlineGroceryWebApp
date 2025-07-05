import { Router } from "express";
import { GetMainAddressController } from "../controllers/user.controller";
const router = Router();

// read
router.get("/address/main/:userId", GetMainAddressController);

export default router;
