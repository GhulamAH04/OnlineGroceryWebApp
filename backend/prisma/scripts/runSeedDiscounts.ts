// === FILE: prisma/scripts/runSeedDiscounts.ts ===
import { PrismaClient } from "@prisma/client";
import { seedDiscounts } from "../seeds/seedDiscounts";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Menjalankan seed diskon saja...");
  await seedDiscounts(prisma);
  console.log("✅ Seed diskon selesai.");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
