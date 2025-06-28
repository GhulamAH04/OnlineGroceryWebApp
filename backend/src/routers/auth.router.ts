import { Router } from "express";
import { RegisterController, RegisterWithGoogleController } from "../controllers/auth.controller";
const router = Router();

// create
router.post("/register", RegisterController);
router.post("/google/register", RegisterWithGoogleController);

export default router;
