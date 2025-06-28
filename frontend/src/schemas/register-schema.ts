import * as Yup from "yup";

export const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  name: Yup.string().required("Name is required"),
  password: Yup.string()
  .min(8, "Password must be at least 8 characters")
  .required("Password is required"),
  confirmPassword: Yup.string()
  .oneOf([Yup.ref("password"), undefined], "Passwords must match")
  .required("Confirming your password is required"),
  role: Yup.string().required("Select Register As"),
  termsAccepted: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
});
