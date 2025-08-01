export interface JwtPayload {
  id: number;
  role: "SUPER_ADMIN" | "STORE_ADMIN";
  iat?: number;
  exp?: number;
}
