"use client";

import { useState } from "react";
import ProductItem from "./productItem";

interface PageProps {
  onPlaceOrder: () => void;
}

interface CartItem {
  id: number;
  storeName: string;
  name: string;
  details: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export default function OrderSummary({ onPlaceOrder }: PageProps) {
  // Mock data for cart items
  const cartItems: CartItem[] = [
    {
      id: 1,
      storeName: "Bahlil",
      name: "Green Capsicum",
      details: "x5",
      price: 70.0,
      quantity: 1,
      imageUrl: "https://placehold.co/64x64/34D399/FFFFFF?text=GC",
    },
    {
      id: 2,
      storeName: "Red Velvet",
      name: "Red Capsicum",
      details: "xl",
      price: 14.0,
      quantity: 1,
      imageUrl: "https://placehold.co/64x64/EF4444/FFFFFF?text=RC",
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;
  const [paymentMethod, setPaymentMethod] = useState("cash");

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full">
      <div className="hidden md:grid grid-cols-12 gap-4 text-sm text-gray-500">
        <h2 className="text-2xl col-span-6 font-bold mb-6 text-gray-800">
          Order Summary
        </h2>
        <div className="col-span-2 text-center">Harga Satuan</div>
        <div className="col-span-2 text-center">Jumlah</div>
        <div className="col-span-2 text-right">Subtotal Produk</div>
      </div>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <ProductItem
            key={item.id}
            image={item.imageUrl}
            storeName={item.storeName}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      <div className="space-y-3 text-gray-600">
        <div className="flex justify-between">
          <p>Subtotal:</p>
          <p className="font-semibold">${subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p>Shipping:</p>
          <p className="font-semibold">{`$${shipping.toFixed(2)}`}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      <div className="flex justify-between text-xl font-bold text-gray-800">
        <p>Total:</p>
        <p>${total.toFixed(2)}</p>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      <div>
        <h3 className="text-xl font-bold mb-4 text-gray-800">Payment Method</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 border border-gray-200 rounded-md">
            <input
              id="cash"
              type="radio"
              name="payment"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
            />
            <label
              htmlFor="cash"
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              Cash on Delivery
            </label>
          </div>
          <div className="flex items-center p-3 border border-gray-200 rounded-md">
            <input
              id="paypal"
              type="radio"
              name="payment"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
            />
            <label
              htmlFor="paypal"
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              Paypal
            </label>
          </div>
          <div className="flex items-center p-3 border border-gray-200 rounded-md">
            <input
              id="amazon"
              type="radio"
              name="payment"
              value="amazon"
              checked={paymentMethod === "amazon"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
            />
            <label
              htmlFor="amazon"
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              Amazon Pay
            </label>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onPlaceOrder}
        className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg mt-8 hover:bg-green-700 transition-colors duration-300 shadow-lg"
      >
        Place Order
      </button>
    </div>
  );
}
