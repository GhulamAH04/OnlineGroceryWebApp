import { Router } from "express";
import {
  EditUserByIdController,
  GetMainAddressController,
  UpdateAvatarController,
} from "../controllers/user.controller";
import { VerifyToken } from "../middlewares/auth.middleware";
import { Multer } from "../utils/multer";
const router = Router();

router.get("/address/main/:userId", GetMainAddressController);
router.put("/:id", EditUserByIdController);
router.patch(
  "/avatar",
  VerifyToken,
  Multer().single("file"),
  UpdateAvatarController
);

export default router;
