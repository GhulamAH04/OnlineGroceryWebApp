// === FILE: prisma/seeds/seedBranches.ts ===
import { PrismaClient } from "@prisma/client";

export const seedBranches = async (prisma: PrismaClient) => {
  const branches = [
    {
      name: "Jakarta Store",
      provinceId: 31,
      cityId: 3171,
      districtId: 3171010,
      postalCode: "10110",
    },
    {
      name: "Bandung Store",
      provinceId: 32,
      cityId: 3273,
      districtId: 3273010,
      postalCode: "40115",
    },
    {
      name: "Surabaya Store",
      provinceId: 35,
      cityId: 3578,
      districtId: 3578010,
      postalCode: "60281",
    },
    {
      name: "Yogyakarta Store",
      provinceId: 34,
      cityId: 3471,
      districtId: 3471010,
      postalCode: "55281",
    },
    {
      name: "Medan Store",
      provinceId: 12,
      cityId: 1271,
      districtId: 1271010,
      postalCode: "20219",
    },
  ];

  for (const branch of branches) {
    await prisma.branchs.create({
      data: {
        name: branch.name,
        address: `${branch.name} Address`,
        postalCode: branch.postalCode,
        phone: "081234567890",
        latitude: 0.0,
        longitude: 0.0,
        provinceId: branch.provinceId,
        cityId: branch.cityId,
        districtId: branch.districtId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  console.log("✅ Seeded branches");
};
