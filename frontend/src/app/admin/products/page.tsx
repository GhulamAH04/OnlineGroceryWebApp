// === FILE: app/admin/products/page.tsx ===
"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Image from "next/image";
import { toast } from "sonner";

import ConfirmModal from "@/components/features2/common/ConfirmModal";
import ProductModal from "@/components/features2/productManagement/ProductModal";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import { Product } from "@/interfaces/productAdmin.interface";
import { PaginationResponse } from "@/interfaces/pagination";
import { getRoleFromToken } from "@/utils/getRoleFromToken";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stores, setStores] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [role, setRole] = useState<"SUPER_ADMIN" | "STORE_ADMIN" | null>(null);
  const [pagination, setPagination] =
    useState<PaginationResponse<Product> | null>(null);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const debouncedSearch = useDebounceSearch(search);

  useEffect(() => {
    const currentRole = getRoleFromToken();
    setRole(currentRole);
  }, []);

  // === FETCH ===
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/admin/products", {
        params: {
          search: debouncedSearch,
          page,
          limit: 10, // atau sesuai kebutuhan
          sortBy: "name", // atau price, createdAt, dll
          sortOrder,
        },
      });

      const responseData: PaginationResponse<Product> = res.data?.data;

      setProducts(responseData.data || []);
      setPagination(responseData);
    } catch {
      toast.error("Gagal memuat produk");
    }
  };

  /*

  ==== jaga jaga kalo error masih bisa pakai ini buat fetch products
const fetchProducts = async () => {
  try {
    const res = await axios.get("/admin/products", {
      params: {
        search: debouncedSearch,
        page,
        limit: 10, // atau sesuai kebutuhan
        sortBy: "name", // atau price, createdAt, dll
        sortOrder,
      },
    });

    const responseData: PaginationResponse<Product> = res.data?.data;

    setProducts(responseData.data || []);
    setPagination(responseData);
  } catch {
    toast.error("Gagal memuat produk");
  }
};
*/

  const fetchStores = async () => {
    try {
      const res = await axios.get("/admin/branches");
      setStores(res.data?.data || []);
    } catch {
      toast.error("Gagal memuat data toko");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/admin/categories");
      setCategories(res.data?.data || []);
    } catch {
      toast.error("Gagal memuat kategori");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, page, sortOrder]);

  useEffect(() => {
    fetchStores();
    fetchCategories();
  }, []);

  // === CRUD ===
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
      await axios.delete(`/admin/products/${confirmId}`);
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
        await axios.put(`/admin/products/${editProduct.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Produk berhasil diperbarui!");
      } else {
        await axios.post("/admin/products", formData, {
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

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-green-700">Product Management</h1>

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
          <option value="asc">A - Z</option>
          <option value="desc">Z - A</option>
        </select>
      </div>

      {role === "SUPER_ADMIN" && (
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Tambah Produk
        </button>
      )}

      {/* === TABLE === */}
      <table className="w-full border text-sm">
        <thead className="bg-green-100 text-left">
          <tr>
            <th className="p-2 border">Gambar</th>
            <th className="p-2 border">Nama</th>
            <th className="p-2 border">Harga</th>
            <th className="p-2 border">Stok</th>
            <th className="p-2 border">Toko</th>
            <th className="p-2 border">Kategori</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const imageUrl = p.image?.startsWith("http")
              ? p.image
              : p.image
              ? `https://res.cloudinary.com/your-cloud-name/image/upload/${p.image}`
              : "/default.png";

            return (
              <tr key={`${p.id}-${p.branchId}`} className="hover:bg-green-50">
                <td className="p-2 border">
                  <Image
                    src={imageUrl}
                    alt={p.name}
                    width={56}
                    height={56}
                    className="object-cover rounded"
                  />
                </td>
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">Rp {p.price.toLocaleString()}</td>
                <td className="p-2 border">{p.stock}</td>
                <td className="p-2 border">
                  {stores.find((s) => s.id === p.branchId)?.name || "-"}
                </td>
                <td className="p-2 border">{p.categoryName || "-"}</td>
                <td className="p-2 border space-x-2">
                  {role === "SUPER_ADMIN" && (
                    <>
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
                    </>
                  )}
                </td>
              </tr>
            );
          })}
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

      {/* === MODAL === */}
      {role === "SUPER_ADMIN" && (
        <ProductModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          selectedProduct={editProduct}
          branches={stores}
          categories={categories}
        />
      )}

      {/* === DELETE CONFIRM === */}
      {confirmId && role === "SUPER_ADMIN" && (
        <ConfirmModal
          open={!!confirmId}
          onCancel={() => setConfirmId(null)}
          onConfirm={handleDelete}
          title="Hapus Produk"
          description="Yakin ingin menghapus produk ini?"
          confirmText="Hapus"
          cancelText="Batal"
        />
      )}
    </div>
  );
}
