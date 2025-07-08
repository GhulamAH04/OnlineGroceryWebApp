"use client";
import { useState } from "react";
import { User } from "@/interfaces";

export default function DeleteUserModal({
  user,
  onDelete,
  onClose,
  onFeedback,
}: {
  user: User;
  onDelete: () => void;
  onClose: () => void;
  onFeedback: (msg: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${user.id}?confirm=true`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        onDelete();
        onFeedback("User berhasil dihapus!");
        onClose();
      } else {
        setError(data.message || "Gagal menghapus user");
        onFeedback("Gagal menghapus user.");
      }
    } catch {
      setError("Gagal koneksi ke server");
      onFeedback("Gagal menghapus user (server error).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-center text-red-600">
          Konfirmasi Hapus User
        </h2>
        <p className="text-center">
          Yakin ingin menghapus user <b>{user.name}</b>?
        </p>
        {error && <div className="text-red-500 text-center">{error}</div>}
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
