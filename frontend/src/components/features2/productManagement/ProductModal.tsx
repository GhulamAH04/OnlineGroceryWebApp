// === FILE: ProductModal.tsx ===

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/features2/ui/dialog";
import { Button } from "@/components/features2/ui/button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  productAdminSchema,
  ProductAdminInput,
} from "@/schemas/productAdmin.schema";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  selectedProduct: (ProductAdminInput & { id?: number }) | null;
  branches: { id: number; name: string }[];
  categories: { id: number; name: string }[];
}

export default function ProductModal({
  open,
  onClose,
  onSubmit,
  selectedProduct,
  branches,
  categories,
}: Props) {
  const [image, setImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productAdminSchema),
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
      description: "",
      branchId: 0,
      categoryId: 0,
    },
  });

  useEffect(() => {
    if (selectedProduct) {
      reset({
        name: selectedProduct.name || "",
        price: selectedProduct.price || 0,
        stock: selectedProduct.stock || 0,
        description: selectedProduct.description || "",
        branchId: selectedProduct.branchId,
        categoryId: selectedProduct.categoryId,
      });
    } else {
      reset();
    }
    setImage(null);
  }, [selectedProduct, reset]);

  const handleFormSubmit = (data: ProductAdminInput) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    if (image) {
      formData.append("images", image);
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {selectedProduct ? "Edit Produk" : "Tambah Produk"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* === NAMA === */}
          <div>
            <label className="block text-sm mb-1 font-medium">
              Nama Produk
            </label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              {...register("name")}
            />
            {errors?.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* === HARGA === */}
          <div>
            <label className="block text-sm mb-1 font-medium">Harga</label>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded"
              {...register("price")}
            />
            {errors?.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          {/* === STOK === */}
          <div>
            <label className="block text-sm mb-1 font-medium">Stok</label>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded"
              {...register("stock")}
            />
            {errors?.stock && (
              <p className="text-sm text-red-500">{errors.stock.message}</p>
            )}
          </div>

          {/* === DESKRIPSI === */}
          <div>
            <label className="block text-sm mb-1 font-medium">Deskripsi</label>
            <textarea
              className="w-full border px-3 py-2 rounded"
              {...register("description")}
            />
            {errors?.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* === TOKO === */}
          <div>
            <label className="block text-sm mb-1 font-medium">Toko</label>
            <select
              {...register("branchId")}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-- Pilih Toko --</option>
              {Array.isArray(branches) &&
                branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
            </select>
            {errors?.branchId && (
              <p className="text-sm text-red-500">{errors.branchId.message}</p>
            )}
          </div>

          {/* === KATEGORI === */}
          <div>
            <label className="block text-sm mb-1 font-medium">Kategori</label>
            <select
              {...register("categoryId")}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors?.categoryId && (
              <p className="text-sm text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* === GAMBAR === */}
          <div>
            <label className="block text-sm mb-1 font-medium">
              Gambar Produk
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImage(file);
                }}
              />
              {image && (
                <span className="text-sm text-gray-600">{image.name}</span>
              )}
            </div>
          </div>

          {/* === BUTTON === */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
