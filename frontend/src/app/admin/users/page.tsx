// === USER MANAGEMENT PAGE ===
// OnlineGroceryWebApp/frontend/src/app/admin/users/page.tsx

"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "@/lib/axios";
import { getRoleFromToken } from "@/utils/getRoleFromToken";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import { userAdminSchema } from "@/schemas/userAdminManagement.schema";
import type { UserAdminInput } from "@/schemas/userAdminManagement.schema";
import type { UserAdmin } from "@/interfaces/userAdmin";
import type { PaginationResponse } from "@/interfaces/pagination";
import ConfirmModal from "@/components/features2/common/ConfirmModal";

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const [pagination, setPagination] =
    useState<PaginationResponse<UserAdmin>["pagination"]>();
  const [editId, setEditId] = useState<number | null>(null);
  const [editBranchName, setEditBranchName] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("username");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [role, setRole] = useState<"SUPER_ADMIN" | "STORE_ADMIN" | null>(null);

  const debouncedSearch = useDebounceSearch(search);

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

  useEffect(() => {
    const userRole = getRoleFromToken();
    setRole(userRole);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get<PaginationResponse<UserAdmin>>(
        "/admin/users",
        {
          params: {
            search: debouncedSearch,
            page,
            limit: 10,
            sortBy,
            sortOrder,
          },
        }
      );
      setUsers(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error("Gagal memuat data user");
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await axios.get("/admin/users/branches");
      setBranches(res.data.data);
    } catch {
      toast.error("Gagal memuat data cabang");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, [debouncedSearch, page, sortBy, sortOrder]);

  const onSubmit = async (data: UserAdminInput) => {
    try {
      if (editId) {
        await axios.put(`/admin/users/${editId}`, {
          email: data.email,
          username: data.username,
          role: "STORE_ADMIN",
        });
        toast.success("User diperbarui");
      } else {
        await axios.post("/admin/users", {
          email: data.email,
          username: data.username,
          password: data.password,
          branchId: Number(data.branchId),
          role: "STORE_ADMIN",
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

  const handleEdit = (user: UserAdmin) => {
    setEditId(user.id);
    setValue("email", user.email);
    setValue("username", user.username || "");
    setValue("branchId", user.branchId || 0);
    setEditBranchName(user.branchName || null);
  };

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

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-green-700 text-center">
          User Management
        </h1>

        {/* === SEARCH & SORT === */}
        <div className="mb-4 flex flex-col md:flex-row gap-2 justify-between items-center">
          <input
            type="text"
            placeholder="Cari user..."
            className="border rounded p-2 w-full md:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="border rounded p-2"
          >
            <option value="asc">A - Z</option>
            <option value="desc">Z - A</option>
          </select>
        </div>

        {/* === FORM TAMBAH / EDIT === */}
        {role === "SUPER_ADMIN" && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          >
            <div>
              <input
                {...register("email")}
                placeholder="Email"
                className="w-full px-3 py-2 border rounded"
              />
              <p className="text-sm text-red-500">{errors.email?.message}</p>
            </div>
            <div>
              <input
                {...register("username")}
                placeholder="Username"
                className="w-full px-3 py-2 border rounded"
              />
              <p className="text-sm text-red-500">{errors.username?.message}</p>
            </div>

            {!editId && (
              <>
                <div>
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="Password"
                    className="w-full px-3 py-2 border rounded"
                  />
                  <p className="text-sm text-red-500">
                    {errors.password?.message}
                  </p>
                </div>
                <div>
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
                  <p className="text-sm text-red-500">
                    {errors.branchId?.message}
                  </p>
                </div>
              </>
            )}

            {editId && (
              <div className="md:col-span-2">
                <input
                  disabled
                  value={editBranchName || "-"}
                  className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-500"
                />
              </div>
            )}

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white w-full py-2 rounded"
              >
                {editId ? "Update" : "Tambah"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    reset();
                  }}
                  className="bg-gray-300 text-gray-800 w-full py-2 rounded"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        )}

        {role === "STORE_ADMIN" && (
          <p className="text-sm text-gray-500 italic mb-4 text-center">
            Anda hanya memiliki akses baca user (read-only).
          </p>
        )}

        {/* === TABEL === */}
        <table className="w-full border text-sm">
          <thead className="bg-green-100">
            <tr>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => toggleSort("email")}
              >
                Email
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => toggleSort("username")}
              >
                Username
              </th>
              <th className="p-2 border">Cabang</th>
              {role === "SUPER_ADMIN" && <th className="p-2 border">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border">
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user.branchName || "-"}</td>
                {role === "SUPER_ADMIN" && (
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmId(user.id)}
                      className="text-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* === PAGINATION === */}
        {pagination && (
          <div className="flex justify-between items-center mt-4 text-sm">
            <p>
              Halaman {pagination.page} dari {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={pagination.page === 1}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() =>
                  setPage((prev) =>
                    prev < pagination.totalPages ? prev + 1 : prev
                  )
                }
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* === MODAL KONFIRMASI HAPUS === */}
        {confirmId && role === "SUPER_ADMIN" && (
          <ConfirmModal
            open={Boolean(confirmId)}
            onCancel={() => setConfirmId(null)}
            onConfirm={handleDelete}
            title="Hapus User"
            description="Yakin ingin menghapus user ini?"
          />
        )}
      </div>
    </div>
  );
}
