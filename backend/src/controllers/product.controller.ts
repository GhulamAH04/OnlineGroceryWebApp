import { Request, Response, NextFunction } from "express";
import { GetProductsByLocationService } from "../services/product.service";

export async function GetProductsByLocationController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const latitude = parseFloat(req.query.latitude as string);
    const longitude = parseFloat(req.query.longitude as string);
    const products = await GetProductsByLocationService(latitude, longitude);

    res.status(200).send({
      message: `Get products by location success`,
      data: products,
    });
  } catch (err) {
    next(err);
  }
}