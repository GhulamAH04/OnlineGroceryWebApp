// src/utils/isTokenExpired.ts

import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number; // UNIX timestamp (in seconds)
  [key: string]: unknown; // kalau ada properti lain, tidak error
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
    if (!decoded.exp) return true;

    const now = Date.now() / 1000; // current time in seconds
    return decoded.exp < now;
  } catch {
    return true; // error parsing token dianggap expired
  }
};
