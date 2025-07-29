"use client";

import { apiUrl } from "@/config";
import { IExistingAddress, ILocation } from "@/interfaces/address.interface";
import { useAppSelector } from "@/lib/redux/hooks";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import AddAddressModal from "./AddAddressModal";

export default function BillingInformationForm() {
  // state in redux
  const user = useAppSelector((state) => state.auth);
  // local state
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [address, setAddress] = useState<IExistingAddress>();

  const [provinces, setProvinces] = useState<ILocation[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<ILocation | null>(
    null
  );

  const [cities, setCities] = useState<ILocation[]>([]);
  const [selectedCity, setSelectedCity] = useState<ILocation | null>(null);

  const [districts, setDistricts] = useState<ILocation[]>([]);

  const [selectedDistrict, setSelectedDistrict] = useState<ILocation | null>(
    null
  );

  const fetchAddress = async () => {
    try {
      // <-- Add try
      const userId = user.user.id;
      const token = getCookie("access_token") as string;
      const { data } = await axios.get(
        `${apiUrl}/api/users/address/main/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Also, safely access the data
      if (data && data.data && data.data.length > 0) {
        setAddress(data.data[0]);
      }
    } catch (error) {
      // <-- Add catch
      console.error("Failed to fetch address:", error);
      // Optionally, you can set an error state here
    }
  };

  useEffect(() => {
    if (user.user.id) {
      fetchAddress();
    }
  });

  useEffect(() => {
    if (address?.provinces && address?.cities && address?.districts) {
      setSelectedProvince(address?.provinces);
      setSelectedCity(address?.cities);
      setSelectedDistrict(address?.districts);
    }
  }, [address]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...address,
      province: address?.provinces.name,
      city: address?.cities.name,
      district: address?.districts.name,
    },
    onSubmit: async (values) => {
      try {
        const token = getCookie("access_token") as string;
        await axios.put(
          `${apiUrl}/api/addresses/${address?.id}`,
          {
            ...values,
            provinceId: selectedProvince?.id,
            cityId: selectedCity?.id,
            districtId: selectedDistrict?.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsEditMode(false);

        fetchAddress();

        alert("Berhasil mengubah alamat!");
      } catch (err) {
        alert("Error edit new address: " + err);
      }
    },
  });

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/provinces`);
        setProvinces(response.data.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const fetchCities = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/api/cities/${selectedProvince.name}`
          );
          setCities(response.data.data);
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      };

      fetchCities();
    }
  }, [selectedProvince]); // Dependency array with selectedProvince

  useEffect(() => {
    if (selectedCity) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/api/districts?province=${selectedProvince?.name}&city=${selectedCity.name}`
          );
          setDistricts(response.data.data);
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      };

      fetchDistricts();
    }
  }, [selectedCity, selectedProvince]); // Dependency array with selectedCity and selectedProvince

  const handleProvinceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedName = event.target.value;
    const province = provinces.find((p) => p.name === selectedName) || null;
    setSelectedProvince(province);
    formik.setFieldValue("province", province?.name || "");
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = event.target.value;
    const city = cities.find((c) => c.name === selectedName) || null;
    setSelectedCity(city);
    formik.setFieldValue("city", city?.name || "");
  };

  const handleDistrictChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedName = event.target.value;
    const district = districts.find((d) => d.name === selectedName) || null;
    setSelectedDistrict(district);
    formik.setFieldValue("district", district?.name || "");
  };

  if (!address)
    return (
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Main Address</h2>
        <div
          className="w-[15rem] py-3 mt-4 px-4 text-center bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 cursor-default"
          onClick={() => {
            setIsShowModal(true);
          }}
        >
          Add New Address
        </div>
        <AddAddressModal
          onAdd={fetchAddress}
          onClose={() => setIsShowModal(false)}
          isOpen={isShowModal}
        />
      </div>
    );

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {...formik.getFieldProps("province")}
                  onChange={handleProvinceChange}
                  className="mt-1 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Pilih Provinsi</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
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
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City
            </label>
            {isEditMode ? (
              <>
                <select
                  id="city"
                  {...formik.getFieldProps("city")}
                  onChange={handleCityChange}
                  disabled={!formik.values.province}
                  className="mt-1 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                >
                  <option value="">Pilih Kota</option>
                  {formik.values.province &&
                    cities.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="district"
              className="block text-sm font-medium text-gray-700"
            >
              Kecamatan
            </label>
            {isEditMode ? (
              <>
                <select
                  id="district"
                  {...formik.getFieldProps("district")}
                  onChange={handleDistrictChange}
                  disabled={!formik.values.city}
                  className="mt-1 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                >
                  <option value="">Pilih Kecamatan</option>
                  {formik.values.city &&
                    districts.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                </select>
                {formik.touched.district && formik.errors.district ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.district}
                  </div>
                ) : null}
              </>
            ) : (
              <p className="w-full h-10 px-3 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm cursor-not-allowed">
                {address?.districts.name}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Postal Code
            </label>
            {isEditMode ? (
              <>
                <input
                  id="postalCode"
                  type="text"
                  placeholder="Postal Code"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                    formik.touched.postalCode && formik.errors.postalCode
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  {...formik.getFieldProps("postalCode")}
                />
                {formik.touched.postalCode && formik.errors.postalCode ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.postalCode}
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
