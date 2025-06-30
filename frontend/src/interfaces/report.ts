export interface SalesSummary {
    month: string;
    totalSales: number;
    totalTransaction: number;
  }
  export interface SalesByCategory {
    category: string;
    sales: number;
  }
  export interface SalesByProduct {
    product: string;
    sales: number;
  }
  export interface StockSummary {
    product: string;
    totalIn: number;
    totalOut: number;
    finalStock: number;
  }
  export interface StockDetail {
    date: string;
    action: string;
    amount: number;
    note?: string;
  }
  