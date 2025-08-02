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

// File: src/interfaces/discountAdmin.ts
import { Product } from "./productAdmin.interface";

export interface Discount {
  id: number;
  productId: number | null;
  type: "PERCENTAGE" | "NOMINAL" | "BUY1GET1";
  value: number;
  isPercentage: boolean;
  minPurchase: number | null;
  expiredAt: string;
  products?: Product | null; // ✅ Tambahkan ini
}

export interface DiscountAdminForm {
  productId: number;
  type: "PERCENTAGE" | "NOMINAL" | "BUY1GET1";
  value: number;
  isPercentage: boolean;
  minPurchase?: number;
  expiredAt: string;
} 
