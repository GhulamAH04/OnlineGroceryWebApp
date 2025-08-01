// === FILE: src/utils/getRoleFromToken.ts ===
import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  id: number;
  role: "SUPER_ADMIN" | "STORE_ADMIN";
  iat?: number;
  exp?: number;
}


export function getRoleFromToken(): JwtPayload["role"] | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.role;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}
