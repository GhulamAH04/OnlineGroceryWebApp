// === FILE: prisma/seeds/seedUsers.ts ===
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export const seedUsers = async (prisma: PrismaClient) => {
  console.log("⏳ Seeding users (SUPER_ADMIN & STORE_ADMIN)...");

  const now = new Date();
  const password = await bcrypt.hash("password123", 10);

  // === SUPER ADMIN
  await prisma.users.upsert({
    where: { email: "superadmin@groceria.com" },
    update: {},
    create: {
      username: "Super Admin",
      email: "superadmin@groceria.com",
      password: await bcrypt.hash("superadmin123", 10),
      role: "SUPER_ADMIN",
      isVerified: true,
      createdAt: now,
      updatedAt: now,
    },
  });

  // === STORE ADMINs
  const storeAdmins = [
    { username: "Admin Jakarta", email: "jakarta@admin.com", branchId: 1 },
    { username: "Admin Bandung", email: "bandung@admin.com", branchId: 2 },
    { username: "Admin Surabaya", email: "surabaya@admin.com", branchId: 3 },
    { username: "Admin Yogyakarta", email: "yogyakarta@admin.com", branchId: 4 },
    { username: "Admin Medan", email: "medan@admin.com", branchId: 5 },
  ];

  for (const admin of storeAdmins) {
    await prisma.users.upsert({
      where: { email: admin.email },
      update: {},
      create: {
        username: admin.username,
        email: admin.email,
        password,
        role: "STORE_ADMIN",
        isVerified: true,
        createdAt: now,
        updatedAt: now,
        branchs: {
          connect: { id: admin.branchId },
        },
      },
    });
  }

  console.log("✅ Seeded users (SUPER_ADMIN & STORE_ADMIN)");
};
