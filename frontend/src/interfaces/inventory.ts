export interface Inventory {
    id: number;
    productId: number;
    productName: string;
    storeId: number;
    storeName: string;
    currentStock: number;
  }
  
  export interface InventoryJournal {
    id: number;
    action: string; // "IN" | "OUT"
    amount: number;
    note?: string;
    createdAt: string;
  }
  