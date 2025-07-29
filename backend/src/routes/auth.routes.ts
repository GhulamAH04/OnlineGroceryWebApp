// OnlineGroceryWebApp/backend/src/routers/auth.router.ts
import { Router } from "express";
import { LoginController, LoginWithGoogleController, RegisterController, RegisterWithGoogleController, SendVerificationEmailController, SetPasswordController, VerifyAccountController, VerifyResetController } from "../controllers/authUser.controller";
import { VerifyToken } from "../middlewares/authUser.middleware";
const router = Router();

router.post("/register", RegisterController);
router.post("/login", LoginController);
router.post("/google/register", RegisterWithGoogleController);
router.post("/google/login", LoginWithGoogleController);
router.patch("/verify", VerifyAccountController);
router.patch("/set-password", SetPasswordController);
router.post("/verifyreset", VerifyResetController);

// this endpoint can only accept request when the user is logged in
router.post("/reverify", VerifyToken, SendVerificationEmailController);

export default router;
