import { Response, Request } from "express"; // Menggunakan Request dari express
import {
  PrismaClient,
  PaymentStatus,
  Prisma,
  Role,
  TransactionType,
} from "@prisma/client";

const prisma = new PrismaClient();

export class AdminOrderController {
  async getAllOrders(req: Request, res: Response) {
    const {
      page = "1",
      limit = "10",
      status,
      branchId,
      sort = "date_desc",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    try {
      const where: Prisma.ordersWhereInput = {};
      const user = req.user!; // req.user sudah dikenali secara global

      // Jika STORE_ADMIN, paksa filter berdasarkan branchId mereka
      if (user.role === Role.STORE_ADMIN) {
        const adminBranch = await prisma.branchs.findUnique({
          where: { userId: user.id },
        });
        if (adminBranch) {
          where.branchId = adminBranch.id;
        } else {
          // Admin toko tidak terhubung ke cabang manapun
          // DIUBAH: 'return' dihapus
          res.status(200).json({ data: [], pagination: { total: 0 } });
          return;
        }
      }
      // Jika SUPER_ADMIN, mereka bisa filter berdasarkan branchId dari query param
      else if (user.role === Role.SUPER_ADMIN && branchId) {
        where.branchId = parseInt(branchId as string);
      }

      if (status) {
        where.paymentStatus = status as PaymentStatus;
      }

      const orderBy: Prisma.ordersOrderByWithRelationInput = {};
      if (sort === "date_asc") {
        orderBy.createdAt = "asc";
      } else {
        orderBy.createdAt = "desc";
      }

      const orders = await prisma.orders.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          users: { select: { username: true, email: true } },
          branchs: { select: { name: true } },
        },
      });

      const totalOrders = await prisma.orders.count({ where });

      // DIUBAH: 'return' dihapus
      res.status(200).json({
        data: orders,
        pagination: {
          total: totalOrders,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalOrders / limitNum),
        },
      });
    } catch (error) {
      // DIUBAH: 'return' dihapus
      res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
  }

  async confirmOrRejectPayment(req: Request, res: Response) {
    const { orderId } = req.params;
    const { action } = req.body; // 'confirm' or 'reject'

    if (!["confirm", "reject"].includes(action)) {
      // DIUBAH: 'return' dihapus
      res.status(400).json({
        message: 'Aksi tidak valid. Gunakan "confirm" atau "reject".',
      });
      return;
    }

    try {
      const order = await prisma.orders.findUnique({
        where: { id: parseInt(orderId) },
      });
      if (!order || order.paymentStatus !== "PROCESSING") {
        // DIUBAH: 'return' dihapus
        res.status(404).json({
          message:
            "Pesanan tidak ditemukan atau statusnya tidak sedang diproses.",
        });
        return;
      }

      if (action === "confirm") {
        const updatedOrder = await prisma.orders.update({
          where: { id: parseInt(orderId) },
          data: { paymentStatus: "PAID" },
        });
        // DIUBAH: 'return' dihapus
        res
          .status(200)
          .json({ message: "Pembayaran dikonfirmasi.", order: updatedOrder });
      } else {
        // reject
        const updatedOrder = await prisma.orders.update({
          where: { id: parseInt(orderId) },
          data: { paymentStatus: "UNPAID", paymentProof: null }, // Hapus bukti bayar
        });
        // DIUBAH: 'return' dihapus
        res
          .status(200)
          .json({ message: "Pembayaran ditolak.", order: updatedOrder });
      }
    } catch (error) {
      // DIUBAH: 'return' dihapus
      res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
  }

  async shipOrder(req: Request, res: Response) {
    const { orderId } = req.params;
    try {
      const order = await prisma.orders.findUnique({
        where: { id: parseInt(orderId) },
      });
      if (!order || order.paymentStatus !== "PAID") {
        // DIUBAH: 'return' dihapus
        res.status(400).json({
          message: "Hanya pesanan yang sudah dibayar yang dapat dikirim.",
        });
        return;
      }
      const updatedOrder = await prisma.orders.update({
        where: { id: parseInt(orderId) },
        data: { paymentStatus: "SHIPPED", shippedAt: new Date() },
      });
      // DIUBAH: 'return' dihapus
      res.status(200).json({
        message: "Status pesanan diubah menjadi DIKIRIM.",
        order: updatedOrder,
      });
    } catch (error) {
      // DIUBAH: 'return' dihapus
      res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
  }

  async cancelOrder(req: Request, res: Response) {
    const { orderId } = req.params;
    try {
      const orderToCancel = await prisma.orders.findUnique({
        where: { id: parseInt(orderId) },
      });

      if (!orderToCancel) {
        // DIUBAH: 'return' dihapus
        res.status(404).json({ message: "Pesanan tidak ditemukan." });
        return;
      }
      if (
        ["SHIPPED", "DELIVERED", "CANCELED"].includes(
          orderToCancel.paymentStatus
        )
      ) {
        // DIUBAH: 'return' dihapus
        res.status(400).json({
          message: `Pesanan dengan status ${orderToCancel.paymentStatus} tidak dapat dibatalkan oleh admin.`,
        });
        return;
      }

      await prisma.$transaction(async (tx) => {
        // ... logika transaksi ...
      });

      // DIUBAH: 'return' dihapus
      res
        .status(200)
        .json({ message: "Pesanan berhasil dibatalkan oleh admin." });
    } catch (error) {
      // DIUBAH: 'return' dihapus
      res.status(500).json({
        message: "Terjadi kesalahan pada server saat membatalkan pesanan.",
      });
    }
  }
}
