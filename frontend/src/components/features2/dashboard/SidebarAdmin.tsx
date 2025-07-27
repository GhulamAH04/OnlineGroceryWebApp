"use client";

import {
  Home,
  Users,
  ShoppingCart,
  Package,
  Percent,
  BarChart3,
  LayoutGrid,
  RotateCcw,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const menu = [
  { label: "Dashboard", icon: <Home size={18} />, href: "/admin" },
  { label: "User Management", icon: <Users size={18} />, href: "/admin/users" },
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
];

export default function SidebarAdmin() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  return (
    <aside className="bg-green-600 text-white h-screen px-4 py-6 flex flex-col justify-between fixed left-0 top-0 w-[230px] z-20">
      {/* Logo */}
      <div>
        <div className="text-2xl font-bold mb-10 tracking-widest text-white">
          <span className="text-white">Groceria</span>
          <span className="text-yellow-200">.Admin</span>
        </div>

        {/* Menu */}
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

      {/* Tombol Logout */}
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
