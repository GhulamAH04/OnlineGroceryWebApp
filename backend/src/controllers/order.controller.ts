import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { haversineDistance } from "../utils/distance";
import { uploadToCloudinary } from "../utils/cloudinary";

const midtransClient = require("midtrans-client");

const prisma = new PrismaClient();

export class OrderController {
  /**
   * Membuat pesanan baru
   */
  async createOrder(req: Request, res: Response) {
    const { cartId, addressId, paymentMethod, shippingCost, courier } =
      req.body;
    const userId = req.user!.id;

    if (!cartId || !addressId || !paymentMethod) {
      return res.status(400).json({
        message: "Cart ID, Address ID, and Payment Method are required.",
      });
    }

    try {
      // Ambil cart aktif
      const cart = await prisma.carts.findUnique({
        where: { id: cartId },
        include: { product_carts: true },
      });
      if (!cart || cart.userId !== userId || cart.isActive === false) {
        return res
          .status(404)
          .json({ message: "Cart not found or is inactive." });
      }

      // Cek stok produk di semua cabang
      let totalPrice = 0;
      const productBranchIds = cart.product_carts.map(
        (pc) => pc.productBranchId
      );
      const productBranchs = await prisma.product_branchs.findMany({
        where: { id: { in: productBranchIds } },
        include: { products: true },
      });

      for (const item of cart.product_carts) {
        const pb = productBranchs.find((pb) => pb.id === item.productBranchId);
        if (!pb || pb.stock < item.quantity) {
          return res.status(400).json({
            message: "Insufficient stock for product " + pb?.products.name,
          });
        }
        totalPrice += pb.products.price * item.quantity;
      }

      // Pilih cabang terdekat
      const userAddress = await prisma.addresses.findFirst({
        where: { id: addressId },
      });
      if (!userAddress) {
        return res.status(400).json({ message: "Address not found." });
      }

      const allBranches = await prisma.branchs.findMany();
      const closestBranch = this.findClosestBranch(allBranches, userAddress);

      // Buat order
      const order = await prisma.orders.create({
        data: {
          name: `Order-${new Date().getTime()}`,
          paymentStatus: "UNPAID",
          shippingCost: shippingCost || 0,
          courier: courier || "JNE",
          total: totalPrice,
          paymentMethod,
          expirePayment: new Date(new Date().getTime() + 60 * 60 * 1000), // Expiry in 1 hour
          branchId: closestBranch.id,
          userId,
          addressId,
          updatedAt: new Date(),
        },
      });

      // Insert order products
      for (const item of cart.product_carts) {
        const pb = productBranchs.find((pb) => pb.id === item.productBranchId);
        await prisma.order_products.create({
          data: {
            orderId: order.id,
            productId: pb!.productId,
            quantity: item.quantity,
            price: pb!.products.price,
            total: pb!.products.price * item.quantity,
            updatedAt: new Date(),
          },
        });
      }

      // Inisiasi pembayaran Midtrans jika metode pembayaran transfer
      if (paymentMethod === "TRANSFER") {
        await this.initiateMidtransPayment(order.id, totalPrice);
      }

      // Menghapus cart setelah pesanan dibuat
      await prisma.carts.update({
        where: { id: cartId },
        data: { isActive: false },
      });

      res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating order", error });
    }
  }

  /**
   * Menghitung cabang terdekat berdasarkan koordinat
   */
  private findClosestBranch(branches: any[], userAddress: any) {
    const userLat = userAddress.latitude;
    const userLong = userAddress.longitude;

    return branches.reduce((prev, curr) => {
      const prevDistance = haversineDistance(
        userLat,
        userLong,
        prev.latitude,
        prev.longitude
      );
      const currDistance = haversineDistance(
        userLat,
        userLong,
        curr.latitude,
        curr.longitude
      );

      return prevDistance < currDistance ? prev : curr;
    });
  }

  /**
   * Inisialisasi pembayaran dengan Midtrans
   */
  private async initiateMidtransPayment(orderId: number, totalPrice: number) {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY || "",
      clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
    });

    const parameter = {
      transaction_details: {
        order_id: `ORDER-${orderId}`,
        gross_amount: totalPrice,
      },
      credit_card: {
        secure: true,
      },
    };

    try {
      const transaction = await snap.createTransaction(parameter);
      // Simpan URL pembayaran Midtrans di pesanan
      console.log(transaction);
      await prisma.orders.update({
        where: { id: orderId },
        data: { paymentProof: transaction.redirect_url },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Mengupload bukti pembayaran
   */

  async uploadPaymentProof(req: Request, res: Response) {
    const { orderId } = req.params;
    const userId = req.user!.id;

    try {
      const order = await prisma.orders.findUnique({
        where: { id: parseInt(orderId) },
        include: { users: true },
      });
      if (!order || order.users.id !== userId) {
        return res
          .status(404)
          .json({ message: "Order not found or you do not have permission." });
      }

      if (order.paymentStatus !== "UNPAID") {
        return res
          .status(400)
          .json({ message: "Payment has already been made." });
      }

      // Validasi file bukti pembayaran
      const paymentProof = req.file as Express.Multer.File;
      if (!paymentProof) {
        return res
          .status(400)
          .json({ message: "No payment proof file uploaded." });
      }

      if (!["image/jpeg", "image/png"].includes(paymentProof.mimetype)) {
        return res.status(400).json({
          message: "Invalid payment proof file type. Only JPG/PNG allowed.",
        });
      }

      if (paymentProof.size > 1 * 1024 * 1024) {
        // Maksimal 1MB
        return res
          .status(400)
          .json({ message: "File size exceeds the limit of 1MB." });
      }

      let paymentProofUrl: string | undefined;

      // Coba upload ke Cloudinary
      try {
        const uploadResult = await uploadToCloudinary(paymentProof.buffer);
        paymentProofUrl = uploadResult.secure_url;

        await prisma.orders.update({
          where: { id: parseInt(orderId) },
          data: {
            paymentProof: paymentProofUrl,
            paymentStatus: "PROCESSING",
          },
        });

        return res.status(200).json({
          message: "Payment proof uploaded successfully (Cloudinary).",
          url: paymentProofUrl,
        });
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return res.status(500).json({
          message: "Error uploading payment proof to Cloudinary",
          error: err,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error uploading payment proof", error });
    }
  }

  /**
   * Melihat daftar pesanan
   */
  async getOrders(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const limit = Number(req.query.limit) || 5;
    const idParam = req.query.id;
    let id: number | undefined = undefined;

    if (idParam !== undefined) {
      const idNum = Number(idParam);
      if (isNaN(idNum)) {
        return res.status(400).json({ message: "Invalid order id." });
      }
      id = idNum;
    }

    const dateQuery = req.query.date as string | undefined;
    const noOrderQuery = req.query.no_order as string | undefined;

    try {
      const whereClause: any = { userId };
      if (id !== undefined) whereClause.id = id;

      if (noOrderQuery) {
        whereClause.name = { contains: noOrderQuery, mode: "insensitive" };
      }

      if (dateQuery) {
        const dayStart = new Date(dateQuery + "T00:00:00.000Z");
        const dayEnd = new Date(dateQuery + "T23:59:59.999Z");
        whereClause.createdAt = { gte: dayStart, lte: dayEnd };
      }

      const data = await prisma.orders.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: limit > 0 ? limit : undefined,
        include: {
          order_products: true,
          addresses: true,
          branchs: true,
        },
      });

      return res.status(200).json(data);
    } catch (error) {
      console.error("Error retrieving orders:", error);
      return res.status(500).json({ message: "Error retrieving orders" });
    }
  }

  /**
   * Melihat pesanan by id
   */
  async getOrder(req: Request, res: Response) {
    const userId = req.user?.id;
    const orderId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!orderId || isNaN(orderId)) {
      return res.status(400).json({ message: "Order id tidak valid." });
    }

    try {
      const order = await prisma.orders.findFirst({
        where: {
          id: orderId,
          userId: userId,
        },
        include: {
          order_products: true,
          addresses: true,
          branchs: true,
        },
      });

      if (!order) {
        return res.status(404).json({ message: "Order tidak ditemukan." });
      }

      return res.status(200).json({ data: order });
    } catch (error) {
      console.error("Error retrieving order:", error);
      return res.status(500).json({ message: "Error retrieving order" });
    }
  }

  /**
   * Membatalkan pesanan
   */
  async cancelOrder(req: Request, res: Response) {
    const { orderId } = req.params;
    const userId = req.user!.id;

    try {
      const order = await prisma.orders.findUnique({
        where: { id: parseInt(orderId) },
        include: { users: true },
      });
      if (!order || order.users.id !== userId) {
        return res
          .status(404)
          .json({ message: "Order not found or you do not have permission." });
      }

      if (order.paymentStatus === "PAID") {
        return res.status(400).json({
          message: "Order cannot be canceled as it has already been paid.",
        });
      }

      await prisma.orders.update({
        where: { id: parseInt(orderId) },
        data: { paymentStatus: "CANCELED" },
      });

      res.status(200).json({ message: "Order canceled successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error canceling order", error });
    }
  }

  /**
   * Konfirmasi Pesanan
   */

  async confirmOrder(req: Request, res: Response) {
    const { orderId } = req.params;
    const userId = req.user!.id;

    try {
      const order = await prisma.orders.findUnique({
        where: { id: parseInt(orderId) },
        include: { users: true },
      });
      if (!order || order.users.id !== userId) {
        return res
          .status(404)
          .json({ message: "Order not found or you do not have permission." });
      }

      if (order.paymentStatus !== "DELIVERED") {
        return res.status(400).json({
          message: "Order cannot be confirmed as it has not been paid.",
        });
      }

      await prisma.orders.update({
        where: { id: parseInt(orderId) },
        data: { paymentStatus: "RECEIVED" },
      });

      res.status(200).json({ message: "Order confirmed successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error confirming order", error });
    }
  }
}
