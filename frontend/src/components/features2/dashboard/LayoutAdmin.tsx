"use client";
import SidebarAdmin from "./SidebarAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <SidebarAdmin />
      {/* Content */}
      <main className="ml-[230px] flex-1 p-8">{children}</main>
    </div>
  );
}
