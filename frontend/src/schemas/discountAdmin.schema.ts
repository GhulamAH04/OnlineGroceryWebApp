// OnlineGroceryWebApp/frontend/src/schemas/discountAdmin.schema.ts

import * as yup from "yup";

export const discountAdminSchema = yup.object({
  productId: yup
    .number()
    .typeError("Produk wajib dipilih")
    .required("Produk wajib dipilih"),

  type: yup
    .mixed<"PERCENTAGE" | "NOMINAL" | "BUY1GET1">()
    .oneOf(["PERCENTAGE", "NOMINAL", "BUY1GET1"], "Tipe diskon tidak valid")
    .required("Tipe diskon wajib dipilih"),

  value: yup
    .number()
    .typeError("Nilai diskon harus berupa angka")
    .min(1, "Diskon minimal 1")
    .required("Nilai diskon wajib diisi"),

  isPercentage: yup
    .boolean()
    .typeError("Pilih bentuk diskon")
    .required("Diskon harus dalam bentuk % atau Rp"),

  minPurchase: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    ),

    branchId: yup
  .number()
  .typeError("Cabang wajib dipilih")
  .required("Cabang wajib dipilih"),

  expiredAt: yup
    .string()
    .required("Tanggal kadaluarsa wajib diisi")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid"),
});

export type DiscountAdminInput = yup.InferType<typeof discountAdminSchema>;