"use client"

import { BillingSchema } from "@/schemas/address.schema";
import { useFormik } from "formik";
import { useState } from "react";

export default function BillingInformationForm() {
  const [shipToDifferent, setShipToDifferent] = useState(false);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      streetAddress: "",
      country: "",
      states: "",
      zipCode: "",
      email: "",
      phone: "",
    },
    validationSchema: BillingSchema,
    onSubmit: (values) => {
      // In a real app, you'd handle form submission here
      console.log(JSON.stringify(values, null, 2));
      alert("Order placed! Check the console for form data.");
    },
  });

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Billing Information
      </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* First and Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="Your first name"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                formik.touched.firstName && formik.errors.firstName
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              {...formik.getFieldProps("firstName")}
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.firstName}
              </div>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Your last name"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                formik.touched.lastName && formik.errors.lastName
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              {...formik.getFieldProps("lastName")}
            />
            {formik.touched.lastName && formik.errors.lastName ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.lastName}
              </div>
            ) : null}
          </div>
        </div>

        {/* Company Name */}
        <div>
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Company Name <span className="text-gray-500">(optional)</span>
          </label>
          <input
            id="companyName"
            type="text"
            placeholder="Company name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            {...formik.getFieldProps("companyName")}
          />
        </div>

        {/* Street Address */}
        <div>
          <label
            htmlFor="streetAddress"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Street Address
          </label>
          <input
            id="streetAddress"
            type="text"
            placeholder="Street Address"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
              formik.touched.streetAddress && formik.errors.streetAddress
                ? "border-red-500"
                : "border-gray-300"
            }`}
            {...formik.getFieldProps("streetAddress")}
          />
          {formik.touched.streetAddress && formik.errors.streetAddress ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.streetAddress}
            </div>
          ) : null}
        </div>

        {/* Country, States, Zip Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Country / Region
            </label>
            <select
              id="country"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white ${
                formik.touched.country && formik.errors.country
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              {...formik.getFieldProps("country")}
            >
              <option value="">Select</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="Mexico">Mexico</option>
            </select>
            {formik.touched.country && formik.errors.country ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.country}
              </div>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="states"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              States
            </label>
            <select
              id="states"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white ${
                formik.touched.states && formik.errors.states
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              {...formik.getFieldProps("states")}
            >
              <option value="">Select</option>
              <option value="California">California</option>
              <option value="New York">New York</option>
              <option value="Texas">Texas</option>
            </select>
            {formik.touched.states && formik.errors.states ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.states}
              </div>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="zipCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Zip Code
            </label>
            <input
              id="zipCode"
              type="text"
              placeholder="Zip Code"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                formik.touched.zipCode && formik.errors.zipCode
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              {...formik.getFieldProps("zipCode")}
            />
            {formik.touched.zipCode && formik.errors.zipCode ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.zipCode}
              </div>
            ) : null}
          </div>
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="Phone number"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                formik.touched.phone && formik.errors.phone
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              {...formik.getFieldProps("phone")}
            />
            {formik.touched.phone && formik.errors.phone ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.phone}
              </div>
            ) : null}
          </div>
        </div>

        {/* Ship to different address checkbox */}
        <div className="flex items-center">
          <input
            id="shipToDifferent"
            type="checkbox"
            checked={shipToDifferent}
            onChange={(e) => setShipToDifferent(e.target.checked)}
            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label
            htmlFor="shipToDifferent"
            className="ml-2 block text-sm text-gray-900"
          >
            Ship to a different address
          </label>
        </div>
        {/* The submit button for the form is now in the OrderSummary component */}
      </form>
    </div>
  );
};
