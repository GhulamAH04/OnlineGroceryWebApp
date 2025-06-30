import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/category.service';

export const getAllCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await categoryService.getAll();
    res.json({ success: true, message: 'OK', data });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await categoryService.create(req.body.name);
    res.status(201).json({ success: true, message: 'Created', data });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = +req.params.id;
    const data = await categoryService.update(id, req.body.name);
    res.json({ success: true, message: 'Updated', data });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = +req.params.id;
    await categoryService.delete(id);
    res.json({ success: true, message: 'Deleted', data: null });
  } catch (err) {
    next(err);
  }
};
