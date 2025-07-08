"use client";
import { Inventory } from "@/interfaces";

export default function InventoryTable({
  inventory,
  onEdit,
  onViewJournal,
}: {
  inventory: Inventory[];
  onEdit: (inv: Inventory) => void;
  onViewJournal: (inv: Inventory) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow">
        <thead>
          <tr>
            <th className="p-3 border">Produk</th>
            <th className="p-3 border">Toko</th>
            <th className="p-3 border">Stok</th>
            <th className="p-3 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((inv) => (
            <tr key={inv.id} className="hover:bg-gray-100">
              <td className="p-3 border">{inv.productName}</td>
              <td className="p-3 border">{inv.storeName}</td>
              <td className="p-3 border">{inv.currentStock}</td>
              <td className="p-3 border">
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => onEdit(inv)}
                >
                  Edit
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                  onClick={() => onViewJournal(inv)}
                >
                  Lihat History
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
