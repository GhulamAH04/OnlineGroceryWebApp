// backend/src/controllers/categoryProductAdmin.controller.ts

import { Request, Response, NextFunction } from "express";
import { categoryService } from "../services/categoryProductAdmin";
import { parsePaginationQuery } from "../utils/paginationHelper";

// === GET ALL CATEGORIES ===
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip, sortBy, sortOrder } = parsePaginationQuery(req.query, "name");
    const search = (req.query.search as string) || "";

    const { data, total } = await categoryService.getAll({
      skip,
      limit,
      sortBy,
      sortOrder,
      search,
    });

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil data kategori",
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// === CREATE CATEGORY ===
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    const newCategory = await categoryService.create(name);

    res.status(201).json({
      success: true,
      message: "Kategori berhasil dibuat",
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

// === UPDATE CATEGORY ===
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedCategory = await categoryService.update(Number(id), name);

    res.status(200).json({
      success: true,
      message: "Kategori berhasil diupdate",
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

// === DELETE CATEGORY ===
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await categoryService.delete(Number(id));

    res.status(200).json({
      success: true,
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};
