
// === FILE: OnlineGroceryWebApp/backend/src/controllers/categoryProductAdmin.controller.ts ===

import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// === GET ALL CATEGORIES ===
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: { createdAt: "desc" },
    });

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
    const { name, slug } = req.body;

    const existing = await prisma.categories.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slug kategori sudah digunakan",
      });
    }

    const newCategory = await prisma.categories.create({
      data: { name, slug, updatedAt: new Date() },
    });

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
    const { name, slug } = req.body;

    const existing = await prisma.categories.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }

    const updatedCategory = await prisma.categories.update({
      where: { id: Number(id) },
      data: { name, slug, updatedAt: new Date() },
    });

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

    const existing = await prisma.categories.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }

    await prisma.categories.delete({ where: { id: Number(id) } });

    res.status(200).json({
      success: true,
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

/*
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// === GET ALL CATEGORIES ===
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: { createdAt: "desc" },
    });

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
    const { name, slug } = req.body;

    const existing = await prisma.categories.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slug kategori sudah digunakan",
      });
    }

    const newCategory = await prisma.categories.create({
      data: { name, slug, updatedAt: new Date() },
    });

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
    const { name, slug } = req.body;

    const existing = await prisma.categories.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }

    const updatedCategory = await prisma.categories.update({
      where: { id: Number(id) },
      data: { name, slug,updatedAt: new Date(), },
    });

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

    const existing = await prisma.categories.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }

    await prisma.categories.delete({ where: { id: Number(id) } });

    res.status(200).json({
      success: true,
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};
*/