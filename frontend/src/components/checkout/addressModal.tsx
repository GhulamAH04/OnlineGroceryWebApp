"use client";

import { apiUrl } from "@/config";
import { useAppSelector } from "@/lib/redux/hooks";
import { AddNewAddressSchema } from "@/schemas/address.schema";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useFormik } from "formik";
import { CheckCircle, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

// --- TIPE DATA (TYPESCRIPT) ---
export interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  province: { id: string; name: string };
  city: { id: string; name: string };
  district: { id: string; name: string };
  postalCode: string;
  isPrimary: boolean;
}

// --- KOMPONEN ---

// Komponen Modal untuk memilih atau menambah alamat
const AddressModal = ({
  isOpen,
  onClose,
  addresses,
  onSelectAddress,
  onAddNewAddress,
  selectedAddressId,
}: {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  onSelectAddress: (address: Address) => void;
  /* eslint-disable-next-line */
  onAddNewAddress: (values: any) => void;
  selectedAddressId: number | null;
}) => {
  // state in redux
  const user = useAppSelector((state) => state.auth);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedProvince, setSelectedProvince] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [selectedCity, setSelectedCity] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [districts, setDistricts] = useState<{ id: string; name: string }[]>(
    []
  );

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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      userId: user.user.id,
      name: "",
      phone: "",
      address: "",
      province: "",
      city: "",
      district: "",
      postalCode: "",
      isPrimary: true,
    },
    validationSchema: AddNewAddressSchema,
    onSubmit: async (values) => {
      try {
        const token = getCookie("access_token") as string;
        await axios.post(`${apiUrl}/api/addresses`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        onAddNewAddress(values);

        formik.resetForm();
        setIsAddingNew(false);

        alert("Alamat berhasil ditambahkan!");
      } catch (err) {
        alert("Error adding new address: " + err);
      }
    },
  });

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {isAddingNew ? "Tambah Alamat Baru" : "Pilih Alamat Pengiriman"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isAddingNew ? (
            <form onSubmit={formik.handleSubmit}>
              {/* Form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Label Alamat (cth: Rumah)
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...formik.getFieldProps("name")}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.name}
                    </div>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    id="phone"
                    {...formik.getFieldProps("phone")}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.phone}
                    </div>
                  ) : null}
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Alamat Lengkap
                  </label>
                  <textarea
                    id="address"
                    {...formik.getFieldProps("address")}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  ></textarea>
                  {formik.touched.address && formik.errors.address ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.address}
                    </div>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="province"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Provinsi
                  </label>
                  <select
                    id="province"
                    {...formik.getFieldProps("province")}
                    onChange={handleProvinceChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
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
                    {...formik.getFieldProps("city")}
                    onChange={handleCityChange}
                    disabled={!formik.values.province}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
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
                </div>
                <div>
                  <label
                    htmlFor="district"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Kecamatan
                  </label>
                  <select
                    id="district"
                    {...formik.getFieldProps("district")}
                    disabled={!formik.values.city}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
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
                </div>
                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    {...formik.getFieldProps("postalCode")}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                  {formik.touched.postalCode && formik.errors.postalCode ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.postalCode}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Simpan Alamat
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  onClick={() => onSelectAddress(address)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedAddressId === address.id
                      ? "border-green-500 ring-2 ring-green-200"
                      : "border-gray-300 hover:border-green-400"
                  }`}
                >
                  <div className="flex justify-between gap-2 items-start">
                    <div>
                      <p className="font-bold text-gray-800">{address.name}</p>
                      <p className="text-sm text-gray-600">{address.phone}</p>
                      <p className="text-sm text-gray-500 mt-1">{`${address.address}, ${address.district}, ${address.city}, ${address.province}`}</p>
                    </div>
                    {address.isPrimary && (
                      <p className="text-xs w-[125px] h-6 text-center rounded-sm text-green-500 border-1 border-green-500 p-1">
                        Alamat Utama
                      </p>
                    )}
                    {selectedAddressId === address.id && (
                      <CheckCircle className="text-green-500" size={24} />
                    )}
                  </div>
                </div>
              ))}
              <button
                onClick={() => setIsAddingNew(true)}
                className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-500 transition"
              >
                <Plus size={20} /> Tambah Alamat Baru
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
