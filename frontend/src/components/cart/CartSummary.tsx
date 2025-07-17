// FILE: frontend/src/components/cart/CartSummary.tsx
"use client";

import { useCartStore } from "@/stores/cart.store";
import Link from "next/link";
import { useMemo } from "react";

export default function CartSummary() {
  const items = useCartStore((state) => state.items);

  const subtotal = useMemo(() => {
    return items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }, [items]);

  // Ongkos kirim akan dihitung di halaman checkout
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Ringkasan Belanja</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between">
          <span>Ongkos Kirim</span>
          <span>(dihitung di checkout)</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span>Rp {total.toLocaleString("id-ID")}</span>
        </div>
      </div>
      <Link href="/checkout">
        <button
          disabled={items.length === 0}
          className="w-full mt-6 bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400"
        >
          Lanjut ke Checkout
        </button>
      </Link>
    </div>
  );
}
