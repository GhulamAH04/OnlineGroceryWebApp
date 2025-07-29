// === FILE: prisma/seeds/seedOrders.ts ===

import { PrismaClient, PaymentStatus } from "@prisma/client";
import dayjs from "dayjs";

export const seedOrders = async (prisma: PrismaClient) => {
  console.log("⏳ Seeding Orders...");

  const users = await prisma.users.findMany({
    where: { role: "USER" },
    take: 5,
  });

  const productBranchs = await prisma.product_branchs.findMany({
    include: { products: true },
    take: 10,
  });

  const addresses = await prisma.addresses.findMany({ take: 5 });

  for (let i = 0; i < 40; i++) {
    const user = users[i % users.length];
    const pb = productBranchs[i % productBranchs.length];
    const address = addresses[i % addresses.length];

    const quantity = Math.floor(Math.random() * 5) + 1;
    const createdAt = dayjs()
      .subtract(Math.floor(Math.random() * 11), "month")
      .toDate();

    const updatedAt = dayjs(createdAt).add(1, "day").toDate();

    const total = pb.products.price * quantity;
    const shippingCost = 10000;

    // === Create order utama ===
    const order = await prisma.orders.create({
      data: {
        name: `Order-${i + 1}`,
        userId: user.id,
        branchId: pb.branchId,
        addressId: address.id,
        total: total + shippingCost,
        shippingCost,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: "TRANSFER",
        expirePayment: dayjs(createdAt).add(1, "day").toDate(),
        paymentProof: null,
        courier: null,
        cancellationSource: null,
        createdAt,
        updatedAt,
      },
    });

    // === Buat order_products ===
    await prisma.order_products.create({
  data: {
    orderId: order.id,
    productId: pb.productId,
    quantity,
    price: pb.products.price,
    total: pb.products.price * quantity,
    updatedAt,
  },
});

  }

  console.log("✅ Seeded Orders + order_products");
};
