"use client";

import Link from "next/link";
import { UserCog, Package, Percent, BarChart, Boxes } from "lucide-react";

export default function AdminDashboardHome() {
  return (
    <>
      {/* Judul Halaman */}
      <h1 className="text-3xl font-bold mb-8 text-green-700">
        Dashboard Admin
      </h1>

      {/* Grid Card Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Account Management */}
        <Link
          href="/admin/users"
          className="group bg-white border border-green-100 rounded-xl p-6 flex flex-col gap-2 shadow hover:shadow-lg hover:bg-green-50 transition"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-100 text-green-700 mb-2">
            <UserCog size={28} />
          </div>
          <div className="text-lg font-semibold text-green-700">
            Admin Account Management
          </div>
          <div className="text-gray-500 text-sm">
            Kelola data user admin, role, dan akses dashboard.
          </div>
        </Link>

        {/* Product Management */}
        <Link
          href="/admin/products"
          className="group bg-white border border-green-100 rounded-xl p-6 flex flex-col gap-2 shadow hover:shadow-lg hover:bg-green-50 transition"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-100 text-green-700 mb-2">
            <Package size={28} />
          </div>
          <div className="text-lg font-semibold text-green-700">
            Product Management
          </div>
          <div className="text-gray-500 text-sm">
            Tambah, edit, hapus, dan lihat seluruh produk.
          </div>
        </Link>

        {/* Inventory Management */}
        <Link
          href="/admin/inventory"
          className="group bg-white border border-green-100 rounded-xl p-6 flex flex-col gap-2 shadow hover:shadow-lg hover:bg-green-50 transition"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-100 text-green-700 mb-2">
            <Boxes size={28} />
          </div>
          <div className="text-lg font-semibold text-green-700">
            Inventory Management
          </div>
          <div className="text-gray-500 text-sm">
            Monitoring & jurnal stok produk per toko.
          </div>
        </Link>

        {/* Discount Management */}
        <Link
          href="/admin/discount"
          className="group bg-white border border-green-100 rounded-xl p-6 flex flex-col gap-2 shadow hover:shadow-lg hover:bg-green-50 transition"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-100 text-green-700 mb-2">
            <Percent size={28} />
          </div>
          <div className="text-lg font-semibold text-green-700">
            Discount Management
          </div>
          <div className="text-gray-500 text-sm">
            Atur promo, diskon khusus, dan syarat penggunaan.
          </div>
        </Link>

        {/* Report & Analysis */}
        <Link
          href="/admin/reports"
          className="group bg-white border border-green-100 rounded-xl p-6 flex flex-col gap-2 shadow hover:shadow-lg hover:bg-green-50 transition"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-100 text-green-700 mb-2">
            <BarChart size={28} />
          </div>
          <div className="text-lg font-semibold text-green-700">
            Report & Analysis
          </div>
          <div className="text-gray-500 text-sm">
            Lihat laporan penjualan & stok lengkap dengan filter toko/bulan.
          </div>
        </Link>
      </div>
    </>
  );
}
