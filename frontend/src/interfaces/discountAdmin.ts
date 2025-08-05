/*
export type DiscountType = "MANUAL" | "MIN_PURCHASE" | "BUY1GET1";

export interface Discount {
  id: number;
  name: string;
  type: DiscountType;
  value: number;
  percentage?: boolean;
  minPurchase?: number;
  maxDiscount?: number;
  productId: number;
  productName?: string;
  storeId: number;
  storeName?: string;
  startDate?: string;
  endDate?: string;
}
*/
import { Product } from "./productAdmin.interface";

export interface Discount {
  id: number;
  productId: number | null;
  branchId?: number; // ✅ Tambahkan ini
  type: "PERCENTAGE" | "NOMINAL" | "BUY1GET1";
  value: number;
  isPercentage: boolean;
  minPurchase: number | null;
  expiredAt: string;
  products?: Product | null;
}

export interface DiscountAdminForm {
  productId: number;
  branchId?: number; // ✅ Optional juga di form
  type: "PERCENTAGE" | "NOMINAL" | "BUY1GET1";
  value: number;
  isPercentage: boolean;
  minPurchase?: number;
  expiredAt: string;
}
