"use client";
import { User } from "@/interfaces";

export default function UserTable({
  users,
  onEdit,
  onDelete,
}: {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow">
        <thead>
          <tr>
            <th className="p-3 border">Nama</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Role</th>
            <th className="p-3 border">Store</th>
            <th className="p-3 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-100">
              <td className="p-3 border">{u.name}</td>
              <td className="p-3 border">{u.email}</td>
              <td className="p-3 border">{u.role.replace("_", " ")}</td>
              <td className="p-3 border">{u.storeId ?? "-"}</td>
              <td className="p-3 border">
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => onEdit(u)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                  onClick={() => onDelete(u)}
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
