import { Router } from "express";
import { GetAllCategoryController } from "../controllers/category.controller";
const router = Router();

// read
router.get("/", GetAllCategoryController);

export default router;
