// === DISCOUNT MANAGEMENT PAGE ===
"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

import {
  discountAdminSchema,
  DiscountAdminInput,
} from "@/schemas/discountAdmin.schema";
import { Discount } from "@/interfaces/discountAdmin";
import { Product } from "@/interfaces/productAdmin.interface";
import ConfirmModal from "@/components/features2/common/ConfirmModal";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import { getRoleFromToken } from "@/utils/getRoleFromToken";
import { PaginationResponse } from "@/interfaces/pagination";

export default function DiscountPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] =
    useState<PaginationResponse<Discount>["pagination"]>();
  const [editId, setEditId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [role, setRole] = useState<"SUPER_ADMIN" | "STORE_ADMIN" | null>(null);
  const debouncedSearch = useDebounceSearch(search);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(discountAdminSchema),
  });

  useEffect(() => {
    setRole(getRoleFromToken());
  }, []);

  const fetchData = async () => {
    try {
      const [discRes, prodRes] = await Promise.all([
        axios.get<PaginationResponse<Discount>>(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/discounts`,
          {
            params: {
              page,
              limit: 10,
              search: debouncedSearch,
              sortBy: "expiredAt",
              sortOrder,
            },
          }
        ),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/products`),
      ]);

      setDiscounts(discRes?.data?.data ?? []);
      setPagination(discRes.data.pagination);
      setProducts(Array.isArray(prodRes?.data?.data) ? prodRes.data.data : []);
    } catch {
      toast.error("Gagal mengambil data diskon");
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, page, sortOrder]);

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

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-green-700 text-center">
          Manajemen Diskon Produk
        </h1>

        {/* === SEARCH & SORT === */}
        <div className="mb-4 flex flex-col md:flex-row gap-2 justify-between items-center">
          <input
            type="text"
            placeholder="Cari nama produk..."
            className="border rounded p-2 w-full md:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="border rounded p-2"
          >
            <option value="asc">Terlama</option>
            <option value="desc">Terkini</option>
          </select>
        </div>

        {role === "SUPER_ADMIN" && (
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
                <p className="text-red-500 text-sm">
                  {errors.productId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1">Tipe</label>
              <select
                {...register("type")}
                className="w-full border rounded p-2"
              >
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
                <p className="text-red-500 text-sm">
                  {errors.expiredAt.message}
                </p>
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
        )}

        {role === "STORE_ADMIN" && (
          <p className="text-sm text-gray-500 italic mb-4 text-center">
            Anda hanya dapat melihat daftar diskon (read-only).
          </p>
        )}

        {/* === TABLE === */}
        <table className="w-full border text-sm">
          <thead className="bg-green-100">
            <tr>
              <th className="p-2 border">Produk</th>
              <th className="p-2 border">Tipe</th>
              <th className="p-2 border">Nilai</th>
              <th className="p-2 border">Minimal Belanja</th>
              <th className="p-2 border">Kadaluarsa</th>
              {role === "SUPER_ADMIN" && <th className="p-2 border">Aksi</th>}
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
                {role === "SUPER_ADMIN" && (
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
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* === PAGINATION === */}
        {pagination && (
          <div className="flex justify-between items-center mt-4 text-sm">
            <p>
              Halaman {pagination.page} dari {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={pagination.page === 1}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() =>
                  setPage((prev) =>
                    prev < pagination.totalPages ? prev + 1 : prev
                  )
                }
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* === MODAL DELETE === */}
        {confirmId && role === "SUPER_ADMIN" && (
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
