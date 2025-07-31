// === FILE: prisma/seeds/seedOrders.ts ===

import { PrismaClient, PaymentStatus } from "@prisma/client";
import dayjs from "dayjs";

export const seedOrders = async (prisma: PrismaClient) => {
  console.log("⏳ Seeding Orders with multi-product items...");

  const users = await prisma.users.findMany({ where: { role: "USER" } });
  const productBranchs = await prisma.product_branchs.findMany({
    include: { products: true },
  });
  const addresses = await prisma.addresses.findMany();

  const now = new Date();

  if (!users.length || !productBranchs.length || !addresses.length) {
    console.log("⚠️ Missing users / product_branchs / addresses. Aborting order seeding.");
    return;
  }

  let counter = 1;

  for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
    const baseDate = dayjs(now).subtract(monthOffset, "month");

    // Jumlah order per bulan
    const orderCount = Math.floor(Math.random() * 6) + 5; // 5–10 order per bulan

    for (let i = 0; i < orderCount; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const address = addresses[Math.floor(Math.random() * addresses.length)];
      const createdAt = baseDate.add(Math.floor(Math.random() * 28), "day").toDate();
      const updatedAt = dayjs(createdAt).add(1, "day").toDate();

      const shippingCost = 10000;
      let totalItemAmount = 0;

      // Create order terlebih dahulu (total akan diupdate nanti)
      const order = await prisma.orders.create({
        data: {
          name: `Order-${counter++}`,
          userId: user.id,
          branchId: productBranchs[0].branchId, // Sementara, kita pakai branch pertama. Bisa kamu random juga jika mau.
          addressId: address.id,
          total: 0, // akan diupdate setelah order_products dibuat
          shippingCost,
          paymentStatus: PaymentStatus.PAID,
          paymentMethod: "TRANSFER",
          expirePayment: dayjs(createdAt).add(1, "day").toDate(),
          paymentProof: null,
          courier: "JNE",
          cancellationSource: null,
          createdAt,
          updatedAt,
        },
      });

      const selectedProductBranchs: number[] = [];

      // Tambahkan 2–4 produk berbeda dalam satu order
      for (let j = 0; j < Math.floor(Math.random() * 3) + 2; j++) {
        const randomPB = productBranchs[Math.floor(Math.random() * productBranchs.length)];

        // Hindari produk yang sama dalam order yang sama
        if (selectedProductBranchs.includes(randomPB.productId)) continue;
        selectedProductBranchs.push(randomPB.productId);

        const quantity = Math.floor(Math.random() * 3) + 1;
        const price = randomPB.products.price;

        await prisma.order_products.create({
          data: {
            orderId: order.id,
            productId: randomPB.productId,
            quantity,
            price,
            total: quantity * price,
            updatedAt,
          },
        });

        totalItemAmount += quantity * price;
      }

      // Update total di order
      await prisma.orders.update({
        where: { id: order.id },
        data: {
          total: totalItemAmount + shippingCost,
        },
      });
    }
  }

  console.log("✅ seedOrders selesai dengan banyak produk per order.");
};
