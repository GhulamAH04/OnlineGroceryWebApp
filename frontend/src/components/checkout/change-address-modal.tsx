"use client";

import React, { useState, FC } from "react";
import { useFormik } from "formik";

// --- TYPE DEFINITION ---
// In a real project, this would likely be in its own file, e.g., `types/address.ts`
export interface Address {
  id: string;
  label?: string; // e.g., "Home", "Work"
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

// --- MOCK DATA ---
// This simulates fetching existing addresses from a database.
const existingAddresses: Address[] = [
  {
    id: "addr1",
    label: "Rumah Utama",
    address: "Jl. Jenderal Sudirman No. 50",
    city: "Makassar",
    province: "Sulawesi Selatan",
    postalCode: "90114",
  },
  {
    id: "addr2",
    label: "Kantor",
    address: "Jl. Dr. Sam Ratulangi No. 15",
    city: "Makassar",
    province: "Sulawesi Selatan",
    postalCode: "90132",
  },
  {
    id: "addr3",
    label: "Alamat Jakarta",
    address: "Jl. MH Thamrin No. 1",
    city: "Jakarta Pusat",
    province: "DKI Jakarta",
    postalCode: "10310",
  },
];

// --- ADDRESS MODAL COMPONENT ---
// In a real project, this would be in `components/AddressModal.tsx`
interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: Address) => void;
}

const AddressModal: FC<AddressModalProps> = ({
  isOpen,
  onClose,
  onSelectAddress,
}) => {
  const [mode, setMode] = useState<"select" | "add">("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Formik hook for the "Add New Address" form
  const newAddressFormik = useFormik({
    initialValues: {
      address: "",
      city: "",
      province: "",
      postalCode: "",
    },
    onSubmit: (values) => {
      // In a real app, you would save this new address to your database
      const addressToAdd: Address = {
        id: `addr_${Date.now()}`, // simple unique id for demo purposes
        label: "Alamat Baru", // Default label
        ...values,
      };
      onSelectAddress(addressToAdd);
      newAddressFormik.resetForm();
    },
  });

  if (!isOpen) return null;

  const handleUseSelectedAddress = () => {
    const addressToUse = existingAddresses.find(
      (addr) => addr.id === selectedId
    );
    if (addressToUse) {
      onSelectAddress(addressToUse);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-300">
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl transform transition-all duration-300 scale-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-gray-700 transition-colors"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-5 text-gray-800">
          Pilih Alamat Pengiriman
        </h2>

        {/* --- TABS --- */}
        <div className="flex border-b mb-5">
          <button
            onClick={() => setMode("select")}
            className={`py-2 px-4 text-sm sm:text-base transition-all ${
              mode === "select"
                ? "border-b-2 border-orange-500 font-semibold text-orange-600"
                : "text-gray-500 hover:text-orange-500"
            }`}
          >
            Pilih Alamat Tersimpan
          </button>
          <button
            onClick={() => setMode("add")}
            className={`py-2 px-4 text-sm sm:text-base transition-all ${
              mode === "add"
                ? "border-b-2 border-orange-500 font-semibold text-orange-600"
                : "text-gray-500 hover:text-orange-500"
            }`}
          >
            Tambah Alamat Baru
          </button>
        </div>

        {/* --- SELECT ADDRESS VIEW --- */}
        {mode === "select" && (
          <div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {existingAddresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedId(addr.id)}
                  className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                    selectedId === addr.id
                      ? "border-orange-500 ring-2 ring-orange-100 bg-orange-50"
                      : "border-gray-300 hover:border-orange-400 hover:bg-gray-50"
                  }`}
                >
                  <p className="font-bold text-gray-800">{addr.label}</p>
                  <p className="text-sm text-gray-600">{`${addr.address}, ${addr.city}, ${addr.province} ${addr.postalCode}`}</p>
                </div>
              ))}
            </div>
            <button
              onClick={handleUseSelectedAddress}
              disabled={!selectedId}
              className="mt-6 w-full rounded-lg bg-orange-600 px-4 py-3 font-semibold text-white shadow-md hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none transition-all"
            >
              Gunakan Alamat Ini
            </button>
          </div>
        )}

        {/* --- ADD NEW ADDRESS VIEW (with Formik) --- */}
        {mode === "add" && (
          <form onSubmit={newAddressFormik.handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Alamat Lengkap
              </label>
              <input
                id="address"
                name="address"
                type="text"
                onChange={newAddressFormik.handleChange}
                onBlur={newAddressFormik.handleBlur}
                value={newAddressFormik.values.address}
                className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  Kota
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  onChange={newAddressFormik.handleChange}
                  onBlur={newAddressFormik.handleBlur}
                  value={newAddressFormik.values.city}
                  className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <label
                  htmlFor="province"
                  className="block text-sm font-medium text-gray-700"
                >
                  Provinsi
                </label>
                <input
                  id="province"
                  name="province"
                  type="text"
                  onChange={newAddressFormik.handleChange}
                  onBlur={newAddressFormik.handleBlur}
                  value={newAddressFormik.values.province}
                  className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-gray-700"
              >
                Kode Pos
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                onChange={newAddressFormik.handleChange}
                onBlur={newAddressFormik.handleBlur}
                value={newAddressFormik.values.postalCode}
                className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white shadow-md hover:bg-green-700 transition-all"
            >
              Simpan & Gunakan Alamat
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddressModal;
