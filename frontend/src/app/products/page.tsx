// === FILE: app/products/page.tsx ===

"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/interfaces/productAdmin.interface";
import { toast } from "sonner";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/products") // ✅ PENTING: gunakan endpoint backend, bukan /api/products
      .then((res) => {
        console.log("RESPON:", res.data);
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        setProducts(data);
      })
      .catch((err) => {
        console.error("Gagal fetch produk:", err);
        toast.error("Gagal memuat produk.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-500">Memuat produk...</p>;
  }

  if (products.length === 0) {
    return (
      <p className="p-6 text-center text-gray-600">
        Tidak ada produk tersedia di lokasi Anda.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((product) => {
        const imageSrc = product.image?.startsWith("http")
          ? product.image
          : "https://res.cloudinary.com/djbdfjx1d/image/upload/v1746972046/nugget_plgi8w.jpg";

        return (
          <Link
            href={`/products/${product.id}`} // ✅ PASTIKAN `id` ADA dan VALID
            key={product.id}
            className="border rounded-lg p-4 hover:shadow-md hover:border-green-500 transition"
          >
            <div className="relative w-full h-40 mb-2">
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                priority
              />
            </div>
            <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-green-600 font-semibold">
              Rp {product.price.toLocaleString()}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
