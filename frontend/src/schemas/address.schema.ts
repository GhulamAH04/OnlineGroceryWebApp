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

export const BillingSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  streetAddress: Yup.string().required("Street address is required"),
  country: Yup.string().required("Country is required"),
  states: Yup.string().required("State is required"),
  zipCode: Yup.string().required("Zip code is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
});
