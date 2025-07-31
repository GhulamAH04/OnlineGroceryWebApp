// === FILE: prisma/seeds/seedDiscounts.ts ===
import { PrismaClient } from "@prisma/client";

export async function seedDiscounts(prisma: PrismaClient) {
  await prisma.discount.createMany({
    data: [
      // === Diskon Persentase
      {
        type: "PERCENTAGE",
        value: 10, // 10%
        isPercentage: true,
        branchId: 1,
        expiredAt: new Date("2025-12-31"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // === Diskon Nominal
      {
        type: "NOMINAL",
        value: 5000, // Rp5000
        isPercentage: false,
        minPurchase: 50000,
        branchId: 2,
        expiredAt: new Date("2025-11-30"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // === Diskon Buy 1 Get 1
      {
        type: "BUY1GET1",
        value: 0,
        isPercentage: false,
        buyX: 1,
        getY: 1,
        branchId: 3,
        expiredAt: new Date("2025-10-31"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // === Diskon Persentase Cabang Lain
      {
        type: "PERCENTAGE",
        value: 15,
        isPercentage: true,
        branchId: 4,
        expiredAt: new Date("2025-12-15"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // === Diskon Nominal Cabang Lain
      {
        type: "NOMINAL",
        value: 10000,
        isPercentage: false,
        minPurchase: 75000,
        branchId: 5,
        expiredAt: new Date("2025-11-15"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });
}