"use client"

import { imageUrl } from "@/config";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";

export default function ProfileHeader() {
const router = useRouter();
const userState = useAppSelector((state) => state.auth);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full border border-s-2 overflow-hidden mb-4">
        {/* eslint-disable-next-line */}
        <img
          src={`${imageUrl}${userState.user.image}.jpg`}
          alt="User Avatar"
          width={100}
          height={100}
          className="object-cover  w-full h-full"
        />
      </div>
      <h2 className="text-xl font-bold text-gray-800">
        {userState.user.username.toUpperCase()}
      </h2>
      <p className="text-gray-500 mb-4">{userState.user.role}</p>
      <button className="text-green-600 font-semibold hover:underline"
      onClick={() => {
        router.push("/profile/settings")
      }}>
        Edit Profile
      </button>
    </div>
  );
}
