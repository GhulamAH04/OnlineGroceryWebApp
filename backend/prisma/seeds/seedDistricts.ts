// === File: prisma/seeds/seedDistricts.ts ===
import { PrismaClient } from "@prisma/client";

export async function seedDistricts(prisma: PrismaClient) {
  await prisma.districts.createMany({
    data: [
      { id: 1101010, name: "Kuta Alam", cityId: 1101 },
      { id: 1271010, name: "Medan Barat", cityId: 1271 },
      { id: 3171010, name: "Gambir", cityId: 3171 },
      { id: 3273010, name: "Coblong", cityId: 3273 },
      { id: 3374010, name: "Banyumanik", cityId: 3374 },
      { id: 3471010, name: "Mantrijeron", cityId: 3471 },
      { id: 3578010, name: "Tegalsari", cityId: 3578 },
      { id: 3671010, name: "Serang Kota", cityId: 3671 },
    ],
    skipDuplicates: true,
  });
}
