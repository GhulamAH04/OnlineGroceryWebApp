// === FILE: prisma/seeds/seedInventory.ts ===
import { PrismaClient, Prisma } from "@prisma/client";

export const seedInventory = async (prisma: PrismaClient) => {
  const products = await prisma.products.findMany();
  const branches = await prisma.branchs.findMany();
  const now = new Date();

  const inventoryData: Prisma.product_branchsCreateManyInput[] = [];

  for (const product of products) {
    for (const branch of branches) {
      inventoryData.push({
        productId: product.id,
        branchId: branch.id,
        stock: Math.floor(Math.random() * 50) + 10,
        createdAt: now,
        updatedAt: now,
        deleted: false,
      });
    }
  }

  await prisma.product_branchs.createMany({
    data: inventoryData,
    skipDuplicates: true,
  });

  console.log("✅ seedInventory selesai");
};