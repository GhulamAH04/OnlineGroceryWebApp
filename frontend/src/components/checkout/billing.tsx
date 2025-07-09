"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { BillingSchema } from "@/schemas/address.schema";
import { useFormik } from "formik";

export default function BillingInformationForm() {
// state in redux
  const user = useAppSelector((state) => state.auth);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      province: "",
      postalcode: "",
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
        {/* Name */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Your name"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
              formik.touched.username && formik.errors.username
                ? "border-red-500"
                : "border-gray-300"
            }`}
            {...formik.getFieldProps("username")}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.username}
            </div>
          ) : null}
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
            <p className="w-full h-10 px-3 py-2 text-gray-700 border border-gray-700 rounded-md shadow-sm cursor-not-allowed">
              {user.user.email}
            </p>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select your address
          </label>
          <select
            id="city"
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white"
          >
            <option value="">Select</option>
            <option value="United province">United province</option>
            <option value="Canada">Canada</option>
            <option value="Mexico">Mexico</option>
          </select>
        </div>

        {/* Street Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Address
          </label>
          <input
            id="address"
            type="text"
            placeholder="Address"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
              formik.touched.address && formik.errors.address
                ? "border-red-500"
                : "border-gray-300"
            }`}
            {...formik.getFieldProps("address")}
          />
          {formik.touched.address && formik.errors.address ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.address}
            </div>
          ) : null}
        </div>

        {/* city, province, Zip Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City
            </label>
            <select
              id="city"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white ${
                formik.touched.city && formik.errors.city
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              {...formik.getFieldProps("city")}
            >
              <option value="">Select</option>
              <option value="United province">United province</option>
              <option value="Canada">Canada</option>
              <option value="Mexico">Mexico</option>
            </select>
            {formik.touched.city && formik.errors.city ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.city}
              </div>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="province"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Province
            </label>
            <select
              id="province"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-white ${
                formik.touched.province && formik.errors.province
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              {...formik.getFieldProps("province")}
            >
              <option value="">Select</option>
              <option value="California">California</option>
              <option value="New York">New York</option>
              <option value="Texas">Texas</option>
            </select>
            {formik.touched.province && formik.errors.province ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.province}
              </div>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="postalcode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Postal Code
            </label>
            <input
              id="postalcode"
              type="text"
              placeholder="Zip Code"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                formik.touched.postalcode && formik.errors.postalcode
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              {...formik.getFieldProps("postalcode")}
            />
            {formik.touched.postalcode && formik.errors.postalcode ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.postalcode}
              </div>
            ) : null}
          </div>
        </div>

        {/* The submit button for the form is now in the OrderSummary component */}
      </form>
    </div>
  );
}
