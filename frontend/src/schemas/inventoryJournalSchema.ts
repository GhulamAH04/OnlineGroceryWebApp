// === FILE: schemas/inventoryJournalSchema.ts ===

import * as yup from "yup";

/**
 * Schema validasi untuk jurnal perubahan stok.
 * Digunakan oleh react-hook-form saat admin mengisi form mutasi stok.
 */
export const inventoryJournalSchema = yup.object({
  productId: yup
    .number()
    .typeError("Produk wajib dipilih")
    .required("Produk wajib dipilih"),

  branchId: yup
    .number()
    .typeError("Cabang wajib dipilih")
    .required("Cabang wajib dipilih"),

  type: yup
    .mixed<"IN" | "OUT">()
    .oneOf(["IN", "OUT"], "Tipe harus IN atau OUT")
    .required("Tipe wajib diisi"),

  stock: yup
    .number()
    .typeError("Jumlah harus berupa angka")
    .positive("Jumlah harus lebih dari 0")
    .required("Jumlah wajib diisi"),

  note: yup.string().optional(),
});

export type InventoryJournalInput = yup.InferType<typeof inventoryJournalSchema>;

/*
import * as yup from "yup";

export const inventoryJournalSchema = yup.object({
  productId: yup
    .number()
    .typeError("Produk wajib dipilih")
    .required("Produk wajib dipilih"),
  branchId: yup
    .number()
    .typeError("Toko cabang wajib dipilih")
    .required("Toko cabang wajib dipilih"),
  type: yup
    .mixed<"IN" | "OUT">()
    .oneOf(["IN", "OUT"], "Tipe stok harus IN atau OUT")
    .required("Tipe wajib diisi"),
  stock: yup
    .number()
    .typeError("Jumlah harus berupa angka")
    .positive("Jumlah harus lebih dari 0")
    .required("Jumlah stok wajib diisi"),
  note: yup.string().optional(),
});

export type InventoryJournalInput = yup.InferType<typeof inventoryJournalSchema>;
*/