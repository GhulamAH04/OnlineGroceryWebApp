// File: src/services/product.service.ts

import { Prisma, PrismaClient } from '@prisma/client';
import { CreateProductInput } from '../interfaces/product.interface';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';

const prisma = new PrismaClient();

export const productService = {
  getAll: async (params: any) => {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const where: Prisma.ProductWhereInput = {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    };

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data,
      total,
      page: +page,
      totalPages: Math.ceil(total / take),
    };
  },

  getById: async (id: number) => {
    return prisma.product.findUnique({ where: { id } });
  },

  create: async (body: CreateProductInput, files: Express.Multer.File[]) => {
    const uploads = await Promise.all(
      files.map((file) => uploadToCloudinary(file.buffer))
    );

    const firstImageUrl = (uploads[0] as any).secure_url;

    const slug = body.name.toLowerCase().replace(/\s+/g, '-');

    return prisma.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        price: +body.price,
        categoryId: +body.categoryId,
        image: firstImageUrl,
      },
    });
  },

  update: async (id: number, body: CreateProductInput, files: Express.Multer.File[]) => {
    const slug = body.name.toLowerCase().replace(/\s+/g, '-');

    const updated: any = {
      name: body.name,
      slug,
      description: body.description,
      price: +body.price,
      categoryId: +body.categoryId,
    };

    if (files && files.length > 0) {
      const uploads = await Promise.all(
        files.map((file) => uploadToCloudinary(file.buffer))
      );
      updated.image = (uploads[0] as any).secure_url;
    }

    return prisma.product.update({
      where: { id },
      data: updated,
    });
  },

  delete: async (id: number) => {
    return prisma.product.delete({ where: { id } });
  },
};
