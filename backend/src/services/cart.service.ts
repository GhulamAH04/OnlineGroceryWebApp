// backend/src/services/cart.service.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Mendapatkan atau membuat keranjang aktif untuk seorang pengguna.
 * @param userId - ID pengguna.
 * @returns Object keranjang (cart).
 */
export const getOrCreateCart = async (userId: number) => {
  let cart = await prisma.carts.findFirst({
    where: { userId, isActive: true },
  });

  if (!cart) {
    cart = await prisma.carts.create({
      data: {
        userId,
        updatedAt: new Date(),
      },
    });
  }
  return cart;
};

/**
 * Memvalidasi ketersediaan stok produk di cabang tertentu.
 * @param productBranchId - ID product_branchs.
 * @param branchId - ID cabang.
 * @param requestedQuantity - Jumlah yang diminta.
 */
const validateStock = async (
  productBranchId: number,
  branchId: number,
  requestedQuantity: number
) => {
  const productStock = await prisma.product_branchs.findFirst({
    where: { id: productBranchId, branchId },
    include: { branchs: true },
  });

  if (!productStock || productStock.stock < requestedQuantity) {
    throw new Error(
      `Stok produk tidak mencukupi di cabang ${
        productStock?.branchs.name || ""
      }.`
    );
  }
};

export class CartService {
  /**
   * Menambahkan produk ke keranjang atau mengupdate kuantitas jika sudah ada.
   */
  static async addToCart(
    userId: number,
    productBranchId: number,
    quantity: number
  ) {
    const cart = await getOrCreateCart(userId);

    const existingItem = await prisma.product_carts.findFirst({
      where: { cartId: cart.id, productBranchId },
      include: {},
    });

    // Dapatkan branchId dari product_branchs
    let branchId: number | undefined;
    if (existingItem) {
      const pb = await prisma.product_branchs.findUnique({
        where: { id: productBranchId },
      });
      branchId = pb?.branchId;
      if (branchId === undefined)
        throw new Error("Product cabang tidak ditemukan.");

      // Validasi stok untuk total kuantitas baru
      const newQuantity = existingItem.quantity + quantity;
      await validateStock(productBranchId, branchId, newQuantity);
      return prisma.product_carts.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQuantity,
          updatedAt: new Date(),
        },
      });
    } else {
      // Dapatkan branchId dari product_branchs
      const pb = await prisma.product_branchs.findUnique({
        where: { id: productBranchId },
        include: { branchs: true },
      });
      if (!pb) throw new Error("Product cabang tidak ditemukan.");
      await validateStock(productBranchId, pb.branchId, quantity);
      return prisma.product_carts.create({
        data: {
          cartId: cart.id,
          productBranchId,
          quantity,
          updatedAt: new Date(),
        },
      });
    }
  }

  /**
   * Mengambil semua isi keranjang milik pengguna.
   */
  static async getCart(userId: number) {
    return prisma.carts.findFirst({
      where: { userId, isActive: true },
      include: {
        product_carts: {
          include: {},
        },
      },
      orderBy: {
        createdAt: "asc",
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

    const itemToUpdate = await prisma.product_carts.findFirst({
      where: { id: productCartId, cartId: cart.id },
      include: {},
    });

    if (!itemToUpdate) {
      throw new Error("Item keranjang tidak ditemukan atau bukan milik Anda.");
    }

    const branch = itemToUpdate.productBranchId;

    if (quantity === 0) {
      // Jika kuantitas 0, hapus item
      return this.removeItem(userId, productCartId);
    }

    await validateStock(itemToUpdate.productBranchId, branch, quantity);

    return prisma.product_carts.update({
      where: { id: productCartId },
      data: {
        quantity,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Menghapus item dari keranjang.
   */
  static async removeItem(userId: number, productCartId: number) {
    const cart = await getOrCreateCart(userId);

    // Verifikasi bahwa item yang akan dihapus benar-benar ada di keranjang pengguna
    const itemToDelete = await prisma.product_carts.findFirst({
      where: { id: productCartId, cartId: cart.id },
    });

    if (!itemToDelete) {
      throw new Error("Item keranjang tidak ditemukan atau bukan milik Anda.");
    }

    return prisma.product_carts.delete({
      where: { id: productCartId },
    });
  }
}

export async function GetAllProductCartByUserIdService(userId: number) {
  try {
    const cart = await prisma.carts.findFirst({
      where: { userId, isActive: true },
    });

    if (!cart) return [];

    const products = await prisma.product_carts.findMany({
      where: { cartId: cart.id },
      include: {
        product_branchs: {
          include: {
            products: true,
            branchs: {
              include: {
                provinces: true,
                cities: true,
                districts: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return products;
  } catch (err) {
    throw err;
  }
}
