import {
  LayoutGrid,
  FileText,
  Heart,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const navItems = [
    { icon: LayoutGrid, label: "Dashboard", active: true },
    { icon: FileText, label: "Order History" },
    { icon: Heart, label: "Wishlist" },
    { icon: ShoppingCart, label: "Shopping Cart" },
    { icon: Settings, label: "Settings" },
    { icon: LogOut, label: "Log-out" },
  ];

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
                  href="#"
                  className={`flex items-center p-3 my-1 rounded-lg transition-colors ${
                    item.active
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
      </nav>
    </aside>
  );
};
