"use client";

import { apiUrl } from "@/config";
import { IExistingAddress } from "@/interfaces/address.interface";
import { useAppSelector } from "@/lib/redux/hooks";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import AddAddressModal from "./AddAddressModal";
import EditAddressModal from "./editAddressModal";

export default function BillingInformationForm() {
  // state in redux
  const user = useAppSelector((state) => state.auth);
  // local state
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [address, setAddress] = useState<IExistingAddress>();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const fetchAddress = async () => {
    try {
      // <-- Add try
      const userId = user.user.id;
      const token = getCookie("access_token") as string;
      const { data } = await axios.get(
        `${apiUrl}/api/users/address/main/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAddress(data.data[0]);
    } catch (error) {
      // <-- Add catch
      console.error("Failed to fetch address:", error);
      // Optionally, you can set an error state here
    }
  };

  useEffect(() => {
    if (user.user.id) {
      fetchAddress();
    }
  });

  if (!address)
    return (
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Main Address</h2>
        <div
          className="w-[15rem] py-3 mt-4 px-4 text-center bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 cursor-default"
          onClick={() => {
            setIsShowModal(true);
          }}
        >
          Add New Address
        </div>
        <AddAddressModal
          onAdd={fetchAddress}
          onClose={() => setIsShowModal(false)}
          isOpen={isShowModal}
        />
      </div>
    );

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Main Address</h2>

      {/* Street Address */}
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Address
        </label>
        <p className="w-full h-10 px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm cursor-not-allowed">
          {address?.address}
        </p>
      </div>

      {/* city, province, Zip Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="province"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Province
          </label>
          <p className="w-full h-10 px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm cursor-not-allowed">
            {address?.provinces.name}
          </p>
        </div>
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            City
          </label>
          <p className="w-full h-10 px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm cursor-not-allowed">
            {address?.cities.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="district"
            className="block text-sm font-medium text-gray-700"
          >
            Kecamatan
          </label>
          <p className="w-full h-10 px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm cursor-not-allowed">
            {address?.districts.name}
          </p>
        </div>
        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Postal Code
          </label>
          <p className="w-full h-10 px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm cursor-not-allowed">
            {address?.postalCode}
          </p>
        </div>
      </div>
      {/* Submit Button*/}
      <div className="flex gap-2">
        <div
          className="w-[10rem] py-3 mt-4 px-4 text-center bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 cursor-default"
          onClick={() => {
            setIsEditMode(true);
          }}
        >
          Edit Address
        </div>
      </div>
      <EditAddressModal
      address={address}
        onEdit={fetchAddress}
        onClose={() => setIsEditMode(false)}
        isOpen={isEditMode}
      />
    </div>
  );
}
