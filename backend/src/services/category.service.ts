// File: src/services/category.service.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const categoryService = {
  getAll: async () => {
    return prisma.category.findMany({ orderBy: { name: 'asc' } });
  },

  create: async (name: string) => {
    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) throw new Error('Category already exists');

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    return prisma.category.create({
      data: { name, slug },
    });
  },

  update: async (id: number, name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    return prisma.category.update({
      where: { id },
      data: { name, slug },
    });
  },

  delete: async (id: number) => {
    return prisma.category.delete({ where: { id } });
  },
};
