"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios"; // ✅ Pakai custom axios
import Image from "next/image";
import { Inventory } from "@/interfaces/inventoryAdmin";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";

export default function InventoryPage() {
  // === STATE ===
  const [inventoryList, setInventoryList] = useState<Inventory[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounceSearch(search);

  // === FETCH DATA INVENTORY ===
const fetchInventory = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("/admin/inventory", {
      params: { search: debouncedSearch },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setInventoryList(res.data.data);
  } catch (error) {
    console.error("❌ Gagal mengambil data inventory", error);
  }
};


  // === TRIGGER FETCH SETIAP SEARCH ===
  useEffect(() => {
    fetchInventory();
  }, [debouncedSearch]);

  // === RENDER ===
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center text-green-700">
          Stok Terkini
        </h1>

        {/* === SEARCH DAN LINK TAMBAH === */}
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Cari produk..."
            className="border rounded p-2 w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <a
            href="/admin/inventory-journal"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            ➕ Tambah Mutasi Stok
          </a>
        </div>

        {/* === TABEL INVENTORY === */}
        <table className="w-full text-sm border">
          <thead className="bg-green-100">
            <tr>
              <th className="p-2 border">Gambar</th>
              <th className="p-2 border">Produk</th>
              <th className="p-2 border">Toko</th>
              <th className="p-2 border">Stok</th>
            </tr>
          </thead>
          <tbody>
            {inventoryList.map((item) => (
              <tr key={item.id} className="border">
                <td className="p-2">
                  {item.products?.image ? (
                    <Image
                      src={item.products.image}
                      alt={item.products.name}
                      width={50}
                      height={50}
                      className="rounded"
                    />
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td className="p-2">{item.products?.name || "-"}</td>
                <td className="p-2">{item.branchs?.name || "-"}</td>
                <td className="p-2 font-semibold text-green-700">
                  {item.stock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
