// === FILE: backend/src/controllers/inventoryProduct.controller.ts ===

import { Request, Response, NextFunction } from "express";
import { inventoryService } from "../services/inventoryAdmin.service";
import { parsePaginationQuery } from "../utils/paginationHelper";

// === GET INVENTORY (with pagination & sorting) ===
export const getInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const branchId = user.role === "SUPER_ADMIN" ? Number(req.query.branchId) : undefined;

    const { page, limit, skip, sortBy, sortOrder } = parsePaginationQuery(req.query, "updatedAt");

    const { items, total } = await inventoryService.getInventory({
      branchId,
      userId: user.id,
      role: user.role,
      skip,
      limit,
      sortBy,
      sortOrder,
      search: (req.query.search as string) || "",
    });

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil data inventory",
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// === UPDATE INVENTORY ===
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

    res.status(200).json({
      success: true,
      message: "Stock updated",
      data,
    });
  } catch (err) {
    next(err);
  }
};
