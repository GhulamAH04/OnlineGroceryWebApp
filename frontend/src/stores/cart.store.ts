// FILE: frontend/src/stores/cart.store.ts

import { create } from "zustand";
import axios from "axios";
import { getAxiosConfig } from "@/helper/getAxiosConfig";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
}

interface ProductCart {
  id: number;
  quantity: number;
  productId: number;
  cartId: number;
  product: Product;
}

interface CartState {
  items: ProductCart[];
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateItemQuantity: (
    productCartId: number,
    quantity: number
  ) => Promise<void>;
  removeItem: (productCartId: number) => Promise<void>;
  getCartItemCount: () => number;
}

const API_URL =
  `${process.env.NEXT_PUBLIC_API_URL}/api` || "http://localhost:8000/api";

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/cart`, getAxiosConfig());
      set({ items: response.data, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Gagal mengambil data keranjang.",
        isLoading: false,
      });
    }
  },

  addToCart: async (productId: number, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(
        `${API_URL}/cart`,
        { productId, quantity },
        getAxiosConfig()
      );
      alert("Item berhasil ditambahkan ke keranjang.");
      await get().fetchCart();
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Gagal menambah item.",
        isLoading: false,
      });
      console.error("Error adding to cart:", err);
      alert(err.response?.data?.message || "Gagal menambah item.");
      throw err;
    }
  },

  updateItemQuantity: async (productCartId: number, quantity: number) => {
    const originalItems = get().items;
    const updatedItems = originalItems.map((item) =>
      item.id === productCartId ? { ...item, quantity } : item
    );
    set({ items: updatedItems });

    try {
      await axios.put(
        `${API_URL}/cart/item/${productCartId}`,
        { quantity },
        getAxiosConfig()
      );
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Gagal mengubah kuantitas.",
        items: originalItems,
      });
    }
  },

  removeItem: async (productCartId: number) => {
    const originalItems = get().items;
    const updatedItems = originalItems.filter(
      (item) => item.id !== productCartId
    );
    set({ items: updatedItems });

    try {
      await axios.delete(
        `${API_URL}/cart/item/${productCartId}`,
        getAxiosConfig()
      );
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Gagal menghapus item.",
        items: originalItems,
      });
    }
  },

  getCartItemCount: () => {
    return get().items.length;
  },
}));
