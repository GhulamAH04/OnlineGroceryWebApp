"use client";

import { apiUrl, imageUrl, jwtSecret } from "@/config";
import { IAuth, IUser } from "@/interfaces/auth.interface";
import { onLogin } from "@/lib/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { AccountSettingSchema } from "@/schemas/settings.schema";
import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useFormik } from "formik";
import { jwtDecode } from "jwt-decode";
import sign from "jwt-encode";
import { useState } from "react";

// --- FORM SECTION 1: Account Settings ---
export default function AccountSettings() {
  //hook
  const dispatch = useAppDispatch();
  // state in redux
  const user = useAppSelector((state) => state.auth);

  const [isEditMode, setIsEditMode] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
    },
    validationSchema: AccountSettingSchema,
    onSubmit: async (values) => {
      try {
        const { username, email } = values;

        await axios.put(`${apiUrl}/api/user/${user.user.id}`, {
          username,
          email,
        });

        // update user state in redux to see immidiate changes
        const token = getCookie("access_token") as string;
        const userData = jwtDecode<IUser>(token);
        const userState: IAuth = {
          user: {
            id: userData.id,
            email: email || userData.email,
            username: username || userData.username,
            role: userData.role,
            image: userData.image,
          },
          isLogin: true,
        };
        dispatch(onLogin(userState));

        //immidiate update of session token
        deleteCookie("access_token");
        
        const payload = {
          id: userData.id,
          email: email || userData.email,
          username: username || userData.username,
          role: userData.role,
          image: userData.image,
        };

        const newToken = sign(payload, String(jwtSecret), { expiresIn: "1h" });
        setCookie("access_token", newToken);

        if (email) {
          alert(
            "Edit profile success, and we've sent an email to verify your new email address"
          );
        } else {
          alert("Edit profile success");
        }

        setIsEditMode(false);
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

  const handleChangePasswordClick = async () => {
    try {
      const { email } = user.user;

      await axios.post(`${apiUrl}/api/auth/verifyreset`, {
        email,
      });

      alert("We've sent an email to change your password.");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage = err.response.data.message;
        alert(`${errorMessage}`);
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

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
                Username
              </label>
              {isEditMode ? (
                <>
                  <input
                    id="username"
                    placeholder={user.user.username}
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
                </>
              ) : (
                <div className="w-full px-3 py-2">
                  <p>{user.user.username.toUpperCase()}</p>
                </div>
              )}
            </div>

            {/* Email Input */}
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              {isEditMode ? (
                <>
                  <input
                    id="email"
                    type="email"
                    placeholder={user.user.email}
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
                </>
              ) : (
                <div className="w-full px-3 py-2">
                  <p>{user.user.email}</p>
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              {/* Submit Button*/}
              {isEditMode ? (
                <button
                  type="submit"
                  className="w-[9rem] py-3 mt-4 px-4 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
                >
                  {formik.isSubmitting ? "Saving Changes..." : "Save Change"}
                </button>
              ) : (
                <div
                  className="w-[10rem] py-3 mt-4 px-4 text-center bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 cursor-default"
                  onClick={() => setIsEditMode(true)}
                >
                  Edit Information
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-[40%] flex-shrink-0 flex flex-col items-center gap-2">
          {/* eslint-disable-next-line */}
          <img
            src={`${imageUrl}${user.user.image}.jpg`}
            alt="User Avatar"
            className="w-32 h-32 border border-s-2 rounded-full object-cover mb-4"
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
