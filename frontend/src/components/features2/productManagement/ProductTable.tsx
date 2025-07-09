// ProductTable.tsx
"use client";
import Image from "next/image";
import { Product } from "@/interfaces";

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow">
        <thead>
          <tr>
            <th className="p-3 border">Nama Produk</th>
            <th className="p-3 border">Harga</th>
            <th className="p-3 border">Stok</th>
            <th className="p-3 border">Gambar</th>
            <th className="p-3 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-100">
              <td className="p-3 border">{p.name}</td>
              <td className="p-3 border">Rp{p.price.toLocaleString()}</td>
              <td className="p-3 border">{p.currentStock ?? "-"}</td>
              <td className="p-3 border">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={48}
                    height={48}
                    className="object-cover rounded"
                  />
                ) : (
                  "-"
                )}
              </td>
              <td className="p-3 border">
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => onEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                  onClick={() => onDelete(p)}
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
