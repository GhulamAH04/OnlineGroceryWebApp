"use client";

import { X } from "lucide-react";

interface props {
  isVisible: boolean;
  onClose: () => void;
}

export default function LocationPopUp({ isVisible, onClose }: props) {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 flex backdrop-filter backdrop-brightness-40 justify-center items-center">
      <div className="w-[872px] h-[400px] bg-[#FFFFFF] rounded-[10px] flex gap-3 items-center px-2 absolute">
        {/* eslint-disable-next-line */}
        <img
          className="w-[354px] h-[380px]"
          src="/pop-up/ladyveg.png"
          alt="ladyveg"
        />
        <div className="w-[500px] h-[300px] flex flex-col items-center justify-center gap-3">
          <h1 className="text-[#1A1A1A] text-[24px] text-center font-semibold">
            Allow Ecobazar to access this device`s location?
          </h1>
          <div className="w-[300px] h-[125px] flex flex-col items-center justify-center gap-2">
            <button className="w-[191px] h-[51px] bg-[#00B207] rounded-4xl text-[16px] font-bold flex justify-center items-center gap-4 text-[#FFFFFF]">
              Allow
            </button>
            <button className="w-[191px] h-[51px] bg-[#999999] rounded-4xl text-[16px] font-bold flex justify-center items-center gap-4 text-[#1A1A1A]">
              Deny
            </button>
          </div>
          <p className="text-[#1A1A1A] text-[14px]">
            We need your location to show nearby stores.
          </p>
        </div>
        <button
          className="w-[45px] h-[45px] flex items-center justify-center text-[#1A1A1A] rounded-md text-lg relative bottom-[180px] left-[5px]"
          onClick={() => onClose()}
        >
          <X width={25} height={25} />
        </button>
      </div>
    </div>
  );
}
