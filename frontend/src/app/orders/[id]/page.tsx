// FILE: frontend/src/app/orders/[id]/page.tsx
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

// Tipe data yang lebih detail, cocok dengan respons API getOrderDetails
interface OrderDetail {
  id: number;
  name: string;
  paymentStatus:
    | "UNPAID"
    | "PAID"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELED";
  total: number;
  shippingCost: number;
  courier: string | null;
  createdAt: string;
  paymentProof: string | null;
  address: {
    address: string;
    city: { name: string };
    province: { name: string };
    latitude: number;
    longitude: number;
  };
  orderProducts: {
    quantity: number;
    price: number;
    product: {
      name: string;
      image: string | null;
    };
  }[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchOrder = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`/api/orders/${id}`);
          setOrder(response.data);
        } catch (err: any) {
          setError(
            err.response?.data?.message || "Gagal memuat detail pesanan."
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadProof = async () => {
    if (!selectedFile || !id) return;
    const formData = new FormData();
    formData.append("paymentProof", selectedFile);

    try {
      await axios.post(`/api/orders/${id}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Bukti pembayaran berhasil diunggah!");
      router.refresh(); // Muat ulang data halaman
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal mengunggah bukti.");
    }
  };

  const handleCancelOrder = async () => {
    if (
      !id ||
      !window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")
    )
      return;
    try {
      await axios.post(`/api/orders/${id}/cancel`);
      alert("Pesanan berhasil dibatalkan.");
      router.refresh();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal membatalkan pesanan.");
    }
  };

  const handleConfirmDelivery = async () => {
    if (
      !id ||
      !window.confirm("Konfirmasi bahwa Anda telah menerima pesanan ini?")
    )
      return;
    try {
      await axios.post(`/api/orders/${id}/confirm-delivery`);
      alert("Konfirmasi penerimaan berhasil.");
      router.refresh();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal melakukan konfirmasi.");
    }
  };

  if (isLoading)
    return (
      <div className="container mx-auto p-8">Memuat detail pesanan...</div>
    );
  if (error)
    return <div className="container mx-auto p-8 text-red-500">{error}</div>;
  if (!order)
    return (
      <div className="container mx-auto p-8">Pesanan tidak ditemukan.</div>
    );

  const subtotal = order.total - order.shippingCost;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Detail Pesanan: {order.name}</h1>
      <p className="text-gray-600 mb-6">
        Status: <span className="font-semibold">{order.paymentStatus}</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Rincian Produk */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Produk yang Dipesan</h2>
            {order.orderProducts.map((op, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={op.product.image || "/product.jpg"}
                    alt={op.product.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                  <div>
                    <p>{op.product.name}</p>
                    <p className="text-sm text-gray-500">
                      {op.quantity} x Rp {op.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <p>Rp {(op.quantity * op.price).toLocaleString("id-ID")}</p>
              </div>
            ))}
          </div>

          {/* Detail Pengiriman */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Detail Pengiriman</h2>
            <p>
              <strong>Kurir:</strong> {order.courier || "N/A"}
            </p>
            <p>
              <strong>Alamat:</strong> {order.address.address},{" "}
              {order.address.city.name}, {order.address.province.name}
            </p>
            {/* Di sini bisa ditambahkan komponen peta kecil dengan library seperti react-leaflet */}
          </div>
        </div>

        <div className="space-y-6">
          {/* Ringkasan & Aksi */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Ringkasan Pembayaran</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim</span>
                <span>Rp {order.shippingCost.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total</span>
                <span>Rp {order.total.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Tombol Aksi Kondisional */}
            <div className="mt-6 space-y-4">
              {order.paymentStatus === "UNPAID" && (
                <div>
                  <h3 className="font-semibold mb-2">
                    Upload Bukti Pembayaran
                  </h3>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/jpg"
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                  />
                  {preview && (
                    <Image
                      src={preview}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="mt-2 rounded-md object-contain"
                    />
                  )}
                  <button
                    onClick={handleUploadProof}
                    disabled={!selectedFile}
                    className="w-full mt-2 bg-blue-600 text-white py-2 rounded-md disabled:bg-gray-400"
                  >
                    Kirim Bukti
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    className="w-full mt-2 bg-red-600 text-white py-2 rounded-md"
                  >
                    Batalkan Pesanan
                  </button>
                </div>
              )}
              {order.paymentStatus === "SHIPPED" && (
                <button
                  onClick={handleConfirmDelivery}
                  className="w-full bg-green-600 text-white py-2 rounded-md"
                >
                  Konfirmasi Pesanan Diterima
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
