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
