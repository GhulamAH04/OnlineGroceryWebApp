"use client";

import { apiUrl } from "@/config";
import { useAppSelector } from "@/lib/redux/hooks";
import { AccountSettingSchema } from "@/schemas/settings.schema";
import axios from "axios";
import { useFormik } from "formik";

// --- FORM SECTION 1: Account Settings ---
export default function AccountSettings() {
// state in redux
  const userState = useAppSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      image: "",
    },
    validationSchema: AccountSettingSchema,
    onSubmit: (values) => {
      console.log("Submitting Account Settings:", values);
      // In a real app, you would make an API call here.
    },
  });

  const handleChangePasswordClick = async () => {
    try {
      const { email } = userState.user;

      await axios.post(`${apiUrl}/api/auth/verifyreset`, {
        email,
      });

      alert("We've sent an email to chenge your password.");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage = err.response.data.message;
        alert(`${errorMessage}`);
      } else {
        alert("An unexpected error occurred");
      }
    }
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Account Settings
      </h2>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col md:flex-row gap-8"
      >
        <div className="w-[55%] flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Username Input */}
            <div className="sm:col-span-2">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First name
              </label>
              <input
                id="username"
                {...formik.getFieldProps("username")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                  formik.touched.username && formik.errors.username
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="text-red-600 text-sm mt-1">
                  {formik.errors.username}
                </div>
              ) : null}
            </div>

            {/* Email Input */}
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                {...formik.getFieldProps("email")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-600 text-sm mt-1">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              {/* Submit Button*/}
              <button
                type="submit"
                disabled={
                  !formik.isValid || !formik.dirty || formik.isSubmitting
                }
                className="w-[9rem] py-3 mt-4 px-4 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting ? "Saving Changes..." : "Save Change"}
              </button>
            </div>
          </div>
        </div>
        <div className="w-[40%] flex-shrink-0 flex flex-col items-center gap-2">
          {/* eslint-disable-next-line */}
          <img
            src="#"
            alt="User Avatar"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <button
            type="button"
            className="w-[10rem] px-4 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
          >
            Change Image
          </button>
          <button
            type="button"
            onClick={handleChangePasswordClick}
            className="w-[10rem] px-4 py-2 text-sm bg-yellow-600 text-white font-semibold rounded-full hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-300"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
}
