"use client";

import { useState, useMemo, useEffect } from "react";
import { MapPin, Truck, ShoppingCart, CreditCard, Plus } from "lucide-react";
import AddressModal from "./addressModal";
import { useAppSelector } from "@/lib/redux/hooks";
import { IShippingOption } from "@/interfaces/shipping.interface";
import { IExistingAddress } from "@/interfaces/address.interface";
import { apiUrl } from "@/config";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useCartStore, TotalCartResponse } from "@/stores/cart.store";
import { createOrder } from "@/stores/order.store";

// --- KOMPONEN UTAMA CHECKOUT ---
export default function Checkout() {
  // Redux user
  const user = useAppSelector((state) => state.auth);
  const [paymentMethod, setPaymentMethod] = useState("TRANSFER");

  // Cart store (API)
  const { items: cartItems, fetchCart, totalCart } = useCartStore();
  const [cartTotals, setCartTotals] = useState<TotalCartResponse | null>(null);

  // Address
  const [userAddresses, setUserAddresses] = useState<IExistingAddress[]>([]);
  const [selectedAddress, setSelectedAddress] =
    useState<IExistingAddress | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Shipping state
  const [shippingOptions, setShippingOptions] = useState<{
    [storeName: string]: { loading: boolean; data: IShippingOption[] };
  }>({});
  const [selectedShipping, setSelectedShipping] = useState<{
    [storeName: string]: IShippingOption;
  }>({});

  // --- 1. FETCH DATA CART & TOTAL ---
  useEffect(() => {
    fetchCart();
    totalCart().then(setCartTotals).catch(console.error);
  }, [fetchCart, totalCart]);

  // --- 2. FETCH MAIN ADDRESS (utama) ---
  useEffect(() => {
    if (!user?.user?.id) return;
    const fetchMainAddress = async () => {
      try {
        const token = getCookie("access_token") as string;
        const { data } = await axios.get(
          `${apiUrl}/api/users/address/main/${user.user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSelectedAddress(data.data[0] || null);
      } catch (err) {
        alert("Error fetching main address");
      }
    };
    fetchMainAddress();
  }, [user?.user?.id]);

  // --- 3. FETCH ALL ADDRESS USER ---
  useEffect(() => {
    if (!user?.user?.id) return;
    const fetchUserAddresses = async () => {
      try {
        const token = getCookie("access_token") as string;
        const { data } = await axios.get(
          `${apiUrl}/api/addresses/${user.user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserAddresses(data.data || []);
      } catch (err) {
        alert("Error fetching user addresses");
      }
    };
    fetchUserAddresses();
  }, [user?.user?.id]);

  // --- 4. GROUP CART BY STORE (JIKA ADA) ---
  // Jika data cart tidak punya store, hapus dan gunakan satu group saja
  const groupedByStore = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const storeName = item.product.branch || "Toko Default";
      if (!acc[storeName]) acc[storeName] = [];
      acc[storeName].push(item);
      return acc;
    }, {} as { [key: string]: typeof cartItems });
  }, [cartItems]);

  // --- 5. SHIPPING: FETCH OPTIONS PER TOKO JIKA ADDRESS DIUBAH ---
  useEffect(() => {
    if (!selectedAddress) return;
    setSelectedShipping({}); // Reset shipping
    Object.entries(groupedByStore).forEach(([storeName, products]) => {
      setShippingOptions((prev) => ({
        ...prev,
        [storeName]: { loading: true, data: [] },
      }));

      // Ambil origin dari product store, sesuaikan dengan struktur API
      // Di sini diambil dari produk pertama di group
      const originAddress = products[0]?.product?.branch?.addresses;
      const origin = originAddress
        ? {
            province: originAddress.provinces.name,
            city: originAddress.cities.name,
            district: originAddress.districts.name,
          }
        : { province: "", city: "", district: "" };
      const destination = {
        province: selectedAddress.provinces.name,
        city: selectedAddress.cities.name,
        district: selectedAddress.districts.name,
      };
      const totalWeight = products.reduce(
        (sum, p: any) => sum + (p.product?.weight || 0) * p.quantity,
        0
      );

      const fetchShippingOptionsForStore = async () => {
        try {
          const token = getCookie("access_token") as string;
          const { data } = await axios.post(
            `${apiUrl}/api/shipping-cost`,
            { origin, destination, weight: totalWeight },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // === CEK, JIKA NULL/KOSONG, MASUKKAN DUMMY ===
          const fetchedOptions =
            data.data && data.data.length > 0
              ? data.data
              : [
                  {
                    name: "JNE",
                    code: "jne",
                    service: "jne",
                    description: "Pengiriman JNE",
                    cost: 10000,
                    etd: "1-2 hari",
                  },
                ];

          setShippingOptions((prev) => ({
            ...prev,
            [storeName]: { loading: false, data: fetchedOptions },
          }));
        } catch (err) {
          // Error juga, tampilkan dummy option
          setShippingOptions((prev) => ({
            ...prev,
            [storeName]: {
              loading: false,
              data: [
                {
                  name: "JNE",
                  code: "jne",
                  service: "jne",
                  description: "Pengiriman JNE",
                  cost: 10000,
                  etd: "1-2 hari",
                },
              ],
            },
          }));
        }
      };

      fetchShippingOptionsForStore();
    });
  }, [selectedAddress, groupedByStore]);

  // --- 6. SHIPPING: SELECT HANDLER ---
  const handleShippingSelectionChange = (storeName: string, value: string) => {
    if (!value) {
      const newSelected = { ...selectedShipping };
      delete newSelected[storeName];
      setSelectedShipping(newSelected);
      return;
    }
    const selectedOptionService = value;
    const selectedCourier = shippingOptions[storeName]?.data.find(
      (c) => c.service === selectedOptionService
    );
    if (selectedCourier) {
      setSelectedShipping((prev) => ({
        ...prev,
        [storeName]: selectedCourier,
      }));
    }
  };

  // --- 7. MODAL ADDRESS HANDLER ---
  const handleSelectAddress = (address: IExistingAddress) => {
    setSelectedAddress(address);
    setIsModalOpen(false);
  };
  const handleAddNewAddress = (
    newAddressData: Omit<IExistingAddress, "id">
  ) => {
    const newAddress: IExistingAddress = { id: Date.now(), ...newAddressData };
    setUserAddresses((prev) => [...prev, newAddress]);
    setSelectedAddress(newAddress);
    setIsModalOpen(false);
  };

  // --- 8. TOTAL SHIPPING ---
  const shippingTotal = useMemo(
    () =>
      Object.values(selectedShipping).reduce(
        (sum, option) => sum + option.cost,
        0
      ),
    [selectedShipping]
  );
  // --- 9. GRAND TOTAL ---
  const grandTotal = (cartTotals?.totalPrice || 0) + shippingTotal;

  // --- 10. BUTTON CHECKOUT ENABLE ---
  const isReadyToCheckout =
    selectedAddress &&
    Object.keys(selectedShipping).length === Object.keys(groupedByStore).length;

  // --- 11. HANDLE CHECKOUT ---
  const handleCheckout = async () => {
    if (!isReadyToCheckout) {
      alert("Lengkapi alamat dan pengiriman terlebih dahulu.");
      return;
    }

    try {
      const cartId = cartItems.length > 0 ? cartItems[0].cartId : null;
      if (!cartId) {
        alert("Keranjang tidak ditemukan.");
        return;
      }

      const addressId = selectedAddress?.id;
      if (!addressId) {
        alert("Alamat belum dipilih.");
        return;
      }

      // Jika 1 toko, ambil shipping yg dipilih. Jika >1, kamu bisa modif sesuai kebutuhan backend
      const shippingOptionsArr = Object.values(selectedShipping);
      const shippingCost = shippingOptionsArr.reduce(
        (acc, curr) => acc + (curr?.cost || 0),
        0
      );

      // Jika multi toko, gabung nama kurir
      const courier = shippingOptionsArr.map((opt) => opt?.name).join(", ");

      // Kirim order ke API
      await createOrder({
        cartId,
        addressId,
        paymentMethod: paymentMethod,
        shippingCost,
        courier,
      });

      fetchCart();

      alert("Pesanan berhasil dibuat!");
      // Redirect, reset cart, dsb bisa di sini jika perlu
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Gagal membuat pesanan. Silakan coba lagi.");
    }
  };
  // --- RENDER ---
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
        <div className="flex flex-col gap-4">
          <div className="space-y-6">
            {/* SECTION: ALAMAT */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="text-green-500" /> Alamat Pengiriman
                </h2>
                {selectedAddress?.isPrimary && (
                  <p className="text-sm h-6 text-center rounded-sm text-green-500 border-2 border-green-500 px-2">
                    Alamat Utama
                  </p>
                )}
              </div>
              {selectedAddress ? (
                <div>
                  <p className="font-bold">{selectedAddress.name}</p>
                  <p className="text-gray-600">{selectedAddress.phone}</p>
                  <p className="text-gray-600 mt-1">
                    {`${selectedAddress.address}, ${selectedAddress.districts.name}, ${selectedAddress.cities.name}, ${selectedAddress.provinces.name} ${selectedAddress.postalCode}`}
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-3 text-sm font-semibold text-green-600 hover:text-green-800"
                  >
                    Ubah Alamat
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-500 transition"
                >
                  <Plus size={20} /> Pilih atau Tambah Alamat Pengiriman
                </button>
              )}
            </div>

            {/* SECTION: RINGKASAN PESANAN (FROM API) */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ShoppingCart className="text-green-500" /> Ringkasan Pesanan
              </h2>
              {Object.entries(groupedByStore).map(([storeName, products]) => (
                <div
                  key={storeName}
                  className="mb-6 last:mb-0 border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="font-bold text-md text-gray-700 mb-3">
                    Dikirim dari: {storeName}
                  </h3>
                  {products.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 mb-3">
                      <img
                        src={item.product.image || ""}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x{" "}
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(item.product.price)}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}

                  {/* OPSI PENGIRIMAN PER TOKO */}
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-semibold text-sm text-gray-600 mb-2 flex items-center gap-2">
                      <Truck size={16} /> Opsi Pengiriman
                    </h4>
                    {!selectedAddress ? (
                      <p className="text-sm text-gray-500">
                        Pilih alamat pengiriman terlebih dahulu.
                      </p>
                    ) : shippingOptions[storeName]?.loading ? (
                      <p className="text-sm text-gray-500">
                        Menghitung ongkos kirim...
                      </p>
                    ) : (
                      <select
                        name={`shipping-${storeName}`}
                        id={`shipping-${storeName}`}
                        className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white"
                        value={selectedShipping[storeName]?.service || ""}
                        onChange={(e) =>
                          handleShippingSelectionChange(
                            storeName,
                            e.target.value
                          )
                        }
                      >
                        <option value="">Pilih Opsi Pengiriman</option>
                        {shippingOptions[storeName]?.data.map((option) => (
                          <option key={option.service} value={option.service}>
                            {`${option.name} ${option.description} (${
                              option.etd
                            }) - ${new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(option.cost)}`}
                          </option>
                        ))}
                        {/* add dummy options if shippingOptions null like JNE, JNT and update state setSelectedShipping */}
                        {shippingOptions[storeName]?.data.length === 0 && (
                          <>
                            <option
                              value="jne"
                              onClick={() =>
                                handleShippingSelectionChange(storeName, "jne")
                              }
                            >
                              JNE - 3-5 hari
                            </option>
                          </>
                        )}
                      </select>
                    )}
                  </div>

                  {/* OPSI PAYMENT METHOD, TRANSFER or  */}
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-semibold text-sm text-gray-600 mb-2 flex items-center gap-2">
                      <CreditCard size={16} /> Metode Pembayaran
                    </h4>
                    <p className="text-sm text-gray-500">
                      Pilih metode pembayaran yang Anda inginkan.
                    </p>
                    <select
                      name={`payment-${storeName}`}
                      id={`payment-${storeName}`}
                      className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white mt-2"
                      defaultValue="TRANSFER"
                      onChange={(e) => {
                        setPaymentMethod(e.target.value);
                      }}
                    >
                      <option value="TRANSFER">Transfer Bank</option>
                      <option value="COD">Bayar di Tempat (COD)</option>
                      <option value="E-WALLET">E-Wallet</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION: RANGKUMAN BELANJA */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="text-green-500" /> Rangkuman Belanja
              </h2>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <p>Total Harga Barang</p>
                  <p className="font-semibold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(cartTotals?.totalPrice || 0)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>Total Ongkos Kirim</p>
                  <p className="font-semibold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(shippingTotal)}
                  </p>
                </div>
                <div className="border-t my-2"></div>
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <p>Total Belanja</p>
                  <p>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(grandTotal)}
                  </p>
                </div>
              </div>
              <button
                disabled={!isReadyToCheckout}
                className="w-full mt-6 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={() => handleCheckout()}
              >
                {isReadyToCheckout
                  ? "Lanjutkan ke Pembayaran"
                  : "Lengkapi Alamat & Pengiriman"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL ADDRESS */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addresses={userAddresses}
        onSelectAddress={handleSelectAddress}
        onAddNewAddress={handleAddNewAddress}
        selectedAddressId={selectedAddress?.id || null}
      />
    </div>
  );
}
