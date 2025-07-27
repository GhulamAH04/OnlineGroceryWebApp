// OnlineGroceryWebApp/frontend/src/app/admin/inventory-journal/page.tsx
// === INVENTORY JOURNAL PAGE ===
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

import {
  InventoryJournal,
  InventoryJournalForm,
} from "@/interfaces/inventoryAdmin";
import { inventoryJournalSchema } from "@/schemas/inventoryJournalSchema";
import ConfirmModal from "@/components/features2/common/ConfirmModal";

export default function InventoryJournalPage() {
  // === STATE ===
  const [journals, setJournals] = useState<InventoryJournal[]>([]);
  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === FETCH DATA JURNAL, PRODUK, CABANG ===
  const fetchData = async () => {
    try {
      const [journalRes, productRes, branchRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/inventory-journal`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/products`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/branches`),
      ]);
      setJournals(journalRes.data.data);
      setProducts(productRes.data.data);
      setBranches(branchRes.data.data);
    } catch {
      toast.error("Gagal mengambil data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // === FORM SETUP ===
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(inventoryJournalSchema),
  });

  // === SUBMIT FORM TAMBAH JURNAL ===
  const onSubmit = async (data: InventoryJournalForm) => {
    try {
      setIsSubmitting(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/inventory-journal`,
        data
      );
      toast.success("Jurnal stok berhasil ditambahkan");
      reset();
      fetchData();
    } catch {
      toast.error("Gagal menambahkan jurnal");
    } finally {
      setIsSubmitting(false);
    }
  };

  // === HANDLE DELETE JURNAL ===
  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/inventory-journal/${confirmId}`
      );
      toast.success("Jurnal berhasil dihapus");
      fetchData();
    } catch {
      toast.error("Gagal menghapus jurnal");
    } finally {
      setConfirmId(null);
    }
  };

  // === RENDER ===
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-green-700 text-center">
          Jurnal Perubahan Stok
        </h1>

        {/* === FORM TAMBAH JURNAL === */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
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

          <div>
            <label className="block mb-1">Toko Cabang</label>
            <select
              {...register("branchId")}
              className="w-full border rounded p-2"
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
            {journals.map((j) => (
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
                    className="text-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* === MODAL KONFIRMASI HAPUS === */}
        {confirmId && (
          <ConfirmModal
            open={Boolean(confirmId)}
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
