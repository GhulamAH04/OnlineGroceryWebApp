"use client";
import { useState } from "react";
import { Inventory } from "@/interfaces";

export default function EditInventoryModal({
  inventory,
  onUpdate,
  onClose,
  onFeedback,
}: {
  inventory: Inventory;
  onUpdate: () => void;
  onClose: () => void;
  onFeedback: (msg: string) => void;
}) {
  const [currentStock, setCurrentStock] = useState(
    inventory.currentStock.toString()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/${inventory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentStock: Number(currentStock),
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        onUpdate();
        onFeedback("Stok berhasil diupdate!");
        onClose();
      } else {
        setError(data.message || "Gagal update stok");
        onFeedback("Gagal update stok.");
      }
    } catch {
      setError("Gagal koneksi ke server");
      onFeedback("Gagal update stok (server error).");
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
        <h2 className="text-xl font-bold text-center">Edit Stok</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <input
          className="w-full border rounded p-2"
          placeholder="Stok"
          type="number"
          value={currentStock}
          onChange={(e) => setCurrentStock(e.target.value)}
          required
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
