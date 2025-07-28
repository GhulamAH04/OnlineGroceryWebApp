// File: src/interfaces/inventory.interface.ts


import { Role, TransactionType } from '@prisma/client';

export interface UpdateStockInput {
  user: {
    id: number;
    role: Role;
  };
  productId: number;
  branchId: number;
  quantity: number;
  transactionType: TransactionType;
  description: string;
}
