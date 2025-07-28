"use client";

import { apiUrl } from "@/config";
import { IExistingAddress, ILocation } from "@/interfaces/address.interface";
import { useAppSelector } from "@/lib/redux/hooks";
import { BillingSchema } from "@/schemas/address.schema";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useFormik } from "formik";
import { useEffect, useState } from "react";

export default function BillingInformationForm() {
  // state in redux
  const user = useAppSelector((state) => state.auth);
  // local state
  const [isEditMode, setIsEditMode] = useState(false);
  const [cities, setCities] = useState<ILocation[]>([]);
  const [provinces, setProvinces] = useState<ILocation[]>([]);
  const [address, setAddress] = useState<IExistingAddress>();

  useEffect(() => {
    const userId = user.user.id;
    const token = getCookie("access_token") as string;
    const fetchAddress = async () => {
      const { data } = await axios.get(
        `${apiUrl}/api/users/address/main/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAddress(data.data[0]);
    };
    if (userId !== 0) fetchAddress();
  }, [user]);

  // Formik setup
  const formik = useFormik({
    enableReinitialize: true, // Enable reinitialization
    initialValues: {
      address: address?.address || "",
      city: address?.cities.id || "",
      province: address?.provinces.id || "",
      postalcode: address?.postalCode || "",
    },
    validationSchema: BillingSchema,
    onSubmit: async (values) => {
      try {
        await axios.put(`${apiUrl}/api/addresses/${user.user.id}`, { values });

        alert("Edit address success");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const errorMessage = err.response.data.message;
          alert(`${errorMessage}`);
        } else {
          alert("An unexpected error occurred");
        }
      }
    },
  });

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/api/cities`);
        setCities(data.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const errorMessage = err.response.data.message;
          alert(`${errorMessage}`);
        } else {
          alert("An unexpected error occurred");
        }
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/api/provinces`);
        setProvinces(data.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const errorMessage = err.response.data.message;
          alert(`${errorMessage}`);
        } else {
          alert("An unexpected error occurred");
        }
      }
    };
    fetchProvinces();
  }, []);

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Main Address</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Street Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Address
          </label>
          {isEditMode ? (
            <>
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
            </>
          ) : (
            <p className="w-full h-10 px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm cursor-not-allowed">
              {address?.address}
            </p>
          )}
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
            {isEditMode ? (
              <>
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
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {formik.touched.city && formik.errors.city ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.city}
                  </div>
                ) : null}
              </>
            ) : (
              <p className="w-full h-10 px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm cursor-not-allowed">
                {address?.cities.name}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="province"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Province
            </label>
            {isEditMode ? (
              <>
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
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
                {formik.touched.province && formik.errors.province ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.province}
                  </div>
                ) : null}
              </>
            ) : (
              <p className="w-full h-10 px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm cursor-not-allowed">
                {address?.provinces.name}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="postalcode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Postal Code
            </label>
            {isEditMode ? (
              <>
                <input
                  id="postalcode"
                  type="text"
                  placeholder="Postal Code"
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
              </>
            ) : (
              <p className="w-full h-10 px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm cursor-not-allowed">
                {address?.postalCode}
              </p>
            )}
          </div>
        </div>
        {/* Submit Button*/}
        <div className="flex gap-2">
          {isEditMode ? (
            <button
              type="submit"
              className="w-[9rem] py-3 mt-4 px-4 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
            >
              {formik.isSubmitting ? "Saving Changes..." : "Save Change"}
            </button>
          ) : (
            <div
              className="w-[10rem] py-3 mt-4 px-4 text-center bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 cursor-default"
              onClick={() => {
                setIsEditMode(true);
              }}
            >
              Edit Address
            </div>
          )}
          {isEditMode && (
            <div
              className="w-[11rem] py-3 mt-4 px-4 text-center bg-yellow-600 text-white font-semibold rounded-full hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 cursor-default"
              onClick={() => setIsEditMode(false)}
            >
              Discard Changes
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
