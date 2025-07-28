export type Role = "SUPER_ADMIN" | "STORE_ADMIN";

export interface IUser {
  id: number;
  username: string;
  email: string;
  role: string;
}
