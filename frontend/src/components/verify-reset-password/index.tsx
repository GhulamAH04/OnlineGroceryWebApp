"use client";

import axios from "axios";
import { apiUrl } from "@/config";
import { useFormik } from "formik";
import { VerifyResetSchema } from "@/schemas/verifyreset.schema";
import { getCookie } from "cookies-next";

export default function VerifyResetPassword() {
  const token = getCookie("access_token") as string;
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: VerifyResetSchema,
    onSubmit: async (values) => {
      // make api call here
      try {
        const { email } = values;

        await axios.post(
          `${apiUrl}/api/auth/verifyreset`,
          {
            email,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("We've sent an email to reset your password.");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const errorMessage = err.response.data.message;
          alert(`${errorMessage}`);
        } else {
          alert("An unexpected error occurred");
        }
      }
    },
  });

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center font-sans py-4 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          We need your registered email to reset your password
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="Email"
                {...formik.getFieldProps("email")}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-green-500"
                }`}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>
          {/* Submit Button*/}
          <button
            type="submit"
            disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
            className="w-full py-3 mt-4 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? "Sending Email..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
