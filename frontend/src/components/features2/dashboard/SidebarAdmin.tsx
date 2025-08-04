"use client";

import {
  Home,
  Users,
  ShoppingCart,
  Package,
  Percent,
  BarChart3,
  Store,
  LayoutGrid,
  RotateCcw,
  LogOut,
  ShoppingBasket,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const menu = [
  { label: "Dashboard", icon: <Home size={18} />, href: "/admin" },
  { label: "User Management", icon: <Users size={18} />, href: "/admin/users" },
  {
    label: "Store Management",
    icon: <Store size={18} />,
    href: "/admin/stores",
  },
  {
    label: "Product Management",
    icon: <ShoppingCart size={18} />,
    href: "/admin/products",
  },
  { label: "Inventory", icon: <Package size={18} />, href: "/admin/inventory" },
  {
    label: "Inventory Journal",
    icon: <RotateCcw size={18} />,
    href: "/admin/inventory-journal",
  },
  { label: "Discounts", icon: <Percent size={18} />, href: "/admin/discount" },
  { label: "Reports", icon: <BarChart3 size={18} />, href: "/admin/reports" },
  {
    label: "Category Management",
    icon: <LayoutGrid size={18} />,
    href: "/admin/categories",
  },
  {
    label: "Orders",
    icon: <ShoppingBasket size={18} />,
    href: "/admin/orders",
  },
];

export default function SidebarAdmin() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide sidebar on login page
  if (pathname === "/admin/login") return null;

  const handleLogout = () => {
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict";
    router.replace("/admin/login");
  };

  return (
    <aside className="bg-green-100 text-green-800 h-screen px-5 py-6 flex flex-col justify-between fixed left-0 top-0 w-[230px] border-r border-green-200 shadow-sm z-20">
      <div>
        {/* Logo */}
        <div className="text-2xl font-extrabold mb-10 tracking-wider">
          <span className="text-green-700">Eco</span>
          <span className="text-blue-500">Bazar</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {menu.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors
                  ${
                    pathname === item.href
                      ? "bg-white text-green-700 font-semibold shadow"
                      : "hover:bg-blue-50 hover:text-blue-600 text-green-800"
                  }`}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
