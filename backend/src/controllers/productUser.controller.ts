// === IMPORTS ===
import { Request, Response, NextFunction } from "express";
import {
  GetAllProductsService,
  GetNearbyProductsService,
  GetProductDetailService,
} from "../services/productUser.service";

// === GET: Semua Produk (Untuk Homepage) ===
export const GetAllProductsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await GetAllProductsService(); // ✅ delegasikan ke service
    res.status(200).json({
      message: "Successfully fetched all products",
      data: products,
    });
  } catch (error) {
    console.error("❌ Error in GetAllProductsController:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// === GET: Produk Berdasarkan Kota (Nearby) ===
export const GetNearbyProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userCity } = req.params;
    const products = await GetNearbyProductsService(userCity);
    res.status(200).json({
      message: "Successfully fetched nearby products",
      data: products,
    });
  } catch (err) {
    console.error("❌ Error in GetNearbyProductsController:", err);
    next(err);
  }
};

// === GET: Detail Produk Berdasarkan ID ===
export const GetProductDetailController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await GetProductDetailService(Number(id));
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({
      message: "Successfully fetched product detail",
      data: product,
    });
  } catch (err) {
    console.error("❌ Error in GetProductDetailController:", err);
    next(err);
  }
};
