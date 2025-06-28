"use client";

import { useFormik } from "formik";
import { RegisterSchema } from "@/schemas/register-schema";
import { GoogleIcon } from "./icons";
import { useGoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import axios from "axios";
import { apiUrl } from "@/config";

export default function RegisterForm() {

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      termsAccepted: false,
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      // make api call here
      try {
        await axios.post(`${apiUrl}/api/auth/register`, values);
        alert("Account created successfully");
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

  // --- Google Login Logic ---
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const { name, email } = userInfoResponse.data;

        await axios.post(`${apiUrl}/api/auth/register`, { name, email });

        alert("Account created successfully");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const errorMessage = err.response.data.message;
          alert(`${errorMessage}`);
        } else {
          alert("An unexpected error occurred");
        }
      }
    },
    onError: (errorResponse) => {
      console.error("Google Login Failed:", errorResponse);
      alert("Google registration failed. Please try again.");
    },
  });

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen font-sans py-4 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Create Account
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <div className="relative">
              <input
                id="name"
                type="text"
                placeholder="Name"
                {...formik.getFieldProps("name")}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-green-500"
                }`}
              />
            </div>
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
            )}
          </div>

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

          {/* Terms and Conditions Checkbox*/}
          <div>
            <div className="flex items-center">
              <input
                id="termsAccepted"
                type="checkbox"
                {...formik.getFieldProps("termsAccepted")}
                checked={formik.values.termsAccepted}
                className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
              />
              <label
                htmlFor="termsAccepted"
                className="ml-3 text-sm text-gray-600 cursor-pointer"
              >
                Accept all terms & Conditions
              </label>
            </div>
            {formik.touched.termsAccepted && formik.errors.termsAccepted && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.termsAccepted}
              </p>
            )}
          </div>

          {/* Submit Button*/}
          <button
            type="submit"
            disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
            className="w-full py-3 mt-4 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* --- OR Separator --- */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* --- Google Register Button --- */}
        <button
          type="button"
          onClick={() => googleLogin()}
          className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-300"
        >
          <GoogleIcon />
          Register with Google
        </button>
        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?
          <Link
            href="/login"
            className="font-bold text-gray-800 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
