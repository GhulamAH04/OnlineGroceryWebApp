// OnlineGroceryWebApp/frontend/src/schemas/inventoryAdmin.schema.ts

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
  stock: yup
    .number()
    .typeError("Stok harus berupa angka")
    .positive("Stok harus lebih dari 0")
    .required("Stok wajib diisi"),
  type: yup
    .mixed<"IN" | "OUT">()
    .oneOf(["IN", "OUT"], "Tipe stok harus IN atau OUT")
    .required("Tipe wajib diisi"),
  description: yup.string().optional(),
});

export type InventoryInput = yup.InferType<typeof inventorySchema>;
