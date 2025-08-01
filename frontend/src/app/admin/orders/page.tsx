// admin/OrderPage.tsx
"use client";
import {
  cancelOrderAdmin,
  ConfirmPaymentAdmin,
  getOrdersAdmin,
  shipOrderAdmin,
} from "@/stores/admin.order.store";
import { getBranches } from "@/stores/branch.store";
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
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [branches, setBranches] = useState<Array<{ id: number; name: string }>>(
    []
  );
  const [selectedBranch, setSelectedBranch] = useState<number | "">("");

  // For action loading
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [actionLoadingRejected, setActionLoadingRejected] = useState<
    number | null
  >(null);

  async function fetchBranches() {
    try {
      const res = await getBranches();
      setBranches(res?.data || []);
    } catch (e) {
      alert("Gagal mengambil data branch!");
    }
  }

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await getOrdersAdmin(page, limit, selectedBranch as number);
      setOrders(res.data || []);
      setTotalPage(res?.pagination?.totalPage || 1);
    } catch (e) {
      alert("Gagal mengambil data orders!");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [page, selectedBranch]);

  const handleConfirmPayment = async (id: number, paymentProof: string) => {
    // if paymentProof null or undefined, set alert
    if (!paymentProof) {
      alert("User belum mengirim bukti bayar");
      return;
    }
    setActionLoading(id);
    try {
      await ConfirmPaymentAdmin(id, "PAID");
      alert("Konfirmasi pembayaran berhasil");
      fetchOrders();
    } catch {
      alert("Gagal konfirmasi pembayaran");
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmNotReceived = async (id: number) => {
    setActionLoadingRejected(id);
    try {
      await ConfirmPaymentAdmin(id, "REJECTED");
      alert("Pembayaran belum diterima");
      fetchOrders();
    } catch {
      alert("Gagal mengonfirmasi pembayaran belum diterima");
    } finally {
      setActionLoadingRejected(null);
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

        <div className="mb-4 flex gap-2 items-center">
          <label htmlFor="branch" className="font-medium">
            Filter Branch:
          </label>
          <select
            id="branch"
            className="border rounded px-2 py-1"
            value={selectedBranch}
            onChange={(e) => {
              setSelectedBranch(
                e.target.value === "" ? "" : Number(e.target.value)
              );
              setPage(1);
            }}
          >
            <option value="">Semua Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
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
                  <th className="py-2 px-3 border">Bukti Bayar</th>
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
                      <td className="py-2 px-3 border">
                        {order.paymentProof ? (
                          <a
                            href={order.paymentProof}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            Lihat Bukti
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-2 px-3 border space-x-1 flex items-center gap-2">
                        {order.paymentStatus === "PAID" && (
                          <button
                            className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                            onClick={() =>
                              handleConfirmPayment(
                                order.id,
                                order?.paymentProof ?? ""
                              )
                            }
                            disabled={actionLoading === order.id}
                          >
                            {actionLoading === order.id
                              ? "..."
                              : "Konfirmasi Bayar"}
                          </button>
                        )}
                        {order.paymentStatus === "PAID" && (
                          <button
                            className="bg-yellow-600 text-white px-3 py-1 rounded disabled:opacity-50"
                            onClick={() => handleConfirmNotReceived(order.id)}
                            disabled={actionLoadingRejected === order.id}
                          >
                            {actionLoadingRejected === order.id
                              ? "..."
                              : "Belum Menerima Pembayaran"}
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
                          order.paymentStatus !== "DELIVERED" &&
                          order.paymentStatus !== "PAID" && (
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
