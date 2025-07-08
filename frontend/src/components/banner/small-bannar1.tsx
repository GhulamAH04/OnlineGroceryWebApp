import { ArrowRight } from "lucide-react";

export default function SmallBannar1() {
  return (
    <>
      {/* eslint-disable-next-line */}
      <img
        className="w-[423px] h-[288px] rounded-[10px] absolute"
        src="/bannar/small-bannar1.jpg"
        alt="small-bannar"
      />
      <div className="w-[156px] h-[136px] relative top-8 left-8">
        <div className="w-[156px] h-[93px]">
          <div className="w-[142px] h-[60px]">
            <p className="text-[#1A1A1A] text-[14px] font-medium">
              SUMMER SALE
            </p>
            <p className="text-[#1A1A1A] text-[30px] font-semibold">75% OFF</p>
          </div>
          <p className="text-[#666666] text-[14px] font-normal mt-3">
            Only Fruit & Vegetable
          </p>
        </div>
        <button className="w-[118px] h-[19px] text-[#00B207] text-[16px] font-semibold flex gap-1 mt-6">Shop Now <ArrowRight/></button>
      </div>
    </>
  );
}
