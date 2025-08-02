// === FILE: schemas/inventoryAdmin.schema.ts ===

import * as yup from "yup";

export const inventorySchema = yup.object({
  productId: yup
    .number()
    .typeError("Produk wajib dipilih")
    .required("Produk wajib dipilih"),

  branchId: yup
    .number()
    .typeError("Toko cabang wajib dipilih")
    .required("Toko cabang wajib dipilih"),

  quantity: yup
    .number()
    .typeError("Jumlah harus berupa angka")
    .positive("Jumlah harus lebih dari 0")
    .required("Jumlah wajib diisi"),

  transactionType: yup
    .mixed<"IN" | "OUT">()
    .oneOf(["IN", "OUT"], "Tipe stok harus IN atau OUT")
    .required("Tipe wajib diisi"),

  description: yup.string().optional(),
});

export type InventoryFormInput = yup.InferType<typeof inventorySchema>;

export interface Inventory {
  id: number;
  stock: number;
  updatedAt: string;
  products: {
    id: number;
    name: string;
    image: string;
  };
  branchs: {
    id: number;
    name: string;
  };
}
