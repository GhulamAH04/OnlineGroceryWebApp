// === STORE MANAGEMENT PAGE ===
// OnlineGroceryWebApp/frontend/src/app/admin/stores/page.tsx

"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { getCookie } from "cookies-next";
import { toast } from "sonner";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import { getRoleFromToken } from "@/utils/getRoleFromToken";
import ConfirmModal from "@/components/features2/common/ConfirmModal";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import type { IStore } from "@/interfaces";
import type { PaginationResponse } from "@/interfaces/pagination";

// === VALIDATION ===
const storeSchema = yup.object({
  name: yup.string().required("Nama toko wajib diisi"),
  address: yup.string().required("Alamat toko wajib diisi"),
});

type StoreInput = yup.InferType<typeof storeSchema>;

export default function StoreManagementPage() {
  // === STATE ===
  const [stores, setStores] = useState<IStore[]>([]);
  const [pagination, setPagination] =
    useState<PaginationResponse<IStore>["pagination"]>();
  const [editId, setEditId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [role, setRole] = useState<"SUPER_ADMIN" | "STORE_ADMIN" | null>(null);

  const debouncedSearch = useDebounceSearch(search);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<StoreInput>({
    resolver: yupResolver(storeSchema),
  });

  // === GET ROLE ON LOAD ===
  useEffect(() => {
    const r = getRoleFromToken();
    setRole(r);
  }, []);

  // === FETCH DATA ===
  const fetchStores = async () => {
    try {
      const token = getCookie("access_token") as string;
      const { data } = await axios.get<PaginationResponse<IStore>>(
        "/admin/branches",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            search: debouncedSearch,
            page,
            limit: 10,
            sortBy,
            sortOrder,
          },
        }
      );
      setStores(data.data);
      setPagination(data.pagination);
    } catch {
      toast.error("Gagal memuat data toko");
    }
  };

  useEffect(() => {
    fetchStores();
  }, [debouncedSearch, page, sortBy, sortOrder]);

  // === CRUD ===
  const onSubmit = async (data: StoreInput) => {
    try {
      if (editId) {
        await axios.put(`/admin/branches/${editId}`, data);
        toast.success("Toko diperbarui");
      } else {
        await axios.post("/admin/branches", data);
        toast.success("Toko ditambahkan");
      }
      reset();
      setEditId(null);
      fetchStores();
    } catch {
      toast.error("Gagal menyimpan toko");
    }
  };

  const handleEdit = (store: IStore) => {
    setEditId(store.id);
    setValue("name", store.name);
    setValue("address", store.address);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/admin/branches/${confirmId}`);
      toast.success("Toko dihapus");
      fetchStores();
    } catch {
      toast.error("Gagal menghapus toko");
    } finally {
      setConfirmId(null);
    }
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // === RENDER ===
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-green-700 text-center">
          Store Management
        </h1>

        {/* === SEARCH & SORT === */}
        <div className="mb-4 flex flex-col md:flex-row gap-2 justify-between items-center">
          <input
            placeholder="Cari toko..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded bg-white w-full md:w-1/2"
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="border px-3 py-2 rounded"
          >
            <option value="asc">A - Z</option>
            <option value="desc">Z - A</option>
          </select>
        </div>

        {/* === FORM SUPER ADMIN === */}
        {role === "SUPER_ADMIN" && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-green-50 border border-green-200 rounded p-4 space-y-4 mb-6"
          >
            <div>
              <label className="block mb-1 font-medium">Nama Toko</label>
              <input
                {...register("name")}
                className="w-full px-3 py-2 border rounded"
              />
              <p className="text-sm text-red-500">{errors.name?.message}</p>
            </div>

            <div>
              <label className="block mb-1 font-medium">Alamat</label>
              <input
                {...register("address")}
                className="w-full px-3 py-2 border rounded"
              />
              <p className="text-sm text-red-500">{errors.address?.message}</p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                {editId ? "Update" : "Tambah"} Toko
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    reset();
                  }}
                  className="text-gray-600 underline"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        )}

        {role === "STORE_ADMIN" && (
          <p className="text-sm text-gray-500 italic mb-4 text-center">
            Anda hanya memiliki akses baca (read-only).
          </p>
        )}

        {/* === TABEL === */}
        <table className="w-full border text-sm">
          <thead className="bg-green-100">
            <tr>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => toggleSort("name")}
              >
                Nama Toko
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => toggleSort("address")}
              >
                Alamat
              </th>
              {role === "SUPER_ADMIN" && (
                <th className="p-2 border text-center">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id} className="hover:bg-green-50">
                <td className="p-2 border">{store.name}</td>
                <td className="p-2 border">{store.address}</td>
                {role === "SUPER_ADMIN" && (
                  <td className="p-2 border text-center space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEdit(store)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => setConfirmId(store.id)}
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
        {confirmId && role === "SUPER_ADMIN" && (
          <ConfirmModal
            open={Boolean(confirmId)}
            onCancel={() => setConfirmId(null)}
            onConfirm={handleDelete}
            title="Hapus Toko"
            description="Yakin ingin menghapus toko ini?"
            confirmText="Hapus"
            cancelText="Batal"
          />
        )}
      </div>
    </div>
  );
}
