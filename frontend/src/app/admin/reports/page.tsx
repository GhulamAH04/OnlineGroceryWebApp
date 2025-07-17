"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SalesReportTable from "@/components/features2/reports/SalesReportTable";
import StockReportTable from "@/components/features2/reports/StockReportTable";
import { Store } from "@/interfaces";

export default function ReportsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"sales" | "stock">("sales");
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [loadingStores, setLoadingStores] = useState(true);

  // Fetch daftar toko untuk filter (jika ada endpoint /stores)
  useEffect(() => {
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   router.push("/admin/login");
    //   return;
    // }
    // Bisa dummy, atau ambil token lama (hasil login) biar backend gak error
    const token = localStorage.getItem("token") || "dummy";
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stores`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setStores(data.data || []);
        setLoadingStores(false);
      })
      .catch(() => setLoadingStores(false));
  }, [router]);

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-5xl">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Report &amp; Analysis
          </h1>

          {/* Tab Selector */}
          <div className="flex justify-center mb-6">
            <button
              className={`px-6 py-2 rounded-l ${
                tab === "sales"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setTab("sales")}
            >
              Sales Report
            </button>
            <button
              className={`px-6 py-2 rounded-r ${
                tab === "stock"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setTab("stock")}
            >
              Stock Report
            </button>
          </div>

          {/* Filter */}
          <div className="flex gap-4 mb-6 flex-wrap justify-center">
            {/* Filter Store */}
            <div>
              <label className="block text-xs mb-1">Toko</label>
              <select
                className="border rounded p-2 min-w-[120px]"
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                disabled={loadingStores}
              >
                <option value="">Semua Toko</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Filter Month */}
            <div>
              <label className="block text-xs mb-1">Bulan</label>
              <input
                type="month"
                className="border rounded p-2 min-w-[120px]"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          {tab === "sales" ? (
            <SalesReportTable storeId={selectedStore} month={selectedMonth} />
          ) : (
            <StockReportTable storeId={selectedStore} month={selectedMonth} />
          )}
        </div>
      </div>
  );
}
