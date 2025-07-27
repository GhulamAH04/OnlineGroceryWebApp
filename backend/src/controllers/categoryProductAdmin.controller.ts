// File: OnlineGroceryWebApp/backend/src/controllers/categoryProductAdmin.controller.ts

import { Request, Response, NextFunction } from "express";
import { categoryService } from "../services/categoryProductAdmin"; // <-- 1. Impor service

// === GET ALL CATEGORIES ===
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 2. Panggil service untuk mengambil data
    const categories = await categoryService.getAll();

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil data kategori",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// === CREATE CATEGORY ===
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Service Anda membuat slug dari nama, jadi kita hanya butuh 'name'
    const { name } = req.body;

    // 3. Panggil service untuk membuat kategori
    const newCategory = await categoryService.create(name);

    res.status(201).json({
      success: true,
      message: "Kategori berhasil dibuat",
      data: newCategory,
    });
  } catch (error) {
    // Service akan melempar error jika kategori sudah ada, yang akan ditangkap di sini
    next(error);
  }
};

// === UPDATE CATEGORY ===
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name } = req.body; // Service hanya butuh 'name' untuk update

    // 4. Panggil service untuk update
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

    // 5. Panggil service untuk menghapus
    await categoryService.delete(Number(id));

    res.status(200).json({
      success: true,
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};