import { Router } from "express";
import { CalculateShippingCostController } from "../controllers/shippingCost.controller";
import { VerifyToken } from "../middlewares/authUser.middleware";
const router = Router();

router.post("/", CalculateShippingCostController);

export default router;
