import { Request, Response, NextFunction } from "express";
import {
  GetNearbyProductsService,
} from "../services/productUser.service";

export async function GetNearbyProductsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userCity } = req.params;

    const products = await GetNearbyProductsService(userCity);

    res.status(200).send({
      message: `Get products by location success`,
      data: products,
    });
  } catch (err) {
    next(err);
  }
}
