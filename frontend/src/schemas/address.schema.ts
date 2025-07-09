import * as Yup from "yup";

export const AddressSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  companyName: Yup.string(),
  streetAddress: Yup.string().required("Required"),
  country: Yup.string().required("Required"),
  state: Yup.string().required("Required"),
  zipCode: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  phone: Yup.string().required("Required"),
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
