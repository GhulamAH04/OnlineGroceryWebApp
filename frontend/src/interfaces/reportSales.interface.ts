// File: interfaces/reportSales.interface.ts

export interface SalesReportItem {
  label: string;
  totalSales: number;
}

export interface StockReportItem {
  label: string;
  totalIn: number;
  totalOut: number;
  endingStock: number;
}

export interface StockMutationItem {
  date: string;
  product: string;
  action: string;
  amount: number;
  branch: string;
  note: string;
}

export interface Branch {
  id: number;
  name: string;
}

export interface DiscountReportItem {
  discountType: string;
  productName: string;
  branchName: string;
  isPercentage: boolean;
  discountValue: number;
  minPurchase: number | null;
  buyX: number | null;
  getY: number | null;
  timesUsed: number;
  totalDiscountGiven: number;
}
