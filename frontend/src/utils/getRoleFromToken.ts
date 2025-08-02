// === FILE: src/utils/getRoleFromToken.ts ===

import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/interfaces/userAdmin";

export function getRoleFromToken(): JwtPayload["role"] | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.role;
  } catch {
    return null;
  }
}
