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
export interface Discount {
  id: number;
  type: "PERCENTAGE" | "NOMINAL" | "BUY1GET1";
  value: number;
  isPercentage: boolean;
  minPurchase?: number;
  expiredAt: string;
  productId: number;
  productName: string;
}

export interface DiscountAdminForm {
  productId: number;
  type: "PERCENTAGE" | "NOMINAL" | "BUY1GET1";
  value: number;
  isPercentage: boolean;
  minPurchase?: number;
  expiredAt: string;
} 
