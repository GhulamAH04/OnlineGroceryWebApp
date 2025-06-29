import { Router } from "express";
import { RegisterController, RegisterWithGoogleController, SetPasswordController, VerifyAccountController } from "../controllers/auth.controller";
const router = Router();

// create
router.post("/register", RegisterController);
router.post("/google/register", RegisterWithGoogleController);
router.patch("/verify", VerifyAccountController);
router.patch("/set-password", SetPasswordController);

export default router;
