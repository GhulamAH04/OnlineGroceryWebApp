"use client";
import {
  Home,
  Users,
  ShoppingCart,
  Package,
  Percent,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { label: "Dashboard", icon: <Home size={18} />, href: "/admin" },
  { label: "User Management", icon: <Users size={18} />, href: "/admin/users" },
  {
    label: "Product Management",
    icon: <ShoppingCart size={18} />,
    href: "/admin/products",
  }, 
  { label: "Inventory", icon: <Package size={18} />, href: "/admin/inventory" },
  { label: "Discounts", icon: <Percent size={18} />, href: "/admin/discount" },
  { label: "Reports", icon: <BarChart3 size={18} />, href: "/admin/reports" },
];

export default function SidebarAdmin() {
  const pathname = usePathname();
  return (
    <aside className="bg-green-600 text-white h-screen px-4 py-6 flex flex-col gap-4 fixed left-0 top-0 w-[230px] z-20">
      <div className="text-2xl font-bold mb-10 tracking-widest text-white">
        <span className="text-white">Groceria</span>
        <span className="text-yellow-200">.Admin</span>
      </div>
      <nav className="flex-1">
        {menu.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={`flex items-center gap-3 px-3 py-2 my-1 rounded-xl cursor-pointer transition
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
    </aside>
  );
}
