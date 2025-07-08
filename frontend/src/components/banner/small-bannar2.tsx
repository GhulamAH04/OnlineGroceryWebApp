import { ArrowRight } from "lucide-react";

export default function SmallBannar2() {
  return (
    <div className="w-[423px] h-[288px] rounded-[10px] bg-[#002603]">
      {/* eslint-disable-next-line */}
      <img
        className="w-[423px] h-[288px] rounded-[10px] opacity-20 absolute"
        src="/bannar/small-bannar2.jpg"
        alt="small-bannar"
      />
      <div className="w-[343px] h-[153px] relative top-[67px] left-[40px] flex flex-col items-center justify-center gap-8">
        <div className="w-[343px] h-[102px] flex flex-col items-center">
          <div className="w-[323px] text-center">
            <p className="text-[#FFFFFF] text-[14px] tracking-[2px] font-medium">
              BEST DEAL
            </p>
            <p className="text-[#FFFFFF] text-[32px]/10 font-semibold my-3">
              Special Products Deal of the Month
            </p>
          </div>
        </div>
        <button className="w-[118px] h-[19px] text-[#00B207] text-[16px] font-semibold flex justify-center gap-1">
          Shop Now <ArrowRight />
        </button>
      </div>
    </div>
  );
}
