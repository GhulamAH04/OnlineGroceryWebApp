// === INVENTORY JOURNAL PAGE ===
// OnlineGroceryWebApp/frontend/src/app/admin/inventory-journal/page.tsx

"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

import {
  InventoryJournal,
  InventoryJournalForm,
} from "@/interfaces/inventoryAdmin";
import { inventoryJournalSchema } from "@/schemas/inventoryJournalSchema";
import ConfirmModal from "@/components/features2/common/ConfirmModal";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import { PaginationResponse } from "@/interfaces/pagination";
import { getRoleFromToken } from "@/utils/getRoleFromToken";

export default function InventoryJournalPage() {
  const [journals, setJournals] = useState<InventoryJournal[]>([]);
  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [pagination, setPagination] =
    useState<PaginationResponse<InventoryJournal>["pagination"]>();
  const [role, setRole] = useState<"SUPER_ADMIN" | "STORE_ADMIN" | null>(null);

  const debouncedSearch = useDebounceSearch(search);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(inventoryJournalSchema),
  });

  // === GET ROLE FROM TOKEN ===
  useEffect(() => {
    const r = getRoleFromToken();
    setRole(r);
  }, []);

  // === FETCH DATA ===
  const fetchData = async () => {
    try {
      const [journalRes, productRes, branchRes] = await Promise.all([
        axios.get<PaginationResponse<InventoryJournal>>(
          "/admin/inventory-journal",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              page,
              limit: 10,
              search: debouncedSearch,
              sortBy: "createdAt",
              sortOrder,
            },
          }
        ),
        axios.get("/admin/products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/admin/branches", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setJournals(journalRes.data.data);
      setPagination(journalRes.data.pagination);
      setProducts(productRes.data?.data?.data ?? []);
      setBranches(branchRes.data?.data ?? []);
    } catch {
      toast.error("Gagal mengambil data");
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [debouncedSearch, page, sortOrder]);

  // === SUBMIT FORM ===
  const onSubmit = async (data: InventoryJournalForm) => {
    try {
      setIsSubmitting(true);
      await axios.post("/admin/inventory-journal", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Jurnal berhasil ditambahkan");
      reset();
      fetchData();
    } catch {
      toast.error("Gagal menyimpan jurnal");
    } finally {
      setIsSubmitting(false);
    }
  };

  // === DELETE HANDLER ===
  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      await axios.delete(`/admin/inventory-journal/${confirmId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Jurnal berhasil dihapus");
      fetchData();
    } catch {
      toast.error("Gagal menghapus jurnal");
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-green-700 text-center">
          Jurnal Perubahan Stok
        </h1>

        {/* === SEARCH & SORT === */}
        <div className="mb-4 flex flex-col md:flex-row gap-2 justify-between items-center">
          <input
            type="text"
            placeholder="Cari nama produk..."
            className="border rounded p-2 w-full md:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="border rounded p-2"
          >
            <option value="desc">Terbaru</option>
            <option value="asc">Terlama</option>
          </select>
        </div>

        {/* === FORM TAMBAH (HANYA SUPER ADMIN) === */}
        {role === "SUPER_ADMIN" && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          >
            {/* Produk */}
            <div>
              <label className="block mb-1">Produk</label>
              <select
                {...register("productId")}
                className="w-full border rounded p-2"
              >
                <option value="">Pilih Produk</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.productId && (
                <p className="text-red-500 text-sm">
                  {errors.productId.message}
                </p>
              )}
            </div>

            {/* Cabang */}
            <div>
              <label className="block mb-1">Cabang</label>
              <select
                {...register("branchId")}
                className="w-full border rounded p-2"
              >
                <option value="">Pilih Cabang</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              {errors.branchId && (
                <p className="text-red-500 text-sm">
                  {errors.branchId.message}
                </p>
              )}
            </div>

            {/* Tipe */}
            <div>
              <label className="block mb-1">Tipe</label>
              <select
                {...register("type")}
                className="w-full border rounded p-2"
              >
                <option value="">Pilih Tipe</option>
                <option value="IN">IN</option>
                <option value="OUT">OUT</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type.message}</p>
              )}
            </div>

            {/* Jumlah */}
            <div>
              <label className="block mb-1">Jumlah</label>
              <input
                type="number"
                {...register("stock")}
                className="w-full border rounded p-2"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm">{errors.stock.message}</p>
              )}
            </div>

            {/* Catatan */}
            <div className="md:col-span-2">
              <label className="block mb-1">Catatan (opsional)</label>
              <textarea
                {...register("note")}
                rows={2}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Tambah Jurnal"}
              </button>
            </div>
          </form>
        )}

        {/* === TABEL JURNAL === */}
        <table className="w-full border text-sm">
          <thead className="bg-green-100">
            <tr>
              <th className="p-2 border">Produk</th>
              <th className="p-2 border">Toko</th>
              <th className="p-2 border">Tipe</th>
              <th className="p-2 border">Jumlah</th>
              <th className="p-2 border">Catatan</th>
              <th className="p-2 border">Tanggal</th>
              {role === "SUPER_ADMIN" && <th className="p-2 border">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {journals.map((j) => (
              <tr key={`${j.id}-${j.createdAt}`} className="border">
                <td className="p-2">{j.productName}</td>
                <td className="p-2">{j.branchName}</td>
                <td className="p-2">{j.action}</td>
                <td className="p-2">{j.amount}</td>
                <td className="p-2">{j.note || "-"}</td>
                <td className="p-2">
                  {new Date(j.createdAt).toLocaleDateString()}
                </td>
                {role === "SUPER_ADMIN" && (
                  <td className="p-2">
                    <button
                      onClick={() => setConfirmId(j.id)}
                      className="text-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                )}
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

        {/* === MODAL KONFIRMASI HAPUS === */}
        {confirmId && (
          <ConfirmModal
            open={!!confirmId}
            onCancel={() => setConfirmId(null)}
            onConfirm={handleDelete}
            title="Hapus Jurnal"
            description="Yakin ingin menghapus jurnal ini?"
          />
        )}
      </div>
    </div>
  );
}
