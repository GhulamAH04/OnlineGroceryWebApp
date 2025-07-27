// OnlineGroceryWebApp/backend/src/controllers/inventoryProduct.controller.ts
import { Request, Response, NextFunction } from 'express';
import { inventoryService } from '../services/inventoryAdmin.service';

export const getInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const branchId = user.role === 'SUPER_ADMIN' ? Number(req.query.branchId) : undefined;

    const data = await inventoryService.getInventory({ branchId, userId: user.id, role: user.role });
    res.json({ success: true, message: 'OK', data });
  } catch (err) {
    next(err);
  }
};

export const updateInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const { productId, branchId, quantity, transactionType, description } = req.body;

    const data = await inventoryService.updateStock({
      user,
      productId: +productId,
      branchId: +branchId,
      quantity: +quantity,
      transactionType,
      description,
    });

    res.status(200).json({ success: true, message: 'Stock updated', data });
  } catch (err) {
    next(err);
  }
};
