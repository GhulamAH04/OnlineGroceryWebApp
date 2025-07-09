import { Request, Response, NextFunction } from "express";
import { GetAllCategoryService } from "../services/category.service";

export async function GetAllCategoryController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categories = await GetAllCategoryService();

    res.status(200).send({
      message: `Get all category success`,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
}