import * as yup from "yup";

export const branchAdminSchema = yup.object({
  name: yup.string().required("Nama cabang wajib diisi"),
  address: yup.string().required("Alamat wajib diisi"),
  postalCode: yup
    .string()
    .matches(/^\d{5}$/, "Kode pos harus 5 digit angka")
    .required("Kode pos wajib diisi"),
  provinceId: yup.number().required("Provinsi wajib dipilih"),
  cityId: yup.number().required("Kota wajib dipilih"),
  districtId: yup.number().required("Kecamatan wajib dipilih"),
  latitude: yup
    .number()
    .required("Latitude wajib diisi")
    .typeError("Latitude harus berupa angka"),
  longitude: yup
    .number()
    .required("Longitude wajib diisi")
    .typeError("Longitude harus berupa angka"),
});

export type BranchAdminInput = yup.InferType<typeof branchAdminSchema>;
