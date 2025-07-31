// /backend/src/services/cart.service.ts

import { PrismaClient } from "@prisma/client";
// import { haversineDistance } from "../utils/distance"; // Pastikan Anda memiliki utilitas untuk menghitung jarak

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
export const getOrCreateCart = async (userId: number) => {
  let cart = await prisma.carts.findFirst({
    where: { userId, isActive: true },
  });

  if (!cart) {
    cart = await prisma.carts.create({
      data: { userId, updatedAt: new Date() },
    });
  }
  return cart;
};

/**
 * Menemukan cabang terdekat dari alamat utama pengguna.
 * @param userId - ID pengguna.
 * @returns Object cabang terdekat (branch).
 */
// const findNearestBranch = async (userId: number) => {
//   const userAddress = await prisma.addresses.findFirst({
//     where: { userId, isPrimary: true }, // Asumsi ada field 'isMain' untuk alamat utama
//   });

//   if (!userAddress) {
//     throw new Error("Alamat utama pengguna tidak ditemukan.");
//   }

//   const allBranches = await prisma.branchs.findMany();
//   if (allBranches.length === 0) {
//     throw new Error("Tidak ada cabang yang tersedia.");
//   }

//   // Hitung jarak ke semua cabang dan temukan yang terdekat
//   const closestBranch = allBranches.reduce((prev: any, curr: any) => {
//     const prevDistance = haversineDistance(
//       userAddress.latitude,
//       userAddress.longitude,
//       prev.latitude,
//       prev.longitude
//     );
//     const currDistance = haversineDistance(
//       userAddress.latitude,
//       userAddress.longitude,
//       curr.latitude,
//       curr.longitude
//     );
//     return prevDistance < currDistance ? prev : curr;
//   });

//   return closestBranch;
// };

/**
 * Memvalidasi ketersediaan stok produk di cabang tertentu.
 * @param productId - ID produk.
 * @param branchId - ID cabang.
 * @param requestedQuantity - Jumlah yang diminta.
 */
const validateStock = async (
  productId: number,
  branchId: number | undefined,
  requestedQuantity: number
) => {
  const productStock = await prisma.product_branchs.findFirst({
    where: { productId, branchId },
    include: { branchs: true },
  });

  if (!productStock || productStock.stock < requestedQuantity) {
    throw new Error(
      `Stok produk tidak mencukupi di cabang ${productStock?.branchs.name} .`
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
    // const nearestBranch = await findNearestBranch(userId);

    const existingItem = await prisma.product_carts.findFirst({
      where: { cartId: cart.id, productBranchId },
      include: {
        product_branchs: {
          include: {
            branchs: true,
          },
        },
      },
    });

    const branch = existingItem?.product_branchs.branchs;

    if (existingItem) {
      // Jika item sudah ada, validasi stok untuk total kuantitas baru
      const newQuantity = existingItem.quantity + quantity;
      await validateStock(productBranchId, branch?.id, newQuantity);
      return prisma.product_carts.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: quantity } },
      });
    } else {
      // Jika item baru, validasi stok untuk kuantitas yang diminta
      await validateStock(productBranchId, branch?.id, quantity);
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
          include: {
            product_branchs: {
              include: { products: true },
            }, // Sertakan detail produk
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
    // const nearestBranch = await findNearestBranch(userId);

    const itemToUpdate = await prisma.product_carts.findFirst({
      where: { id: productCartId, cartId: cart.id },
      include: {
        product_branchs: {
          include: { branchs: true },
        },
      }, // Pastikan item milik user yg login
    });

    const branch = itemToUpdate?.product_branchs.branchs;

    if (!itemToUpdate) {
      throw new Error("Item keranjang tidak ditemukan atau bukan milik Anda.");
    }

    if (quantity === 0) {
      // Jika kuantitas 0, hapus item
      return this.removeItem(userId, productCartId);
    }

    await validateStock(itemToUpdate.productBranchId, branch?.id, quantity);

    return prisma.product_carts.update({
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
      where: { userId },
    });

    const products = await prisma.product_carts.findMany({
      where: {
        cartId: cart?.id
      },
      include: {
        product_branchs: {
          include: {
            products: true,
            branchs: {
              include: {
                provinces: true,
                cities: true,
                districts: true
              }
            }
          }
        }
      }
    });
    return products;
  } catch (err) {
    throw err;
  }
}
