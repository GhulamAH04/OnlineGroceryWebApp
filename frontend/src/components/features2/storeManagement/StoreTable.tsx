"use client";
import { IStore } from "@/interfaces";

export default function StoreTable({
  stores,
  onEdit,
  onDelete,
}: {
  stores: IStore[];
  onEdit: (store: IStore) => void;
  onDelete: (store: IStore) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow">
        <thead>
          <tr>
            <th className="p-3 border">Nama</th>
            <th className="p-3 border">Admin Toko</th>
            <th className="p-3 border">Alamat</th>
            <th className="p-3 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id} className="hover:bg-gray-100">
              <td className="p-3 border">{store.name}</td>
              <td className="p-3 border">{store.userId}</td>
              <td className="p-3 border">{store.address}</td>
              <td className="p-3 border">
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => onEdit(store)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                  onClick={() => onDelete(store)}
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
