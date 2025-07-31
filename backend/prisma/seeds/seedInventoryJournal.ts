// === FILE: prisma/seeds/seedInventoryJournal.ts ===
import { PrismaClient, TransactionType } from "@prisma/client";

const getInDescription = (month: number): string => {
  switch (month) {
    case 0: return "Restock awal tahun";
    case 2: return "Persiapan Ramadan";
    case 3: return "Stok Lebaran masuk";
    case 6: return "Restock liburan sekolah";
    case 10: return "Restock akhir tahun";
    default: return "Penambahan stok rutin";
  }
};

const getOutDescription = (month: number): string => {
  switch (month) {
    case 3: return "Penjualan tinggi saat Lebaran";
    case 4: return "Stok terjual habis pasca Lebaran";
    case 6: return "Penjualan libur sekolah";
    case 11: return "Penjualan akhir tahun";
    default: return "Pengambilan untuk penjualan";
  }
};

export const seedInventoryJournal = async (prisma: PrismaClient) => {
  console.log("⏳ Seeding inventory journal for all product_branchs...");

  const productBranchs = await prisma.product_branchs.findMany();
  const now = new Date();

  if (productBranchs.length === 0) {
    console.log("⚠️ Tidak ada product_branchs ditemukan.");
    return;
  }

  for (const pb of productBranchs) {
    for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
      const date = new Date(now);
      date.setMonth(now.getMonth() - monthOffset);
      const month = date.getMonth(); // 0–11

      const inQty = Math.floor(Math.random() * 20) + 5;
      const outQty = Math.floor(Math.random() * 10);

      await prisma.journal_mutations.create({
        data: {
          quantity: inQty,
          transactionType: TransactionType.IN,
          description: getInDescription(month),
          productBranchId: pb.id,
          branchId: pb.branchId,
          createdAt: date,
          updatedAt: date,
        },
      });

      await prisma.journal_mutations.create({
        data: {
          quantity: outQty,
          transactionType: TransactionType.OUT,
          description: getOutDescription(month),
          productBranchId: pb.id,
          branchId: pb.branchId,
          createdAt: date,
          updatedAt: date,
        },
      });
    }
  }

  console.log(`✅ seedInventoryJournal selesai: ${productBranchs.length * 24} mutasi dibuat.`);
};
