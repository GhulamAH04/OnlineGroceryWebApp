// FILE: frontend/src/app/cart/page.tsx
"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart.store";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import Link from "next/link";

// Komponen Skeleton Loader sederhana
const CartSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-24 bg-gray-200 rounded-md mb-4"></div>
    <div className="h-24 bg-gray-200 rounded-md mb-4"></div>
    <div className="h-24 bg-gray-200 rounded-md mb-4"></div>
  </div>
);

export default function CartPage() {
  const { items, isLoading, error, fetchCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Keranjang Belanja</h1>
      {error && (
        <p className="text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {isLoading ? (
            <CartSkeleton />
          ) : items.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <h2 className="text-xl text-gray-700">Keranjang Anda kosong.</h2>
              <Link href="/">
                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                  Mulai Belanja
                </button>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
