// OnlineGroceryWebApp/backend/src/routers/product.router.ts

import { Router } from "express";
import { GetNearbyProductsController } from "../controllers/productUser.controller";
const router = Router();

// read
router.get("/nearby/:userCity", GetNearbyProductsController);

export default router;
