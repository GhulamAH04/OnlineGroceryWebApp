// === FILE: app/admin/products/page.tsx ===
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "@/lib/axios";
import { toast } from "sonner";
import ConfirmModal from "@/components/features2/common/ConfirmModal";
import ProductModal from "@/components/features2/productManagement/ProductModal";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import { Product } from "@/interfaces/productAdmin.interface";
import { apiUrl } from "@/config";

export default function ProductPage() {
  // === STATE ===
  const [products, setProducts] = useState<Product[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stores, setStores] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounceSearch(search);
  const fallbackImage =
    "https://res.cloudinary.com/djbdfjx1d/image/upload/v1746972046/nugget_plgi8w.jpg";

  // === FETCH DATA ===
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/products`, {
        params: {
          search: debouncedSearch,
          page,
          limit,
          sortBy: "name",
          sortOrder,
          categoryId: selectedCategory || undefined,
        },
      });

      setProducts(res.data?.data || []);
      setTotalPages(res.data?.meta?.totalPages || 1);
    } catch {
      toast.error("Gagal memuat produk");
    }
  };

  const fetchStores = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/branches`);
      setStores(res.data?.data || []);
    } catch {
      toast.error("Gagal memuat data toko");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/categories`);
      setCategories(res.data?.data || []);
    } catch {
      toast.error("Gagal memuat kategori");
    }
  };

  useEffect(() => {
    fetchStores();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, page, sortOrder, selectedCategory]);

  // === HANDLER ===
  const handleAdd = () => {
    setEditProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/api/admin/products/${confirmId}`, {
        params: { confirm: true },
      });
      toast.success("Produk dihapus");
      setConfirmId(null);
      fetchProducts();
    } catch {
      toast.error("Gagal menghapus produk");
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (editProduct) {
        await axios.put(
          `${apiUrl}/api/admin/products/${editProduct.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Produk berhasil diperbarui!");
      } else {
        await axios.post(`${apiUrl}/api/admin/products`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Produk berhasil ditambahkan!");
      }
      setIsModalOpen(false);
      setEditProduct(null);
      fetchProducts();
    } catch {
      toast.error("Gagal menyimpan produk");
    }
  };

  // === UI ===
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-700">
          Manajemen Produk
        </h1>
        <button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          + Tambah Produk
        </button>
      </div>

      {/* === FILTER BAR === */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 w-full sm:w-64"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-lg"
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="border border-gray-300 px-3 py-2 rounded-lg"
        >
          <option value="asc">Sortir Nama (A-Z)</option>
          <option value="desc">Sortir Nama (Z-A)</option>
        </select>
      </div>

      {/* === TABEL === */}
      <div className="overflow-auto rounded border">
        <table className="min-w-full text-sm text-left bg-white">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border">Gambar</th>
              <th className="p-3 border">Nama</th>
              <th className="p-3 border">Harga</th>
              <th className="p-3 border">Stok</th>
              <th className="p-3 border">Berat</th>
              <th className="p-3 border">Toko</th>
              <th className="p-3 border">Kategori</th>
              <th className="p-3 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={`${p.id}-${p.branchId}`} className="hover:bg-green-50">
                <td className="p-2 border">
                  <div className="w-[50px] h-[50px] relative">
                    <Image
                      src={p.image || fallbackImage}
                      alt={p.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded"
                      unoptimized
                    />
                  </div>
                </td>
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">Rp {p.price.toLocaleString()}</td>
                <td className="p-2 border">{p.stock}</td>
                <td className="p-2 border">{p.weight} g</td>
                <td className="p-2 border">
                  {stores.find((s) => s.id === p.branchId)?.name || "-"}
                </td>
                <td className="p-2 border">{p.categoryName || "-"}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmId(p.id)}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === PAGINATION === */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          &larr; Prev
        </button>

        <span className="text-sm text-gray-600">
          Halaman <span className="font-semibold">{page}</span> dari{" "}
          <span className="font-semibold">{totalPages}</span>
        </span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page >= totalPages}
          className="px-4 py-2 rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          Next &rarr;
        </button>
      </div>

      {/* === MODALS === */}
      <ProductModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        selectedProduct={editProduct}
        branches={stores}
        categories={categories}
      />

      <ConfirmModal
        open={!!confirmId}
        onCancel={() => setConfirmId(null)}
        onConfirm={handleDelete}
        title="Hapus Produk"
        description="Yakin ingin menghapus produk ini?"
        confirmText="Hapus"
        cancelText="Batal"
      />
    </div>
  );
}
