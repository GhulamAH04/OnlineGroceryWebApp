// === SERVICE: PRODUCT ADMIN ===
import { PrismaClient } from '@prisma/client';
import { CreateProductInput } from '../interfaces/productAdmin.interface';
import { uploadToCloudinary } from '../utils/cloudinary';

const prisma = new PrismaClient();

export const productService = {
  // === GET ALL PRODUCTS (with branch & stock) ===
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

    const productBranches = await prisma.product_branchs.findMany({
      where: {
        products: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      },
      include: {
        products: { include: { categories: true } },
        branchs: true,
      },
      skip,
      take,
      orderBy: { createdAt: sortOrder },
    });

    const total = await prisma.product_branchs.count({
      where: {
        products: {
          name: { contains: search, mode: 'insensitive' },
        },
      },
    });

    return {
      data: productBranches.map((pb) => ({
        id: pb.products.id,
        name: pb.products.name,
        slug: pb.products.slug,
        image: pb.products.image,
        price: pb.products.price,
        stock: pb.stock,
        storeId: pb.branchs.id,
        storeName: pb.branchs.name,
        categoryName: pb.products.categories?.name || '-',
        description: pb.products.description || '',
      })),
      total,
      page: +page,
      totalPages: Math.ceil(total / take),
    };
  },

  // === GET PRODUCT BY ID (with branch & stock) ===
  getById: async (id: number) => {
    const pb = await prisma.product_branchs.findFirst({
      where: { productId: id },
      include: {
        products: { include: { categories: true } },
        branchs: true,
      },
    });

    if (!pb) return null;

    return {
      id: pb.products.id,
      name: pb.products.name,
      slug: pb.products.slug,
      image: pb.products.image,
      price: pb.products.price,
      stock: pb.stock,
      storeId: pb.branchs.id,
      storeName: pb.branchs.name,
      categoryName: pb.products.categories?.name || '-',
      description: pb.products.description || '',
    };
  },

  // === CREATE PRODUCT ===
  create: async (body: CreateProductInput, files: Express.Multer.File[]) => {
    const existing = await prisma.products.findUnique({ where: { name: body.name } });
    if (existing) throw new Error('Produk dengan nama ini sudah ada');

    const uploads = await Promise.all(
      files.map((file) => uploadToCloudinary(file.buffer))
    );
    const firstImageUrl = (uploads[0] as any).secure_url;
    const slug = body.name.toLowerCase().replace(/\s+/g, '-');

    const product = await prisma.products.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        price: +body.price,
        categoryId: Number(body.categoryId) || 1,
        image: firstImageUrl,
        updatedAt: new Date(),
      },
    });

    await prisma.product_branchs.create({
      data: {
        productId: product.id,
        branchId: Number(body.branchId) || 1,
        stock: Number(body.stock) || 0,
        updatedAt: new Date(),
      },
    });

    return product;
  },

  // === UPDATE PRODUCT ===
  update: async (
    id: number,
    body: CreateProductInput,
    files: Express.Multer.File[]
  ) => {
    const existing = await prisma.products.findFirst({
      where: { name: body.name, NOT: { id } },
    });
    if (existing) throw new Error('Produk dengan nama ini sudah ada');

    const slug = body.name.toLowerCase().replace(/\s+/g, '-');

    const updated: any = {
      name: body.name,
      slug,
      description: body.description,
      price: +body.price,
      categoryId: Number(body.categoryId) || 1,
      updatedAt: new Date(),
    };

    if (files && files.length > 0) {
      const uploads = await Promise.all(
        files.map((file) => uploadToCloudinary(file.buffer))
      );
      updated.image = (uploads[0] as any).secure_url;
    }

    const product = await prisma.products.update({
      where: { id },
      data: updated,
    });

    await prisma.product_branchs.updateMany({
      where: { productId: id },
      data: {
        stock: Number(body.stock) || 0,
        updatedAt: new Date(),
      },
    });

    return product;
  },

  // === DELETE PRODUCT ===
  delete: async (id: number) => {
    await prisma.product_branchs.deleteMany({ where: { productId: id } });
    return prisma.products.delete({ where: { id } });
  },
};
