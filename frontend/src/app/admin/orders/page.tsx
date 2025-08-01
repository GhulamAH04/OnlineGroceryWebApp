// admin/OrderPage.tsx
"use client";
import {
  cancelOrderAdmin,
  ConfirmPaymentAdmin,
  getOrdersAdmin,
  shipOrderAdmin,
} from "@/stores/admin.order.store";
import React, { useEffect, useState } from "react";

type Order = {
  id: number;
  name: string;
  paymentStatus: string;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  paymentProof: string | null;
  expirePayment: string;
  branchId: number;
  userId: number;
  addressId: number;
  courier: string;
  shippedAt: string | null;
  cancellationSource: string | null;
  createdAt: string;
  updatedAt: string;
  users: {
    id: number;
    username: string;
    email: string;
    image: string | null;
  };
  branchs: {
    id: number;
    name: string;
    address: string;
    phone: string;
  };
  addresses: {
    name: string;
    address: string;
    phone: string;
  };
  order_products: Array<{
    id: number;
    quantity: number;
    price: number;
    total: number;
    productId: number;
  }>;
};

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Bisa dijadikan dropdown jika perlu
  const [totalPage, setTotalPage] = useState(1);

  // For action loading
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await getOrdersAdmin(page, limit);
      setOrders(res.data || []);
      setTotalPage(res?.pagination?.totalPage || 1);
    } catch (e) {
      alert("Gagal mengambil data orders!");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [page]);

  const handleConfirmPayment = async (id: number) => {
    setActionLoading(id);
    try {
      await ConfirmPaymentAdmin(id, "PROCESSING");
      alert("Konfirmasi pembayaran berhasil");
      fetchOrders();
    } catch {
      alert("Gagal konfirmasi pembayaran");
    } finally {
      setActionLoading(null);
    }
  };

  const handleShipOrder = async (id: number) => {
    setActionLoading(id);
    try {
      await shipOrderAdmin(id);
      alert("Order dikirim!");
      fetchOrders();
    } catch {
      alert("Gagal mengirim order");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelOrder = async (id: number) => {
    if (!confirm("Yakin batalkan order?")) return;
    setActionLoading(id);
    try {
      await cancelOrderAdmin(id);
      alert("Order dibatalkan");
      fetchOrders();
    } catch {
      alert("Gagal membatalkan order");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-green-700 text-center">
          Order Management
        </h1>

        {loading ? (
          <div className="text-center py-10">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-green-50">
                  <th className="py-2 px-3 border">Order ID</th>
                  <th className="py-2 px-3 border">Customer</th>
                  <th className="py-2 px-3 border">Order Date</th>
                  <th className="py-2 px-3 border">Status</th>
                  <th className="py-2 px-3 border">Total</th>
                  <th className="py-2 px-3 border">Branch</th>
                  <th className="py-2 px-3 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-2 px-3 border">{order.name}</td>
                      <td className="py-2 px-3 border">
                        <div>
                          <div className="font-semibold">
                            {order.users?.username}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.users?.email}
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-3 border">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 border">
                        <span
                          className={
                            "px-2 py-1 rounded-full text-xs " +
                            (order.paymentStatus === "PROCESSING"
                              ? "bg-green-200 text-green-700"
                              : order.paymentStatus === "PENDING"
                              ? "bg-yellow-200 text-yellow-700"
                              : order.paymentStatus === "CANCELED"
                              ? "bg-red-200 text-red-700"
                              : "")
                          }
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-2 px-3 border">
                        Rp {order.total.toLocaleString()}
                        <div className="text-xs text-gray-400">
                          Ongkir: Rp {order.shippingCost.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-2 px-3 border">
                        <div className="font-semibold">
                          {order.branchs?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.branchs?.address}
                        </div>
                      </td>
                      <td className="py-2 px-3 border space-x-1">
                        {order.paymentStatus === "PENDING" && (
                          <button
                            className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                            onClick={() => handleConfirmPayment(order.id)}
                            disabled={actionLoading === order.id}
                          >
                            {actionLoading === order.id
                              ? "..."
                              : "Konfirmasi Bayar"}
                          </button>
                        )}
                        {order.paymentStatus === "PROCESSING" &&
                          !order.shippedAt && (
                            <button
                              className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                              onClick={() => handleShipOrder(order.id)}
                              disabled={actionLoading === order.id}
                            >
                              {actionLoading === order.id
                                ? "..."
                                : "Kirim Order"}
                            </button>
                          )}
                        {/* TOMBOL BATALKAN: hanya tampil jika status bukan PROCESSING dan bukan CANCELED */}
                        {order.paymentStatus !== "PROCESSING" &&
                          order.paymentStatus !== "CANCELED" &&
                          order.paymentStatus !== "DELIVERED" && (
                            <button
                              className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                              onClick={() => handleCancelOrder(order.id)}
                              disabled={actionLoading === order.id}
                            >
                              {actionLoading === order.id ? "..." : "Batalkan"}
                            </button>
                          )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* PAGINATION */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Previous
              </button>
              <span>
                Page <b>{page}</b> / {totalPage}
              </span>
              <button
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                disabled={page >= totalPage}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
