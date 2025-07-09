"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useAppSelector } from "@/lib/redux/hooks";
import { apiUrl, imageUrl } from "@/config";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const UpdateProfileModal: React.FC<ModalProps> = ({ isVisible, onClose }) => {
  const user = useAppSelector((state) => state.auth.user);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  if (!isVisible) return null;

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Get the cookie value
      const token = getCookie("access_token") as string;

      await axios.patch(
        `${apiUrl}/api/users/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use the cookie value in the request
          },
        }
      );

      alert("Upload Profile Image Success");

      onClose();
    } catch (err) {
      alert("Error uploading image");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 flex backdrop-filter backdrop-brightness-75 backdrop-blur-md justify-center items-center">
      <div className="w-[600px] flex flex-col">
        <button
          className="text-red-600 bg-black rounded-md text-lg place-self-end"
          onClick={() => onClose()}
        >
          <X />
        </button>
        <div className="flex flex-col gap-4 bg-white p-4 w-[600px] h-[275px] rounded-xl text-black border-2 border-black">
          <h2 className="text-2xl font-bold text-[#112D4E]">
            Update Profile Picture
          </h2>
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="selected-picture"
              className="border-black border-solid border-1 rounded-sm"
              width={100}
              height={100}
            />
          ) : (
            <Image
              src={imageUrl + user.image}
              alt="profile-picture"
              className="border-black border-solid border-1 rounded-sm"
              width={100}
              height={100}
            />
          )}
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg" // Good practice to accept only image types
            className="file:bg-[#112D4E] file:w-[125px] file:py-1 file:px-3 file:mr-4 file:rounded-md hover:file:bg-amber-300 file:text-white"
            onChange={(e) => {
              const file = e.target.files?.[0];
              const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes

              if (file) {
                // Check file size
                if (file.size > MAX_FILE_SIZE) {
                  alert("File is too large! Maximum size is 1MB.");
                  // Reset the input and state
                  e.target.value = "";
                  setSelectedFile(null);
                  setPreviewUrl("");
                  return; // Stop further execution
                }

                // If validation passes, set the file and preview
                setSelectedFile(file);
                setPreviewUrl(URL.createObjectURL(file));
              } else {
                setSelectedFile(null);
                setPreviewUrl("");
              }
            }}
          />
          <button
            className="text-white bg-yellow-400 w-[125px] rounded-md text-lg hover:bg-red-500"
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
