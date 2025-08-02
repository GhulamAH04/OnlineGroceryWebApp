"use client"

import {
  LayoutGrid,
  FileText,
  Heart,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react";
import { deleteCookie } from "cookies-next";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import { onLogout } from "@/lib/redux/features/authSlice";
import Link from "next/link";

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutGrid, label: "Dashboard", link: "/profile" },
    { icon: FileText, label: "Order History", link: "/profile/history" },
    { icon: Heart, label: "Wishlist", link: "/profile/wishlist" },
    { icon: ShoppingCart, label: "Shopping Cart", link: "/profile/cart" },
    { icon: Settings, label: "Settings", link: "/profile/settings" },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-bold mb-4">Navigation</h2>
      <nav>
        <ul>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.link;
            return (
              <li key={item.label}>
                <Link
                  href={item.link}
                  className={`flex items-center p-3 my-1 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-green-500 text-white font-semibold"
                        : "hover:bg-gray-600 hover:text-white hover:font-semibold"
                    }
                  `}
                  aria-label={item.label}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <button
          className="flex w-full gap-2 items-center p-3 my-1 rounded-lg transition-colors hover:bg-gray-400 hover:text-red-500 hover:font-semibold focus:bg-green-500"
          onClick={() => {
            deleteCookie("access_token");
            localStorage.removeItem("activeMenuItem");
            dispatch(onLogout());
            router.push("/");
          }}
        >
          <LogOut />
          <span>Log-out</span>
        </button>
      </nav>
    </aside>
  );
}
