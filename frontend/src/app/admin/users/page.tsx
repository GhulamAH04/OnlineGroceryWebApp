"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserTable from "@/components/UserTable";
import AddUserModal from "@/components/AddUserModal";
import EditUserModal from "@/components/EditUserModal";
import DeleteUserModal from "@/components/DeleteUserModal";
import { User } from "@/interfaces";

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  const fetchUsers = () => {
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   router.push("/admin/login");
    //   return;
    // }
    const token = localStorage.getItem("token") || "dummy";
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-center">User Management</h1>
        <p className="mb-4 text-center">Kelola admin dan store admin toko</p>

        {feedback && (
          <div className="mb-4 text-center bg-green-50 border border-green-300 text-green-700 px-4 py-2 rounded">
            {feedback}
          </div>
        )}

        <div className="mb-4 flex justify-end">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setShowAddModal(true)}
          >
            + Tambah User
          </button>
        </div>

        {showAddModal && (
          <AddUserModal
            onAdd={fetchUsers}
            onClose={() => setShowAddModal(false)}
            onFeedback={showFeedback}
          />
        )}
        {editUser && (
          <EditUserModal
            user={editUser}
            onUpdate={fetchUsers}
            onClose={() => setEditUser(null)}
            onFeedback={showFeedback}
          />
        )}
        {deleteUser && (
          <DeleteUserModal
            user={deleteUser}
            onDelete={fetchUsers}
            onClose={() => setDeleteUser(null)}
            onFeedback={showFeedback}
          />
        )}

        {loading ? (
          <p>Loading data user...</p>
        ) : (
          <UserTable
            users={users}
            onEdit={setEditUser}
            onDelete={setDeleteUser}
          />
        )}
      </div>
    </div>
  );
}
