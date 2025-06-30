// File: src/services/inventory.service.ts

import { PrismaClient, Role, TransactionType } from '@prisma/client';
import { UpdateStockInput } from '../interfaces/inventory.interfaces';

const prisma = new PrismaClient();

export const inventoryService = {
  getInventory: async ({ branchId, userId, role }: { branchId?: number; userId: number; role: Role }) => {
    let resolvedBranchId = branchId;

    // Jika STORE_ADMIN, ambil cabang dari user langsung
    if (role === 'STORE_ADMIN') {
      const branch = await prisma.branch.findFirst({ where: { userId } });
      if (!branch) throw new Error('Branch not found for store admin');
      resolvedBranchId = branch.id;
    }

    return prisma.productBranch.findMany({
      where: { branchId: resolvedBranchId },
      include: {
        product: true,
        branch: true,
      },
    });
  },

  updateStock: async (input: UpdateStockInput) => {
    const { user, productId, branchId, quantity, transactionType, description } = input;

    if (user.role === 'STORE_ADMIN') {
      const branch = await prisma.branch.findFirst({ where: { userId: user.id } });
      if (!branch || branch.id !== branchId) {
        throw new Error('Unauthorized: Store admin can only manage their own branch');
      }
    }

    const existing = await prisma.productBranch.findUnique({
      where: {
        productId_branchId: {
          productId,
          branchId,
        },
      },
    });

    const newStock = transactionType === 'IN'
      ? (existing?.stock || 0) + quantity
      : (existing?.stock || 0) - quantity;

    // Simpan atau update ke tabel productBranch
    const productBranch = existing
      ? await prisma.productBranch.update({
          where: {
            productId_branchId: {
              productId,
              branchId,
            },
          },
          data: { stock: newStock },
        })
      : await prisma.productBranch.create({
          data: {
            productId,
            branchId,
            stock: quantity,
          },
        });

    // Buat jurnal mutasi
    await prisma.journalMutation.create({
      data: {
        productBranchId: productBranch.id,
        quantity,
        transactionType,
        description,
        branchId,
      },
    });

    return productBranch;
  },
};
