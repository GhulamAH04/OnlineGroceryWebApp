// FILE: frontend/src/app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCartStore } from "@/stores/cart.store";
// Asumsi ada tipe data Address dari API
interface Address {
  id: number;
  name: string;
  address: string;
  city: { name: string };
  province: { name: string };
  isPrimary?: boolean;
}
interface CourierOption {
  code: string;
  name: string;
  costs: {
    service: string;
    description: string;
    cost: { value: number; etd: string }[];
  }[];
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, fetchCart } = useCartStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [courierOptions, setCourierOptions] = useState<CourierOption[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<string>("");
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("bank_transfer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Redirect jika keranjang kosong
    if (items.length === 0) {
      router.push("/cart");
    }
    // Fetch alamat user
    const fetchAddresses = async () => {
      try {
        const response = await axios.get("/api/addresses"); // Ganti dengan endpoint yg sesuai
        setAddresses(response.data);
        const primaryAddress = response.data.find(
          (addr: Address) => addr.isPrimary
        );
        if (primaryAddress) {
          setSelectedAddress(primaryAddress.id);
        }
      } catch (err) {
        setError("Gagal memuat alamat.");
      }
    };
    fetchAddresses();
  }, [items, router]);

  // Efek untuk mengambil opsi kurir saat alamat dipilih
  useEffect(() => {
    if (selectedAddress) {
      // Panggil API (misal RajaOngkir) dengan data alamat tujuan dan asal (toko terdekat)
      // Ini adalah contoh, perlu disesuaikan
      const fetchCouriers = async () => {
        // const response = await axios.post('/api/shipping-options', { addressId: selectedAddress });
        // setCourierOptions(response.data);
        console.log("Fetching couriers for addressId:", selectedAddress);
        // Mock data
        setCourierOptions([
          {
            code: "jne",
            name: "JNE",
            costs: [
              {
                service: "REG",
                description: "Reguler",
                cost: [{ value: 18000, etd: "2-3" }],
              },
            ],
          },
        ]);
      };
      fetchCouriers();
    }
  }, [selectedAddress]);

  const handleCreateOrder = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [courierName, service] = selectedCourier.split("_");
      const response = await axios.post("/api/orders", {
        addressId: selectedAddress,
        shippingCost,
        paymentMethod,
        courier: `${courierName.toUpperCase()} - ${service}`,
      });
      // Tampilkan notifikasi toast sukses
      // alert('Pesanan berhasil dibuat!');
      await fetchCart(); // Kosongkan keranjang di state
      router.push(`/orders/${response.data.order.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal membuat pesanan.");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      {/* Konten checkout: Ringkasan, Form Alamat, Opsi Pengiriman, Pembayaran */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {/* Pilih Alamat */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Alamat Pengiriman</h2>
            <select
              value={selectedAddress || ""}
              onChange={(e) => setSelectedAddress(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            >
              <option value="" disabled>
                Pilih Alamat
              </option>
              {addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.name} - {addr.address}
                </option>
              ))}
            </select>
          </div>
          {/* Pilih Kurir */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Opsi Pengiriman</h2>
            <select
              value={selectedCourier}
              onChange={(e) => {
                const [costStr] = e.target.value.split("_");
                setSelectedCourier(e.target.value);
                setShippingCost(Number(costStr));
              }}
              disabled={!selectedAddress}
              className="w-full p-2 border rounded-md"
            >
              <option value="" disabled>
                Pilih Kurir
              </option>
              {courierOptions.map((courier) =>
                courier.costs.map((cost) => (
                  <option
                    key={`${courier.code}_${cost.service}`}
                    value={`${cost.cost[0].value}_${courier.code}_${cost.service}`}
                  >
                    {courier.name} - {cost.service} (Rp{" "}
                    {cost.cost[0].value.toLocaleString("id-ID")})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
        <div>
          {/* Ringkasan & Tombol Bayar */}
          <button
            onClick={handleCreateOrder}
            disabled={!selectedAddress || !selectedCourier || isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? "Memproses..." : "Buat Pesanan"}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}
