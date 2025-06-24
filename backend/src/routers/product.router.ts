import { Router } from "express";
import { GetMainStoresProductsController, GetNearbyProductsController } from "../controllers/product.controller";
const router = Router();

// read
router.get("/nearby", GetNearbyProductsController);
router.get("/main", GetMainStoresProductsController);

export default router;
