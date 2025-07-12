import { Request, Response, NextFunction } from "express";
import { GetAllCitiesService } from "../services/city.service";

export async function GetAllCitiesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cities = await GetAllCitiesService();

    res.status(200).send({
      message: `Get all cities success`,
      data: cities,
    });
  } catch (err) {
    next(err);
  }
}