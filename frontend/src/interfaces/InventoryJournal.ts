export interface InventoryJournal {
  id: number;
  productName: string;
  branchName: string;
  action: "IN" | "OUT";
  amount: number;
  note?: string;
  createdAt: string;
}