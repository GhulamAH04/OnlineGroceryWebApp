// === File: prisma/seeds/seedCities.ts ===
import { PrismaClient } from "@prisma/client";

export async function seedCities(prisma: PrismaClient) {
  await prisma.cities.createMany({
    data: [
      { id: 1101, name: "Banda Aceh", provinceId: 11 },
      { id: 1271, name: "Medan", provinceId: 12 },
      { id: 3171, name: "Jakarta Pusat", provinceId: 31 },
      { id: 3273, name: "Bandung", provinceId: 32 },
      { id: 3374, name: "Semarang", provinceId: 33 },
      { id: 3471, name: "Yogyakarta", provinceId: 34 },
      { id: 3578, name: "Surabaya", provinceId: 35 },
      { id: 3671, name: "Serang", provinceId: 36 },
    ],
    skipDuplicates: true,
  });
}
