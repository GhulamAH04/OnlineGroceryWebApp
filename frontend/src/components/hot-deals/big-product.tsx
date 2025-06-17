import { EyeIcon, Heart, Star } from "lucide-react";
import Timer from "../bannar2/timer";

export default function BigProduct() {
  return (
    <div className="w-[528px] h-[654px] bg-[#FFFFFF] text-[#4D4D4D] flex flex-col items-center border border-[#E5E5E5] rounded-[5px] hover:border-[#2C742F] hover:shadow-xl/25 hover:text-[#2C742F]">
      <div className="w-[525px] h-[426px] flex flex-col">
        <div className="w-[525px] h-[426px] self-center">
          {/* eslint-disable-next-line */}
          <img
            className="w-[524px] h-[426px] absolute"
            src="/hot-deals/green-apple.jpg"
            alt="icon"
          />
          <div className="w-[168px] h-[27px] flex gap-2 relative top-4 left-4">
            <button className="w-[80px] h-[27px] bg-[#EA4B48] px-2 py-[3px] flex gap-1 rounded-[4px]">
              <p className="text-[#FFFFFF] text[14px] font-normal">Sale</p>
              <p className="text-[#FFFFFF] text[14px] font-medium">50%</p>
            </button>
            <button className="w-[80px] h-[27px] bg-[#2388FF] px-2 py-[3px] flex gap-1 rounded-[4px]">
              <p className="text-[#FFFFFF] text-[14px] font-normal">
                Best Sale
              </p>
            </button>
          </div>
          <div className="w-[527px] h-[46px] flex justify-center items-center gap-2 relative top-[354px]">
            <button className="w-[40px] h-[40px]">
              <div className="w-[40px] h-[40px] bg-[#F2F2F2] hover:bg-[#00B207] text-[#1A1A1A] hover:text-[#FFFFFF] rounded-full flex justify-center items-center">
                <Heart width={20} height={20} />
              </div>
            </button>
            <button className="w-[371px] h-[45px] bg-[#00B207] rounded-4xl text-[16px] font-bold flex justify-center items-center gap-4 text-[#FFFFFF]">
              Add To Cart
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
            </button>
            <button className="w-[40px] h-[40px]">
              <div className="w-[40px] h-[40px] bg-[#F2F2F2] hover:bg-[#00B207] text-[#1A1A1A] hover:text-[#FFFFFF] rounded-full flex justify-center items-center">
                <EyeIcon width={20} height={20} />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="w-[528px] h-[103px] flex flex-col items-center gap-1 py-2">
        <p className="text-[18px] text-center font-normal">Green Apple</p>
        <div className="w-[260px] h-[36px] flex items-center justify-center gap-1">
          <p className="text-[24px] text-[#1A1A1A] font-medium">IDR14.999</p>
          <p className="text-[24px] text-[#999999] font-normal line-through">
            IDR20.500
          </p>
        </div>
        <div className="w-[189px] h-[18px] mt-1.5 flex justify-center items-center">
          <Star
            className="fill-[#FF8A00] text-[#FF8A00]"
            width={18}
            height={18}
          />
          <Star
            className="fill-[#FF8A00] text-[#FF8A00]"
            width={18}
            height={18}
          />
          <Star
            className="fill-[#FF8A00] text-[#FF8A00]"
            width={18}
            height={18}
          />
          <Star
            className="fill-[#FF8A00] text-[#FF8A00]"
            width={18}
            height={18}
          />
          <Star
            className="fill-[#CCCCCC] text-[#CCCCCC]"
            width={18}
            height={18}
          />
          <p className="text-[12px] text-[#808080]">(524 Feedback)</p>
        </div>
      </div>
      <div className="w-[300px] h-[103px] flex flex-col items-center pt-2 mt-2">
        <p className="text-[14px] text-[#999999]">Hurry up! Offer ends In:</p>
        <div className="w-[290px] h-[52px] mb-6 flex justify-center">
          <Timer number={1} time="DAYS" textColor="#1A1A1A" />
          <p className="text-2xl text-[#999999]">:</p>
          <Timer number={13} time="HOURS" textColor="#1A1A1A" />
          <p className="text-2xl text-[#999999]">:</p>
          <Timer number={45} time="MINS" textColor="#1A1A1A" />
          <p className="text-2xl text-[#999999]">:</p>
          <Timer number={60} time="SECS" textColor="#1A1A1A" />
        </div>
      </div>
    </div>
  );
}
