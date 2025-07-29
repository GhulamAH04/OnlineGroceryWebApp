import { Router } from "express";
import { GetCitiesByProvinceController, GetCityFromCoordinatesController } from "../controllers/city.controller";
const router = Router();

// read
router.get("/", GetCityFromCoordinatesController);
router.get("/:province", GetCitiesByProvinceController);

export default router;
