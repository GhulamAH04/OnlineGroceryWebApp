// File: src/services/discount.service.ts

import { PrismaClient, Role, DiscountType } from '@prisma/client';

const prisma = new PrismaClient();

export const discountService = {
  getAll: async (user: { id: number; role: Role }) => {
    if (user.role === 'SUPER_ADMIN') {
      return prisma.discount.findMany({
        include: { branch: true, product: true },
        orderBy: { expiredAt: 'desc' },
      });
    }

    const branch = await prisma.branch.findFirst({ where: { userId: user.id } });
    if (!branch) throw new Error('Branch not found');

    return prisma.discount.findMany({
      where: { branchId: branch.id },
      include: { branch: true, product: true },
      orderBy: { expiredAt: 'desc' },
    });
  },

  create: async (user: { id: number; role: Role }, body: any) => {
    const {
      type,
      value,
      isPercentage,
      minPurchase,
      expiredAt,
      branchId,
      productId,
      buyX,
      getY,
    } = body;

    let resolvedBranchId = branchId;

    if (user.role === 'STORE_ADMIN') {
      const branch = await prisma.branch.findFirst({ where: { userId: user.id } });
      if (!branch) throw new Error('Branch not found');
      resolvedBranchId = branch.id;
    }

    return prisma.discount.create({
      data: {
        type,
        value: +value,
        isPercentage: type === 'PERCENTAGE',
        minPurchase: minPurchase ? +minPurchase : null,
        expiredAt: new Date(expiredAt),
        branchId: resolvedBranchId,
        productId: productId ? +productId : null,
        buyX: buyX ? +buyX : null,
        getY: getY ? +getY : null,
      },
    });
  },

  update: async (id: number, user: { id: number; role: Role }, body: any) => {
    const discount = await prisma.discount.findUnique({ where: { id } });
    if (!discount) throw new Error('Discount not found');

    if (user.role === 'STORE_ADMIN') {
      const branch = await prisma.branch.findFirst({ where: { userId: user.id } });
      if (!branch || branch.id !== discount.branchId) {
        throw new Error('Unauthorized to update this discount');
      }
    }

    return prisma.discount.update({
      where: { id },
      data: {
        ...body,
        value: +body.value,
        isPercentage: body.type === 'PERCENTAGE',
        expiredAt: new Date(body.expiredAt),
        minPurchase: body.minPurchase ? +body.minPurchase : null,
        productId: body.productId ? +body.productId : null,
        buyX: body.buyX ? +body.buyX : null,
        getY: body.getY ? +body.getY : null,
      },
    });
  },

  remove: async (id: number, user: { id: number; role: Role }) => {
    const discount = await prisma.discount.findUnique({ where: { id } });
    if (!discount) throw new Error('Discount not found');

    if (user.role === 'STORE_ADMIN') {
      const branch = await prisma.branch.findFirst({ where: { userId: user.id } });
      if (!branch || branch.id !== discount.branchId) {
        throw new Error('Unauthorized to delete this discount');
      }
    }

    return prisma.discount.delete({ where: { id } });
  },
};
