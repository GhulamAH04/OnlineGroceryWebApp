import * as Yup from "yup";

export const AddNewAddressSchema = Yup.object({
    name: Yup.string().required("Label alamat wajib diisi"),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Nomor telepon harus angka")
      .min(10, "Minimal 10 digit")
      .required("Nomor telepon wajib diisi"),
    address: Yup.string().required("Alamat lengkap wajib diisi"),
    province: Yup.string().required("Provinsi wajib dipilih"),
    city: Yup.string().required("Kota wajib dipilih"),
    district: Yup.string().required("Kecamatan wajib dipilih"),
    postalCode: Yup.string().required("Alamat lengkap wajib diisi"),
  });


