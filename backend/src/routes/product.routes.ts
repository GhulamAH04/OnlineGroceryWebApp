// OnlineGroceryWebApp/backend/src/routers/product.router.ts

import { Router } from "express";
import { GetMainStoresProductsController, GetNearbyProductsController } from "../controllers/productUser.controller";
const router = Router();

// read
router.get("/nearby/:userCity", GetNearbyProductsController);
router.get("/main", GetMainStoresProductsController);

export default router;
