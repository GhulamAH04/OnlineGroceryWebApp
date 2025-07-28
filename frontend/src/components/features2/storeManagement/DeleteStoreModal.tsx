"use client";
import { useState } from "react";
import { IStore } from "@/interfaces";
import axios from "axios";
import { apiUrl } from "@/config";

export default function DeleteStoreModal({
  store,
  onDelete,
  onClose,
}: {
  store: IStore;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${apiUrl}/api/stores/${store.id}`);
      onDelete();
      onClose();
      setLoading(false);
      alert("toko berhasil dihapus!");
    } catch {
      alert("Gagal menghapus toko.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-center text-red-600">
          Konfirmasi Hapus Toko
        </h2>
        <p className="text-center">
          Yakin ingin menghapus toko <b>{store.name}</b>?
        </p>
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
            disabled={loading}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
