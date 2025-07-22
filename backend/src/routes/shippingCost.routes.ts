import { Router } from "express";
import { CalculateShippingCostController } from "../controllers/shippingCost.controller";
const router = Router();

router.post("/", CalculateShippingCostController);

export default router;
