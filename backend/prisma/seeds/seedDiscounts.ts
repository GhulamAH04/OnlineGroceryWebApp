// === FILE: prisma/seeds/seedDiscounts.ts ===
import { PrismaClient } from "@prisma/client";

export async function seedDiscounts(prisma: PrismaClient) {
  console.log("🌱 Seeding diskon dengan produk...");

  const now = new Date();

  // Ambil satu produk dari tiap cabang (product_branchs)
  const productBranches = await prisma.product_branchs.findMany({
    where: { stock: { gt: 0 } },
    distinct: ["branchId"],
    select: {
      branchId: true,
      productId: true,
    },
  });

  const discountsData = productBranches.map((pb, index) => {
    const type = index % 3 === 0 ? "PERCENTAGE" : index % 3 === 1 ? "NOMINAL" : "BUY1GET1";

    const base: any = {
      productId: pb.productId,
      branchId: pb.branchId,
      value: type === "BUY1GET1" ? 0 : type === "PERCENTAGE" ? 10 : 5000,
      type,
      isPercentage: type === "PERCENTAGE",
      expiredAt: new Date("2025-12-31"),
      createdAt: now,
      updatedAt: now,
    };

    if (type === "NOMINAL") {
      base.minPurchase = 50000;
    }

    if (type === "BUY1GET1") {
      base.buyX = 1;
      base.getY = 1;
    }

    return base;
  });

  await prisma.discount.createMany({
    data: discountsData,
    skipDuplicates: true,
  });

  console.log("✅ Diskon berhasil di-seed.");
}
