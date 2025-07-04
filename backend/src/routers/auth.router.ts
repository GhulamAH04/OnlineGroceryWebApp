import { Router } from "express";
import { LoginController, LoginWithGoogleController, RegisterController, RegisterWithGoogleController, SetPasswordController, VerifyAccountController, VerifyResetController } from "../controllers/auth.controller";
const router = Router();

router.post("/register", RegisterController);
router.post("/login", LoginController);
router.post("/google/register", RegisterWithGoogleController);
router.post("/google/login", LoginWithGoogleController);
router.patch("/verify", VerifyAccountController);
router.post("/verifyreset", VerifyResetController);
router.patch("/set-password", SetPasswordController);

export default router;
