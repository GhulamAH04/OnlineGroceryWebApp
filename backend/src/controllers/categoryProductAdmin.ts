// === FILE: src/controllers/categoryProduct.controller.ts ===

import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/categoryProductAdmin';

// === GET ALL PRODUCT CATEGORIES ===
export const getAllCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await categoryService.getAll();
    res.json({ success: true, message: 'OK', data });
  } catch (err) {
    next(err);
  }
};

// === CREATE NEW PRODUCT CATEGORY ===
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await categoryService.create(req.body.name);
    res.status(201).json({ success: true, message: 'Created', data });
  } catch (err) {
    next(err);
  }
};

// === UPDATE PRODUCT CATEGORY ===
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = +req.params.id;
    const data = await categoryService.update(id, req.body.name);
    res.json({ success: true, message: 'Updated', data });
  } catch (err) {
    next(err);
  }
};

// === DELETE PRODUCT CATEGORY ===
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = +req.params.id;
    await categoryService.delete(id);
    res.json({ success: true, message: 'Deleted', data: null });
  } catch (err) {
    next(err);
  }
};
