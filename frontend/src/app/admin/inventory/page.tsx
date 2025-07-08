"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InventoryTable from "@/components/inventory/InventoryTable";
import AddInventoryModal from "@/components/inventory/AddInventoryModal";
import EditInventoryModal from "@/components/inventory/EditInventoryModal";
import InventoryJournalModal from "@/components/inventory/InventoryJournalModal";
import { Inventory } from "@/interfaces";


export default function InventoryPage() {
  const router = useRouter();
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editInventory, setEditInventory] = useState<Inventory | null>(null);
  const [journalInventory, setJournalInventory] = useState<Inventory | null>(
    null
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };
  const fetchInventory = () => {
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   router.push("/admin/login");
    //   return;
    // }
    const token = localStorage.getItem("token") || "dummy";

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setInventory(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  /*
  const fetchInventory = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setInventory(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };
*/
  useEffect(() => {
    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Inventory Management
        </h1>
        <p className="mb-4 text-center">
          Kelola stok produk per toko dan history perubahan stok
        </p>

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
            + Tambah Stok
          </button>
        </div>

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
  );
}
