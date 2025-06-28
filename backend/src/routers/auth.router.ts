import { Router } from "express";
import { RegisterController } from "../controllers/auth.controller";
const router = Router();

// create
router.post("/register", RegisterController);

export default router;
