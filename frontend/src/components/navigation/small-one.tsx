import { MapPinIcon } from "lucide-react";
import Link from "next/link";

export default function SmallOne() {
  return (
    <div className="h-[42px] text-[#666666] text-xs flex justify-between px-[300px] py-3 shadow-xs/15">
      <div className="flex gap-1 items-center">
        <MapPinIcon width={15} height={18} />
        <p>Store Location:</p>
      </div>
      <div className="flex gap-5">
        <p>Id</p>
        <p>IDR</p>|
        <div className="flex gap-1">
          <Link href="/login">Sign In</Link> <p>/</p>
          <Link href="/register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
