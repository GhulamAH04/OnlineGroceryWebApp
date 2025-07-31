// === FILE: prisma/seeds/seedCleanup.ts ===
import { PrismaClient, Role } from "@prisma/client";

export const seedCleanup = async (prisma: PrismaClient) => {
  // === 1. Hapus relasi user duluan: wishlists & carts
  await prisma.wishlists.deleteMany();
  await prisma.product_carts.deleteMany();
  await prisma.carts.deleteMany();

  // === 2. Hapus order dan relasinya
  await prisma.order_products.deleteMany();
  await prisma.orders.deleteMany();

  // === 3. Hapus jurnal mutasi
  await prisma.journal_mutations.deleteMany();

  // === 4. Hapus mutasi stok
  await prisma.mutations.deleteMany();

  // === 5. Hapus stok per cabang
  await prisma.product_branchs.deleteMany();

  // === 6. Hapus diskon
  await prisma.discount.deleteMany();

  // === 7. Hapus produk dan kategori
  await prisma.products.deleteMany();
  await prisma.categories.deleteMany();

  // === 8. Hapus alamat user
  await prisma.addresses.deleteMany();

  // === 9. Hapus user dengan role USER
  await prisma.users.deleteMany({
    where: { role: "USER" },
  });
};
