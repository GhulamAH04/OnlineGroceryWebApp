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
      const activeCart = await prisma.carts.findFirst({
        where: { userId, isActive: true },
        include: {
          product_carts: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      if (!activeCart) {
        res.status(200).json([]);
        return;
      }

      const productBranchIds = activeCart.product_carts.map(
        (pc) => pc.productBranchId
      );

      const productBranchs = await prisma.product_branchs.findMany({
        where: { id: { in: productBranchIds } },
        include: { products: true },
      });

      const cartItems = activeCart.product_carts.map((item) => {
        const pb = productBranchs.find((pb) => pb.id === item.productBranchId);
        return {
          id: item.id,
          quantity: item.quantity,
          product: pb
            ? {
                name: pb.products.name,
                price: pb.products.price,
                image: pb.products.image,
              }
            : null,
        };
      });

      res.status(200).json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan pada server", error });
    }
  }

  /**
   * Menghitung total kuantitas dan harga dari semua item di keranjang aktif.
   */
  async totalCart(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      // Cari cart aktif user
      const activeCart = await prisma.carts.findFirst({
        where: { userId, isActive: true },
        include: {
          product_carts: true,
        },
      });

      if (!activeCart || activeCart.product_carts.length === 0) {
        // Jika cart kosong
        res.status(200).json({ totalQuantity: 0, totalPrice: 0 });
        return;
      }

      // Ambil semua productBranchId yang ada di cart
      const productBranchIds = activeCart.product_carts.map(
        (pc) => pc.productBranchId
      );

      // Ambil detail produk (agar dapat harga)
      const productBranchs = await prisma.product_branchs.findMany({
        where: { id: { in: productBranchIds } },
        include: { products: true },
      });

      // Hitung total quantity & price
      let totalQuantity = 0;
      let totalPrice = 0;

      for (const item of activeCart.product_carts) {
        const pb = productBranchs.find((pb) => pb.id === item.productBranchId);
        if (pb && pb.products) {
          totalQuantity += item.quantity;
          totalPrice += item.quantity * pb.products.price;
        }
      }

      res.status(200).json({ totalQuantity, totalPrice });
    } catch (error) {
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
      const userAddress = await prisma.addresses.findFirst({
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
      const allBranches = await prisma.branchs.findMany();
      if (allBranches.length === 0) {
        // DIUBAH: 'return' dihapus
        res
          .status(404)
          .json({ message: "Tidak ada toko cabang yang tersedia." });
        return;
      }

      const userLat = -6.2;
      const userLong = 106.816666;

      let closestBranch = allBranches.reduce((prev, curr) =>
        haversineDistance(
          userLat,
          userLong,
          Number(prev.latitude),
          Number(prev.longitude)
        ) <
        haversineDistance(
          userLat,
          userLong,
          Number(curr.latitude),
          Number(curr.longitude)
        )
          ? prev
          : curr
      );

      // 3. Validasi stok di cabang terdekat
      const productInBranch = await prisma.product_branchs.findUnique({
        where: {
          productId_branchId: { productId, branchId: closestBranch.id },
        },
      });

      const activeCart = await prisma.carts.findFirst({
        where: { userId, isActive: true },
      });

      const cart = await prisma.carts.upsert({
        where: { id: activeCart?.id || -1 },
        update: {},
        create: {
          userId,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const existingCartItem = await prisma.product_carts.findFirst({
        where: {
          cartId: cart.id,
          productBranchId: productInBranch?.id,
        },
      });

      const requestedQuantity = (existingCartItem?.quantity || 0) + quantity;

      if (!productInBranch || productInBranch.stock < requestedQuantity) {
        res
          .status(400)
          .json({ message: "Stok produk tidak mencukupi di toko terdekat." });
        return;
      }

      if (existingCartItem) {
        const updatedItem = await prisma.product_carts.update({
          where: { id: existingCartItem.id },
          data: { quantity: { increment: quantity } },
        });
        res.status(200).json(updatedItem);
      } else {
        const newItem = await prisma.product_carts.create({
          data: {
            cartId: cart.id,
            productBranchId: productInBranch.id,
            quantity,
            updatedAt: new Date(),
          },
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
      const productCart = await prisma.product_carts.findFirst({
        where: { id: parseInt(productCartId), carts: { userId } },
        include: { carts: true },
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
      const updatedItem = await prisma.product_carts.update({
        where: { id: parseInt(productCartId) },
        data: { quantity },
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
      const productCart = await prisma.product_carts.findFirst({
        where: { id: parseInt(productCartId), carts: { userId } },
      });

      if (!productCart) {
        // DIUBAH: 'return' dihapus
        res.status(404).json({
          message:
            "Item keranjang tidak ditemukan atau Anda tidak berhak menghapusnya.",
        });
        return;
      }

      await prisma.product_carts.delete({
        where: { id: parseInt(productCartId) },
      });
      // DIUBAH: 'return' dihapus
      res.status(204).send(); // Mengirim status 204 No Content
    } catch (error) {
      // DIUBAH: 'return' dihapus
      res.status(500).json({ message: "Terjadi kesalahan pada server", error });
    }
  }
}
