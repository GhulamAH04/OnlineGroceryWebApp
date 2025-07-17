"use client";
import SidebarAdmin from "./SidebarAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
