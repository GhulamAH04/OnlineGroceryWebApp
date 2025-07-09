"use client";

import { AddressSchema } from "@/schemas/address.schema";
import { useFormik } from "formik";

export default function BillingAddressSettings() {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      streetAddress: "",
      country: "",
      state: "",
      zipCode: "",
      email: "",
      phone: "",
    },
    validationSchema: AddressSchema,
    onSubmit: (values) => {
      console.log("Submitting Billing Address:", values);
    },
  });

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Main Address</h2>
      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {/* Billing First Name */}
        <div>
          <label
            htmlFor="billingFirstName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First name
          </label>
          <input
            id="billingFirstName"
            {...formik.getFieldProps("firstName")}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
              formik.touched.firstName && formik.errors.firstName
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <div className="text-red-600 text-sm mt-1">
              {formik.errors.firstName}
            </div>
          ) : null}
        </div>

        {/* Billing Last Name */}
        <div>
          <label
            htmlFor="billingLastName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last name
          </label>
          <input
            id="billingLastName"
            {...formik.getFieldProps("lastName")}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
              formik.touched.lastName && formik.errors.lastName
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <div className="text-red-600 text-sm mt-1">
              {formik.errors.lastName}
            </div>
          ) : null}
        </div>

        {/* Company Name */}
        <div className="sm:col-span-2">
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Company Name (optional)
          </label>
          <input
            id="companyName"
            {...formik.getFieldProps("companyName")}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
              formik.touched.companyName && formik.errors.companyName
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.companyName && formik.errors.companyName ? (
            <div className="text-red-600 text-sm mt-1">
              {formik.errors.companyName}
            </div>
          ) : null}
        </div>

        {/* Street Address */}
        <div className="sm:col-span-2">
          <label
            htmlFor="streetAddress"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Street Address
          </label>
          <input
            id="streetAddress"
            {...formik.getFieldProps("streetAddress")}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
              formik.touched.streetAddress && formik.errors.streetAddress
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.streetAddress && formik.errors.streetAddress ? (
            <div className="text-red-600 text-sm mt-1">
              {formik.errors.streetAddress}
            </div>
          ) : null}
        </div>

        {/* Country Select */}
        <div className="sm:col-span-1">
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Country / Region
          </label>
          <select
            id="country"
            {...formik.getFieldProps("country")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="Mexico">Mexico</option>
          </select>
        </div>

        {/* State Select */}
        <div className="sm:col-span-1">
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            State
          </label>
          <select
            id="state"
            {...formik.getFieldProps("state")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          >
            <option value="Washington DC">Washington DC</option>
            <option value="California">California</option>
            <option value="Texas">Texas</option>
          </select>
        </div>

        {/* Zip Code */}
        <div className="sm:col-span-2">
          <label
            htmlFor="zipCode"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Zip Code
          </label>
          <input
            id="zipCode"
            {...formik.getFieldProps("zipCode")}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
              formik.touched.zipCode && formik.errors.zipCode
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.zipCode && formik.errors.zipCode ? (
            <div className="text-red-600 text-sm mt-1">
              {formik.errors.zipCode}
            </div>
          ) : null}
        </div>

        {/* Billing Email */}
        <div>
          <label
            htmlFor="billingEmail"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="billingEmail"
            type="email"
            {...formik.getFieldProps("email")}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-600 text-sm mt-1">
              {formik.errors.email}
            </div>
          ) : null}
        </div>

        {/* Billing Phone */}
        <div>
          <label
            htmlFor="billingPhone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone
          </label>
          <input
            id="billingPhone"
            type="tel"
            {...formik.getFieldProps("phone")}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
              formik.touched.phone && formik.errors.phone
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.phone && formik.errors.phone ? (
            <div className="text-red-600 text-sm mt-1">
              {formik.errors.phone}
            </div>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          {/* Submit Button*/}
          <button
            type="submit"
            disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
            className="w-[9rem] py-3 mt-4 px-4 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? "Saving Changes..." : "Save Change"}
          </button>
        </div>
      </form>
    </div>
  );
}
