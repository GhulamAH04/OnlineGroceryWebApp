import * as Yup from "yup";

export const AccountSettingSchema = Yup.object({
  username: Yup.string(),
  email: Yup.string()
    .email("Invalid email address")
});
