// FILE: frontend/src/app/orders/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { debounce } from "lodash";

// Tipe data harus cocok dengan respons API dari `getMyOrders`
interface Order {
  id: number;
  name: string;
  createdAt: string;
  total: number;
  paymentStatus:
    | "UNPAID"
    | "PAID"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELED";
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const statusColors: { [key: string]: string } = {
  UNPAID: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  PAID: "bg-green-100 text-green-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELED: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || ""
  );

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError("");
    const params = new URLSearchParams(searchParams.toString());

    try {
      const response = await axios.get("/api/orders", { params });
      setOrders(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat riwayat pesanan.");
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus) {
      params.set("status", newStatus);
    } else {
      params.delete("status");
    }
    params.set("page", "1"); // Reset ke halaman pertama saat filter berubah
    router.push(`/orders?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/orders?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Riwayat Pesanan Saya</h1>
        <div>
          <select
            value={statusFilter}
            onChange={handleFilterChange}
            className="p-2 border rounded-md"
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
      </div>

      {isLoading && <p>Memuat...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && (
        <>
          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <Link href={`/orders/${order.id}`} key={order.id}>
                  <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg text-blue-700">
                          {order.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          statusColors[order.paymentStatus]
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="text-right mt-2">
                      <p className="text-gray-800 font-semibold">
                        Total: Rp {order.total.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>Anda belum memiliki pesanan.</p>
            )}
          </div>

          {/* Paginasi */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-md ${
                    pagination.page === page
                      ? "bg-blue-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
