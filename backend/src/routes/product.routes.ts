// OnlineGroceryWebApp/backend/src/routers/product.router.ts

import { Router } from "express";
import { GetMainStoresProductsController } from "../controllers/productUser.controller";
const router = Router();

// read
// router.get("/nearby", GetNearbyProductsController);
router.get("/main", GetMainStoresProductsController);

export default router;
