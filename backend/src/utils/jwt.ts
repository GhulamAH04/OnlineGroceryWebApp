// File: src/utils/jwt.ts
// backend/src/utils/jwt.ts
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { JwtPayload } from "../interfaces/user.interface";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "secret";

if (JWT_SECRET === "secret") {
  console.warn("⚠️ JWT_SECRET not set. Using fallback 'secret'. Avoid in production!");
}

export const signJwt = (
  payload: JwtPayload,
  expiresIn: `${number}${"s" | "m" | "h" | "d"}` = "1d"
) => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyJwt = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};


/*
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { JwtPayload } from '../interfaces/user.interface';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'secret'; // fallback dev
if (!process.env.JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET not set. Using default fallback. Do NOT use in production.");
}

export const signJwt = (payload: JwtPayload, expiresIn: `${number}${'s' | 'm' | 'h' | 'd'}` = '1d') => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
};
export const verifyJwt = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    return null; // atau lempar error custom
  }
};
*/