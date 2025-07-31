// === FILE: prisma/seeds/seedAddresses.ts ===
import { PrismaClient, Role } from "@prisma/client";

export const seedAddresses = async (prisma: PrismaClient) => {
  const users = await prisma.users.findMany({
    where: { role: Role.USER },
  });

  const district = await prisma.districts.findFirst({
    where: { cityId: 3171 }, // Jakarta Pusat
  });

  let counter = 1;
  for (const user of users) {
    await prisma.addresses.create({
      data: {
        name: `Alamat Utama ${user.username ?? "User" + counter}`,
        address: `Jl. Contoh No.${counter}`,
        postalCode: "12345",
        isPrimary: true,
        userId: user.id,
        provinceId: 31,       // DKI Jakarta
        cityId: 3171,         // Jakarta Pusat
        districtId: district?.id ?? 3171010, // ✅ fallback ke Gambir
        phone: "081234567890",
        updatedAt: new Date(),
      },
    });
    counter++;
  }

  console.log("✅ Seeded addresses for USERs");
};
