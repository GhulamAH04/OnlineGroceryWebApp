// File: src/interfaces/product.interface.ts

export interface CreateProductInput {
    name: string;
    slug?: string;  // opsional kalau Prisma auto-gen
    description?: string;
    price: number;
    categoryId: number;
  }
  