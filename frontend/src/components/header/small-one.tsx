import { MapPinIcon } from "lucide-react";
import Link from "next/link";

export default function SmallOne() {
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
        <p>Store Location:</p>
      </div>
      <div className="flex gap-2 sm:gap-3 xl:gap-2">
        <Link href="/login" className="hover:text-black">
          Sign In
        </Link>
        <p>/</p>
        <Link href="/register" className="hover:text-black">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
