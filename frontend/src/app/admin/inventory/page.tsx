// === INVENTORY MANAGEMENT PAGE ===
// OnlineGroceryWebApp/frontend/src/app/admin/inventory/page.tsx

"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Image from "next/image";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import { PaginationResponse } from "@/interfaces/pagination";
import { Inventory } from "@/interfaces/inventoryAdmin";
import { getRoleFromToken } from "@/utils/getRoleFromToken";
import ConfirmModal from "@/components/features2/common/ConfirmModal";

export default function InventoryPage() {
  // === STATE ===
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [pagination, setPagination] =
    useState<PaginationResponse<Inventory> | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [role, setRole] = useState<"SUPER_ADMIN" | "STORE_ADMIN" | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const debouncedSearch = useDebounceSearch(search);

  // === GET ROLE FROM TOKEN ===
  useEffect(() => {
    const r = getRoleFromToken();
    setRole(r);
  }, []);

  // === FETCH INVENTORY ===
  const fetchInventory = async () => {
    try {
      const res = await axios.get<PaginationResponse<Inventory>>(
        "/admin/inventory",
        {
          params: {
            page,
            limit: 10,
            search: debouncedSearch,
            sortBy: "stock",
            sortOrder,
          },
        }
      );
      setInventory(Array.isArray(res.data.data) ? res.data.data : []);
      setPagination(res.data);
    } catch (error) {
      console.error("Gagal mengambil data inventory", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [debouncedSearch, page, sortOrder]);

  // === DELETE INVENTORY (Opsional, jika ada fitur hapus) ===
  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      await axios.delete(`/admin/inventory/${confirmId}`);
      setConfirmId(null);
      fetchInventory();
    } catch (error) {
      console.error("Gagal menghapus inventory", error);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-green-700 text-center">
          Inventory Produk
        </h1>

        {/* === SEARCH & SORT === */}
        <div className="mb-4 flex flex-col md:flex-row gap-2 justify-between items-center">
          <input
            type="text"
            placeholder="Cari produk..."
            className="border rounded p-2 w-full md:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="border rounded p-2"
          >
            <option value="asc">Stok Naik</option>
            <option value="desc">Stok Turun</option>
          </select>
        </div>

        {/* === LINK TAMBAH MUTASI (HANYA SUPER ADMIN) === */}
        {role === "SUPER_ADMIN" && (
          <div className="mb-4">
            <a
              href="/admin/inventory-journal"
              className="bg-green-600 text-white px-4 py-2 rounded inline-block"
            >
              ➕ Tambah Mutasi Stok
            </a>
          </div>
        )}

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
            {inventory.map((item) => (
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

        {/* === PAGINATION === */}
        {pagination && (
          <div className="flex justify-between items-center mt-4 text-sm">
            <p>
              Halaman {pagination.page} dari {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={pagination.page === 1}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() =>
                  setPage((prev) =>
                    prev < pagination.totalPages ? prev + 1 : prev
                  )
                }
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* === MODAL KONFIRMASI HAPUS (HANYA SUPER ADMIN) === */}
        {confirmId && role === "SUPER_ADMIN" && (
          <ConfirmModal
            open={Boolean(confirmId)}
            onCancel={() => setConfirmId(null)}
            onConfirm={handleDelete}
            title="Hapus Inventory"
            description="Yakin ingin menghapus data stok ini?"
          />
        )}
      </div>
    </div>
  );
}
