"use client";
import { useState, useEffect } from "react";
import { Product, Category } from "@/interfaces";

export default function EditProductModal({
  product,
  onUpdate,
  onClose,
  onFeedback,
}: {
  product: Product;
  onUpdate: () => void;
  onClose: () => void;
  onFeedback: (msg: string) => void;
}) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price.toString());
  const [categoryId, setCategoryId] = useState(
    product.categoryId?.toString() || ""
  );
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch kategori untuk dropdown
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || "dummy"}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("categoryId", categoryId);
    if (image) formData.append("images", image);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${product.id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      const data = await res.json();
      if (data.success) {
        onUpdate();
        onFeedback("Produk berhasil diupdate!");
        onClose();
      } else {
        setError(data.message || "Gagal update produk");
        onFeedback("Gagal update produk.");
      }
    } catch {
      setError("Gagal koneksi ke server");
      onFeedback("Gagal update produk (server error).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Edit Produk</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <input
          className="w-full border rounded p-2"
          placeholder="Nama Produk"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Harga"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        {/* Dropdown Kategori */}
        <label className="block text-sm mb-1">Kategori</label>
        <select
          className="w-full border rounded p-2 mb-2"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Pilih Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          className="w-full"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
