"use client";

import { PhoneCall } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const links = [
    { name: "Home", link: "/" },
    { name: "Shop", link: "/shop" },
    { name: "About Us", link: "/about" },
    { name: "Contact Us", link: "/contact" },
  ];

  const pathname = usePathname();

  return (
    <div
      className="
      w-full
      bg-neutral-800
      text-neutral-400
      flex flex-col md:flex-row
      items-center
      justify-between
      px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[150px] 2xl:px-[300px]
      py-3 md:py-4
      gap-3 md:gap-0
    "
    >
      {/* Navigation Links */}
      <ul
        className="
        flex
        flex-wrap justify-center md:justify-start
        gap-x-5 sm:gap-x-6
        gap-y-2
        w-full md:w-auto
        text-sm sm:text-[14px]
        
      "
      >
        {links.map((link, index) => {
          const isActive = pathname === link.link;
          return (
            <li key={index}>
              <Link
                href={link.link}
                className={`
                  transition-colors
                  p-2
                  rounded
                  ${
                    isActive
                      ? "bg-green-500 text-white font-semibold"
                      : "hover:text-white hover:font-semibold hover:bg-gray-600"
                  }
                `}
                aria-label={link.name}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Phone Contact */}
      <div
        className="
        hidden
        md:flex
        items-center
        gap-2
        text-white
        text-sm sm:text-[14px]
        hover:text-green-300
        transition-colors
      "
      >
        <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
        <a
          href="tel:2195550114"
          className="focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
        >
          (219) 555-0114
        </a>
      </div>
    </div>
  );
}
