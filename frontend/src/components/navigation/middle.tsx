import { Heart, Search } from "lucide-react";
import Image from "next/image";

export default function Middle() {
  return (
    <div className="h-[93px] text-[#666666] text-xs flex justify-between items-center px-[300px] py-[27.5px]">
      <div className="w-[183px] h-[38px] flex gap-2 py-[3px] items-center">
        <Image src="/navigation/plant.svg" alt="plant" width={32} height={32} />
        <p className="font-semibold text-[32px] text-[#000000]">Ecobazar</p>
      </div>
      <div className="w-[498px] h-[45px] border border-[#E5E5E5] flex items-center justify-between rounded-r-md">
        <div className="flex gap-1 pl-4 py-[12.5px]">
          <Search className="text-[#1A1A1A]" width={20} height={20} />
          <input type="text" placeholder="Search" />
        </div>
        <button className="bg-[#00B207] text-white w-[98px] h-[45px] rounded-r-md">
          Search
        </button>
      </div>
      <div className="w-[191px] h-[34px] flex gap-4 text-[#1A1A1A]">
        <Heart width={30} height={30} />
        <p className="text-2xl">|</p>
        <div className="flex gap-6 w-[127px] h-[34px]">
          <div className="flex items-center justify-center">
            <Image className="absolute" src="/navigation/bag.svg" alt="bag" width={34} height={34} />
            <div className="bg-[#2C742F] rounded-full w-[16px] h-[16px] text-white text-[10px] flex items-center justify-center relative bottom-[8px] left-[8px]">
              2
            </div>
          </div>
          <div className="flec flex-col gap-2">
            <p className="text-[11px] text-[#4D4D4D]">Shopping Cart:</p>
            <p className="text-[14px]">IDR 57.000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
