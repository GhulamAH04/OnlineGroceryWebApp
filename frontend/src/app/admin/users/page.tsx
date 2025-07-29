// OnlineGroceryWebApp/frontend/src/app/admin/users/page.tsx

"use client";

// === IMPORTS ===
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "@/lib/axios";

import { userAdminSchema } from "@/schemas/userAdminManagement.schema";
import type { UserAdminInput } from "@/schemas/userAdminManagement.schema";
import type { UserAdmin } from "@/interfaces/userAdmin";
import ConfirmModal from "@/components/features2/common/ConfirmModal";

// === PAGE COMPONENT ===
export default function UserManagementPage() {
  // === STATE ===
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editBranchName, setEditBranchName] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  // === FORM SETUP ===
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userAdminSchema),
    context: { isEdit: !!editId },
  });

  // === FETCH USERS ===
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/users");
      setUsers(res.data.data);
    } catch {
      toast.error("Gagal memuat data user");
    }
  };

  // === FETCH BRANCHES ===
  const fetchBranches = async () => {
    try {
      const res = await axios.get("/admin/users/branches");
      setBranches(res.data.data);
    } catch {
      toast.error("Gagal memuat data cabang");
    }
  };

  // === FETCH STORE==
  const fetchBranches = async () => {
    try {
      const res = await axios.get("/admin/users/branches");
      setBranches(res.data.data);
    } catch {
      toast.error("Gagal memuat data cabang");
    }
  };

  // === ON LOAD ===
  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, []);

  // === HANDLE SUBMIT ===
  const onSubmit = async (data: UserAdminInput) => {
    try {
      if (editId) {
        // === UPDATE MODE ===
        await axios.put(`/admin/users/${editId}`, {
          email: data.email,
          username: data.username,
          role: "STORE_ADMIN",
        });
        toast.success("User diperbarui");
      } else {
        // === CREATE MODE ===
        await axios.post("/admin/users", {
          email: data.email,
          username: data.username,
          password: data.password,
          role: "STORE_ADMIN",
          branchId: Number(data.branchId),
        });
        toast.success("User ditambahkan");
      }
      reset();
      setEditId(null);
      fetchUsers();
    } catch {
      toast.error("Gagal menyimpan user");
    }
  };

  // === HANDLE EDIT ===
  const handleEdit = (user: UserAdmin) => {
    setEditId(user.id);
    setValue("email", user.email);
    setValue("username", user.username || "");
    setValue("branchId", user.branchId || 0);
    setEditBranchName(user.branchName || null);
  };

  // === HANDLE DELETE ===
  const handleDelete = async () => {
    try {
      await axios.delete(`/admin/users/${confirmId}`);
      toast.success("User dihapus");
      fetchUsers();
    } catch {
      toast.error("Gagal menghapus user");
    } finally {
      setConfirmId(null);
    }
  };

  // === SEARCH ===
  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // === RENDER ===
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-green-700">User Management</h1>

      {/* === SEARCH INPUT === */}
      <input
        placeholder="Cari user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded bg-white"
      />

      {/* === FORM CREATE/EDIT === */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-green-50 border border-green-200 rounded p-4 space-y-4"
      >
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            {...register("email")}
            className="w-full px-3 py-2 border rounded"
          />
          <p className="text-sm text-red-500">{errors.email?.message}</p>
        </div>

        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            {...register("username")}
            className="w-full px-3 py-2 border rounded"
          />
          <p className="text-sm text-red-500">{errors.username?.message}</p>
        </div>

        {editId ? (
          <div>
            <label className="block mb-1 font-medium">Cabang</label>
            <input
              disabled
              value={editBranchName || "-"}
              className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-500"
            />
          </div>
        ) : (
          <>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                {...register("password")}
                className="w-full px-3 py-2 border rounded"
              />
              <p className="text-sm text-red-500">{errors.password?.message}</p>
            </div>

            <div>
              <label className="block mb-1 font-medium">Cabang</label>
              <select
                {...register("branchId")}
                className="w-full px-3 py-2 border rounded bg-white"
              >
                <option value="">Pilih Cabang</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-red-500">{errors.branchId?.message}</p>
            </div>
          </>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {editId ? "Update" : "Tambah"} User
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                reset();
              }}
              className="text-gray-600 underline"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* === TABEL DATA USER === */}
      <table className="w-full border mt-4">
        <thead className="bg-green-100">
          <tr>
            <th className="text-left p-2 border">Email</th>
            <th className="text-left p-2 border">Username</th>
            <th className="text-left p-2 border">Cabang</th>
            <th className="text-center p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                Tidak ada data user
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-green-50">
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.username}</td>
                <td className="p-2 border">{user.branchName || "-"}</td>
                <td className="p-2 border text-center space-x-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => setConfirmId(user.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* === MODAL KONFIRMASI HAPUS === */}
      <ConfirmModal
        open={!!confirmId}
        onCancel={() => setConfirmId(null)}
        onConfirm={handleDelete}
        title="Hapus User"
        description="Yakin ingin menghapus user ini?"
        confirmText="Hapus"
        cancelText="Batal"
      />
    </div>
  );
}
