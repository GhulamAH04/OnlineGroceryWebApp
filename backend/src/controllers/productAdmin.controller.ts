// backend/src/controllers/productAdmin.controller.ts
import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/productAdmin.service';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await productService.getAll(req.query);
    res.json({ success: true, message: 'OK', data });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = +req.params.id;
    const data = await productService.getById(id);
    res.json({ success: true, message: 'OK', data });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await productService.create(req.body, req.files as Express.Multer.File[]);
    res.status(201).json({ success: true, message: 'Created', data });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = +req.params.id;
    const data = await productService.update(id, req.body, req.files as Express.Multer.File[]);
    res.json({ success: true, message: 'Updated', data });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = +req.params.id;
    const confirmed = req.query.confirm === 'true';

    if (!confirmed) {
      res.status(400).json({
        success: false,
        message: 'Confirmation required',
        data: null,
      });
      return;
    }

    await productService.delete(id);
    res.json({ success: true, message: 'Deleted', data: null });
  } catch (err) {
    next(err);
  }
};