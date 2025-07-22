// OnlineGroceryWebApp/backend/src/routers/category.router.ts

import { Router } from "express";
import { GetAllCategoryController } from "../controllers/categoryUser.controller";
const router = Router();

// read
router.get("/", GetAllCategoryController);

export default router;
