// admin.order.controller.ts
import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AdminOrderController {
  /**
   * Admin: Lihat semua pesanan, filter by branch
   */
  async getAllOrders(req: Request, res: Response) {
    try {
      const { branchId, limit = 10, page = 1 } = req.query;

      const whereClause: any = {};
      if (branchId) {
        whereClause.branchId = Number(branchId);
      }

      // Hitung total order (untuk pagination)
      const total = await prisma.orders.count({ where: whereClause });

      // Data order dengan limit & offset
      const orders = await prisma.orders.findMany({
        where: whereClause,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
          users: true,
          order_products: true,
          branchs: true,
          addresses: true,
        },
      });

      const totalPage = Math.ceil(total / Number(limit));

      res.status(200).json({
        data: orders,
        pagination: {
          total,
          totalPage,
          page: Number(page),
          limit: Number(limit),
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving orders", error });
    }
  }

  /**
   * Store Admin: Lihat hanya pesanan di gudang sendiri (branch)
   */
  async getOrdersByBranch(req: Request, res: Response) {
    try {
      const { branchId } = req.user!; // diasumsikan branchId dari req.user
      const orders = await prisma.orders.findMany({
        where: { branchId: branchId },
        orderBy: { createdAt: "desc" },
        include: {
          users: true,
          order_products: true,
          addresses: true,
        },
      });
      res.status(200).json(orders);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving branch orders", error });
    }
  }

  /**
   * Admin: Konfirmasi pembayaran manual transfer
   */
  async confirmPaymentManual(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { status } = req.body; // status: 'ACCEPTED' | 'REJECTED'
      // Step konfirmasi (opsional: bisa popup di FE sebelum submit request)

      const order = await prisma.orders.findUnique({
        where: { id: Number(orderId) },
      });
      if (
        !order ||
        order.paymentMethod !== "TRANSFER" ||
        order.paymentStatus !== "PROCESSING"
      ) {
        return res
          .status(400)
          .json({ message: "Order tidak valid untuk konfirmasi manual" });
      }

      if (status === "REJECTED") {
        await prisma.orders.update({
          where: { id: Number(orderId) },
          data: {
            paymentStatus: "UNPAID",
            paymentProof: null,
          },
        });
        // Opsional: kirim notifikasi ke user
        return res.status(200).json({
          message: "Pembayaran ditolak. Status kembali ke Menunggu Pembayaran.",
        });
      }

      if (status === "ACCEPTED") {
        await prisma.orders.update({
          where: { id: Number(orderId) },
          data: {
            paymentStatus: "PAID",
          },
        });
        // Opsional: kirim notifikasi ke user
        return res.status(200).json({
          message: "Pembayaran diterima. Status berubah menjadi Diproses.",
        });
      }

      res.status(400).json({ message: "Status tidak valid" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error manual payment confirmation", error });
    }
  }

  /**
   * Admin: Update status pesanan menjadi Dikirim
   * Perlu validasi stok (stok mutasi harus tiba secara fisik)
   */
  async sendOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const order = await prisma.orders.findUnique({
        where: { id: Number(orderId) },
        include: { order_products: true, branchs: true },
      });

      if (!order || order.paymentStatus !== "PAID") {
        return res.status(400).json({
          message:
            "Pesanan belum siap dikirim (belum dibayar atau tidak ditemukan)",
        });
      }

      // Cek apakah stok sudah benar-benar tersedia di branch
      // Ini hanya contoh, asumsikan field 'stock' di product_branchs dan produk di order_products
      for (const op of order.order_products) {
        const branchStock = await prisma.product_branchs.findFirst({
          where: { productId: op.productId, branchId: order.branchId },
        });
        if (!branchStock || branchStock.stock < op.quantity) {
          return res.status(400).json({
            message: `Stok produk ${op.productId} belum tersedia sepenuhnya di gudang`,
          });
        }
      }

      // Update status order jadi Dikirim, set tanggal pengiriman
      await prisma.orders.update({
        where: { id: Number(orderId) },
        data: {
          paymentStatus: "DELIVERED",
          updatedAt: new Date(),
        },
      });

      // Opsional: kirim notifikasi ke user
      res
        .status(200)
        .json({ message: "Order dikirim, menunggu approval user." });
    } catch (error) {
      res.status(500).json({ message: "Error sending order", error });
    }
  }

  /**
   * Auto-confirm setelah 7 hari jika user tidak mengkonfirmasi pesanan
   * (Ini hanya logic dasar, sebaiknya jalan di cron job)
   */
  async autoConfirmOrders() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    await prisma.orders.updateMany({
      where: {
        paymentStatus: "DELIVERED",
        updatedAt: { lte: sevenDaysAgo },
      },
      data: { paymentStatus: "DELIVERED" },
    });
  }

  /**
   * Admin: Cancel pesanan (hanya sebelum Dikirim)
   * Kembalikan stok dan catat jurnal stok
   */
  async adminCancelOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const order = await prisma.orders.findUnique({
        where: { id: Number(orderId) },
        include: { order_products: true },
      });

      if (!order)
        return res.status(404).json({ message: "Pesanan tidak ditemukan." });
      if (order.paymentStatus === "DELIVERED") {
        return res
          .status(400)
          .json({ message: "Pesanan tidak dapat dibatalkan setelah dikirim." });
      }

      // Rollback stok setiap produk di branch
      for (const op of order.order_products) {
        await prisma.product_branchs.updateMany({
          where: { productId: op.productId, branchId: order.branchId },
          data: { stock: { increment: op.quantity } },
        });
        // Catat jurnal history perubahan stok (asumsi ada tabel product_stock_journal)
        await prisma.journal_mutations.create({
          data: {
            productBranchId: op.productId,
            branchId: order.branchId,
            transactionType: "IN",
            quantity: op.quantity,
            description: "Restock karena order dibatalkan admin",
            updatedAt: new Date(),
          },
        });
      }

      // Update status pesanan jadi DIBATALKAN
      await prisma.orders.update({
        where: { id: order.id },
        data: { paymentStatus: "CANCELED", updatedAt: new Date() },
      });

      res
        .status(200)
        .json({ message: "Pesanan dibatalkan dan stok sudah direstore." });
    } catch (error) {
      res.status(500).json({ message: "Error membatalkan pesanan", error });
    }
  }
}
