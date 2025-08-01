// utils/getBranchIdFromToken.ts
import { jwtDecode } from "jwt-decode";

export function getBranchIdFromToken(): number | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<{ branchId?: number }>(token);
    return decoded.branchId ?? null;
  } catch {
    return null;
  }
}
