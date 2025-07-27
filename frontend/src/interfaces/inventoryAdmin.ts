// ===================== INTERFACES =====================

// === Current Inventory (per cabang & produk) ===
export interface Inventory {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  branchId: number;
  branchName: string;
  currentStock: number;
}

// === Journal Entry (log mutasi stok) ===
export interface InventoryJournal {
  id: number;
  inventoryId: number;
  productId: number;
  productName: string;
  branchId: number;
  branchName: string;
  action: "IN" | "OUT";
  amount: number;
  note?: string;
  createdAt: string;
}

// === Form input saat admin melakukan mutasi stok ===
export interface InventoryJournalForm {
  productId: number;
  branchId: number;
  type: "IN" | "OUT";
  stock: number;
  note?: string;
}

// === Modal Props untuk Jurnal ===
import { InventoryJournalInput } from "@/schemas/inventoryJournalSchema"; // Pastikan path sesuai
export interface InventoryJournalModal {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: InventoryJournalInput) => void;
  isSubmitting: boolean;
  products: { id: number; name: string }[];
  branches: { id: number; name: string }[];
  initialData?: InventoryJournalInput | null;
}
