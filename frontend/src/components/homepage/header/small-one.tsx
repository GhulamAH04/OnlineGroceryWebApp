"use client";

import { imageUrl } from "@/config";
import { IAuth, IUser } from "@/interfaces/auth.interface";
import { ILocation } from "@/interfaces/location.interface";
import { onLogin } from "@/lib/redux/features/authSlice";
import { setCity } from "@/lib/redux/features/locationSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { MapPinIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function SmallOne() {
  //hook
  const dispatch = useAppDispatch();
  // state in redux
  const userState = useAppSelector((state) => state.auth);
  const location = useAppSelector((state) => state.location);

  useEffect(() => {
    const token = getCookie("access_token") as string;
    if (token) {
      const userData = jwtDecode<IUser>(token);
      const userState: IAuth = {
        user: {
          id: userData.id,
          email: userData.email,
          username: userData.username,
          role: userData.role,
          image: userData.image,
        },
        isLogin: true,
      };
      dispatch(onLogin(userState));
    }
  }, [dispatch]);

  useEffect(() => {
    const token = getCookie("location_token") as string;
    if (token) {
      const location = jwtDecode<ILocation>(token);
      const locationState: ILocation = {
        latitude: location.latitude,
        longitude: location.longitude,
        city: location.city,
      };
      dispatch(setCity(locationState));
    }
  }, [location, dispatch]);

  return (
    <div
      className="
      h-auto sm:h-[30px] xl:h-[32px] 2xl:h-[42px]
      text-[#666666] text-xs sm:text-sm
      flex flex-col sm:flex-row justify-between items-center
      px-4 sm:px-8 md:px-20 xl:px-[150px] 2xl:px-[300px]
      py-2 sm:py-0
      shadow-xs/15
    "
    >
      <div className="flex gap-1 items-center mb-2 sm:mb-0">
        <MapPinIcon className="w-3 h-4 sm:w-[15px] sm:h-[18px]" />
        <p>Store Location: {location.city}</p>
      </div>
      {!userState.isLogin ? (
        <div className="flex gap-2 sm:gap-3 xl:gap-2">
          <Link href="/login" className="hover:text-black">
            Sign In
          </Link>
          <p>/</p>
          <Link href="/register" className="hover:text-black">
            Sign Up
          </Link>
        </div>
      ) : (
        <div className="flex justify-center items-center gap-2 sm:gap-3 xl:gap-2">
          <Link href="/profile">
            {/* eslint-disable-next-line */}
            <img
              src={`${imageUrl}${userState.user.image}.jpg`}
              alt="profile-picture"
              className="rounded-full w-6 h-6 border-black border-solid border-1"
            />
          </Link>
          <p>{userState.user.username}</p>
        </div>
      )}
    </div>
  );
}
