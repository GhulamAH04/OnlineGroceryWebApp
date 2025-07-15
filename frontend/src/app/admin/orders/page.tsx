// FILE: frontend/src/app/admin/orders/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import FilterControls from "@/components/admin/FilterControls";
import OrderTableAndModal from "@/components/admin/OrderTableAndModal";

interface OrderAdmin {
  id: number;
  name: string;
  createdAt: string;
  total: number;
  paymentStatus: string;
  user: { email: string };
  branch: { name: string };
}
interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<OrderAdmin[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      const response = await axios.get("/api/admin/orders", { params });
      setOrders(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch admin orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchAdminOrders();
  }, [fetchAdminOrders]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manajemen Pesanan</h1>
      <FilterControls />
      {isLoading ? (
        <p>Memuat pesanan...</p>
      ) : (
        <OrderTableAndModal orders={orders} />
      )}
      {/* Di sini bisa ditambahkan komponen Paginasi untuk admin */}
    </div>
  );
}
