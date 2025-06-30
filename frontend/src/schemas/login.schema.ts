import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Minimum eight characters, at least one letter, one number and one special character"
    )
    .required("Password is required")
});
