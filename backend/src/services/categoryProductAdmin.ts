// File: backend/src/services/categoryProductAdmin.service.ts

import { PrismaClient } from "@prisma/client";
import { slugify } from "../utils/slugify";
import { PaginationQueryParams } from "../interfaces/pagination.interfaces";

const prisma = new PrismaClient();

export const categoryService = {
  // === GET ALL with pagination, sorting, search ===
  async getAll(params: PaginationQueryParams) {
    const { skip, limit, sortBy, sortOrder, search } = params;

    const where = search
      ? {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.categories.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.categories.count({ where }),
    ]);

    return { data, total };
  },

  // === CREATE ===
  async create(name: string) {
    const existing = await prisma.categories.findFirst({
      where: { name },
    });
    if (existing) throw new Error("Kategori sudah ada");

    const slug = slugify(name).toLowerCase();

    return prisma.categories.create({
      data: {
        name,
        slug,
        updatedAt: new Date(),
      },
    });
  },

  // === UPDATE ===
  async update(id: number, name: string) {
    const slug = slugify(name).toLowerCase();

    return prisma.categories.update({
      where: { id },
      data: {
        name,
        slug,
        updatedAt: new Date(),
      },
    });
  },

  // === DELETE ===
  async delete(id: number) {
    return prisma.categories.delete({
      where: { id },
    });
  },
};
