"use client";
import { useState } from "react";

export default function AddUserModal({
  onAdd,
  onClose,
  onFeedback,
}: {
  onAdd: () => void;
  onClose: () => void;
  onFeedback: (msg: string) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STORE_ADMIN");
  const [storeId, setStoreId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          role,
          storeId: storeId ? Number(storeId) : null,
          password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onAdd();
        onFeedback("User berhasil ditambahkan!");
        onClose();
      } else {
        setError(data.message || "Gagal tambah user");
        onFeedback("Gagal tambah user.");
      }
    } catch {
      setError("Gagal koneksi ke server");
      onFeedback("Gagal tambah user (server error).");
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
        <h2 className="text-xl font-bold text-center">Tambah User</h2>
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
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="STORE_ADMIN">Store Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
        {role === "STORE_ADMIN" && (
          <input
            className="w-full border rounded p-2"
            placeholder="Store ID"
            type="number"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            required
          />
        )}
        <input
          className="w-full border rounded p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Mengirim..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
