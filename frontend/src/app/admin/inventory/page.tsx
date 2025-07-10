"use client";
import { useEffect, useState } from "react";
import InventoryTable from "@/components/features2/inventory/InventoryTable";
import AddInventoryModal from "@/components/features2/inventory/AddInventoryModal";
import EditInventoryModal from "@/components/features2/inventory/EditInventoryModal";
import InventoryJournalModal from "@/components/features2/inventory/InventoryJournalModal";
import { Inventory } from "@/interfaces";
import AdminLayout from "@/components/features2/dashboard/LayoutAdmin";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editInventory, setEditInventory] = useState<Inventory | null>(null);
  const [journalInventory, setJournalInventory] = useState<Inventory | null>(
    null
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  // Fetch inventory
  const fetchInventory = () => {
    const token = localStorage.getItem("token") || "dummy";
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory?search=${encodeURIComponent(
        search
      )}&page=${page}&limit=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => res.json())
      .then((data) => {
        setInventory(data.data?.data || []);
        setTotalPages(data.data?.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  return (
    <AdminLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Inventory Management
          </h1>
          <p className="mb-4 text-center">
            Kelola stok produk per toko dan history perubahan stok
          </p>

          {/* Feedback */}
          {feedback && (
            <div className="mb-4 text-center bg-green-50 border border-green-300 text-green-700 px-4 py-2 rounded">
              {feedback}
            </div>
          )}

          {/* Tambah Stok */}
          <div className="mb-4 flex justify-end">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => setShowAddModal(true)}
            >
              + Tambah Stok
            </button>
          </div>

          {/* Search & Pagination */}
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Cari produk/toko..."
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

          {/* Modals */}
          {showAddModal && (
            <AddInventoryModal
              onAdd={fetchInventory}
              onClose={() => setShowAddModal(false)}
              onFeedback={showFeedback}
            />
          )}
          {editInventory && (
            <EditInventoryModal
              inventory={editInventory}
              onUpdate={fetchInventory}
              onClose={() => setEditInventory(null)}
              onFeedback={showFeedback}
            />
          )}
          {journalInventory && (
            <InventoryJournalModal
              inventory={journalInventory}
              onClose={() => setJournalInventory(null)}
            />
          )}

          {/* Table */}
          {loading ? (
            <p>Loading data inventory...</p>
          ) : (
            <InventoryTable
              inventory={inventory}
              onEdit={setEditInventory}
              onViewJournal={setJournalInventory}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
