// FILE: frontend/src/app/admin/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// Asumsi ada hook `useAuth` untuk mendapatkan info user
// import { useAuth } from '@/hooks/useAuth';
import Link from "next/link";

// Mock hook untuk simulasi
const useAuth = () => ({
  user: { role: "SUPER_ADMIN" }, // Ganti dengan 'USER' atau 'STORE_ADMIN' untuk testing
  isLoading: false,
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (
      !isLoading &&
      (!user || !["SUPER_ADMIN", "STORE_ADMIN"].includes(user.role))
    ) {
      router.replace("/login"); // Redirect jika bukan admin
    }
  }, [user, isLoading, router]);

  if (
    isLoading ||
    !user ||
    !["SUPER_ADMIN", "STORE_ADMIN"].includes(user.role)
  ) {
    return <div>Memuat atau mengalihkan...</div>; // Tampilkan layar loading
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav>
          <ul>
            <li>
              <Link
                href="/admin/dashboard"
                className="block py-2 px-4 rounded hover:bg-gray-700"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/orders"
                className="block py-2 px-4 rounded hover:bg-gray-700"
              >
                Manajemen Pesanan
              </Link>
            </li>
            {/* Tambahkan menu lain di sini */}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-100">{children}</main>
    </div>
  );
}
