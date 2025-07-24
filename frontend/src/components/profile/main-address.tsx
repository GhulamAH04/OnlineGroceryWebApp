"use client";

import { apiUrl } from "@/config";
import { IExistingAddress } from "@/interfaces/address.interface";
import { useAppSelector } from "@/lib/redux/hooks";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function MainAddress() {
  const userState = useAppSelector((state) => state.auth);

  const [address, setAddress] = useState<IExistingAddress>();

  useEffect(() => {
    const userId = userState.user.id;
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

      setAddress(data.data[0]);
    };
    if (userId !== 0) fetchAddress();
  }, [userState]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
        Main Address
      </h3>
      <address className="not-italic text-gray-700 space-y-2">
        <p>{address?.address}, {address?.city}</p>
        <p>{userState.user.email}</p>
        <p>{address?.postalCode}</p>
      </address>
    </div>
  );
}
