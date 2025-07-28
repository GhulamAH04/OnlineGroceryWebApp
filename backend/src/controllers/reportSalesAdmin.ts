// === FILE: src/controllers/reportSalesAdmin.controller.ts ===

import { Request, Response, NextFunction } from "express";
import * as reportService from "../services/reportSalesAdmin.service";

// Helper untuk ambil branchId sesuai role (dengan pengecekan user undefined)
const resolveBranchId = (req: Request): number | undefined => {
  if (!req.user) return undefined;

  if (req.user.role === "SUPER_ADMIN") {
    return req.query.branchId ? Number(req.query.branchId) : undefined;
  }
  return req.user.branchId;
};

// === SALES REPORT ===
export const getSalesPerMonth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const branchId = resolveBranchId(req);
    const result = await reportService.getSalesPerMonth(branchId);
    res.json({ success: true, message: "OK", data: result });
  } catch (err) {
    next(err);
  }
};

export const getSalesByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const branchId = resolveBranchId(req);
    const result = await reportService.getSalesByCategory(branchId);
    res.json({ success: true, message: "OK", data: result });
  } catch (err) {
    next(err);
  }
};

export const getSalesByProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const branchId = resolveBranchId(req);
    const result = await reportService.getSalesByProduct(branchId);
    res.json({ success: true, message: "OK", data: result });
  } catch (err) {
    next(err);
  }
};

// === STOCK REPORT ===
export const getStockSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const branchId = resolveBranchId(req);
    const result = await reportService.getStockSummary(branchId);
    res.json({ success: true, message: "OK", data: result });
  } catch (err) {
    next(err);
  }
};

export const getStockDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const branchId = resolveBranchId(req);
    const month = req.query.month as string;
    const result = await reportService.getStockDetail(branchId, month);
    res.json({ success: true, message: "OK", data: result });
  } catch (err) {
    next(err);
  }
};


/*
// === FILE: src/controllers/reportSalesAdmin.controller.ts ===

import { Request, Response, NextFunction } from "express";
import * as reportService from "../services/reportSalesAdmin.service";

export const getSalesPerMonth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const branchId = Number(req.query.branchId);
    const result = await reportService.getSalesPerMonth(branchId);
    res.json({ success: true, message: "OK", data: result });
  } catch (err) {
    next(err);
  }
};

export const getSalesByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const branchId = Number(req.query.branchId);
    const result = await reportService.getSalesByCategory(branchId);
    res.json({ success: true, message: "OK", data: result });
  } catch (err) {
    next(err);
  }
};

export const getSalesByProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const branchId = Number(req.query.branchId);
    const result = await reportService.getSalesByProduct(branchId);
    res.json({ success: true, message: "OK", data: result });
  } catch (err) {
    next(err);
  }
};

export const getStockSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const branchId = Number(req.query.branchId);
    const result = await reportService.getStockSummary(branchId);
    res.json({ success: true, message: "OK", data: result });
  } catch (err) {
    next(err);
  }
};


*/