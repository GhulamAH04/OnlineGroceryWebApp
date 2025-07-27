"use client";
import { useEffect, useState } from "react";
import { User } from "@/interfaces";
import StoreTable from "@/components/features2/storeManagement/StoreTable";
import AddStoreModal from "@/components/features2/storeManagement/AddStoreModal";
import EditStoreModal from "@/components/features2/storeManagement/EditStoreModal";
import DeleteStoreModal from "@/components/features2/storeManagement/DeleteStoreModal";

export default function StoresPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  // Fetch user data
  const fetchUsers = () => {
    const token = localStorage.getItem("token") || "dummy";
    setLoading(true);
    fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/admin/users?search=${encodeURIComponent(search)}&page=${page}&limit=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.data?.data || []);
        setTotalPages(data.data?.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Store Management
        </h1>

        {/* Feedback/Notification */}
        {feedback && (
          <div className="mb-4 text-center bg-green-50 border border-green-300 text-green-700 px-4 py-2 rounded">
            {feedback}
          </div>
        )}

        {/* Tambah User */}
        <div className="mb-4 flex justify-end">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setShowModal(true)}
          >
            + Tambah Toko
          </button>
        </div>

        {/* Search & Pagination Controls */}
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Cari user..."
            className="border rounded p-2 w-1/3"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <div>
            <button
              className="px-3 py-1 bg-gray-300 rounded mr-2"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="font-semibold">
              {page} / {totalPages}
            </span>
            <button
              className="px-3 py-1 bg-gray-300 rounded ml-2"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <AddStoreModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
        {editUser && (
          <EditStoreModal
            user={editUser}
            onUpdate={fetchUsers}
            onClose={() => setEditUser(null)}
            onFeedback={showFeedback}
          />
        )}
        {deleteUser && (
          <DeleteStoreModal
            user={deleteUser}
            onDelete={fetchUsers}
            onClose={() => setDeleteUser(null)}
            onFeedback={showFeedback}
          />
        )}

        {/* Table */}
        {loading ? (
          <p>Loading data user...</p>
        ) : (
          <StoreTable
            users={users}
            onEdit={setEditUser}
            onDelete={setDeleteUser}
          />
        )}
      </div>
    </div>
  );
}
