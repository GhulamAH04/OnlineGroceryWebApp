"use client";
import { useState, useEffect } from "react";
import { IStore } from "@/interfaces";

export default function EditStoreModal({
  store,
  onUpdate,
  onClose,
  onFeedback,
}: {
  store: IStore;
  onUpdate: () => void;
  onClose: () => void;
  onFeedback: (msg: string) => void;
}) {
  const [name, setName] = useState(store.name);
  const [storeId, setStoreId] = useState(store.id?.toString() || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stores, setStores] = useState<IStore[]>([]);

  // Fetch toko untuk dropdown
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stores`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || "dummy"}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStores(data.data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${store.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
            role,
            storeId: role === "STORE_ADMIN" ? Number(storeId) : null,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        onUpdate();
        onFeedback("User berhasil diupdate!");
        onClose();
      } else {
        setError(data.message || "Gagal update store");
        onFeedback("Gagal update store.");
      }
    } catch {
      setError("Gagal koneksi ke server");
      onFeedback("Gagal update store (server error).");
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
        <h2 className="text-xl font-bold text-center">Edit User</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <input
          className="w-full border rounded p-2"
          placeholder="Nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <select
          className="w-full border rounded p-2"
          value={role}
          onChange={(e) =>
            setRole(e.target.value as "SUPER_ADMIN" | "STORE_ADMIN")
          }
        >
          <option value="STORE_ADMIN">Store Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
        {role === "STORE_ADMIN" && (
          <>
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
          </>
        )}
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
