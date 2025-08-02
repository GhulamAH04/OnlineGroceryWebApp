import { PrismaClient } from "@prisma/client";
import { seedOrders } from "../seeds/seedOrders";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Menjalankan hanya seedOrders...");
  await seedOrders(prisma);
  console.log("✅ seedOrders selesai.");
}

main()
  .catch((e) => {
    console.error("❌ Error saat menjalankan seedOrders:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
