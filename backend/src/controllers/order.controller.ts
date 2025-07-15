import { Response, Request } from "express";
import { PrismaClient, TransactionType } from "@prisma/client";
import { haversineDistance } from "../utils/distance";
import multer from "multer";
import path from "path";

const prisma = new PrismaClient();

// ... (Konfigurasi Multer tetap sama)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/proofs/");
  },
  filename: (req: Request, file, cb) => {
    const orderId = req.params.orderId;
    cb(
      null,
      `PROOF-${orderId}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Tipe file tidak valid, hanya .jpg, .jpeg, .png yang diizinkan"
      ),
      false
    );
  }
};

export const uploadProof = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 1 }, // 1MB
  fileFilter: fileFilter,
}).single("paymentProof");

export class OrderController {
  // Ganti method createOrder yang ada dengan yang ini:

  async createOrder(req: Request, res: Response) {
    const userId = req.user!.id;
    const { addressId, shippingCost, paymentMethod, courier } = req.body;

    if (
      !addressId ||
      shippingCost === undefined ||
      !paymentMethod ||
      !courier
    ) {
      res.status(400).json({
        message:
          "Input tidak lengkap: addressId, shippingCost, paymentMethod, dan courier diperlukan.",
      });
      return;
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        // =================================================================
        // BAGIAN YANG HILANG & DIPERBAIKI ADA DI SINI
        // =================================================================

        // 1. Validasi awal
        const cart = await tx.cart.findFirst({
          where: { userId, isActive: true },
          include: { productCarts: { include: { product: true } } },
        });

        if (!cart || cart.productCarts.length === 0) {
          throw new Error("Keranjang Anda kosong.");
        }

        const shippingAddress = await tx.address.findUnique({
          where: { id: addressId, userId, isDeleted: false },
        });

        if (!shippingAddress) {
          throw new Error("Alamat pengiriman tidak valid.");
        }

        // 2. Tentukan toko cabang terdekat
        const allBranches = await tx.branch.findMany();
        if (allBranches.length === 0)
          throw new Error("Tidak ada toko yang tersedia.");

        const processingBranch = allBranches.reduce((prev, curr) =>
          haversineDistance(
            shippingAddress.latitude,
            shippingAddress.longitude,
            prev.latitude,
            prev.longitude
          ) <
          haversineDistance(
            shippingAddress.latitude,
            shippingAddress.longitude,
            curr.latitude,
            curr.longitude
          )
            ? prev
            : curr
        );

        // 3. Validasi ulang stok & hitung total
        let subTotal = 0;
        for (const item of cart.productCarts) {
          const productInBranch = await tx.productBranch.findUnique({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: processingBranch.id,
              },
            },
          });

          if (!productInBranch || productInBranch.stock < item.quantity) {
            throw new Error(
              `Stok untuk produk "${item.product.name}" tidak mencukupi.`
            );
          }
          subTotal += item.product.price * item.quantity;
        }
        const total = subTotal + shippingCost;

        // 4. Buat entri Order (INI BAGIAN KUNCINYA)
        const expirePayment = new Date(Date.now() + 60 * 60 * 1000); // 1 jam dari sekarang

        // 'newOrder' didefinisikan di sini menggunakan hasil dari `tx.order.create`
        const newOrder = await tx.order.create({
          data: {
            name: `ORDER-${userId}-${Date.now()}`,
            userId,
            addressId,
            branchId: processingBranch.id,
            shippingCost,
            total,
            paymentMethod,
            courier,
            paymentStatus: "UNPAID",
            expirePayment,
          },
        });

        // 5. Pindahkan item dari keranjang ke OrderProduct dan update inventaris
        for (const item of cart.productCarts) {
          // Buat OrderProduct
          await tx.orderProduct.create({
            data: {
              orderId: newOrder.id, // Gunakan id dari newOrder yang baru dibuat
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
              total: item.product.price * item.quantity,
            },
          });

          // Update stok di ProductBranch
          const updatedProductBranch = await tx.productBranch.update({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: processingBranch.id,
              },
            },
            data: { stock: { decrement: item.quantity } },
          });

          // Buat entri JournalMutation
          await tx.journalMutation.create({
            data: {
              productBranchId: updatedProductBranch.id,
              branchId: processingBranch.id,
              quantity: item.quantity,
              transactionType: TransactionType.OUT,
              description: `Penjualan dari Pesanan #${newOrder.id}`,
            },
          });
        }

        // 6. Kosongkan keranjang user
        await tx.productCart.deleteMany({
          where: { cartId: cart.id },
        });

        // Sekarang kita bisa me-return 'newOrder' karena sudah didefinisikan
        return newOrder;
      });

      // 'result' sekarang berisi objek 'newOrder' yang dikembalikan dari transaksi
      res
        .status(201)
        .json({ message: "Pesanan berhasil dibuat.", order: result });
    } catch (error: any) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({
          message: "Terjadi kesalahan pada server saat membuat pesanan.",
        });
      }
    }
  }

  async uploadPaymentProof(req: Request, res: Response) {
    const { orderId } = req.params;
    const userId = req.user!.id;

    if (!req.file) {
      res
        .status(400)
        .json({ message: "File bukti pembayaran tidak ditemukan." });
      return;
    }

    try {
      const order = await prisma.order.findFirst({
        where: { id: parseInt(orderId), userId },
      });

      if (!order) {
        res.status(404).json({ message: "Pesanan tidak ditemukan." });
        return;
      }
      if (order.paymentStatus !== "UNPAID") {
        res.status(400).json({
          message: `Tidak dapat mengunggah bukti untuk pesanan dengan status ${order.paymentStatus}`,
        });
        return;
      }

      const updatedOrder = await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: {
          paymentProof: req.file.path,
          paymentStatus: "PROCESSING",
        },
      });
      res.status(200).json({
        message: "Bukti pembayaran berhasil diunggah.",
        order: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
  }

  async getMyOrders(req: Request, res: Response) {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
      const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      });
      const totalOrders = await prisma.order.count({ where: { userId } });
      res.status(200).json({
        data: orders,
        pagination: {
          total: totalOrders,
          page,
          limit,
          totalPages: Math.ceil(totalOrders / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
  }

  async getOrderDetails(req: Request, res: Response) {
    const { orderId } = req.params;
    const userId = req.user!.id;
    try {
      const order = await prisma.order.findFirst({
        where: { id: parseInt(orderId), userId },
        include: {
          orderProducts: { include: { product: true } },
          address: true,
          branch: true,
        },
      });
      if (!order) {
        res.status(404).json({ message: "Pesanan tidak ditemukan." });
        return;
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
  }

  async cancelOrder(req: Request, res: Response) {
    const { orderId } = req.params;
    const userId = req.user!.id;

    try {
      const orderToCancel = await prisma.order.findFirst({
        where: { id: parseInt(orderId), userId },
      });

      if (!orderToCancel) {
        res.status(404).json({ message: "Pesanan tidak ditemukan." });
        return;
      }
      if (orderToCancel.paymentStatus !== "UNPAID") {
        res.status(400).json({
          message: `Pesanan dengan status ${orderToCancel.paymentStatus} tidak dapat dibatalkan.`,
        });
        return;
      }

      // ... logika transaksi ...

      res.status(200).json({ message: "Pesanan berhasil dibatalkan." });
    } catch (error) {
      res.status(500).json({
        message: "Terjadi kesalahan pada server saat membatalkan pesanan.",
      });
    }
  }

  async confirmDelivery(req: Request, res: Response) {
    const { orderId } = req.params;
    const userId = req.user!.id;

    try {
      const order = await prisma.order.findFirst({
        where: { id: parseInt(orderId), userId },
      });
      if (!order) {
        res.status(404).json({ message: "Pesanan tidak ditemukan." });
        return;
      }
      if (order.paymentStatus !== "SHIPPED") {
        res.status(400).json({
          message: "Hanya pesanan yang sedang dikirim yang bisa dikonfirmasi.",
        });
        return;
      }
      const updatedOrder = await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: { paymentStatus: "DELIVERED" },
      });
      res.status(200).json({
        message: "Penerimaan pesanan berhasil dikonfirmasi.",
        order: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
  }
}
