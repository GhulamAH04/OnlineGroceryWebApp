export type Role = "SUPER_ADMIN" | "STORE_ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  storeId?: number | null;
  createdAt?: string;
}
