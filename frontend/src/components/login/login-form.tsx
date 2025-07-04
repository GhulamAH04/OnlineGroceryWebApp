"use client";

import { useFormik } from "formik";
import { useGoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import axios from "axios";
import { apiUrl } from "@/config";
import { setCookie } from "cookies-next";
import { EyeIcon, GoogleIcon } from "../register/icons";
import { useState } from "react";
import { LoginSchema } from "@/schemas/login.schema";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import { onLogin } from "@/lib/redux/features/authSlice";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [isCorrectPassword, setIsCorrectPassword] = useState(true);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      termsAccepted: false,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      // make api call here
      try {
        const { data } = await axios.post(`${apiUrl}/api/auth/login`, values);

        // set token to cookie
        const { token } = data.data;

        setCookie("access_token", token);

        // update user state on login
        const { user } = data.data;
        const userState = {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            image: user.image
          },
          isLogin: true,
        };

        dispatch(onLogin(userState));
        
        alert(
          "Successfully Logged In"
        );
        
        router.push("/");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          if (err.response.data.message === "Incorrect Password") setIsCorrectPassword(false);
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

        const { data } = await axios.post(`${apiUrl}/api/auth/google/login`, {
          name,
          email,
        });

        // set token to cookie
        const { token } = data.data;
        setCookie("access_token", token);

        // update user state on login
        const { user } = data.data;
        const userState = {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            image: user.image,
          },
          isLogin: true,
        };

        dispatch(onLogin(userState));

        alert("Successfully logged in!");

        router.push("/");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const errorMessage = err.response.data.message;
          alert(`Login failed: ${errorMessage}`);
        } else {
          alert("An unexpected error occurred during login.");
        }
      }
    },
    onError: (errorResponse) => {
      console.error("Google Login Failed:", errorResponse);
      alert("Google login failed. Please try again.");
    },
  });

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen font-sans py-4 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Login
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

          {/* Password Field */}
          <div>
            {!isCorrectPassword && (
              // update later, i should sent an email first
              <Link href="/verify-reset-password" className="text-red-500 text-xs mt-1 mb-1 hover:text-green-500">
                Forgot Password?
              </Link>
            )}
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

          {/* Submit Button*/}
          <button
            type="submit"
            disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
            className="w-full py-3 mt-4 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? "Logging In..." : "Login"}
          </button>
        </form>

        {/* --- OR Separator --- */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* --- Google Login Button --- */}
        <button
          type="button"
          onClick={() => googleLogin()}
          className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-300"
        >
          <GoogleIcon />
          Login with Google
        </button>
        <p className="text-center text-sm text-gray-600 mt-8">
          Don`t have an account?
          <Link
            href="/register"
            className="font-bold text-gray-800 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
