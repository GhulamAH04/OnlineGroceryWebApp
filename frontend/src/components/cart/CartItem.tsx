// FILE: frontend/src/components/cart/CartItem.tsx
"use client";

import { useCartStore } from "@/stores/cart.store";
import Image from "next/image";
import { Trash2 } from "lucide-react"; // contoh ikon

// Tipe data disamakan dengan store
interface ProductCart {
  id: number;
  quantity: number;
  product: { name: string; price: number; image: string | null };
}

interface CartItemProps {
  item: ProductCart;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateItemQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      updateItemQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <Image
          src={item.product.image || "/product.jpg"}
          alt={item.product.name}
          width={80}
          height={80}
          className="rounded-md object-cover"
        />
        <div>
          <h3 className="font-semibold">{item.product.name}</h3>
          <p className="text-gray-600">
            Rp {item.product.price.toLocaleString("id-ID")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="number"
          value={item.quantity}
          onChange={handleQuantityChange}
          className="w-16 p-2 border rounded-md text-center"
          min="1"
        />
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
