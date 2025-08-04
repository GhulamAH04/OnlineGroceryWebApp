"use client";

import { usePathname } from "next/navigation";
import SidebarAdmin from "./SidebarAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // ⛔ Jangan tampilkan sidebar saat di halaman login
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Konten utama */}
      <main className="ml-[230px] flex-1 px-6 py-10 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-8">{children}</div>
      </main>
    </div>
  );
}
