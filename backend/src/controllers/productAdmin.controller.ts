// === CONTROLLER: PRODUCT ADMIN ===

import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/productAdmin.service';

// === GET ALL PRODUCTS ===
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const result = await productService.getAll({
      ...req.query,
      role: req.user.role,
      branchId: req.user.branchId,
    });

    res.json({
      success: true,
      message: "OK",
      data: result.data,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};

// === GET PRODUCT BY ID ===
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = +req.params.id;
    const data = await productService.getById(id);

    res.json({ success: true, message: 'OK', data });
  } catch (err) {
    next(err);
  }
};

// === GET PRODUCTS FOR DROPDOWN (DISCOUNT FORM) ===
export const getProductsForDropdown = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    console.log("user from token:", user); // ✅ log user
    const products = await productService.getDropdownProducts(user);
    res.json({ success: true, message: "OK", data: products });
  } catch (err) {
    console.error("Error fetching dropdown products:", err); // ✅ log error
    next(err);
  }
};

// === CREATE PRODUCT ===
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    const data = await productService.create(req.body, file);

    res.status(201).json({ success: true, message: 'Created', data });
  } catch (err) {
    next(err);
  }
};

// === UPDATE PRODUCT ===
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = +req.params.id;
    const file = req.file as Express.Multer.File | undefined;
    const data = await productService.update(id, req.body, file);

    res.json({ success: true, message: 'Updated', data });
  } catch (err) {
    next(err);
  }
};

// === DELETE PRODUCT ===
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
