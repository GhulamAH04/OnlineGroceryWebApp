"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Image from "next/image";
import { toast } from "sonner";

import ConfirmModal from "@/components/features2/common/ConfirmModal";
import ProductModal from "@/components/features2/productManagement/ProductModal";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import { Product } from "@/interfaces/productAdmin.interface";

export default function ProductPage() {
  // === STATE ===
  const [products, setProducts] = useState<Product[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stores, setStores] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  const debouncedSearch = useDebounceSearch(search);

  // === FETCH PRODUCTS ===
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/admin/products", {
        params: { search: debouncedSearch },
      });
        console.log("prduct tidak muncul",res.data.data.data)
          setProducts(Array.isArray(res.data?.data.data) ? res.data.data.data : []);
    } catch {
      toast.error("Gagal memuat produk");
    }
  };

  // === FETCH STORES ===
  const fetchStores = async () => {
   try {
     const res = await axios.get("/admin/branches");
     setStores(res.data?.data || []); // ✅ penting!
     console.log("stores loaded", res.data?.data);
   } catch (err) {
     toast.error("Gagal memuat data toko");
     console.error("Gagal fetch /admin/branches", err);
   }
  };

  // === FETCH CATEGORIES ===
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/admin/categories");
      setCategories(res.data?.data || []);
    } catch {
      toast.error("Gagal memuat kategori");
    }
  };

  // === FETCH DI LOAD AWAL ===
  useEffect(() => {
    fetchProducts();
    fetchStores();
    fetchCategories();
  }, []);

  // === FETCH SAAT CARI ===
  useEffect(() => {
    if (debouncedSearch !== "") {
      fetchProducts();
    }
  }, [debouncedSearch]);

  // === HANDLE TAMBAH ===
  const handleAdd = () => {
    setEditProduct(null);
    setIsModalOpen(true);
  };

  // === HANDLE EDIT ===
  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  // === HANDLE DELETE ===
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

  // === HANDLE SUBMIT FORM ===
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

  // === RENDER ===
  console.log(products.map((p) => p.id));
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-green-700">Product Management</h1>

      {/* === SEARCH & ADD === */}
      <div className="flex justify-between items-center mb-4">
        <input
          className="border px-4 py-2 rounded w-full max-w-sm"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="ml-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          + Tambah Produk
        </button>
      </div>

      {/* === PRODUCT TABLE === */}
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
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-green-50">
              <td className="p-2 border">
                <Image
                  src={p.image || "/default.png"}
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

      {/* === MODAL FORM === */}
      <ProductModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        selectedProduct={editProduct}
        branches={stores}
        categories={categories}
      />

      {/* === MODAL DELETE CONFIRMATION === */}
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
