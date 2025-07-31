"use client";
import { useEffect, useState } from "react";
import StoreTable from "@/components/features2/storeManagement/StoreTable";
import AddStoreModal from "@/components/features2/storeManagement/AddStoreModal";
import EditStoreModal from "@/components/features2/storeManagement/EditStoreModal";
import DeleteStoreModal from "@/components/features2/storeManagement/DeleteStoreModal";
import { IStore } from "@/interfaces";
import axios from "axios";
import { apiUrl } from "@/config";
import AssignStoreModal from "@/components/features2/storeManagement/AssignStoreModal";
import { getCookie } from "cookies-next";

export default function StoresPage() {
  const [stores, setStores] = useState<IStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editStore, setEditStore] = useState<IStore | null>(null);
  const [deleteStore, setDeleteStore] = useState<IStore | null>(null);
  const [assignStore, setAssignStore] = useState<IStore | null>(null);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const token = getCookie("access_token") as string;
      const { data } = await axios.get(`${apiUrl}/api/stores`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStores(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stores:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Store Management
        </h1>

        {/* Tambah Toko */}
        <div className="mb-4 flex justify-end">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setShowModal(true)}
          >
            + Tambah Toko
          </button>
        </div>

        {/* Search & Pagination Controls
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
        </div> */}

        {/* Modal */}
        {showModal && (
          <AddStoreModal
            isOpen={showModal}
            onAdd={fetchStores}
            onClose={() => setShowModal(false)}
          />
        )}
        {editStore && (
          <EditStoreModal
            store={editStore}
            onEdit={fetchStores}
            onClose={() => setEditStore(null)}
          />
        )}
        {deleteStore && (
          <DeleteStoreModal
            store={deleteStore}
            onDelete={fetchStores}
            onClose={() => setDeleteStore(null)}
          />
        )}
        {assignStore && (
          <AssignStoreModal
            store={assignStore}
            onAssign={fetchStores}
            onClose={() => setAssignStore(null)}
          />
        )}

        {/* Table */}
        {loading ? (
          <p>Loading data toko...</p>
        ) : (
          <StoreTable
            stores={stores}
            onEdit={setEditStore}
            onAssign={setAssignStore}
            onDelete={setDeleteStore}
          />
        )}
      </div>
    </div>
  );
}
