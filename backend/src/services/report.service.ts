// File: src/services/report.service.ts

import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export const reportService = {
  getSalesReport: async (user: { id: number; role: Role }, month: number, year: number) => {
    let branchId: number | undefined;

    if (user.role === 'STORE_ADMIN') {
      const branch = await prisma.branch.findFirst({ where: { userId: user.id } });
      if (!branch) throw new Error('Branch not found');
      branchId = branch.id;
    }

    const whereBase = {
      createdAt: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(`${year}-${month + 1}-01`),
      },
      ...(branchId && { branchId }),
    };

    // Total by product
    const byProduct = await prisma.orderProduct.groupBy({
      by: ['productId'],
      where: {
        order: { ...whereBase },
      },
      _sum: { total: true, quantity: true },
    });

    // Total by category
    const byCategory = await prisma.orderProduct.groupBy({
      by: ['productId'],
      where: {
        order: { ...whereBase },
      },
      _sum: { total: true },
    });

    // Total all
    const totalSales = await prisma.order.aggregate({
      where: whereBase,
      _sum: { total: true },
    });

    return {
      total: totalSales._sum.total || 0,
      byProduct,
      byCategory,
    };
  },

  getStockReport: async (user: { id: number; role: Role }, month: number, year: number) => {
    let branchId: number | undefined;

    if (user.role === 'STORE_ADMIN') {
      const branch = await prisma.branch.findFirst({ where: { userId: user.id } });
      if (!branch) throw new Error('Branch not found');
      branchId = branch.id;
    }

    const where = {
      createdAt: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(`${year}-${month + 1}-01`),
      },
      ...(branchId && { branchId }),
    };

    const mutations = await prisma.journalMutation.findMany({
      where,
      include: {
        productBranch: {
          include: {
            product: true,
            branch: true,
          },
        },
      },
    });

    // Ringkasan
    const summary: Record<number, { in: number; out: number }> = {};

    for (const m of mutations) {
      const id = m.productBranch.productId;
      if (!summary[id]) summary[id] = { in: 0, out: 0 };
      if (m.transactionType === 'IN') summary[id].in += m.quantity;
      else summary[id].out += m.quantity;
    }

    return {
      summary,
      details: mutations,
    };
  },
};
