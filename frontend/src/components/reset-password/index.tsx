"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "@/config";
import { useFormik } from "formik";
import { EyeIcon } from "../register/icons";
import { SetPasswordSchema } from "@/schemas/setpassword.schema";
import { useRouter } from "next/navigation";

export interface props {
  token: string | undefined;
}

export default function ResetPassword({ token }: props) {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) throw new Error("Token not provided");

        await axios.patch(`${apiUrl}/api/auth/verify`, {
          token,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };

    verifyToken();
  }, [token]);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: SetPasswordSchema,
    onSubmit: async (values) => {
      // make api call here
      try {
        const password = values.confirmPassword;

        if (!token) throw new Error("Token not provided");

        await axios.patch(`${apiUrl}/api/auth/set-password`, {
          password,
          token,
        });

        alert("Set password successfully.");

        router.push("/login");
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
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Set Your New Password
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Password Field */}
          <div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...formik.getFieldProps("password")}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-green-500"
                }`}
              />
              <EyeIcon onClick={() => setShowPassword(!showPassword)} />
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>
          {/* Confirm Password Field */}
          <div>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...formik.getFieldProps("confirmPassword")}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-green-500"
                }`}
              />
              <EyeIcon
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>
          {/* Submit Button*/}
          <button
            type="submit"
            disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
            className="w-full py-3 mt-4 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? "Setting Password..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
