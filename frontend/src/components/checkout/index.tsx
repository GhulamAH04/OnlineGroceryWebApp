"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { MapPin, Truck, ShoppingCart, CreditCard, Plus } from "lucide-react";
import AddressModal from "./addressModal";
import { useAppSelector } from "@/lib/redux/hooks";
import { getCookie } from "cookies-next";
import { ICartItems, IGroupedItem } from "@/interfaces/product.interface";
import { IShippingOption } from "@/interfaces/shipping.interface";
import {
  getMainAddress,
  getShippingOptions,
  getUserAddresses,
} from "@/lib/data";
import { IExistingAddress } from "@/interfaces/address.interface";

// --- DATA DUMMY / MOCK DATA ---
const initialCartItems: ICartItems[] = [
  {
    id: 1,
    branchs: {
      id: 1,
      name: "Toko Segar Jaya",
      addresses: {
        id: 1,
        name: "Jl. Raya No. 1",
        phone: "08123456789",
        address: "Jl. Raya No. 1",
        districts: { id: 1, name: "kenjeran" },
        cities: { id: 1, name: "Surabaya" },
        provinces: { id: 1, name: "Jawa Timur" },
        postalCode: "12345",
        isPrimary: true,
        userId: 1,
      },
    },
    products: {
      id: 1,
      name: "Apel Fuji",
      price: 15000,
      weight: 1000,
      image: "https://placehold.co/100x100/a8e6cf/333?text=Apel",
      categoryId: 1,
    },
    quantity: 1,
  },
];

export default function Checkout() {
  const user = useAppSelector((state) => state.auth);
  const [cartItems, setCartItems] = useState<ICartItems[]>(initialCartItems);
  const [userAddresses, setUserAddresses] = useState<IExistingAddress[]>([]);
  const [selectedAddress, setSelectedAddress] =
    useState<IExistingAddress | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<{
    [storeName: string]: { loading: boolean; data: IShippingOption[] };
  }>({});
  const [selectedShipping, setSelectedShipping] = useState<{
    [storeName: string]: IShippingOption;
  }>({});

  // Group products by store
  const groupedByStore = useMemo(() => {
    return cartItems.reduce((acc, product) => {
      const storeName = product.branchs.name;
      if (!acc[storeName]) {
        acc[storeName] = [];
      }
      acc[storeName].push({
        id: product.products.id,
        name: product.products.name,
        price: product.products.price,
        quantity: product.quantity,
        weightInGrams: product.products.weight,
        imageUrl: product.products.image,
        storeName,
        storeAddress: product.branchs.addresses,
      });
      return acc;
    }, {} as { [key: string]: IGroupedItem[] });
  }, [cartItems]);

  const fetchShippingOptionsForStore = useCallback(
    async (
      storeName: string,
      products: IGroupedItem[],
      selectedAddress: IExistingAddress
    ) => {
      setShippingOptions((prev) => ({
        ...prev,
        [storeName]: { loading: true, data: [] },
      }));

      const originAddress = products[0].storeAddress;
      const totalWeight = products.reduce(
        (sum, p) => sum + p.weightInGrams * p.quantity,
        0
      );

      try {
        const data = await getShippingOptions(
          originAddress,
          selectedAddress,
          totalWeight
        );
        setShippingOptions((prev) => ({
          ...prev,
          [storeName]: { loading: false, data: data || [] },
        }));
      } catch (err) {
        console.error(`Error fetching shipping options for ${storeName}:`, err);
        setShippingOptions((prev) => ({
          ...prev,
          [storeName]: { loading: false, data: [] },
        }));
      }
    },
    []
  );

  // Handle fetching user addresses
  useEffect(() => {
    const fetchUserAddressesData = async () => {
      try {
        const data = await getUserAddresses(user.user.id);
        setUserAddresses(data);
      } catch (err) {
        console.error("Error fetching user addresses:", err);
      }
    };

    fetchUserAddressesData();
  }, [user.user.id]);

  useEffect(() => {
    const fetchMainAddress = async () => {
      try {
        const token = getCookie("access_token") as string;
        const data = await getMainAddress(user.user.id, token);
        console.log("Main address:", data);
        setSelectedAddress(data[0]);
      } catch (err) {
        console.error("Error fetching main address:", err);
      }
    };

    fetchMainAddress();
  }, [user.user.id]);

  useEffect(() => {
    if (selectedAddress) {
      Object.entries(groupedByStore).forEach(([storeName, products]) => {
        fetchShippingOptionsForStore(storeName, products, selectedAddress);
      });
    }
  }, [selectedAddress, groupedByStore, fetchShippingOptionsForStore]);

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

  const handleShippingSelectionChange = (storeName: string, value: string) => {
    if (!value) {
      const newSelected = { ...selectedShipping };
      delete newSelected[storeName];
      setSelectedShipping(newSelected);
      return;
    }

    const selectedOption = shippingOptions[storeName]?.data.find(
      (c) => c.service === value
    );
    if (selectedOption) {
      setSelectedShipping((prev) => ({ ...prev, [storeName]: selectedOption }));
    }
  };

  // Calculate totals
  const productsSubtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.products.price * item.quantity,
        0
      ),
    [cartItems]
  );
  const shippingTotal = useMemo(
    () =>
      Object.values(selectedShipping).reduce(
        (sum, option) => sum + option.cost,
        0
      ),
    [selectedShipping]
  );
  const grandTotal = productsSubtotal + shippingTotal;

  const isReadyToCheckout =
    selectedAddress &&
    Object.keys(selectedShipping).length === Object.keys(groupedByStore).length;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
        <div className="flex flex-col gap-4">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="text-green-500" /> Alamat Pengiriman
                </h2>
                {selectedAddress && selectedAddress.isPrimary && (
                  <p className="text-sm h-6 text-center rounded-sm text-green-500 border-2 border-green-500 px-2">
                    Alamat Utama
                  </p>
                )}
              </div>
              {selectedAddress ? (
                <div>
                  <p className="font-bold">{selectedAddress?.name}</p>
                  <p className="text-gray-600">{selectedAddress?.phone}</p>
                  <p className="text-gray-600 mt-1">{`${selectedAddress?.address}, ${selectedAddress?.districts?.name}, ${selectedAddress?.cities?.name}, ${selectedAddress?.provinces?.name} ${selectedAddress?.postalCode}`}</p>
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
                    Dikirim dari: {storeName} -{" "}
                    {products[0].storeAddress.cities.name}
                  </h3>
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 mb-3"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {product.quantity} x{" "}
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(product.price)}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(product.price * product.quantity)}
                      </p>
                    </div>
                  ))}

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
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                    }).format(productsSubtotal)}
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
              >
                {isReadyToCheckout
                  ? "Lanjutkan ke Pembayaran"
                  : "Lengkapi Alamat & Pengiriman"}
              </button>
            </div>
          </div>
        </div>
      </div>

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
