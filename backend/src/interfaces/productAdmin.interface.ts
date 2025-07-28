// File: src/interfaces/product.interface.ts
// === INTERFACE: PRODUCT ADMIN ===

export interface CreateProductInput {
  name: string;
  slug?: string; // auto-generate dari name
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
  branchId: number;
}