// === FILE: prisma/seeds/seedInventoryJournal.ts ===
import { PrismaClient, TransactionType } from "@prisma/client";

export const seedInventoryJournal = async (prisma: PrismaClient) => {
  console.log("⏳ Seeding journal_mutations...");

  const productBranches = await prisma.product_branchs.findMany({
    take: 30, // ⛔️ Batasi agar tidak overload
  });

  const now = new Date();

  if (productBranches.length === 0) {
    console.log("⚠️ No product_branchs found. Skipping journal_mutations seeding.");
    return;
  }

  for (const pb of productBranches) {
    const inQty = Math.floor(Math.random() * 20) + 1;
    const outQty = Math.floor(Math.random() * 10);

    // Mutasi IN
    await prisma.journal_mutations.create({
      data: {
        quantity: inQty,
        transactionType: TransactionType.IN,
        description: `Penambahan stok awal`,
        productBranchId: pb.id,
        branchId: pb.branchId,
        createdAt: new Date(now),
        updatedAt: new Date(now),
      },
    });

    // Mutasi OUT
    await prisma.journal_mutations.create({
      data: {
        quantity: outQty,
        transactionType: TransactionType.OUT,
        description: `Pengambilan stok awal`,
        productBranchId: pb.id,
        branchId: pb.branchId,
        createdAt: new Date(now),
        updatedAt: new Date(now),
      },
    });
  }

  console.log(`✅ seedInventoryJournal selesai: ${productBranches.length * 2} mutasi dibuat.`);
};


/*
// === FILE: prisma/seeds/seedInventoryJournal.ts ===
import { PrismaClient } from "@prisma/client";

// === Bantu fungsi dapatkan deskripsi bulan ===
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
  const productBranchs = await prisma.product_branchs.findMany();
  const now = new Date();

  for (const pb of productBranchs) {
    for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
      const date = new Date(now);
      date.setMonth(now.getMonth() - monthOffset);
      const month = date.getMonth(); // 0 (Jan) to 11 (Dec)

      const inQty = Math.floor(Math.random() * 20) + 5;  // IN: 5–24
      const outQty = Math.floor(Math.random() * 10);     // OUT: 0–9

      // Mutasi IN
      await prisma.journal_mutations.create({
        data: {
          quantity: inQty,
          transactionType: "IN",
          description: getInDescription(month),
          productBranchId: pb.id,
          branchId: pb.branchId,
          createdAt: date,
          updatedAt: date,
        },
      });

      // Mutasi OUT
      await prisma.journal_mutations.create({
        data: {
          quantity: outQty,
          transactionType: "OUT",
          description: getOutDescription(month),
          productBranchId: pb.id,
          branchId: pb.branchId,
          createdAt: date,
          updatedAt: date,
        },
      });
    }
  }

  console.log("✅ seedInventoryJournal selesai");
};
*/

/*
// === FILE: prisma/seeds/seedInventoryJournal.ts ===
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const seedInventoryJournal = async () => {
  const productBranchs = await prisma.product_branchs.findMany();
  const now = new Date();

  // Buat mutasi stok per produk-cabang selama 12 bulan terakhir
  for (const pb of productBranchs) {
    for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
      const date = new Date(now);
      date.setMonth(now.getMonth() - monthOffset);

      const inQty = Math.floor(Math.random() * 20) + 5;
      const outQty = Math.floor(Math.random() * 10);

      // Mutasi IN (penambahan stok)
      await prisma.journal_mutations.create({
        data: {
          quantity: inQty,
          transactionType: "IN",
          description: "Penambahan stok rutin",
          productBranchId: pb.id,
          branchId: pb.branchId,
          createdAt: date,
          updatedAt: date,
        },
      });

      // Mutasi OUT (pengurangan stok)
      await prisma.journal_mutations.create({
        data: {
          quantity: outQty,
          transactionType: "OUT",
          description: "Pengambilan untuk penjualan",
          productBranchId: pb.id,
          branchId: pb.branchId,
          createdAt: date,
          updatedAt: date,
        },
      });
    }
  }

  console.log("✅ seedInventoryJournal selesai");
};
*/