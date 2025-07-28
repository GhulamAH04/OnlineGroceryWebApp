// File: /schemas/userAdminManagement.schema.ts
import * as yup from "yup";

// Gunakan yup.object().shape untuk dukung .when dengan context
export const userAdminSchema = yup.object().shape({
  username: yup.string().required("Username wajib diisi"),
  email: yup
    .string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  password: yup
    .string()
    .min(6, "Minimal 6 karakter")
    .when([], {
      is: (_: unknown, context: { isEdit?: boolean }) => !context?.isEdit,
      then: (schema) => schema.required("Password wajib diisi"),
      otherwise: (schema) => schema.notRequired(),
    }),
  branchId: yup
    .number()
    .typeError("Cabang wajib diisi")
    .required("Cabang wajib diisi"),
});

export type UserAdminInput = yup.InferType<typeof userAdminSchema>;

/*
import * as yup from "yup";

export const userAdminSchema = yup.object({
  email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
  username: yup.string().required("Username wajib diisi"),
  password: yup
    .string()
    .min(6, "Minimal 6 karakter")
    .when("$isEdit", (isEdit: boolean, schema: any) =>
      isEdit ? schema.optional() : schema.required("Password wajib diisi")
    ),
  branchId: yup
    .number()
    .typeError("Cabang wajib dipilih")
    .required("Cabang wajib diisi"),
});

*/