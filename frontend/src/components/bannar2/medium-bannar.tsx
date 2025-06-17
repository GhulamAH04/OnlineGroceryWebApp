import Button1 from "../button1";
import Timer from "./timer";

export default function MediumBannar() {
  return (
    <div className="w-[424px] h-[536px] rounded-[10px] flex flex-col items-center gap-3">
      {/* eslint-disable-next-line */}
      <img
        className="w-[424px] h-[536px] rounded-[10px] absolute"
        src="/bannar2/vegies.jpg"
        alt="vegies"
      />
      <div className="relative top-[35px] flex flex-col items-center">
        <p className="text-[#FFFFFF] text-[14px] tracking-[2px] font-medium ">
          BEST DEALS
        </p>
        <p className="text-[#FFFFFF] text-[40px]/10 text-center font-semibold my-3">
          Sale of the Month
        </p>
        <div className="w-[290px] h-[52px] mb-6 flex justify-center">
          <Timer number={1} time="DAYS" textColor="#FFFFFF" />
          <p className="text-2xl text-[#FFFFFF]">:</p>
          <Timer number={13} time="HOURS" textColor="#FFFFFF" />
          <p className="text-2xl text-[#FFFFFF]">:</p>
          <Timer number={45} time="MINS" textColor="#FFFFFF"/>
          <p className="text-2xl text-[#FFFFFF]">:</p>
          <Timer number={60} time="SECS" textColor="#FFFFFF" />
        </div>
        <Button1 />
      </div>
    </div>
  );
}
