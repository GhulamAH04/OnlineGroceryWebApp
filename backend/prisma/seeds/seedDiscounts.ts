// === FILE: prisma/seeds/seedDiscounts.ts ===
import { PrismaClient } from "@prisma/client";

export async function seedDiscounts(prisma: PrismaClient) {
  console.log("🌱 Seeding diskon untuk banyak produk per cabang...");

  const now = new Date();

  // Ambil semua product_branchs yang stoknya > 0
  const productBranches = await prisma.product_branchs.findMany({
    where: { stock: { gt: 0 } },
    select: {
      branchId: true,
      productId: true,
    },
  });

  // Group by branchId
  const grouped: Record<number, { branchId: number; productId: number }[]> = {};
  for (const pb of productBranches) {
    if (!grouped[pb.branchId]) grouped[pb.branchId] = [];
    grouped[pb.branchId].push(pb);
  }

  // Ambil 2 produk acak per cabang
  const discountsData: any[] = [];
  Object.entries(grouped).forEach(([branchIdStr, products], branchIndex) => {
    const branchId = Number(branchIdStr);
    const sampleCount = Math.min(products.length, 2);
    const shuffled = products.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, sampleCount);

    selected.forEach((pb, productIndex) => {
      const globalIndex = branchIndex * 10 + productIndex;
      const type =
        globalIndex % 3 === 0
          ? "PERCENTAGE"
          : globalIndex % 3 === 1
          ? "NOMINAL"
          : "BUY1GET1";

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

      discountsData.push(base);
    });
  });

  await prisma.discount.createMany({
    data: discountsData,
    skipDuplicates: true,
  });

  console.log(`✅ Diskon berhasil di-seed (${discountsData.length} data).`);
}
