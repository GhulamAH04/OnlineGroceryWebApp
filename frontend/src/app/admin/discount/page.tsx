// === DISCOUNT MANAGEMENT PAGE ===
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

import {
  discountAdminSchema,
  DiscountAdminInput,
} from "@/schemas/discountAdmin.schema";
import { Discount } from "@/interfaces/discountAdmin";
import ConfirmModal from "@/components/features2/common/ConfirmModal";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";

export default function DiscountPage() {
  // === STATE ===
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounceSearch(search);

  // === FORM SETUP ===
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(discountAdminSchema),
  });

  // === FETCH DATA DISKON & PRODUK ===
  const fetchData = async () => {
    try {
      const [discRes, prodRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/discounts`, {
          params: { search: debouncedSearch },
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/products`),
      ]);
      setDiscounts(discRes.data.data);
      setProducts(prodRes.data.data);
    } catch {
      toast.error("Gagal mengambil data diskon");
    }
  };

  useEffect(() => {
    fetchData();
    /* eslint-disable-next-line */
  }, [debouncedSearch]);

  // === SUBMIT FORM DISKON ===
  const onSubmit = async (data: DiscountAdminInput) => {
    try {
      const payload = {
        ...data,
        expiredAt: new Date(data.expiredAt),
      };

      if (editId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/discounts/${editId}`,
          payload
        );
        toast.success("Diskon berhasil diperbarui");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/discounts`,
          payload
        );
        toast.success("Diskon berhasil ditambahkan");
      }

      reset();
      setEditId(null);
      fetchData();
    } catch {
      toast.error("Gagal menyimpan diskon");
    }
  };

  // === HANDLE EDIT ===
  const handleEdit = (item: Discount) => {
    reset({
      productId: item.productId,
      type: item.type,
      value: item.value,
      isPercentage: item.isPercentage,
      minPurchase: item.minPurchase,
      expiredAt: item.expiredAt.slice(0, 10),
    });
    setEditId(item.id);
  };

  // === HANDLE DELETE ===
  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/discounts/${confirmId}`
      );
      toast.success("Diskon berhasil dihapus");
      fetchData();
    } catch {
      toast.error("Gagal menghapus diskon");
    } finally {
      setConfirmId(null);
    }
  };

  // === RENDER ===
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-green-700 text-center">
          Manajemen Diskon Produk
        </h1>

        {/* === SEARCH DISKON === */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari nama produk..."
            className="border rounded p-2 w-full md:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* === FORM INPUT DISKON === */}
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
            <label className="block mb-1">Tipe</label>
            <select {...register("type")} className="w-full border rounded p-2">
              <option value="">Pilih Tipe</option>
              <option value="PERCENTAGE">Persentase</option>
              <option value="NOMINAL">Nominal</option>
              <option value="BUY1GET1">Beli 1 Gratis 1</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Nilai Diskon</label>
            <input
              type="number"
              {...register("value")}
              className="w-full border rounded p-2"
            />
            {errors.value && (
              <p className="text-red-500 text-sm">{errors.value.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Diskon dalam bentuk</label>
            <select
              {...register("isPercentage")}
              className="w-full border rounded p-2"
            >
              <option value="true">%</option>
              <option value="false">Rp</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Minimum Pembelian (opsional)</label>
            <input
              type="number"
              {...register("minPurchase")}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block mb-1">Tanggal Expired</label>
            <input
              type="date"
              {...register("expiredAt")}
              className="w-full border rounded p-2"
            />
            {errors.expiredAt && (
              <p className="text-red-500 text-sm">{errors.expiredAt.message}</p>
            )}
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {editId ? "Update" : "Tambah"}
            </button>
          </div>
        </form>

        {/* === TABEL DISKON === */}
        <table className="w-full border text-sm">
          <thead className="bg-green-100">
            <tr>
              <th className="p-2 border">Produk</th>
              <th className="p-2 border">Tipe</th>
              <th className="p-2 border">Nilai</th>
              <th className="p-2 border">Minimal Belanja</th>
              <th className="p-2 border">Kadaluarsa</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.id}>
                <td className="p-2 border">{d.productName}</td>
                <td className="p-2 border">{d.type}</td>
                <td className="p-2 border">
                  {d.isPercentage
                    ? `${d.value}%`
                    : `Rp${d.value.toLocaleString()}`}
                </td>
                <td className="p-2 border">{d.minPurchase ?? "-"}</td>
                <td className="p-2 border">
                  {new Date(d.expiredAt).toLocaleDateString()}
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(d)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmId(d.id)}
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
            title="Hapus Diskon"
            description="Yakin ingin menghapus diskon ini?"
          />
        )}
      </div>
    </div>
  );
}
