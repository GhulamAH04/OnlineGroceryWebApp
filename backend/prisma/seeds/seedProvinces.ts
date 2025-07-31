// === File: prisma/seeds/seedProvinces.ts ===
import { PrismaClient } from "@prisma/client";

export async function seedProvinces(prisma: PrismaClient) {
  await prisma.provinces.createMany({
    data: [
      { id: 11, name: "Aceh" },
      { id: 12, name: "Sumatera Utara" },
      { id: 31, name: "DKI Jakarta" },
      { id: 32, name: "Jawa Barat" },
      { id: 33, name: "Jawa Tengah" },
      { id: 34, name: "DI Yogyakarta" },
      { id: 35, name: "Jawa Timur" },
      { id: 36, name: "Banten" },
    ],
    skipDuplicates: true,
  });
}