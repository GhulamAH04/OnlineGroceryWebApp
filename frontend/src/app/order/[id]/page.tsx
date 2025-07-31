"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  cancelOrder,
  confirmOrder,
  getOrders,
  uploadPaymentProof,
} from "@/stores/order.store";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Payment proof
  const [paymentProof, setPaymentProof] = useState<File | null>(null);

  // Fetch order
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getOrders(1, id)
      .then((res) => {
        // data dari getOrders bentuk array, ambil [0]
        const orderData = Array.isArray(res) ? res[0] : res;
        setOrder(orderData || null);
      })
      .catch(() => setError("Gagal mengambil data order"))
      .finally(() => setLoading(false));
  }, [id]);

  // Handle payment proof upload
  const handleUploadPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!paymentProof || !order) return;
    setUploading(true);
    setError(null);
    try {
      await uploadPaymentProof(order.id, paymentProof);
      alert("Bukti transfer berhasil diupload!");
      // Refresh data
      const res = await getOrders(1, order.id);
      setOrder(Array.isArray(res) ? res[0] : res);
      setPaymentProof(null);
    } catch {
      setError("Upload bukti transfer gagal");
    } finally {
      setUploading(false);
    }
  };

  // Handle cancel order
  const handleCancelOrder = async () => {
    if (!order) return;
    if (!confirm("Yakin ingin membatalkan pesanan ini?")) return;
    setCancelling(true);
    setError(null);
    try {
      await cancelOrder(order.id);
      alert("Pesanan berhasil dibatalkan.");
      // Refresh data
      const res = await getOrders(1, order.id);
      setOrder(Array.isArray(res) ? res[0] : res);
    } catch {
      setError("Gagal membatalkan pesanan");
    } finally {
      setCancelling(false);
    }
  };

  // Handle confirm order
  const handleConfirmOrder = async () => {
    if (!order) return;
    if (!confirm("Yakin ingin mengkonfirmasi pesanan ini?")) return;
    setConfirming(true);
    setError(null);
    try {
      await confirmOrder(order.id);
      alert("Pesanan berhasil dikonfirmasi.");
      // Refresh data
      const res = await getOrders(1, order.id);
      setOrder(Array.isArray(res) ? res[0] : res);
    } catch {
      setError("Gagal mengkonfirmasi pesanan");
    } finally {
      setConfirming(false);
    }
  };

  // Status mapping
  const getStatus = (o: any) => {
    if (o.paymentStatus === "CANCELED") return "Dibatalkan";
    if (o.paymentStatus === "UNPAID") return "Menunggu Pembayaran";
    if (o.paymentStatus === "PAID" && !o.shippedAt) return "Sedang Diproses";
    if (o.paymentStatus === "PAID" && o.shippedAt) return "Dikirim";
    return o.paymentStatus;
  };

  // Format date
  const formatDate = (d?: string | null) =>
    d
      ? new Date(d).toLocaleString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!order)
    return <div className="p-6 text-gray-500">Order tidak ditemukan</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <button
          className="text-green-600 hover:underline text-sm"
          onClick={() => router.back()}
        >
          &larr; Kembali ke daftar order
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-3">
        Detail Pesanan: {order.name || order.id}
      </h2>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="mb-2">
              <span className="font-semibold">Status:</span>{" "}
              <span className="inline-block px-2 py-1 rounded text-sm font-bold bg-gray-100">
                {getStatus(order)}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Tanggal Order:</span>{" "}
              {formatDate(order.createdAt)}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Toko:</span>{" "}
              {order.branchs?.name || "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Alamat Pengiriman:</span>
              <div className="text-gray-700 text-sm ml-2">
                <div>{order.addresses?.name}</div>
                <div>{order.addresses?.address}</div>
                <div>
                  {order.addresses?.districtId} - {order.addresses?.cityId} -{" "}
                  {order.addresses?.provinceId} {order.addresses?.postalCode}
                </div>
                <div>{order.addresses?.phone}</div>
              </div>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Kurir:</span>{" "}
              {order.courier || "-"}
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-2">
              <span className="font-semibold">Metode Pembayaran:</span>{" "}
              {order.paymentMethod}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Total Produk:</span>{" "}
              {order.order_products.reduce(
                (a: any, b: any) => a + b.quantity,
                0
              )}{" "}
              produk
            </div>
            <div className="mb-2">
              <span className="font-semibold">Total Belanja:</span> Rp
              {order.total.toLocaleString("id-ID")}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Ongkir:</span> Rp
              {(order.shippingCost || 0).toLocaleString("id-ID")}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Bukti Transfer:</span>{" "}
              {order.paymentProof ? (
                <a
                  href={order.paymentProof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  Lihat Bukti
                </a>
              ) : (
                <span className="text-gray-500">Belum ada</span>
              )}
            </div>
            {order.paymentStatus === "UNPAID" && (
              <div className="mb-2">
                <span className="font-semibold">Batas Bayar:</span>{" "}
                <span className="text-red-500">
                  {formatDate(order.expirePayment)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Produk */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="font-bold mb-4">Daftar Produk</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-2">Produk ID</th>
              <th className="py-2 px-2">Jumlah</th>
              <th className="py-2 px-2">Harga Satuan</th>
              <th className="py-2 px-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.order_products.map((item: any) => (
              <tr key={item.id}>
                <td className="py-2 px-2">{item.productId}</td>
                <td className="py-2 px-2">{item.quantity}</td>
                <td className="py-2 px-2">
                  Rp{item.price.toLocaleString("id-ID")}
                </td>
                <td className="py-2 px-2">
                  Rp{item.total.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action: Upload Bukti Transfer */}
      {order.paymentStatus === "UNPAID" && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="font-bold mb-3">Upload Bukti Transfer</h3>
          <form onSubmit={handleUploadPayment} className="flex flex-col gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
              required
              className="border rounded px-3 py-2"
            />
            <button
              type="submit"
              className="bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 disabled:bg-gray-400"
              disabled={uploading || !paymentProof}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
      )}

      {/* Action: Cancel Order */}
      {order.paymentStatus === "UNPAID" && (
        <div className="mb-8">
          <button
            onClick={handleCancelOrder}
            className="bg-red-600 text-white px-5 py-2 rounded font-bold hover:bg-red-700 disabled:bg-gray-400"
            disabled={cancelling}
          >
            {cancelling ? "Membatalkan..." : "Batalkan Pesanan"}
          </button>
        </div>
      )}
      {/* Action: Confirm Order */}
      {/* bisa tambahkan kondisi !order.shippedAt && */}
      {order.paymentStatus === "PAID" && (
        <div className="mb-8">
          <button
            onClick={handleConfirmOrder}
            className="bg-blue-600 text-white px-5 py-2 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
            disabled={confirming}
          >
            {confirming ? "Mengkonfirmasi..." : "Konfirmasi Pesanan"}
          </button>
        </div>
      )}
      {/* Show Button Disabled order is DELIVERED */}
      {order.paymentStatus === "DELIVERED" && (
        <div className="mb-8">
          <button
            className="bg-gray-400 text-white px-5 py-2 rounded font-bold cursor-not-allowed"
            disabled
          >
            Pesanan Sudah Diterima
          </button>
        </div>
      )}
    </div>
  );
}
