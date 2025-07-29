// === FILE: prisma/seeds/seedUserCustomers.ts ===
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export const seedUserCustomers = async (prisma: PrismaClient) => {
  console.log("⏳ Seeding USER role...");

  const password = await bcrypt.hash("user123", 10);
  const now = new Date();

  await prisma.users.createMany({
    data: [
      {
        username: "budi",
        email: "budi@example.com",
        password,
        role: "USER",
        createdAt: now,
        updatedAt: now,
      },
      {
        username: "siti",
        email: "siti@example.com",
        password,
        role: "USER",
        createdAt: now,
        updatedAt: now,
      },
      {
        username: "agus",
        email: "agus@example.com",
        password,
        role: "USER",
        createdAt: now,
        updatedAt: now,
      },
      {
        username: "rina",
        email: "rina@example.com",
        password,
        role: "USER",
        createdAt: now,
        updatedAt: now,
      },
      {
        username: "andi",
        email: "andi@example.com",
        password,
        role: "USER",
        createdAt: now,
        updatedAt: now,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ seedUserCustomers selesai: 5 user CUSTOMER ditambahkan.");
};
