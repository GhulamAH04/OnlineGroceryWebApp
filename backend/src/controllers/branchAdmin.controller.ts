// === FILE: backend/src/controllers/branchAdmin.controller.ts ===

import { Request, Response, NextFunction } from "express";
import { branchService } from "../services/branchAdmin.service"; // ✅ FIXED

export const getAllBranches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await branchService.getAll();
    res.json({ success: true, message: "OK", data });
  } catch (err) {
    next(err);
  }
};

export const createBranch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await branchService.create(req.body);
    res.status(201).json({ success: true, message: "Created", data });
  } catch (err) {
    next(err);
  }
};

export const updateBranch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = +req.params.id;
    const data = await branchService.update(id, req.body);
    res.json({ success: true, message: "Updated", data });
  } catch (err) {
    next(err);
  }
};

export const deleteBranch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = +req.params.id;
    await branchService.delete(id); // ✅ FIXED: was `remove`
    res.json({ success: true, message: "Deleted", data: null });
  } catch (err) {
    next(err);
  }
};

export const assignStoreAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const branchId = +req.params.id;
    const { userId } = req.body;

    const data = await branchService.assignAdmin(branchId, userId);
    res.json({ success: true, message: "Store admin assigned", data });
  } catch (err) {
    next(err);
  }
};
