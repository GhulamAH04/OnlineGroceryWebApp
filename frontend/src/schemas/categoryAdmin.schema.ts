// OnlineGroceryWebApp/frontend/src/schemas/categoryAdmin.schema.ts
import * as yup from "yup";

export const categorySchema = yup.object().shape({
  name: yup.string().required("Nama kategori wajib diisi"),
  slug: yup.string().required("Slug wajib diisi"),
});

export type CategoryInput = yup.InferType<typeof categorySchema>;
