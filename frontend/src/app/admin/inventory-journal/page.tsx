"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

import {
  InventoryJournal,
  InventoryJournalForm,
} from "@/interfaces/inventoryAdmin";
import { inventoryJournalSchema } from "@/schemas/inventoryJournalSchema";
import ConfirmModal from "@/components/features2/common/ConfirmModal";
import { getRoleFromToken } from "@/utils/getRoleFromToken";

export default function InventoryJournalPage() {
  const [journals, setJournals] = useState<InventoryJournal[]>([]);
  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [role, setRole] = useState<
    "SUPER_ADMIN" | "STORE_ADMIN" | "USER" | null
  >(null);
  const [storeBranchId, setStoreBranchId] = useState<number | null>(null);

  // === FETCH DATA ===
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userRole = getRoleFromToken();
      setRole(userRole);

      const [journalRes, productRes, branchRes] = await Promise.all([
        axios.get("/api/admin/inventory-journal", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/admin/products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/admin/branches", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Set Journals
      setJournals(
        Array.isArray(journalRes.data?.data) ? journalRes.data.data : []
      );

      // Set Products (deduplicate)
      const productData = productRes.data?.data?.data;
      if (Array.isArray(productData)) {
        const typedProducts = productData as { id: number; name: string }[];
        const uniqueProducts = Array.from(
          new Map(typedProducts.map((p) => [p.id, p])).values()
        );
        setProducts(uniqueProducts);
      } else {
        setProducts([]);
      }

      // Set Branches
      const branchList = branchRes.data?.data;
      if (Array.isArray(branchList)) {
        setBranches(branchList);
        // Auto-assign branch for STORE_ADMIN
        if (userRole === "STORE_ADMIN" && branchList.length === 1) {
          setStoreBranchId(branchList[0].id);
        }
      }
    } catch (err) {
      console.error("❌ fetch error:", err);
      toast.error("Gagal mengambil data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(inventoryJournalSchema),
  });

  // === SET BRANCH AUTO FOR STORE ADMIN ===
  useEffect(() => {
    if (role === "STORE_ADMIN" && storeBranchId) {
      setValue("branchId", storeBranchId);
    }
  }, [role, storeBranchId, setValue]);

  const onSubmit = async (data: InventoryJournalForm) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");

      await axios.post("/api/admin/inventory-journal", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Jurnal stok berhasil ditambahkan");
      reset();
      fetchData();
    } catch {
      toast.error("Gagal menambahkan jurnal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`/api/admin/inventory-journal/${confirmId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Jurnal berhasil dihapus");
      fetchData();
    } catch {
      toast.error("Gagal menghapus jurnal");
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-green-700 text-center">
          Jurnal Perubahan Stok
        </h1>

        {/* === FORM TAMBAH === */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          {/* Produk */}
          <div>
            <label className="block mb-1">Produk</label>
            <select
              {...register("productId")}
              className="w-full border rounded p-2"
            >
              <option value="">Pilih Produk</option>
              {products.map((p) => (
                <option key={`product-${p.id}`} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.productId && (
              <p className="text-red-500 text-sm">{errors.productId.message}</p>
            )}
          </div>

          {/* Cabang */}
          <div>
            <label className="block mb-1">Toko Cabang</label>
            <select
              {...register("branchId")}
              className="w-full border rounded p-2"
              disabled={role === "STORE_ADMIN"}
            >
              <option value="">Pilih Cabang</option>
              {branches.map((branch) => (
                <option key={`branch-${branch.id}`} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            {errors.branchId && (
              <p className="text-red-500 text-sm">{errors.branchId.message}</p>
            )}
          </div>

          {/* Tipe */}
          <div>
            <label className="block mb-1">Tipe</label>
            <select {...register("type")} className="w-full border rounded p-2">
              <option value="">Pilih Tipe</option>
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type.message}</p>
            )}
          </div>

          {/* Jumlah */}
          <div>
            <label className="block mb-1">Jumlah</label>
            <input
              type="number"
              {...register("stock")}
              className="w-full border rounded p-2"
            />
            {errors.stock && (
              <p className="text-red-500 text-sm">{errors.stock.message}</p>
            )}
          </div>

          {/* Catatan */}
          <div className="md:col-span-2">
            <label className="block mb-1">Catatan (opsional)</label>
            <textarea
              {...register("note")}
              rows={2}
              className="w-full border rounded p-2"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Tambah Jurnal"}
            </button>
          </div>
        </form>

        {/* === TABEL JURNAL === */}
        <table className="w-full border text-sm">
          <thead className="bg-green-100">
            <tr>
              <th className="p-2 border">Produk</th>
              <th className="p-2 border">Toko</th>
              <th className="p-2 border">Tipe</th>
              <th className="p-2 border">Jumlah</th>
              <th className="p-2 border">Catatan</th>
              <th className="p-2 border">Tanggal</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {journals.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              journals.map((j) => (
                <tr key={j.id} className="border">
                  <td className="p-2">{j.productName}</td>
                  <td className="p-2">{j.branchName}</td>
                  <td className="p-2">{j.action}</td>
                  <td className="p-2">{j.amount}</td>
                  <td className="p-2">{j.note || "-"}</td>
                  <td className="p-2">
                    {new Date(j.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => setConfirmId(j.id)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* === MODAL KONFIRMASI HAPUS === */}
        {confirmId && (
          <ConfirmModal
            open={!!confirmId}
            onCancel={() => setConfirmId(null)}
            onConfirm={handleDelete}
            title="Hapus Jurnal"
            description="Yakin ingin menghapus jurnal ini?"
          />
        )}
      </div>
    </div>
  );
}
