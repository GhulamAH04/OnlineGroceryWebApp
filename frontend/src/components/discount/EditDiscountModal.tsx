"use client";
import { useState, useEffect } from "react";
import { Discount, Product, Store } from "@/interfaces";

// =========================
// EditDiscountModal Component
// =========================
export default function EditDiscountModal({
  discount,
  onUpdate,
  onClose,
  onFeedback,
}: {
  discount: Discount;
  onUpdate: () => void;
  onClose: () => void;
  onFeedback: (msg: string) => void;
}) {
  // --- State Management ---
  const [name, setName] = useState(discount.name);
  const [type, setType] = useState(discount.type);
  const [value, setValue] = useState(discount.value.toString());
  const [percentage, setPercentage] = useState(discount.percentage || false);
  const [minPurchase, setMinPurchase] = useState(
    discount.minPurchase?.toString() || ""
  );
  const [maxDiscount, setMaxDiscount] = useState(
    discount.maxDiscount?.toString() || ""
  );
  const [productId, setProductId] = useState(discount.productId.toString());
  const [storeId, setStoreId] = useState(discount.storeId.toString());
  const [startDate, setStartDate] = useState(discount.startDate || "");
  const [endDate, setEndDate] = useState(discount.endDate || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- State for Dropdown Data ---
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  // --- Fetch Produk & Toko saat Modal Dibuka ---
  useEffect(() => {
    // Fetch Produk
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || "dummy"}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data.data?.data || []));
    // Fetch Toko
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stores`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || "dummy"}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStores(data.data || []));
  }, []);

  // --- Handle Submit Form ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const body = {
        name,
        type,
        value: Number(value),
        percentage,
        productId: Number(productId),
        storeId: Number(storeId),
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        minPurchase: undefined as number | undefined,
        maxDiscount: undefined as number | undefined,
      };
      if (type === "MIN_PURCHASE") {
        body.minPurchase = Number(minPurchase);
        body.maxDiscount = Number(maxDiscount);
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/discounts/${discount.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (data.success) {
        onUpdate();
        onFeedback("Diskon berhasil diupdate!");
        onClose();
      } else {
        setError(data.message || "Gagal update diskon");
        onFeedback("Gagal update diskon.");
      }
    } catch {
      setError("Gagal koneksi ke server");
      onFeedback("Gagal update diskon (server error).");
    } finally {
      setLoading(false);
    }
  };

  // =============== UI RETURN ===============
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Edit Diskon</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}

        {/* Input Nama Diskon */}
        <input
          className="w-full border rounded p-2"
          placeholder="Nama Diskon"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Dropdown Pilih Produk */}
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

        {/* Dropdown Pilih Toko */}
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

        {/* Pilih Tipe Diskon */}
        <select
          className="w-full border rounded p-2"
          value={type}
          onChange={(e) =>
            setType(e.target.value as "MANUAL" | "MIN_PURCHASE" | "BUY1GET1")
          }
        >
          <option value="MANUAL">Manual</option>
          <option value="MIN_PURCHASE">Min Purchase</option>
          <option value="BUY1GET1">Buy 1 Get 1</option>
        </select>

        {/* Input Nilai Diskon & Opsi */}
        {type === "MANUAL" && (
          <>
            <input
              className="w-full border rounded p-2"
              placeholder="Nilai Diskon"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
            <label className="block">
              <input
                type="checkbox"
                checked={percentage}
                onChange={(e) => setPercentage(e.target.checked)}
                className="mr-2"
              />
              Persentase (%)
            </label>
          </>
        )}
        {type === "MIN_PURCHASE" && (
          <>
            <input
              className="w-full border rounded p-2"
              placeholder="Nilai Diskon"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
            <label className="block">
              <input
                type="checkbox"
                checked={percentage}
                onChange={(e) => setPercentage(e.target.checked)}
                className="mr-2"
              />
              Persentase (%)
            </label>
            <input
              className="w-full border rounded p-2"
              placeholder="Minimal Pembelian"
              type="number"
              value={minPurchase}
              onChange={(e) => setMinPurchase(e.target.value)}
              required
            />
            <input
              className="w-full border rounded p-2"
              placeholder="Maksimal Diskon"
              type="number"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
              required
            />
          </>
        )}
        {type === "BUY1GET1" && (
          <div className="text-sm text-gray-600">
            Diskon Buy 1 Get 1 akan otomatis diterapkan pada produk ini
          </div>
        )}

        {/* Periode Diskon */}
        <label className="block text-sm text-gray-600">Periode Diskon</label>
        <div className="flex gap-2">
          <input
            type="date"
            className="w-full border rounded p-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="w-full border rounded p-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Tombol Submit & Batal */}
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
