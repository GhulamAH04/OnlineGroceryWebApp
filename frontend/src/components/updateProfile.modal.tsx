"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { apiUrl, imageUrl, jwtSecret } from "@/config";
import { IAuth, IUser } from "@/interfaces/auth.interface";
import { jwtDecode } from "jwt-decode";
import { onLogin } from "@/lib/redux/features/authSlice";
import sign from "jwt-encode";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const UpdateProfileModal: React.FC<ModalProps> = ({ isVisible, onClose }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  if (!isVisible) return null;

  const handleUpload = async () => {
    setLoading(true);
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Get the cookie value
      const token = getCookie("access_token") as string;

      const response = await axios.patch(
        `${apiUrl}/api/users/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use the cookie value in the request
          },
        }
      );

      const image = response.data.data;

      // update user state in redux to see immidiate changes
      const userData = jwtDecode<IUser>(token);
      const userState: IAuth = {
        user: {
          ...userData,
          image,
        },
        isLogin: true,
      };
      dispatch(onLogin(userState));

      //immidiate update of session token
      deleteCookie("access_token");

      const payload = {
        ...userData,
        image,
      };

      const newToken = sign(payload, String(jwtSecret), { expiresIn: "1h" });
      setCookie("access_token", newToken);

      setLoading(false);
      onClose();
      alert("Upload Profile Image Success");
    } catch (err) {
      alert("Error uploading image");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-filter backdrop-brightness-75 backdrop-blur-md">
      <div className="relative w-full max-w-md mx-auto">
        <div className="flex flex-col gap-4 bg-white p-6 rounded-xl text-black border-2 border-black shadow-lg">
          <button
            className="absolute top-3 right-3 text-red-600 bg-black rounded-full p-1 place-self-end hover:bg-red-700 transition-colors"
            onClick={onClose}
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold text-[#112D4E]">
            Update Profile Picture
          </h2>

          <div className="flex items-center gap-4">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="selected-picture"
                className="border-black border-solid border-2 rounded-full object-cover"
                width={100}
                height={100}
              />
            ) : (
              <Image
                src={
                  user.image
                    ? `${imageUrl}${user.image}`
                    : "/default-avatar.png"
                }
                alt="profile-picture"
                className="border-black border-solid border-2 rounded-full object-cover"
                width={100}
                height={100}
              />
            )}
          </div>

          <div className="flex flex-col gap-4">
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#112D4E] file:text-white hover:file:bg-amber-300"
              onChange={(e) => {
                const file = e.target.files?.[0];
                const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes

                if (file) {
                  if (file.size > MAX_FILE_SIZE) {
                    alert("File is too large! Maximum size is 1MB.");
                    e.target.value = "";
                    setSelectedFile(null);
                    setPreviewUrl("");
                    return;
                  }

                  setSelectedFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                } else {
                  setSelectedFile(null);
                  setPreviewUrl("");
                }
              }}
            />
            <button
              className="text-white bg-yellow-400 w-full sm:w-auto sm:self-start px-6 py-2 rounded-md text-lg hover:bg-red-500 transition-colors"
              onClick={handleUpload}
              disabled={!selectedFile}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
