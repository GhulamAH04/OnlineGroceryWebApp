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

  const handleLogout = () => {
    // Hapus cookie token dengan expired date
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict";
    router.replace("/admin/login");
  };

  return (
    <aside className="bg-green-600 text-white h-screen px-4 py-6 flex flex-col justify-between fixed left-0 top-0 w-[230px] z-20">
      <div>
        <div className="text-2xl font-bold mb-10 tracking-widest text-white">
          <span className="text-white">EcoBazar</span>
          <span className="text-yellow-200">Admin</span>
        </div>

        <nav className="flex flex-col gap-1">
          {menu.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition
                  ${
                    pathname === item.href
                      ? "bg-white text-green-600 font-bold shadow"
                      : "hover:bg-green-700/60 text-white"
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      <div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
