//backend/src/routes/productUser.routes.ts

import { Router } from "express";
import { GetNearbyProductsController } from "../controllers/productUser.controller"; // ✅ NAMED IMPORT

const router = Router();

router.get("/nearby/:userCity", GetNearbyProductsController); // ✅

export default router;
