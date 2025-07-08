"use client";
import { useState, useEffect } from "react";
import { Product, Store } from "@/interfaces";

// ==============================
// AddInventoryModal Component
// ==============================
export default function AddInventoryModal({
  onAdd,
  onClose,
  onFeedback,
}: {
  onAdd: () => void;
  onClose: () => void;
  onFeedback: (msg: string) => void;
}) {
  // --- State untuk form ---
  const [productId, setProductId] = useState("");
  const [storeId, setStoreId] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- State untuk dropdown data ---
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  // --- Fetch produk & toko untuk dropdown saat modal muncul ---
  useEffect(() => {
    // Fetch produk
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || "dummy"}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data.data?.data || []));
    // Fetch toko
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stores`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || "dummy"}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStores(data.data || []));
  }, []);

  // --- Handle submit form tambah inventory ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: Number(productId),
          storeId: Number(storeId),
          currentStock: Number(currentStock),
        }),
      });
      const data = await res.json();
      if (data.success) {
        onAdd();
        onFeedback("Stok berhasil ditambahkan!");
        onClose();
      } else {
        setError(data.message || "Gagal tambah stok");
        onFeedback("Gagal tambah stok.");
      }
    } catch {
      setError("Gagal koneksi ke server");
      onFeedback("Gagal tambah stok (server error).");
    } finally {
      setLoading(false);
    }
  };

  // ================== UI RETURN ==================
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Tambah Stok</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}

        {/* Dropdown Produk */}
        <label className="block text-sm mb-1">Produk</label>
        <select
          className="w-full border rounded p-2 mb-2"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        >
          <option value="">Pilih Produk</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Dropdown Toko */}
        <label className="block text-sm mb-1">Toko</label>
        <select
          className="w-full border rounded p-2 mb-2"
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
          required
        >
          <option value="">Pilih Toko</option>
          {stores.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Input Stok Awal */}
        <input
          className="w-full border rounded p-2"
          placeholder="Stok Awal"
          type="number"
          value={currentStock}
          onChange={(e) => setCurrentStock(e.target.value)}
          required
        />

        {/* Tombol aksi */}
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
            {loading ? "Mengirim..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
