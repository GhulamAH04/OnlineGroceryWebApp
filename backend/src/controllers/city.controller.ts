import { Request, Response, NextFunction } from "express";
import {
  GetCitiesByProvinceService,
  GetCityFromCoordinatesService,
} from "../services/city.service";

export async function GetCitiesByProvinceController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { province } = req.params;

    const cities = await GetCitiesByProvinceService(province);

    res.status(200).send({
      message: `Get cities by province success`,
      data: cities,
    });
  } catch (err) {
    next(err);
  }
}

export async function GetCityFromCoordinatesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const latitude = parseFloat(req.query.latitude as string);
    const longitude = parseFloat(req.query.longitude as string);

    const city = await GetCityFromCoordinatesService(latitude, longitude);

    res.status(200).send({
      message: `Get city by coordinates success`,
      data: city,
    });
  } catch (err) {
    next(err);
  }
}
