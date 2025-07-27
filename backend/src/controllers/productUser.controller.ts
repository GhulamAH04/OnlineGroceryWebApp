// OnlineGroceryWebApp/backend/src/controllers/productUser.controller.ts
import { Request, Response, NextFunction } from "express";
import {
  GetMainStoresProductsService,
  // GetNearbyProductsService,
} from "../services/productUser.service";

// export async function GetNearbyProductsController(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const latitude = parseFloat(req.query.latitude as string);
//     const longitude = parseFloat(req.query.longitude as string);
//     const products = await GetNearbyProductsService(latitude, longitude);

//     res.status(200).send({
//       message: `Get products by location success`,
//       data: products,
//     });
//   } catch (err) {
//     next(err);
//   }
// }

export async function GetMainStoresProductsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const products = await GetMainStoresProductsService();

    res.status(200).send({
      message: `Get main stores products success`,
      data: products,
    });
  } catch (err) {
    next(err);
  }
}