import { Request, Response, NextFunction } from "express";
import { GetProductsByLocationService } from "../services/product.service";

export async function GetProductsByLocationController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { latitude, longitude } = req.body;
    const coupon = await GetProductsByLocationService(latitude, longitude);

    res.status(200).send({
      message: `Get products by location success`,
      data: coupon,
    });
  } catch (err) {
    next(err);
  }
}