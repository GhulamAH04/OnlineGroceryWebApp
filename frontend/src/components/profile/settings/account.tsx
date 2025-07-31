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
import { Check, X } from "lucide-react";
import { useState } from "react";

interface PageProps {
  onChangeImageClick: () => void;
}

// --- FORM SECTION 1: Account Settings ---
export default function AccountSettings({ onChangeImageClick }: PageProps) {
  const token = getCookie("access_token") as string;
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

        await axios.put(
          `${apiUrl}/api/users/${user.user.id}`,
          {
            username,
            email,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // update user state in redux to see immidiate changes
        const userData = jwtDecode<IUser>(token);
        let userState: IAuth;
        if (email) {
          userState = {
            user: {
              id: userData.id,
              email: email || userData.email,
              username: username || userData.username,
              isVerified: false,
              role: userData.role,
              image: userData.image,
            },
            isLogin: true,
          };
        } else {
          userState = {
            user: {
              id: userData.id,
              email: email || userData.email,
              username: username || userData.username,
              isVerified: userData.isVerified,
              role: userData.role,
              image: userData.image,
            },
            isLogin: true,
          };
        }
        dispatch(onLogin(userState));

        //immidiate update of session token
        deleteCookie("access_token");

        const payload = {
          id: userData.id,
          email: email || userData.email,
          username: username || userData.username,
          isVerified: userData.isVerified,
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

  const handleUnverifiedClick = async () => {
    try {
      await axios.post(
        `${apiUrl}/api/auth/reverify`,
        {
          username: user.user.username,
          email: user.user.email,
          subject: "Re-verification",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("We've sent you an email to verify your account.");
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
            src={
              user.user.image === "/profile.jpg"
              ? `${user.user.image}`
              : `${imageUrl}${user.user.image}`
            }
            alt="User Avatar"
            className="w-32 h-32 border border-s-2 rounded-full object-cover mb-4"
          />
          {user.user.isVerified ? (
            <div className="flex justify-center px-2 items-center gap-1 text-blue-500 font-semibold border border-s-2 rounded-full mb-2">
              <p>Verified</p> <Check className="w-5 h-5" />
            </div>
          ) : (
            <>
              <div
                className="flex justify-center px-2 items-center gap-1 text-red-500 font-semibold border border-s-2 rounded-full hover:bg-gray-200 cursor-default"
                onClick={handleUnverifiedClick}
              >
                <p>Unverified</p>
                <X className="w-5 h-5" />
              </div>
              <p className="text-[10px] mb-2">
                Click the badge to verify your account
              </p>
            </>
          )}
          <button
            type="button"
            onClick={onChangeImageClick}
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
