import { Router } from "express";
import { GetAllCitiesController } from "../controllers/city.controller";
const router = Router();

// read
router.get("/", GetAllCitiesController);

export default router;
