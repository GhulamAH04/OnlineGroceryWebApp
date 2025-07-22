"use client";

import { apiUrl } from "@/config";
import axios from "axios";
import { getCookie } from "cookies-next";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import ChangeAddressModal from "./changeAddressModal";
import { IExistingAddress, INewAddressFormData } from "@/interfaces/address.interface";
import { useAppSelector } from "@/lib/redux/hooks";

export default function ShippingAddress() {
// state in redux
  const user = useAppSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shippingAddress, setShippingAddress] =
    useState<IExistingAddress | null>(null);

  // Mock data for existing addresses
  const mockAddresses: IExistingAddress[] = [
    {
      id: 1,
      name: "Kantor Utama",
      address: "Jl. Jenderal Sudirman No. 5",
      isPrimary: true,
      userId: 123,
      postalCode: "10220",
      city: "Jakarta Pusat",
      province: "DKI Jakarta",
      district: "Jakarta Wetan"
    },
    {
      id: 2,
      name: "Rumah Pribadi",
      address: "Jl. Cihampelas No. 160",
      isPrimary: false,
      userId: 123,
      postalCode: "40131",
      city: "Bandung",
      province: "Jawa Barat",
      district: "Bandung"
    },
  ];

  // Mock API call for adding a new address
  const handleAddNewAddress = async (addressData: INewAddressFormData) => {
    try {
      await axios.post(`${apiUrl}/api/addresses`, addressData);
  
      alert("New Address added!");
      // In a real app, you'd probably refetch addresses or add the new one to the state
      // For this example, we'll just set it as the selected one.
      setShippingAddress({
        id: Math.floor(Math.random() * 1000), // temporary ID
        ...addressData,
        userId: user.user.id,
        isPrimary: false,
      });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage = err.response.data.message;
        alert(`${errorMessage}`);
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  // Mock API call for selecting an existing address
  const handleSelectExistingAddress = async (address: IExistingAddress) => {
    console.log("API CALL: Selecting existing address...", address);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("API SUCCESS: Address selected!");
    setShippingAddress(address);
  };

  useEffect(() => {
    const userId = user.user.id;
    const token = getCookie("access_token") as string;
    const fetchAddress = async () => {
      const { data } = await axios.get(
        `${apiUrl}/api/users/address/main/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShippingAddress(data.data[0]);
    };
    if (userId !== 0) fetchAddress();
  }, [user]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center text-green-600 mb-4">
        <MapPin className="w-5 h-5 mr-3" />
        <h2 className="text-lg font-semibold text-gray-800">
          Alamat Pengiriman
        </h2>
      </div>
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm text-gray-800">
            {user.user.username} (+62) 82144949060
          </p>
          <p className="text-gray-600 text-lg mt-1">
            {shippingAddress
              ? `${shippingAddress?.address}, ${shippingAddress?.district}, ${shippingAddress?.city},
              ${shippingAddress?.province}, ${shippingAddress?.postalCode}.`
              : `no address yet`}
          </p>
          <div className="flex items-center space-x-4 ml-4">
            {shippingAddress?.isPrimary && (
              <span className="text-xs border border-green-500 text-green-500 px-2 py-0.5 rounded-sm">
                Utama
              </span>
            )}
            <button
              className="text-orange-600 hover:underline text-sm font-medium"
              onClick={() => setIsModalOpen(true)}
            >
              {shippingAddress ? "ubah" : "Add new address"}
            </button>
          </div>
        </div>
      </div>
      <ChangeAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        existingAddresses={mockAddresses}
        userId={user.user.id} // Example user ID
        onAddNewAddress={handleAddNewAddress}
        onSelectExistingAddress={handleSelectExistingAddress}
      />
    </div>
  );
}
