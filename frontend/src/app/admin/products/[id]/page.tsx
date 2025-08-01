// === PRODUCT DETAIL PAGE (USER) ===
// OnlineGroceryWebApp/frontend/src/app/admin/products/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { Product, CartItem } from "@/interfaces/productAdmin.interface";
import { imageUrl } from "@/config";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // === FETCH DATA PRODUK BERDASARKAN ID ===
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${id}`
        );
        setProduct(res.data?.data || null);
      } catch {
        toast.error("Gagal memuat produk");
        router.push("/products");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, router]);

  // === HANDLE ADD TO CART ===
  const handleAddToCart = () => {
    if (!product) return;

    const cartFromStorage: CartItem[] =
      JSON.parse(localStorage.getItem("cartItems") || "[]") || [];

    const existingIndex = cartFromStorage.findIndex(
      (item) => item.id === product.id
    );

    if (existingIndex >= 0) {
      cartFromStorage[existingIndex].quantity += 1;
    } else {
      cartFromStorage.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartFromStorage));
    toast.success("Produk ditambahkan ke keranjang!");
  };

  // === LOADING STATE ===
  if (loading) {
    return <p className="p-6 text-gray-500">Memuat produk...</p>;
  }

  // === NOT FOUND STATE ===
  if (!product) {
    return <p className="p-6 text-red-500">Produk tidak ditemukan</p>;
  }

  // === RENDER DETAIL PRODUK ===
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* === NAMA PRODUK === */}
      <h1 className="text-2xl font-bold text-green-700">{product.name}</h1>

      {/* === INFO TAMBAHAN === */}
      <p className="text-sm text-gray-500">
        Kategori: <span className="font-medium">{product.categoryName}</span> |
        Toko: <span className="font-medium">{product.branchName}</span>
      </p>

      {/* === GAMBAR PRODUK === */}
      {/* eslint-disable-next-line */}
      <img
        src={`${imageUrl}/${product.image}`}
        alt={product.name}
        width={600}
        height={400}
        className="rounded object-cover"
      />

      {/* === HARGA === */}
      <div className="text-lg font-semibold text-gray-800">
        Rp {product.price.toLocaleString()}
      </div>

      {/* === DESKRIPSI === */}
      <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>

      {/* === STATUS STOK === */}
      <div
        className={`px-3 py-1 inline-block rounded text-sm font-medium ${
          product.stock > 0
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-600"
        }`}
      >
        {product.stock > 0 ? "Tersedia" : "Stok Habis"}
      </div>

      {/* === TOMBOL TAMBAH KE KERANJANG === */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock <= 0}
        className={`block mt-4 px-4 py-2 rounded text-white font-semibold ${
          product.stock > 0
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Tambah ke Keranjang
      </button>
    </div>
  );
}
