// === FILE: productUser.controller.ts ===
import { Request, Response, NextFunction } from "express";
import { GetNearbyProductsService } from "../services/productUser.service";

export const GetNearbyProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userCity = req.params.userCity;
    if (!userCity) {
      return res.status(400).json({
        success: false,
        message: "Kota tidak ditemukan dalam parameter",
        data: null,
      });
    }

    const products = await GetNearbyProductsService(userCity);
    res.status(200).json({
      success: true,
      message: `Berhasil mengambil produk dari kota ${userCity}`,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};


/*
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
*/