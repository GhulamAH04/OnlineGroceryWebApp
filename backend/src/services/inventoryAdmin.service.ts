import { PrismaClient, Role, TransactionType, Prisma } from '@prisma/client';
import { UpdateStockInput } from '../interfaces/inventoryProductAdmin.interfaces';

const prisma = new PrismaClient();

export const inventoryService = {
  // === GET INVENTORY with pagination & sorting ===
  getInventory: async ({
    branchId,
    userId,
    role,
    skip,
    limit,
    sortBy,
    sortOrder,
    search,
  }: {
    branchId?: number;
    userId: number;
    role: Role;
    skip: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
  }) => {
    let resolvedBranchId: number | undefined = branchId;

    if (role === 'STORE_ADMIN') {
      const branch = await prisma.branchs.findFirst({ where: { userId } });
      if (!branch) throw new Error('Branch not found for Store Admin');
      resolvedBranchId = branch.id;
    }

    const whereClause: Prisma.product_branchsWhereInput = {
      ...(resolvedBranchId ? { branchId: resolvedBranchId } : {}),
      ...(search
        ? {
            products: {
              is: {
                name: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.product_branchs.findMany({
        where: whereClause,
        include: {
          products: true,
          branchs: true,
        },
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.product_branchs.count({
        where: whereClause,
      }),
    ]);

    return { items, total };
  },

  // === UPDATE STOCK ===
  updateStock: async (input: UpdateStockInput) => {
    const { user, productId, branchId, quantity, transactionType, description } = input;

    if (user.role === 'STORE_ADMIN') {
      const branch = await prisma.branchs.findFirst({ where: { userId: user.id } });
      if (!branch || branch.id !== branchId) {
        throw new Error('Unauthorized: Store Admin hanya bisa mengelola cabangnya sendiri');
      }
    }

    const existing = await prisma.product_branchs.findUnique({
      where: {
        productId_branchId: {
          productId,
          branchId,
        },
      },
    });

    const newStock =
      transactionType === 'IN'
        ? (existing?.stock || 0) + quantity
        : (existing?.stock || 0) - quantity;

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
