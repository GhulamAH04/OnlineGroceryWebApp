// === FILE: prisma/seedProductsOnly.ts ===
import { PrismaClient } from "@prisma/client";
import { seedProducts } from "../seeds/seedProducts";
const prisma = new PrismaClient();

async function main() {
  try {
    await seedProducts(prisma);
  } catch (error) {
    console.error("❌ Gagal menjalankan seedProducts:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
