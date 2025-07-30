// === FILE: prisma/seeds/seedProductBranchs.ts ===
import { PrismaClient } from "@prisma/client";

export const seedProductBranchs = async (prisma: PrismaClient) => {
  const products = await prisma.products.findMany();
  const branches = await prisma.branchs.findMany();

  for (const branch of branches) {
    for (const product of products) {
      const exists = await prisma.product_branchs.findUnique({
        where: {
          productId_branchId: {
            productId: product.id,
            branchId: branch.id,
          },
        },
      });

      if (!exists) {
        await prisma.product_branchs.create({
          data: {
            productId: product.id,
            branchId: branch.id,
            stock: Math.floor(Math.random() * 40) + 10,
            updatedAt: new Date(),
          },
        });
      }
    }
  }

  console.log("✅ Seeded product stock per branch");
};
