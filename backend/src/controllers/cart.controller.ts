import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { haversineDistance } from "../utils/distance";

const prisma = new PrismaClient();

export class CartController {
  /**
   * Mengambil semua item di keranjang aktif milik pengguna.
   */
  async getCart(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const activeCart = await prisma.cart.findFirst({
        where: { userId, isActive: true },
        include: {
          productCarts: {
            include: {
              product: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      if (!activeCart) {
        // DIUBAH: 'return' dihapus
        res.status(200).json([]);
        return;
      }
      // DIUBAH: 'return' dihapus
      res.status(200).json(activeCart.productCarts);
    } catch (error) {
      // DIUBAH: 'return' dihapus
      res.status(500).json({ message: "Terjadi kesalahan pada server", error });
    }
  }

  /**
   * Menambah produk ke dalam keranjang atau memperbarui kuantitas jika sudah ada.
   */
  async addToCart(req: Request, res: Response) {
    const { productId, quantity } = req.body;
    const userId = req.user!.id;

    if (!productId || !quantity || quantity <= 0) {
      // DIUBAH: 'return' dihapus
      res.status(400).json({
        message: "ProductId dan quantity (harus positif) diperlukan.",
      });
      return;
    }

    try {
      // 1. Dapatkan lokasi default user untuk menentukan cabang terdekat
      const userAddress = await prisma.address.findFirst({
        where: { userId, isPrimary: true, isDeleted: false },
      });
      if (!userAddress) {
        // DIUBAH: 'return' dihapus
        res
          .status(400)
          .json({ message: "Mohon atur alamat utama Anda terlebih dahulu." });
        return;
      }

      // 2. Temukan cabang terdekat
      const allBranches = await prisma.branch.findMany();
      if (allBranches.length === 0) {
        // DIUBAH: 'return' dihapus
        res
          .status(404)
          .json({ message: "Tidak ada toko cabang yang tersedia." });
        return;
      }

      // ... logika haversine ...
      let closestBranch = allBranches.reduce((prev, curr) =>
        haversineDistance(
          userAddress.latitude,
          userAddress.longitude,
          prev.latitude,
          prev.longitude
        ) <
        haversineDistance(
          userAddress.latitude,
          userAddress.longitude,
          curr.latitude,
          curr.longitude
        )
          ? prev
          : curr
      );

      // 3. Validasi stok di cabang terdekat
      const productInBranch = await prisma.productBranch.findUnique({
        where: {
          productId_branchId: { productId, branchId: closestBranch.id },
        },
      });

      const existingCartItem = await prisma.productCart.findFirst({
        where: {
          cartId: {
            in: (
              await prisma.cart.findMany({ where: { userId, isActive: true } })
            ).map((c) => c.id),
          },
          productId,
        },
      });

      const requestedQuantity = (existingCartItem?.quantity || 0) + quantity;

      if (!productInBranch || productInBranch.stock < requestedQuantity) {
        // DIUBAH: 'return' dihapus
        res
          .status(400)
          .json({ message: "Stok produk tidak mencukupi di toko terdekat." });
        return;
      }

      // ... logika upsert keranjang ...
      const cart = await prisma.cart.upsert({
        where: {
          id:
            (
              await prisma.cart.findFirst({ where: { userId, isActive: true } })
            )?.id || -1,
        },
        update: {},
        create: { userId, isActive: true },
      });

      if (existingCartItem) {
        const updatedItem = await prisma.productCart.update({
          where: { id: existingCartItem.id },
          data: { quantity: { increment: quantity } },
          include: { product: true },
        });
        res.status(200).json(updatedItem);
      } else {
        const newItem = await prisma.productCart.create({
          data: { cartId: cart.id, productId, quantity },
          include: { product: true },
        });
        res.status(201).json(newItem);
      }
    } catch (error) {
      console.error(error);
      // DIUBAH: 'return' dihapus
      res.status(500).json({ message: "Terjadi kesalahan pada server", error });
    }
  }

  /**
   * Mengubah kuantitas item tertentu di dalam keranjang.
   */
  async updateCartItem(req: Request, res: Response) {
    const { productCartId } = req.params;
    const { quantity } = req.body;
    const userId = req.user!.id;

    if (!quantity || quantity <= 0) {
      // DIUBAH: 'return' dihapus
      res.status(400).json({ message: "Quantity (harus positif) diperlukan." });
      return;
    }

    try {
      const productCart = await prisma.productCart.findFirst({
        where: { id: parseInt(productCartId), cart: { userId } },
        include: { cart: true },
      });

      if (!productCart) {
        // DIUBAH: 'return' dihapus
        res.status(404).json({
          message:
            "Item keranjang tidak ditemukan atau Anda tidak berhak mengubahnya.",
        });
        return;
      }

      // ... logika cek stok ...
      const updatedItem = await prisma.productCart.update({
        where: { id: parseInt(productCartId) },
        data: { quantity },
        include: { product: true },
      });
      // DIUBAH: 'return' dihapus
      res.status(200).json(updatedItem);
    } catch (error) {
      // DIUBAH: 'return' dihapus
      res.status(500).json({ message: "Terjadi kesalahan pada server", error });
    }
  }

  /**
   * Menghapus item dari keranjang.
   */
  async removeCartItem(req: Request, res: Response) {
    const { productCartId } = req.params;
    const userId = req.user!.id;

    try {
      const productCart = await prisma.productCart.findFirst({
        where: { id: parseInt(productCartId), cart: { userId } },
      });

      if (!productCart) {
        // DIUBAH: 'return' dihapus
        res.status(404).json({
          message:
            "Item keranjang tidak ditemukan atau Anda tidak berhak menghapusnya.",
        });
        return;
      }

      await prisma.productCart.delete({
        where: { id: parseInt(productCartId) },
      });
      // DIUBAH: 'return' dihapus
      res.status(204).send(); // No Content
    } catch (error) {
      // DIUBAH: 'return' dihapus
      res.status(500).json({ message: "Terjadi kesalahan pada server", error });
    }
  }
}
