"use client";
import { useEffect, useState } from "react";
import { IStore, IUser } from "@/interfaces";
import axios from "axios";
import { apiUrl } from "@/config";

export default function AssignStoreModal({
  store,
  onAssign,
  onClose,
}: {
  store: IStore;
  onAssign: () => void;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/users`);
      const users = response.data.data;
      const storeAdmins = users.filter((user: IUser) => user.role === "STORE_ADMIN" ) || null;
      setUsers(storeAdmins);
    } catch (err) {
      alert("Failed to fetch users:" + err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAssign = async () => {
    setLoading(true);
    try {
      await axios.patch(`${apiUrl}/api/stores/${store.id}`, {
        userId: selectedUser?.id
      });
      onAssign();
      onClose();
      setLoading(false);
      alert("Berhasil memasukkan admin ke toko!");
    } catch {
      alert("Gagal memasukkan admin ke toko.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-center text-red-600">
          Assign Admin Toko
        </h2>
        <p className="text-center">
          Pilih admin untuk toko <b>{store.name}</b>?
        </p>
        <div>
          <select
            className="w-full border rounded p-2 mb-2"
            value={selectedUser?.id || ""}
            onChange={(e) =>
              setSelectedUser(
                users.find((user) => user.id === Number(e.target.value)) || null
              )
            }
            required
          >
            <option value="">Pilih Admin Toko</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
        </div>
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
            onClick={handleAssign}
            className="px-4 py-2 bg-red-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
