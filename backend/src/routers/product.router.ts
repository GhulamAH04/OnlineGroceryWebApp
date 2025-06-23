import { Router } from "express";
import { GetProductsByLocationController } from "../controllers/product.controller";
const router = Router();

// read
router.get("/nearby", GetProductsByLocationController);

export default router;
