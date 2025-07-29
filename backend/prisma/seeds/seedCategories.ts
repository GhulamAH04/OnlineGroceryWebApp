// === FILE: prisma/seeds/seedCategories.ts ===
import { PrismaClient } from "@prisma/client";

export const seedCategories = async (prisma: PrismaClient) => {
  console.log("⏳ Seeding categories...");

  // Hapus data yang bergantung terlebih dahulu
  await prisma.order_products.deleteMany();
  await prisma.journal_mutations.deleteMany(); // <-- tambahkan ini
  await prisma.product_branchs.deleteMany();
  await prisma.products.deleteMany();
  await prisma.categories.deleteMany();

  const now = new Date();

  const categoryNames = [
    "Minuman Segar",
    "Frozen Food",
    "Bumbu & Rempah",
    "Telur & Produk Ternak",
    "Susu & Olahan",
  ];

  for (const name of categoryNames) {
    await prisma.categories.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  console.log(`✅ seedCategories selesai: ${categoryNames.length} kategori dibuat.`);
};



/*

// === FILE: prisma/seeds/seedCategories.ts ===
import { PrismaClient } from "@prisma/client";

export const seedCategories = async (prisma: PrismaClient) => {
  console.log("⏳ Seeding categories...");

  // Opsional: Kosongkan data produk sebelum reseed kategori
  await prisma.order_products.deleteMany();
  await prisma.product_branchs.deleteMany();
  await prisma.products.deleteMany();
  await prisma.categories.deleteMany();

  const categories = [
    { name: "Sayur Segar", slug: "sayur-segar" },
    { name: "Buah Segar", slug: "buah-segar" },
    { name: "Daging Segar", slug: "daging-segar" },
    { name: "Ikan & Seafood", slug: "ikan-seafood" },
    { name: "Frozen Food", slug: "frozen-food" },
    { name: "Makanan Siap Masak", slug: "makanan-siap-masak" },
    { name: "Bumbu & Rempah", slug: "bumbu-rempah" },
    { name: "Telur & Produk Ternak", slug: "telur-produk-ternak" },
    { name: "Susu & Olahan", slug: "susu-olahan" },
    { name: "Minuman Segar", slug: "minuman-segar" },
    { name: "Paket Masak Harian", slug: "paket-masak-harian" },
    { name: "Promo & Diskon", slug: "promo-diskon" },
  ];

  const now = new Date();

  for (const category of categories) {
    await prisma.categories.create({
      data: {
        ...category,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  console.log("✅ seedCategories selesai");
};
*/