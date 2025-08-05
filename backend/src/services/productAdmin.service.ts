// === FILE: productAdmin.service.ts ===
import { PrismaClient, Role } from "@prisma/client";
import { CreateProductInput, ProductAdminItem } from "../interfaces/productAdmin.interface";
import { uploadToCloudinary } from "../utils/cloudinary";

const prisma = new PrismaClient();

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/djbdfjx1d/image/upload/v1746972046/nugget_plgi8w.jpg";

export const productService = {
  // === GET ALL PRODUCTS ===
 getAll: async (params: any) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "name",
    sortOrder = "asc",
    categoryId,
    role,
    branchId,
  } = params;

  const take = parseInt(limit);
  const skip = (parseInt(page) - 1) * take;

  const whereProduct: any = {
    name: {
      contains: search,
      mode: "insensitive",
    },
  };

  if (categoryId) {
    whereProduct.categoryId = parseInt(categoryId);
  }

  const allProducts = await prisma.products.findMany({
    where: whereProduct,
    include: {
      categories: true,
      product_branchs: {
        include: { branchs: true },
      },
    },
    orderBy: { [sortBy]: sortOrder },
  });

  const DEFAULT_IMAGE =
    "https://res.cloudinary.com/djbdfjx1d/image/upload/v1746972046/nugget_plgi8w.jpg";

  const result = allProducts.flatMap((product) => {
    const branches = product.product_branchs.filter((pb) =>
      role === "STORE_ADMIN" ? pb.branchId === Number(branchId) : true
    );

    return branches.map((pb) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image || DEFAULT_IMAGE,
      price: product.price,
      weight: product.weight,
      stock: pb.stock,
      branchId: pb.branchId,
      branchName: pb.branchs.name,
      categoryName: product.categories?.name || "-",
      description: product.description || "",
    }));
  });

  const total = result.length;
  const paginated = result.slice(skip, skip + take);

  return {
    data: paginated,
    meta: {
      totalItems: total,
      totalPages: Math.ceil(total / take),
      currentPage: parseInt(page),
    },
  };
},

  // === GET PRODUCT BY ID ===
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
      image: pb.products.image || DEFAULT_IMAGE,
      price: pb.products.price,
      stock: pb.stock,
      branchId: pb.branchs.id,
      branchName: pb.branchs.name,
      categoryName: pb.products.categories?.name || "-",
      description: pb.products.description || "",
    };
  },

  // === CREATE PRODUCT ===
create: async (body: CreateProductInput, file?: Express.Multer.File) => {
  const existing = await prisma.products.findUnique({
    where: { name: body.name },
  });
  if (existing) throw new Error("Produk dengan nama ini sudah ada");

  let imageUrl = DEFAULT_IMAGE;

  if (file) {
    const upload = await uploadToCloudinary(file.buffer);
    imageUrl = (upload as any).secure_url || DEFAULT_IMAGE;
  }

  const slug = body.name.toLowerCase().replace(/\s+/g, "-");

  const product = await prisma.products.create({
    data: {
      name: body.name,
      slug,
      description: body.description,
      price: +body.price,
      weight: Number(body.weight), 
      image: imageUrl,
      categoryId: Number(body.categoryId) || 1,
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
  file?: Express.Multer.File
) => {
  const existing = await prisma.products.findFirst({
    where: { name: body.name, NOT: { id } },
  });
  if (existing) throw new Error("Produk dengan nama ini sudah ada");

  const slug = body.name.toLowerCase().replace(/\s+/g, "-");

  const updated: any = {
    name: body.name,
    slug,
    description: body.description,
    price: +body.price,
    weight: Number(body.weight), // ✅ Tambahkan ini
    categoryId: Number(body.categoryId) || 1,
    updatedAt: new Date(),
  };

  if (file) {
    const upload = await uploadToCloudinary(file.buffer);
    updated.image = (upload as any).secure_url || DEFAULT_IMAGE;
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
getDropdownProducts: async (user: { id: number; role: Role }) => {
  if (user.role === "SUPER_ADMIN") {
    return prisma.products.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  }

  const branch = await prisma.branchs.findFirst({ where: { userId: user.id } });
  if (!branch) throw new Error("Branch not found");

  const productBranchs = await prisma.product_branchs.findMany({
    where: { branchId: branch.id },
    include: {
      products: {
        select: { id: true, name: true },
      },
    },
  });

  return productBranchs.map((pb) => ({
    id: pb.products.id,
    name: pb.products.name,
  }));
},

  // === DELETE PRODUCT ===
  delete: async (id: number) => {
    await prisma.product_branchs.deleteMany({ where: { productId: id } });
    return prisma.products.delete({ where: { id } });
  },
};
