// === FILE: backend/src/services/inventoryAdmin.service.ts ===
import { PrismaClient, Role, TransactionType } from '@prisma/client';
import { UpdateStockInput } from '../interfaces/inventoryProductAdmin.interfaces';

const prisma = new PrismaClient();

export const inventoryService = {
  // === GET INVENTORY ===
  getInventory: async ({ branchId, userId, role }: { branchId?: number; userId: number; role: Role }) => {
    let resolvedBranchId: number | undefined = branchId;

    // Jika STORE_ADMIN, ambil branch berdasarkan userId
    if (role === 'STORE_ADMIN') {
      const branch = await prisma.branchs.findFirst({ where: { userId } });
      if (!branch) throw new Error('Branch not found for Store Admin');
      resolvedBranchId = branch.id;
    }

    // Ambil daftar stok produk
    return prisma.product_branchs.findMany({
      where: {
        ...(resolvedBranchId ? { branchId: resolvedBranchId } : {}), // hanya tambahkan filter jika ada
      },
      include: {
        products: true,
        branchs: true,
      },
    });
  },

  // === UPDATE STOCK ===
  updateStock: async (input: UpdateStockInput) => {
    const { user, productId, branchId, quantity, transactionType, description } = input;

    // Store Admin hanya boleh update branch miliknya
    if (user.role === 'STORE_ADMIN') {
      const branch = await prisma.branchs.findFirst({ where: { userId: user.id } });
      if (!branch || branch.id !== branchId) {
        throw new Error('Unauthorized: Store Admin hanya bisa mengelola cabangnya sendiri');
      }
    }

    // Cari data stok yang sudah ada
    const existing = await prisma.product_branchs.findUnique({
      where: {
        productId_branchId: {
          productId,
          branchId,
        },
      },
    });

    // Hitung stok baru
    const newStock = transactionType === 'IN'
      ? (existing?.stock || 0) + quantity
      : (existing?.stock || 0) - quantity;

    // Simpan stok baru
    const productBranch = existing
      ? await prisma.product_branchs.update({
          where: {
            productId_branchId: {
              productId,
              branchId,
            },
          },
          data: { stock: newStock, updatedAt: new Date() },
        })
      : await prisma.product_branchs.create({
          data: {
            productId,
            branchId,
            stock: quantity,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

    // Catat ke jurnal mutasi
    await prisma.journal_mutations.create({
      data: {
        productBranchId: productBranch.id,
        quantity,
        transactionType,
        description,
        branchId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return productBranch;
  },
};
