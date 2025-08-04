// === FILE: backend/src/routes/productUser.routes.ts ===

import { Router } from "express";
import {
  GetNearbyProductsController,
  GetProductDetailController,
  GetAllProductsController,
} from "../controllers/productUser.controller";

const router = Router();

// === Route: Ambil produk berdasarkan kota (userCity) ===
router.get("/nearby/:userCity", GetNearbyProductsController);

// === Route: Ambil detail produk berdasarkan ID ===
router.get("/:id", GetProductDetailController);

router.get("/", GetAllProductsController); 




export default router;

/*
Nahalil
// OnlineGroceryWebApp/backend/src/routers/product.router.ts

import { Router } from "express";
import { GetNearbyProductsController } from "../controllers/productUser.controller";
const router = Router();

// read
router.get("/nearby/:userCity", GetNearbyProductsController);

export default router;
*/