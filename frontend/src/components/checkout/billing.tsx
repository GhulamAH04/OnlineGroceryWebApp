// --- MAIN PAGE COMPONENT ---

import { useState } from "react";
import AddressModal, { Address } from "./change-address-modal";
import { useFormik } from "formik";

// This would be your page component, e.g., `app/billing/page.tsx`
export default function BillingInformationForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formik hook for the main billing form
  const formik = useFormik({
    initialValues: {
      username: "nahalil",
      phone: "",
      address: "Jl. Aspol Tello No. 6",
      city: "Makassar",
      province: "Sulawesi Selatan",
      postalCode: "90233",
    },
    onSubmit: (values) => {
      // This function is called when the form is submitted.
      // For now, we'll just log the values.
      alert(JSON.stringify(values, null, 2));
    },
  });

  const handleSelectAddress = (selectedAddress: Address) => {
    // Update the formik values with the data from the modal
    formik.setValues({
      ...formik.values, // Keep existing values like username and phone
      address: selectedAddress.address,
      city: selectedAddress.city,
      province: selectedAddress.province,
      postalCode: selectedAddress.postalCode,
    });
    setIsModalOpen(false); // Close the modal after selection
  };

  return (
      <div className="w-full rounded-xl p-6 sm:p-8 shadow-lg">
        <h1 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-800">
          Billing Information
        </h1>

        <form onSubmit={formik.handleSubmit} className="w-full">
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-gray-600"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formik.values.username}
              className="w-full rounded-lg border-gray-300 p-3 shadow-sm"
              readOnly
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-gray-600"
            >
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
              placeholder="Phone number"
              className="w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="mb-1 block text-sm font-medium text-gray-600"
            >
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address}
              className="w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="city"
                className="mb-1 block text-sm font-medium text-gray-600"
              >
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.city}
                className="w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="province"
                className="mb-1 block text-sm font-medium text-gray-600"
              >
                Province
              </label>
              <input
                id="province"
                name="province"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.province}
                className="w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="postalCode"
                className="mb-1 block text-sm font-medium text-gray-600"
              >
                Postal Code
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.postalCode}
                className="w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-sm font-semibold text-orange-600 hover:text-orange-500 transition-colors duration-200"
            >
              Shipping to other address?
            </button>
          </div>
        </form>
        {/* --- RENDER THE MODAL --- */}
        <AddressModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectAddress={handleSelectAddress}
        />
      </div>

  );
}
