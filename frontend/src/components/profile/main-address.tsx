"use client";

import { apiUrl } from "@/config";
import { IAddress } from "@/interfaces/address.interface";
import { useAppSelector } from "@/lib/redux/hooks";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MainAddress() {
  const router = useRouter();
  const userState = useAppSelector((state) => state.auth);

  const [address, setAddress] = useState<IAddress>();

  useEffect(() => {
    const userId = userState.user.id;
    const fetchAddress = async () => {
      // console.log(userState.user.id)
      const { data } = await axios.get(
        `${apiUrl}/api/user/address/main/${userId}`
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
        <p>{address?.address}, {address?.cities.name}</p>
        <p>{userState.user.email}</p>
        <p>{address?.postalCode}</p>
      </address>
      <button className="text-green-600 font-semibold hover:underline mt-4"
      onClick={() => {
        router.push("/profile/settings")
      }}>
        Edit Address
      </button>
    </div>
  );
}
