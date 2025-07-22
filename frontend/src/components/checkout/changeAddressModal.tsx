"use client";

import React, { useState, FC, useEffect } from "react";
import { useFormik } from "formik";
import {
  IExistingAddress,
  INewAddressFormData,
} from "@/interfaces/address.interface";

// --- INTERFACES ---
// It's good practice to define the shapes of your data.

// Represents the structure of an existing address, likely coming from your DB
// --- PROPS FOR THE MODAL ---
interface ChangeAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Function to handle adding a new address via API
  onAddNewAddress: (addressData: INewAddressFormData) => Promise<void>;
  // Function to handle selecting an existing address via API
  onSelectExistingAddress: (address: IExistingAddress) => Promise<void>;
  // The user's currently saved addresses
  existingAddresses: IExistingAddress[];
  userId: number; // Pass the user's ID to the modal
}

// --- ADDRESS MODAL COMPONENT ---
const ChangeAddressModal: FC<ChangeAddressModalProps> = ({
  isOpen,
  onClose,
  onAddNewAddress,
  onSelectExistingAddress,
  existingAddresses,
  userId,
}) => {
  const [mode, setMode] = useState<"select" | "add">("select");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when the modal is opened or closed
  useEffect(() => {
    if (isOpen) {
      setMode("select");
      setSelectedId(null);
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  // Formik hook for the "Add New Address" form
  const newAddressFormik = useFormik({
    initialValues: {
      name: "",
      address: "",
      city: "",
      province: "",
      isPrimary: false,
      district: "",
      postalCode: "",
      userId: 0,
    },
    // Validation schema can be added here with Yup for more robustness
    onSubmit: async (values) => {
      setError(null);
      setIsLoading(true);
      try {
        const newAddress = { ...values, userId };

        await onAddNewAddress(newAddress);
        newAddressFormik.resetForm();
        onClose(); // Close modal on success
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Handler for selecting an existing address
  const handleUseSelectedAddress = async () => {
    if (selectedId === null) return;

    const addressToUse = existingAddresses.find(
      (address) => address.id === selectedId
    );

    if (addressToUse) {
      setError(null);
      setIsLoading(true);
      try {
        // Call the async function passed via props
        await onSelectExistingAddress(addressToUse);
        onClose(); // Close modal on success
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-300">
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl transform transition-all duration-300 scale-100">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50"
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
            disabled={isLoading}
            className={`py-2 px-4 text-sm sm:text-base transition-all ${
              mode === "select"
                ? "border-b-2 border-orange-500 font-semibold text-orange-600"
                : "text-gray-500 hover:text-orange-500"
            } disabled:opacity-50`}
          >
            Pilih Alamat Tersimpan
          </button>
          <button
            onClick={() => setMode("add")}
            disabled={isLoading}
            className={`py-2 px-4 text-sm sm:text-base transition-all ${
              mode === "add"
                ? "border-b-2 border-orange-500 font-semibold text-orange-600"
                : "text-gray-500 hover:text-orange-500"
            } disabled:opacity-50`}
          >
            Tambah Alamat Baru
          </button>
        </div>

        {/* --- ERROR DISPLAY --- */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* --- SELECT ADDRESS VIEW --- */}
        {mode === "select" && (
          <div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {existingAddresses.length > 0 ? (
                existingAddresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => !isLoading && setSelectedId(address.id)}
                    className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                      selectedId === address.id
                        ? "border-orange-500 ring-2 ring-orange-100 bg-orange-50"
                        : "border-gray-300 hover:border-orange-400 hover:bg-gray-50"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <p className="font-bold text-gray-800">{address.name}</p>
                    <p className="text-sm text-gray-600">{`${address.address}, ${address.city}, ${address.province} ${address.postalCode}`}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Tidak ada alamat tersimpan. Silakan tambah alamat baru.
                </p>
              )}
            </div>
            <button
              onClick={handleUseSelectedAddress}
              disabled={!selectedId || isLoading}
              className="mt-6 w-full rounded-lg bg-orange-600 px-4 py-3 font-semibold text-white shadow-md hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none transition-all flex items-center justify-center"
            >
              {isLoading ? "Loading..." : "Gunakan Alamat Ini"}
            </button>
          </div>
        )}

        {/* --- ADD NEW ADDRESS VIEW (with Formik) --- */}
        {mode === "add" && (
          <form onSubmit={newAddressFormik.handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nama Penerima
              </label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={newAddressFormik.handleChange}
                onBlur={newAddressFormik.handleBlur}
                value={newAddressFormik.values.name} // Corrected binding
                className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            {/* Street Address Input */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Nama Jalan & Nomor Rumah
              </label>
              <input
                id="address"
                name="address"
                type="text"
                onChange={newAddressFormik.handleChange}
                onBlur={newAddressFormik.handleBlur}
                value={newAddressFormik.values.address} // Corrected binding
                className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            {/* Province and City Selects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="province"
                  className="block text-sm font-medium text-gray-700"
                >
                  Provinsi
                </label>
                <select
                  id="province"
                  name="province"
                  onChange={newAddressFormik.handleChange}
                  onBlur={newAddressFormik.handleBlur}
                  value={newAddressFormik.values.province} // Corrected binding
                  className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="" label="Pilih Provinsi" />
                  <option value="DKI Jakarta" label="DKI Jakarta" />
                  <option value="Jawa Barat" label="Jawa Barat" />
                  <option value="Jawa Timur" label="Jawa Timur" />
                </select>
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  Kota/Kabupaten
                </label>
                <select
                  id="city"
                  name="city"
                  onChange={newAddressFormik.handleChange}
                  onBlur={newAddressFormik.handleBlur}
                  value={newAddressFormik.values.city} // Corrected binding
                  className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="" label="Pilih Kota/Kabupaten" />
                  <option value="Jakarta Pusat" label="Jakarta Pusat" />
                  <option value="Bandung" label="Bandung" />
                  <option value="Surabaya" label="Surabaya" />
                </select>
              </div>
            </div>
            {/* District and Postal Code Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-gray-700"
                >
                  Kecamatan
                </label>
                <input
                  id="district"
                  name="district"
                  type="text"
                  onChange={newAddressFormik.handleChange}
                  onBlur={newAddressFormik.handleBlur}
                  value={newAddressFormik.values.district} // Corrected binding
                  className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
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
                  value={newAddressFormik.values.postalCode} // Corrected binding
                  className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white shadow-md hover:bg-green-700 transition-all disabled:bg-gray-400 flex items-center justify-center"
            >
              {isLoading ? "Menyimpan..." : "Simpan & Gunakan Alamat"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangeAddressModal;
