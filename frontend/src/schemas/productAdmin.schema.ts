// === FILE: productAdmin.schema.ts ===
import * as yup from "yup";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

type FileListType = {
  name: string;
  type: string;
  size: number;
}[];

export const productAdminSchema = yup
  .object({
    name: yup.string().required("Nama produk wajib diisi"),
    price: yup
      .number()
      .typeError("Harga harus berupa angka")
      .positive("Harga harus lebih dari 0")
      .required("Harga wajib diisi"),
    stock: yup
      .number()
      .typeError("Stok harus berupa angka")
      .min(0, "Stok tidak boleh negatif")
      .required("Stok wajib diisi"),
    description: yup.string().nullable().notRequired(),

    branchId: yup
      .number()
      .typeError("Toko wajib dipilih")
      .required("Toko wajib dipilih"),

    categoryId: yup
      .number()
      .typeError("Kategori wajib dipilih")
      .required("Kategori wajib dipilih"),

    // === VALIDASI FILE UPLOAD ===
    images: yup
      .mixed<FileListType>()
      .test("fileType", "Format gambar tidak valid (jpg, jpeg, png, gif)", (files) => {
        if (!files || !Array.isArray(files)) return true;
        return files.every((file) => SUPPORTED_FORMATS.includes(file.type));
      })
      .test("fileSize", "Ukuran gambar maksimal 1MB", (files) => {
        if (!files || !Array.isArray(files)) return true;
        return files.every((file) => file.size <= 1024 * 1024);
      }),
  })
  .required();

export type ProductAdminInput = yup.InferType<typeof productAdminSchema>;