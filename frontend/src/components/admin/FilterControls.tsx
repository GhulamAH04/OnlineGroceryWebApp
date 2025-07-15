// FILE: frontend/src/components/admin/FilterControls.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Mock hook untuk auth
const useAuth = () => ({ user: { role: "SUPER_ADMIN" } });

// Tipe data Branch untuk dropdown
interface Branch {
  id: number;
  name: string;
}

export default function FilterControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [branchId, setBranchId] = useState(searchParams.get("branchId") || "");
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    // Jika Super Admin, fetch daftar cabang toko
    if (user.role === "SUPER_ADMIN") {
      // axios.get('/api/admin/branches').then(res => setBranches(res.data));
      // Mock data
      setBranches([
        { id: 1, name: "Toko Jakarta Pusat" },
        { id: 2, name: "Toko Bandung" },
      ]);
    }
  }, [user.role]);

  const handleApplyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (status) params.set("status", status);
    else params.delete("status");
    if (branchId) params.set("branchId", branchId);
    else params.delete("branchId");
    params.set("page", "1");
    router.push(`/admin/orders?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-end gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status Pesanan
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Semua Status</option>
          <option value="UNPAID">Belum Dibayar</option>
          <option value="PROCESSING">Diproses</option>
          <option value="PAID">Dibayar</option>
          <option value="SHIPPED">Dikirim</option>
          <option value="DELIVERED">Terkirim</option>
          <option value="CANCELED">Dibatalkan</option>
        </select>
      </div>

      {user.role === "SUPER_ADMIN" && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Toko Cabang
          </label>
          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Semua Cabang</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={handleApplyFilter}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Terapkan Filter
      </button>
    </div>
  );
}
