export interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;
    categoryId?: number;
    currentStock?: number | null;
    image?: string;
  }
  