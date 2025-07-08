"use client"; // Diperlukan karena kita menggunakan hook 'usePathname'

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LuLayoutDashboard,
  LuPackage,
  LuHeart,
  LuShoppingCart,
  LuSettings,
  LuLogOut,
} from "react-icons/lu";
import { clsx } from "clsx";

const navLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LuLayoutDashboard },
  { name: "Order History", href: "/dashboard/orders", icon: LuPackage },
  { name: "Wishlist", href: "/dashboard/wishlist", icon: LuHeart },
  { name: "Shopping Cart", href: "/dashboard/cart", icon: LuShoppingCart },
  { name: "Settings", href: "/dashboard/settings", icon: LuSettings },
  { name: "Log-out", href: "/logout", icon: LuLogOut },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full lg:w-1/4 p-6 bg-white rounded-lg shadow-md">
      <h3 className="font-bold text-lg mb-4">Navigation</h3>
      <nav>
        <ul>
          {navLinks.map((link) => {
            const LinkIcon = link.icon;
            const isActive = pathname === link.href;
            return (
              <li key={link.name} className="mb-2">
                <Link
                  href={link.href}
                  className={clsx(
                    "flex items-center p-3 rounded-lg transition-colors",
                    {
                      "bg-green-100 text-green-700 font-bold": isActive,
                      "hover:bg-gray-100 text-gray-600": !isActive,
                    }
                  )}
                >
                  <LinkIcon className="w-5 h-5 mr-3" />
                  <span>{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
