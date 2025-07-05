"use client";

import { useState, useEffect } from "react";
import {
  LayoutGrid,
  FileText,
  Heart,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import { onLogout } from "@/lib/redux/features/authSlice";

export default function Sidebar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  // Initialize state from localStorage or default to an empty string
  const [activeItem, setActiveItem] = useState<string>("");

  // Function to handle menu item click
  const handleMenuItemClick = (item: string) => {
    setActiveItem(item);
    localStorage.setItem("activeMenuItem", item);
  };

  const navItems = [
    { icon: LayoutGrid, label: "Dashboard", link: "/" },
    { icon: FileText, label: "Order History", link: "/history" },
    { icon: Heart, label: "Wishlist", link: "wishlist" },
    { icon: ShoppingCart, label: "Shopping Cart", link: "cart" },
    { icon: Settings, label: "Settings", link: "settings" },
  ];

  // Effect to update state from localStorage on component mount
  useEffect(() => {
    const storedActiveItem = localStorage.getItem("activeMenuItem");
    if (storedActiveItem) {
      setActiveItem(storedActiveItem);
    }
  }, []);

  return (
    <aside className="w-full lg:w-64 bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-bold mb-4">Navigation</h2>
      <nav>
        <ul>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <a
                  href={`/profile/${item.link}`}
                  onClick={() => handleMenuItemClick(item.label)}
                  className={`flex items-center p-3 my-1 rounded-lg transition-colors ${
                    activeItem === item.label
                      ? "bg-green-100 text-green-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
        <button
          className="flex w-full gap-2 items-center p-3 my-1 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 hover:text-red-500 hover:font-semibold"
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
