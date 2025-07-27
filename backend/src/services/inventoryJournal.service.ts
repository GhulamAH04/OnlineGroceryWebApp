// OnlineGroceryWebApp/backend/src/services/inventoryJournal.service.ts

import { PrismaClient, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

export async function createInventoryJournalAndUpdateStock(data: {
  productId: number;
  branchId: number;
  stock: number;
  type: "IN" | "OUT";
  note?: string;
}) {
  const { productId, branchId, stock, type, note } = data;

  const productBranch = await prisma.product_branchs.findUnique({
    where: {
      productId_branchId: {
        productId: Number(productId),
        branchId: Number(branchId),
      },
    },
  });

  if (!productBranch) throw new Error("Produk pada cabang ini tidak ditemukan");

  const newStock = type === "IN"
    ? productBranch.stock + Number(stock)
    : productBranch.stock - Number(stock);

  if (newStock < 0) throw new Error("Stok tidak mencukupi untuk dikurangi");

  await prisma.$transaction([
    prisma.journal_mutations.create({
      data: {
        quantity: Number(stock),
        transactionType: type as TransactionType,
        description: note || "",
        productBranchId: productBranch.id,
        branchId: Number(branchId),
        updatedAt: new Date(),
      },
    }),
    prisma.product_branchs.update({
      where: { id: productBranch.id },
      data: { stock: newStock },
    }),
  ]);

  return true;
}
