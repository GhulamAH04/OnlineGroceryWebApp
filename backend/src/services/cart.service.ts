// /backend/src/services/cart.service.ts

import { PrismaClient } from "@prisma/client";
import { haversineDistance } from "../utils/distance"; // Pastikan Anda memiliki utilitas untuk menghitung jarak

const prisma = new PrismaClient();

// Asumsi model lain yang diperlukan untuk validasi stok
// Pastikan schema.prisma Anda memiliki model `addresses`, `branchs`, dan `product_branchs`.
// model addresses { ... latitude Float, longitude Float, isMain Boolean ... }
// model branchs { ... latitude Float, longitude Float ... }
// model product_branchs { ... productId Int, branchId Int, stock Int ... }

/**
 * Mendapatkan atau membuat keranjang aktif untuk seorang pengguna.
 * @param userId - ID pengguna.
 * @returns Object keranjang (cart).
 */
const getOrCreateCart = async (userId: number) => {
  let cart = await prisma.cart.findFirst({
    where: { userId, isActive: true },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }
  return cart;
};

/**
 * Menemukan cabang terdekat dari alamat utama pengguna.
 * @param userId - ID pengguna.
 * @returns Object cabang terdekat (branch).
 */
const findNearestBranch = async (userId: number) => {
  const userAddress = await prisma.address.findFirst({
    where: { userId, isPrimary: true }, // Asumsi ada field 'isMain' untuk alamat utama
  });

  if (!userAddress) {
    throw new Error("Alamat utama pengguna tidak ditemukan.");
  }

  const allBranches = await prisma.branch.findMany();
  if (allBranches.length === 0) {
    throw new Error("Tidak ada cabang yang tersedia.");
  }

  // Hitung jarak ke semua cabang dan temukan yang terdekat
  const closestBranch = allBranches.reduce((prev: any, curr: any) => {
    const prevDistance = haversineDistance(
      userAddress.latitude,
      userAddress.longitude,
      prev.latitude,
      prev.longitude
    );
    const currDistance = haversineDistance(
      userAddress.latitude,
      userAddress.longitude,
      curr.latitude,
      curr.longitude
    );
    return prevDistance < currDistance ? prev : curr;
  });

  return closestBranch;
};

/**
 * Memvalidasi ketersediaan stok produk di cabang tertentu.
 * @param productId - ID produk.
 * @param branchId - ID cabang.
 * @param requestedQuantity - Jumlah yang diminta.
 */
const validateStock = async (
  productId: number,
  branchId: number,
  requestedQuantity: number
) => {
  const productStock = await prisma.productBranch.findFirst({
    where: { productId, branchId },
  });

  if (!productStock || productStock.stock < requestedQuantity) {
    throw new Error("Stok produk tidak mencukupi di cabang terdekat.");
  }
};

export class CartService {
  /**
   * Menambahkan produk ke keranjang atau mengupdate kuantitas jika sudah ada.
   */
  static async addToCart(userId: number, productId: number, quantity: number) {
    const cart = await getOrCreateCart(userId);
    const nearestBranch = await findNearestBranch(userId);

    const existingItem = await prisma.productCart.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      // Jika item sudah ada, validasi stok untuk total kuantitas baru
      const newQuantity = existingItem.quantity + quantity;
      await validateStock(productId, nearestBranch.id, newQuantity);
      return prisma.productCart.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: quantity } },
      });
    } else {
      // Jika item baru, validasi stok untuk kuantitas yang diminta
      await validateStock(productId, nearestBranch.id, quantity);
      return prisma.productCart.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }
  }

  /**
   * Mengambil semua isi keranjang milik pengguna.
   */
  static async getCart(userId: number) {
    return prisma.cart.findFirst({
      where: { userId, isActive: true },
      include: {
        productCarts: {
          include: {
            product: true, // Sertakan detail produk
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }

  /**
   * Mengupdate kuantitas item dalam keranjang.
   */
  static async updateItemQuantity(
    userId: number,
    productCartId: number,
    quantity: number
  ) {
    const cart = await getOrCreateCart(userId);
    const nearestBranch = await findNearestBranch(userId);

    const itemToUpdate = await prisma.productCart.findFirst({
      where: { id: productCartId, cartId: cart.id }, // Pastikan item milik user yg login
    });

    if (!itemToUpdate) {
      throw new Error("Item keranjang tidak ditemukan atau bukan milik Anda.");
    }

    if (quantity === 0) {
      // Jika kuantitas 0, hapus item
      return this.removeItem(userId, productCartId);
    }

    await validateStock(itemToUpdate.productId, nearestBranch.id, quantity);

    return prisma.productCart.update({
      where: { id: productCartId },
      data: { quantity },
    });
  }

  /**
   * Menghapus item dari keranjang.
   */
  static async removeItem(userId: number, productCartId: number) {
    const cart = await getOrCreateCart(userId);

    // Verifikasi bahwa item yang akan dihapus benar-benar ada di keranjang pengguna
    const itemToDelete = await prisma.productCart.findFirst({
      where: { id: productCartId, cartId: cart.id },
    });

    if (!itemToDelete) {
      throw new Error("Item keranjang tidak ditemukan atau bukan milik Anda.");
    }

    return prisma.productCart.delete({
      where: { id: productCartId },
    });
  }
}
