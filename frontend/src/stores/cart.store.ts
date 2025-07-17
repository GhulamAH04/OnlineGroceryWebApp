// FILE: frontend/src/stores/cart.store.ts

import { create } from "zustand";
import axios from "axios"; // Asumsi axios sudah ter-setup

// Definisikan tipe data yang sesuai dengan respons API
// Ini harus cocok dengan apa yang dikirim dari `backend/src/controllers/cart.controller.ts`
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: true,
  error: null,

  /**
   * Mengambil data keranjang dari server dan memperbarui state.
   */
  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/cart`, {
        withCredentials: true,
      }); // Asumsi setup token/cookie
      set({ items: response.data, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Gagal mengambil data keranjang.",
        isLoading: false,
      });
    }
  },

  /**
   * Menambahkan produk ke keranjang.
   */
  addToCart: async (productId: number, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(
        `${API_URL}/cart`,
        { productId, quantity },
        { withCredentials: true }
      );
      await get().fetchCart(); // Muat ulang keranjang untuk mendapatkan state terbaru
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Gagal menambah item.",
        isLoading: false,
      });
      throw err; // Lempar kembali error agar bisa ditangkap di komponen
    }
  },

  /**
   * Memperbarui kuantitas item di keranjang.
   */
  updateItemQuantity: async (productCartId: number, quantity: number) => {
    // Optimistic update
    const originalItems = get().items;
    const updatedItems = originalItems.map((item) =>
      item.id === productCartId ? { ...item, quantity } : item
    );
    set({ items: updatedItems });

    try {
      await axios.put(
        `${API_URL}/cart/item/${productCartId}`,
        { quantity },
        { withCredentials: true }
      );
      // fetchCart tidak perlu jika optimistic update berhasil
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Gagal mengubah kuantitas.",
        items: originalItems,
      }); // Rollback
    }
  },

  /**
   * Menghapus item dari keranjang.
   */
  removeItem: async (productCartId: number) => {
    const originalItems = get().items;
    const updatedItems = originalItems.filter(
      (item) => item.id !== productCartId
    );
    set({ items: updatedItems });

    try {
      await axios.delete(`${API_URL}/cart/item/${productCartId}`, {
        withCredentials: true,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Gagal menghapus item.",
        items: originalItems,
      }); // Rollback
    }
  },

  /**
   * Mengembalikan jumlah item unik di keranjang.
   */
  getCartItemCount: () => {
    return get().items.length;
  },
}));
