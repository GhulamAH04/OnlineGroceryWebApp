import { ArrowRight } from "lucide-react";

export default function SmallBanner2() {
  return (
    <div className="relative w-full h-auto aspect-[423/288] rounded-[10px] bg-[#002603] overflow-hidden group">
      {/* Background Image with Overlay */}
      {/* eslint-disable-next-line */}
      <img
        className="w-full h-full object-cover absolute opacity-20 group-hover:opacity-30 transition-opacity"
        src="/bannar/small-bannar2.jpg"
        alt="Special products deal of the month"
      />

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 sm:p-8 md:p-10 text-center">
        <div className="max-w-[343px] space-y-3 sm:space-y-4">
          {/* Badge */}
          <p className="text-white text-xs sm:text-[12px] tracking-widest font-medium uppercase">
            BEST DEAL
          </p>

          {/* Title */}
          <h3 className="text-white text-xl sm:text-2xl md:text-[24px] font-semibold leading-snug sm:leading-tight">
            Special Products Deal of the Month
          </h3>
        </div>

        {/* Shop Now Button */}
        <button
          className="
          mt-6 sm:mt-8
          text-green-500 hover:text-green-400
          text-sm sm:text-[16px]
          font-semibold
          flex items-center gap-1
          transition-colors
          group-hover:translate-x-1
        "
        >
          Shop Now
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
