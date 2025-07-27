// OnlineGroceryWebApp/backend/src/controllers/discountProduct.controller.ts
import { Request, Response, NextFunction } from 'express';
import { discountService } from '../services/discountAdmin.service';

export const getDiscounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const data = await discountService.getAll(user);
    res.json({ success: true, message: 'OK', data });
  } catch (err) {
    next(err);
  }
};

export const createDiscount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const data = await discountService.create(user, req.body);
    res.status(201).json({ success: true, message: 'Created', data });
  } catch (err) {
    next(err);
  }
};

export const updateDiscount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = +req.params.id;
    const user = req.user!;
    const data = await discountService.update(id, user, req.body);
    res.json({ success: true, message: 'Updated', data });
  } catch (err) {
    next(err);
  }
};

export const deleteDiscount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = +req.params.id;
    const user = req.user!;
    await discountService.remove(id, user);
    res.json({ success: true, message: 'Deleted', data: null });
  } catch (err) {
    next(err);
  }
};
