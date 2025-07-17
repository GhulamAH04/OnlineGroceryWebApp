"use client";
import { useEffect, useState } from "react";
import { Inventory, InventoryJournal } from "@/interfaces";

export default function InventoryJournalModal({
  inventory,
  onClose,
}: {
  inventory: Inventory;
  onClose: () => void;
}) {
  const [journals, setJournals] = useState<InventoryJournal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/${inventory.id}/journal`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setJournals(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [inventory.id]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl space-y-4">
        <h2 className="text-xl font-bold text-center mb-2">
          History Jurnal Stok — {inventory.productName} ({inventory.storeName})
        </h2>
        <button
          onClick={onClose}
          className="mb-4 px-4 py-2 bg-gray-300 rounded block mx-auto"
        >
          Tutup
        </button>
        {loading ? (
          <p className="text-center">Loading jurnal stok...</p>
        ) : (
          <table className="min-w-full bg-white rounded-xl shadow text-sm">
            <thead>
              <tr>
                <th className="p-2 border">Tanggal</th>
                <th className="p-2 border">Aksi</th>
                <th className="p-2 border">Jumlah</th>
                <th className="p-2 border">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {journals.map((j) => (
                <tr key={j.id}>
                  <td className="p-2 border">
                    {new Date(j.createdAt).toLocaleString()}
                  </td>
                  <td className="p-2 border">{j.action}</td>
                  <td className="p-2 border">{j.amount}</td>
                  <td className="p-2 border">{j.note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
