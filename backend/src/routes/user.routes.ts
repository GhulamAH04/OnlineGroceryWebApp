import { Router } from "express";
import {
  EditUserByIdController,
  GetAllUsersController,
  GetMainAddressController,
  UpdateAvatarController,
} from "../controllers/user.controller";
import { VerifyToken } from "../middlewares/authUser.middleware";
import { Multer } from "../utils/multer";
const router = Router();

router.get("/", GetAllUsersController);
router.get("/address/main/:userId", VerifyToken, GetMainAddressController); //should move to address.routes.ts
router.put("/:id", VerifyToken, EditUserByIdController);
router.patch(
  "/avatar",
  VerifyToken,
  Multer().single("file"),
  UpdateAvatarController
);

export default router;
