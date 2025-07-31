// === FILE: app/admin/branches/page.tsx ===
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ConfirmModal from "@/components/features2/common/ConfirmModal";
import { Branch } from "@/interfaces/branchAdmin";

// === YUP VALIDATION SCHEMA ===
const schema = yup.object().shape({
  name: yup.string().required("Nama wajib diisi"),
  address: yup.string().required("Alamat wajib diisi"),
  postalCode: yup.string().required("Kode pos wajib diisi"),
  provinceId: yup.number().required("ID Provinsi wajib diisi"),
  cityId: yup.number().required("ID Kota wajib diisi"),
  districtId: yup.number().required("ID Kecamatan wajib diisi"),
  latitude: yup.number().required("Latitude wajib diisi"),
  longitude: yup.number().required("Longitude wajib diisi"),
});

export default function BranchPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBranch, setEditBranch] = useState<Branch | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [assignId, setAssignId] = useState<number | null>(null);
  const [storeAdmins, setStoreAdmins] = useState<
    { id: number; email: string }[]
  >([]);
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/admin/branches");
      setBranches(res.data.data);
    } catch {
      toast.error("Gagal memuat data cabang");
    }
  };

  const fetchStoreAdmins = async () => {
    try {
      const res = await axios.get("/api/admin/users");
      setStoreAdmins(res.data.data);
    } catch {
      toast.error("Gagal memuat store admin");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data: Omit<Branch, "id">) => {
    try {
      if (editBranch) {
        await axios.put(`/api/admin/branches/${editBranch.id}`, data);
        toast.success("Cabang berhasil diperbarui");
      } else {
        await axios.post("/api/admin/branches", data);
        toast.success("Cabang berhasil ditambahkan");
      }
      fetchData();
      reset();
      setEditBranch(null);
      setIsModalOpen(false);
    } catch {
      toast.error("Gagal menyimpan data cabang");
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      await axios.delete(`/api/admin/branches/${confirmId}`);
      toast.success("Cabang berhasil dihapus");
      fetchData();
      setConfirmId(null);
    } catch {
      toast.error("Gagal menghapus data cabang");
    }
  };

  const handleAssign = async () => {
    if (!assignId || !selectedAdminId) return;
    try {
      await axios.put(
        `/api/admin/branches/${assignId}/assign/${selectedAdminId}`
      );
      toast.success("Store Admin berhasil di-assign ke cabang");
      setAssignId(null);
      setSelectedAdminId(null);
      fetchData();
    } catch {
      toast.error("Gagal assign Store Admin");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Branch Management</h1>
        <button
          onClick={() => {
            setEditBranch(null);
            setIsModalOpen(true);
            reset();
          }}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Tambah Cabang
        </button>
      </div>

      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Nama</th>
            <th className="border px-3 py-2">Alamat</th>
            <th className="border px-3 py-2">Kode Pos</th>
            <th className="border px-3 py-2">Provinsi</th>
            <th className="border px-3 py-2">Kota</th>
            <th className="border px-3 py-2">Kecamatan</th>
            <th className="border px-3 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((b) => (
            <tr key={b.id}>
              <td className="border px-3 py-1">{b.name}</td>
              <td className="border px-3 py-1">{b.address}</td>
              <td className="border px-3 py-1">{b.postalCode}</td>
              <td className="border px-3 py-1">{b.provinceId}</td>
              <td className="border px-3 py-1">{b.cityId}</td>
              <td className="border px-3 py-1">{b.districtId}</td>
              <td className="border px-3 py-1 space-x-2">
                <button
                  onClick={() => {
                    setEditBranch(b);
                    reset(b);
                    setIsModalOpen(true);
                  }}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmId(b.id)}
                  className="text-red-600"
                >
                  Hapus
                </button>
                <button
                  onClick={() => {
                    setAssignId(b.id);
                    fetchStoreAdmins();
                  }}
                  className="text-purple-600"
                >
                  Assign Admin
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* === MODAL FORM === */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-[500px] max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-semibold mb-4">
              {editBranch ? "Edit Cabang" : "Tambah Cabang"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <input
                {...register("name")}
                placeholder="Nama"
                className="input"
              />
              <p className="text-red-500 text-sm">{errors.name?.message}</p>
              <input
                {...register("address")}
                placeholder="Alamat"
                className="input"
              />
              <input
                {...register("postalCode")}
                placeholder="Kode Pos"
                className="input"
              />
              <input
                type="number"
                {...register("provinceId")}
                placeholder="ID Provinsi"
                className="input"
              />
              <input
                type="number"
                {...register("cityId")}
                placeholder="ID Kota"
                className="input"
              />
              <input
                type="number"
                {...register("districtId")}
                placeholder="ID Kecamatan"
                className="input"
              />
              <input
                type="number"
                step="0.000001"
                {...register("latitude")}
                placeholder="Latitude"
                className="input"
              />
              <input
                type="number"
                step="0.000001"
                {...register("longitude")}
                placeholder="Longitude"
                className="input"
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setEditBranch(null);
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === CONFIRM MODAL DELETE === */}
      {confirmId && (
        <ConfirmModal
          open={Boolean(confirmId)}
          onCancel={() => setConfirmId(null)}
          onConfirm={handleDelete}
          title="Hapus Cabang"
          description="Yakin ingin menghapus cabang ini?"
        />
      )}

      {/* === MODAL ASSIGN ADMIN === */}
      {assignId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Assign Store Admin</h2>
            <select
              value={selectedAdminId ?? ""}
              onChange={(e) => setSelectedAdminId(Number(e.target.value))}
              className="w-full border px-3 py-2 rounded mb-4"
            >
              <option value="" disabled>
                Pilih Store Admin
              </option>
              {storeAdmins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.email}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setAssignId(null);
                  setSelectedAdminId(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleAssign}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
