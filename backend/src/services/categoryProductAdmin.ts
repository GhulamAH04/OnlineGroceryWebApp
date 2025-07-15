// OnlineGroceryWebApp/backend/src/services/categoryAdmin.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const categoryService = {
  getAll: async () => {
    return prisma.categories.findMany({ orderBy: { name: 'asc' } });
  },

  create: async (name: string) => {
    const existing = await prisma.categories.findUnique({ where: { name } });
    if (existing) throw new Error('Category already exists');

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    return prisma.categories.create({
      data: { name, slug, updatedAt: new Date() },
    });
  },

  update: async (id: number, name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    return prisma.categories.update({
      where: { id },
      data: { name, slug,updatedAt: new Date(), },
    });
  },

  delete: async (id: number) => {
    return prisma.categories.delete({ where: { id } });
  },
};
