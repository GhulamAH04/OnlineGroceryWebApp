const SidebarUser = () => {
  const menu = [
    { name: "Dashboard", active: true },
    { name: "Order History" },
    { name: "Wishlist" },
    { name: "Shopping Cart" },
    { name: "Settings" },
    { name: "Log-out", danger: true },
  ];

  return (
    <aside className="w-full bg-white rounded-lg shadow-md p-4">
      <ul className="space-y-3">
        {menu.map((item, idx) => (
          <li
            key={idx}
            className={`cursor-pointer text-sm px-3 py-2 rounded ${
              item.active
                ? "bg-green-100 text-green-700 font-semibold"
                : item.danger
                ? "text-red-500 hover:underline"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SidebarUser;
