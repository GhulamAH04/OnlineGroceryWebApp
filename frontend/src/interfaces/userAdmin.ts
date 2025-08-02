// OnlineGroceryWebApp/frontend/src/interfaces/userAdmin.ts

export interface UserAdmin {
  id: number;
  email: string;
  username?: string | null;
  role: string;
  branchId?: number | null;        
  branchName?: string;
}

export interface JwtPayload {
  userId: number;
  role: "SUPER_ADMIN" | "STORE_ADMIN" | "USER";
}
