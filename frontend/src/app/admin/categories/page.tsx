// === CATEGORY MANAGEMENT PAGE ===
// OnlineGroceryWebApp/frontend/src/app/admin/categories/page.tsx

"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import ConfirmModal from "@/components/features2/common/ConfirmModal";
import { Category } from "@/interfaces/categoryAdmin";
import { PaginationResponse } from "@/interfaces/pagination";
import { getRoleFromToken } from "@/utils/getRoleFromToken";

// === SCHEMA & TYPES ===
const categorySchema = yup.object({
  name: yup.string().required("Nama kategori wajib diisi"),
});

type CategoryInput = yup.InferType<typeof categorySchema>;

const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] =
    useState<PaginationResponse<Category>["pagination"]>();
  const [editId, setEditId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [role, setRole] = useState<"SUPER_ADMIN" | "STORE_ADMIN" | null>(null);
  const debouncedSearch = useDebounceSearch(search);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryInput>({
    resolver: yupResolver(categorySchema),
  });

  // === GET ROLE FROM TOKEN ===
  useEffect(() => {
    const userRole = getRoleFromToken();
    setRole(userRole);
  }, []);

  // === FETCH DATA ===
  const fetchData = async () => {
    try {
      const res = await axios.get<PaginationResponse<Category>>(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/categories`,
        {
          params: {
            page,
            limit: 10,
            search: debouncedSearch,
            sortBy: "name",
            sortOrder,
          },
        }
      );
      setCategories(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error("Gagal mengambil data kategori");
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, page, sortOrder]);

  // === SUBMIT FORM TAMBAH / EDIT ===
  const onSubmit = async (data: CategoryInput) => {
    try {
      const payload = {
        name: data.name,
        slug: generateSlug(data.name),
      };

      if (editId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${editId}`,
          payload
        );
        toast.success("Kategori berhasil diperbarui");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/categories`,
          payload
        );
        toast.success("Kategori berhasil ditambahkan");
      }

      reset();
      setEditId(null);
      fetchData();
    } catch {
      toast.error("Gagal menyimpan kategori");
    }
  };

  const handleEdit = (category: Category) => {
    reset({ name: category.name });
    setEditId(category.id);
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${confirmId}`
      );
      toast.success("Kategori berhasil dihapus");
      fetchData();
    } catch {
      toast.error("Gagal menghapus kategori");
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-green-700 text-center">
          Kategori Produk
        </h1>

        {/* === FORM TAMBAH / EDIT (HANYA SUPER ADMIN) === */}
        {role === "SUPER_ADMIN" && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          >
            <div className="md:col-span-2">
              <input
                type="text"
                {...register("name")}
                placeholder="Nama Kategori"
                className="w-full border rounded p-2"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="bg-green-600 text-white w-full py-2 rounded"
              >
                {editId ? "Update" : "Tambah"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setEditId(null);
                  }}
                  className="bg-gray-300 text-gray-800 w-full mt-2 py-2 rounded"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        )}

        {role === "STORE_ADMIN" && (
          <p className="text-sm text-gray-500 italic mb-4 text-center">
            Anda hanya memiliki akses baca kategori (read-only).
          </p>
        )}

        {/* === SEARCH & SORT === */}
        <div className="mb-4 flex flex-col md:flex-row gap-2 justify-between items-center">
          <input
            type="text"
            placeholder="Cari kategori..."
            className="border rounded p-2 w-full md:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="border rounded p-2"
          >
            <option value="asc">A - Z</option>
            <option value="desc">Z - A</option>
          </select>
        </div>

        {/* === TABEL === */}
        <table className="w-full border text-sm">
          <thead className="bg-green-100">
            <tr>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Slug</th>
              {role === "SUPER_ADMIN" && <th className="p-2 border">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border">
                <td className="p-2">{cat.name}</td>
                <td className="p-2">{cat.slug}</td>
                {role === "SUPER_ADMIN" && (
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmId(cat.id)}
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

        {/* === MODAL KONFIRMASI HAPUS (HANYA SUPER ADMIN) === */}
        {confirmId && role === "SUPER_ADMIN" && (
          <ConfirmModal
            open={Boolean(confirmId)}
            onCancel={() => setConfirmId(null)}
            onConfirm={handleDelete}
            title="Hapus Kategori"
            description="Yakin ingin menghapus kategori ini?"
          />
        )}
      </div>
    </div>
  );
}
