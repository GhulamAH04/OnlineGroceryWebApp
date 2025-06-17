"use client"

import { EyeIcon, Heart, Star } from "lucide-react";
import { useState } from "react";

interface props {
  icon: string;
  title: string;
}

export default function Product({ icon, title }: props) {
  const [displayIcon, setDisplayIcon] = useState(false);

  return (
    <div
      className="w-[264px] h-[327px] text-[#4D4D4D] flex flex-col justify-center items-center gap-4 border border-[#E5E5E5] rounded-[5px] hover:border-[#2C742F] hover:shadow-xl/25 hover:text-[#2C742F]"
      onMouseEnter={() => setDisplayIcon(true)}
      onMouseLeave={() => setDisplayIcon(false)}
    >
      <div className="w-[264px] h-[240px] flex flex-col">
        {/* eslint-disable-next-line */}
        <img
          className="w-[254px] h-[230px] self-center absolute"
          src={`/products/${icon}.png`}
          alt={icon}
        />
        <button className="w-[80px] h-[27px] bg-[#EA4B48] px-2 py-[3px] flex gap-1 rounded-[4px] relative top-4 left-4">
          <p className="text-[#FFFFFF] text[14px] font-normal">Sale</p>
          <p className="text-[#FFFFFF] text[14px] font-medium">50%</p>
        </button>
        {displayIcon && (
          <>
            <button className="w-[40px] h-[40px] mt-4 mr-2 relative bottom-8 left-[210px]">
              <div className="w-[40px] h-[40px] bg-[#F2F2F2] hover:bg-[#00B207] text-[#1A1A1A] hover:text-[#FFFFFF] rounded-full flex justify-center items-center">
                <Heart width={20} height={20} />
              </div>
            </button>
            <button className="w-[40px] h-[40px] mt-4 mr-2 relative bottom-10 left-[210px]">
              <div className="w-[40px] h-[40px] bg-[#F2F2F2] hover:bg-[#00B207] text-[#1A1A1A] hover:text-[#FFFFFF] rounded-full flex justify-center items-center">
                <EyeIcon width={20} height={20} />
              </div>
            </button>
          </>
        )}
      </div>
      <div className="w-[264px] h-[87px] flex justify-center items-center gap-1.5 px-3 pb-4">
        <div className="w-[240px] h-[45px]">
          <p className="text-[14px] font-normal">{title}</p>
          <div className="w-[106px] h-[24px] flex gap-1">
            <p className="text-[16px] text-[#1A1A1A] font-medium">IDR14.999</p>
            <p className="text-[16px] text-[#999999] font-normal line-through">
              IDR20.500
            </p>
          </div>
          <div className="w-[60px] h-[12px] mt-1.5 flex">
            <Star
              className="fill-[#FF8A00] text-[#FF8A00]"
              width={9.75}
              height={9.35}
            />
            <Star
              className="fill-[#CCCCCC] text-[#CCCCCC]"
              width={9.75}
              height={9.35}
            />
          </div>
        </div>
        <div className="w-[40px] h-[40px] mt-4 mr-2">
          <div className="w-[40px] h-[40px] bg-[#F2F2F2] hover:bg-[#00B207]  rounded-full flex justify-center items-center relative">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.66667 7.33333H3.16667L1.5 16.5H16.5L14.8333 7.33333H12.3333M5.66667 7.33333V4.83334C5.66667 2.99239 7.15905 1.5 9 1.5V1.5C10.8409 1.5 12.3333 2.99238 12.3333 4.83333V7.33333M5.66667 7.33333H12.3333M5.66667 7.33333V9.83333M12.3333 7.33333V9.83333"
                className="hover:stroke-[#FFFFFF]"
                stroke="#1A1A1A"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
