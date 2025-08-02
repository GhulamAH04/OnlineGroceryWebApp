"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

import { getRoleFromToken } from "@/utils/getRoleFromToken";
import { inventorySchema } from "@/schemas/inventoryAdmin.schema";
import type {
  InventoryFormInput,
  Inventory,
} from "@/schemas/inventoryAdmin.schema";


export default function InventoryPage() {
  const userRole = getRoleFromToken();
  const [storeAdminBranchId, setStoreAdminBranchId] = useState<number | null>(
    null
  );
  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(inventorySchema),
  });

  const fetchInitialData = async () => {
    try {
      const [productRes, branchRes, invRes] = await Promise.all([
        axios.get("/api/admin/products"),
        axios.get("/api/admin/branches"),
        axios.get("/api/admin/inventory"),
      ]);

      setProducts(productRes.data?.data?.data || []);
      setBranches(branchRes.data?.data || []);
      setInventory(invRes.data?.data || []);
    } catch (err) {
      console.error("❌ Error fetch data:", err);
      toast.error("Gagal memuat data");
    }
  };

  const fetchStoreAdminBranch = async () => {
    if (userRole === "STORE_ADMIN") {
      try {
        const res = await axios.get("/api/admin/me");
        const branchId = res.data?.data?.branchId;
        setStoreAdminBranchId(branchId);
        reset((prev) => ({ ...prev, branchId }));
      } catch {
        console.error("❌ Gagal ambil cabang STORE_ADMIN");
      }
    }
  };

  useEffect(() => {
    fetchInitialData();
    fetchStoreAdminBranch();
  }, []);

  const onSubmit = async (data: InventoryFormInput) => {
    try {
      setIsSubmitting(true);
      await axios.put("/api/admin/inventory", data);
      toast.success("Stok berhasil diperbarui");
      reset();
      fetchInitialData();
    } catch {
      toast.error("Gagal memperbarui stok");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-green-700 text-center">
          Manajemen Stok Produk
        </h1>

        {/* === FORM MUTASI STOK === */}
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
                <option key={p.id} value={p.id}>
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
              disabled={userRole === "STORE_ADMIN"}
              defaultValue={
                userRole === "STORE_ADMIN" ? storeAdminBranchId ?? "" : ""
              }
            >
              <option value="">Pilih Cabang</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
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
            <select
              {...register("transactionType")}
              className="w-full border rounded p-2"
            >
              <option value="">Pilih Tipe</option>
              <option value="IN">IN (Penambahan)</option>
              <option value="OUT">OUT (Pengurangan)</option>
            </select>
            {errors.transactionType && (
              <p className="text-red-500 text-sm">
                {errors.transactionType.message}
              </p>
            )}
          </div>

          {/* Jumlah */}
          <div>
            <label className="block mb-1">Jumlah</label>
            <input
              type="number"
              {...register("quantity")}
              className="w-full border rounded p-2"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm">{errors.quantity.message}</p>
            )}
          </div>

          {/* Catatan */}
          <div className="md:col-span-2">
            <label className="block mb-1">Catatan (opsional)</label>
            <textarea
              {...register("description")}
              rows={2}
              className="w-full border rounded p-2"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {isSubmitting ? "Menyimpan..." : "Update Stok"}
            </button>
          </div>
        </form>

        {/* === TABEL INVENTORY === */}
        <table className="w-full border text-sm">
          <thead className="bg-green-100">
            <tr>
              <th className="p-2 border">Produk</th>
              <th className="p-2 border">Toko</th>
              <th className="p-2 border">Stok</th>
              <th className="p-2 border">Terakhir Update</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id}>
                <td className="p-2 border">{item.products?.name}</td>
                <td className="p-2 border">{item.branchs?.name}</td>
                <td className="p-2 border">{item.stock}</td>
                <td className="p-2 border">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {inventory.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Tidak ada data stok
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
