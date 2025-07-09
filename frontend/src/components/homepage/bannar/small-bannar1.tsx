import { ArrowRight } from "lucide-react";

export default function SmallBanner1() {
  return (
    <article className="relative w-full h-auto aspect-[423/288] rounded-[10px] overflow-hidden group">
      {/* Banner Image */}
      {/* eslint-disable-next-line */}
      <img
        className="w-full h-full object-cover absolute inset-0 transition-transform group-hover:scale-105"
        src="/bannar/small-bannar1.jpg"
        alt="Summer sale on fruits and vegetables"
      />

      {/* Content Overlay */}
      <div className="relative z-10 p-4 sm:p-6 md:p-8 h-full flex flex-col justify-between">
        <div className="max-w-[156px]">
          <div className="mb-2 sm:mb-3">
            <p className="text-neutral-800 text-sm sm:text-[14px] font-medium">
              SUMMER SALE
            </p>
            <p className="text-neutral-800 text-2xl sm:text-[30px] font-semibold leading-tight">
              75% OFF
            </p>
          </div>
          <p className="text-neutral-600 text-xs sm:text-[14px]">
            Only Fruit & Vegetable
          </p>
        </div>

        {/* Shop Now Button */}
        <button
          className="
          text-green-600 hover:text-green-700
          text-sm sm:text-[16px]
          font-semibold
          flex items-center gap-1
          mt-4 sm:mt-6
          transition-colors
          w-fit
        "
        >
          Shop Now
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </article>
  );
}
