"use client";
import { Discount } from "@/interfaces";

export default function DiscountTable({
  discounts,
  onEdit,
  onDelete,
}: {
  discounts: Discount[];
  onEdit: (discount: Discount) => void;
  onDelete: (discount: Discount) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow">
        <thead>
          <tr>
            <th className="p-3 border">Nama Diskon</th>
            <th className="p-3 border">Produk</th>
            <th className="p-3 border">Toko</th>
            <th className="p-3 border">Tipe</th>
            <th className="p-3 border">Nilai</th>
            <th className="p-3 border">Periode</th>
            <th className="p-3 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((d) => (
            <tr key={d.id} className="hover:bg-gray-100">
              <td className="p-3 border">{d.name}</td>
              <td className="p-3 border">{d.productName ?? d.productId}</td>
              <td className="p-3 border">{d.storeName ?? d.storeId}</td>
              <td className="p-3 border">{d.type}</td>
              <td className="p-3 border">
                {d.percentage ? `${d.value}%` : `Rp${d.value.toLocaleString()}`}
                {d.type === "MIN_PURCHASE" && d.minPurchase
                  ? ` (min. Rp${d.minPurchase.toLocaleString()})`
                  : ""}
                {d.type === "MIN_PURCHASE" && d.maxDiscount
                  ? ` (max. Rp${d.maxDiscount.toLocaleString()})`
                  : ""}
                {d.type === "BUY1GET1" ? " (Beli 1 Gratis 1)" : ""}
              </td>
              <td className="p-3 border">
                {d.startDate && d.endDate
                  ? `${new Date(d.startDate).toLocaleDateString()} - ${new Date(
                      d.endDate
                    ).toLocaleDateString()}`
                  : "-"}
              </td>
              <td className="p-3 border">
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => onEdit(d)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                  onClick={() => onDelete(d)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
