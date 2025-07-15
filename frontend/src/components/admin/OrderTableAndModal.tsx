// FILE: frontend/src/components/admin/OrderTableAndModal.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Tipe data dari API admin
interface OrderAdmin {
  id: number;
  name: string;
  createdAt: string;
  total: number;
  paymentStatus: string;
  user: { email: string };
  branch: { name: string };
  paymentProof?: string | null;
  // ...tambahkan field lain dari `getOrderDetails` jika perlu
}

interface OrderTableProps {
  orders: OrderAdmin[];
  // ...props lain seperti pagination, sort
}

// Modal Component
function OrderDetailModal({
  order,
  onClose,
  onActionSuccess,
}: {
  order: OrderAdmin;
  onClose: () => void;
  onActionSuccess: () => void;
}) {
  const handleAction = async (
    action: "confirm" | "reject" | "ship" | "cancel"
  ) => {
    const endpoints = {
      confirm: `/api/admin/orders/${order.id}/confirm-payment`,
      reject: `/api/admin/orders/${order.id}/confirm-payment`,
      ship: `/api/admin/orders/${order.id}/ship`,
      cancel: `/api/admin/orders/${order.id}/cancel`,
    };
    const body =
      action === "confirm"
        ? { action: "confirm" }
        : action === "reject"
        ? { action: "reject" }
        : {};

    if (!window.confirm(`Anda yakin ingin ${action} pesanan ini?`)) return;

    try {
      await axios.post(endpoints[action], body);
      alert(`Aksi ${action} berhasil.`);
      onActionSuccess();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal melakukan aksi.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Detail Pesanan {order.name}</h2>
        <p>Email User: {order.user.email}</p>
        <p>Total: Rp {order.total.toLocaleString("id-ID")}</p>
        <p>Status: {order.paymentStatus}</p>

        {order.paymentProof && (
          <div className="my-4">
            <h3 className="font-semibold">Bukti Pembayaran</h3>
            <Image
              src={`http://localhost:8000/${order.paymentProof}`}
              alt="Bukti Bayar"
              width={300}
              height={400}
              className="rounded-md mt-2 object-contain"
            />
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {order.paymentStatus === "PROCESSING" && (
            <>
              <button
                onClick={() => handleAction("confirm")}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Setujui Pembayaran
              </button>
              <button
                onClick={() => handleAction("reject")}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Tolak Pembayaran
              </button>
            </>
          )}
          {order.paymentStatus === "PAID" && (
            <button
              onClick={() => handleAction("ship")}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Kirim Pesanan
            </button>
          )}
          {["UNPAID", "PROCESSING", "PAID"].includes(order.paymentStatus) && (
            <button
              onClick={() => handleAction("cancel")}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Batalkan Pesanan
            </button>
          )}
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// Table Component
export default function OrderTable({ orders }: OrderTableProps) {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<OrderAdmin | null>(null);

  const fetchFullOrderDetail = async (orderId: number) => {
    try {
      // API detail untuk admin mungkin berbeda, atau bisa pakai yang user punya
      const res = await axios.get(`/api/orders/${orderId}`);
      setSelectedOrder(res.data);
    } catch (error) {
      alert("Gagal mengambil detail pesanan");
    }
  };

  const handleActionSuccess = () => {
    setSelectedOrder(null);
    router.refresh(); // Muat ulang data tabel
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Rp {order.total.toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.paymentStatus}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => fetchFullOrderDetail(order.id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Lihat Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onActionSuccess={handleActionSuccess}
        />
      )}
    </>
  );
}
