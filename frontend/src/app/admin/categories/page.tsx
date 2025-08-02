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

// === SCHEMA & TYPES ===
const categorySchema = yup.object({
  name: yup.string().required("Nama kategori wajib diisi"),
});
type CategoryInput = yup.InferType<typeof categorySchema>;

// === SLUG GENERATOR ===
const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounceSearch(search);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryInput>({
    resolver: yupResolver(categorySchema),
  });

  // === FETCH DATA ===
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/admin/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { search: debouncedSearch },
      });

      const data = Array.isArray(res.data.data) ? res.data.data : [];
      console.log("✅ Kategori fetched:", data);
      setCategories(data);
    } catch (err) {
      console.error("❌ Error fetching kategori:", err);
      toast.error("Gagal mengambil data kategori");
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearch]);

  // === HANDLE SUBMIT ===
  const onSubmit = async (data: CategoryInput) => {
    const payload = {
      name: data.name,
      slug: generateSlug(data.name),
    };

    try {
      const token = localStorage.getItem("token");

      if (editId) {
        await axios.put(`/api/admin/categories/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Kategori berhasil diperbarui");
      } else {
        await axios.post("/api/admin/categories", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Kategori berhasil ditambahkan");
      }

      reset();
      setEditId(null);
      fetchData();
    } catch {
      toast.error("Gagal menyimpan kategori");
    }
  };

  // === HANDLE EDIT ===
  const handleEdit = (category: Category) => {
    reset({ name: category.name });
    setEditId(category.id);
  };

  // === HANDLE DELETE ===
  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`/api/admin/categories/${confirmId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

        {/* === FORM TAMBAH / EDIT === */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <div className="md:col-span-2">
            <input
              type="text"
              {...register("name")}
              placeholder="Nama Kategori"
              autoComplete="off"
              aria-label="Nama kategori"
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

        {/* === SEARCH INPUT === */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari kategori..."
            autoComplete="off"
            aria-label="Cari kategori"
            className="border rounded p-2 w-full md:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* === TABEL KATEGORI === */}
        <table className="w-full border text-sm">
          <thead className="bg-green-100">
            <tr>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Slug</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center text-gray-500 py-4">
                  Tidak ada kategori ditemukan.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="border">
                  <td className="p-2">{cat.name}</td>
                  <td className="p-2">{cat.slug}</td>
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
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* === MODAL KONFIRMASI HAPUS === */}
        {confirmId && (
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
