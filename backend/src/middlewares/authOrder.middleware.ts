import { Request, Response, NextFunction, RequestHandler } from "express";
import { PrismaClient, Role, users } from "@prisma/client";
import jwt from "jsonwebtoken";
import { IUserReqParam } from "../custom"; // Pastikan path ini sesuai dengan struktur proyek Anda

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface UserRequest extends Request {
  username?: string;
}

/**
 * Middleware untuk memverifikasi token JWT dan peran pengguna.
 * @param allowedRoles - Array peran yang diizinkan untuk mengakses rute.
 */
export const verifyToken = (allowedRoles: Role[]): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Cast req ke UserRequest agar properti user dikenali
    const userReq = req as UserRequest;
    const authHeader = userReq.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ message: "Akses ditolak. Token tidak ditemukan." });
      return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Akses ditolak. Token tidak valid." });
      return;
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      const user = await prisma.users.findUnique({
        where: { id: decoded.id },
      });
      if (!user) {
        res.status(401).json({ message: "User tidak ditemukan." });
        return;
      }
      if (!user.isVerified) {
        res.status(403).json({ message: "Akun Anda belum terverifikasi." });
        return;
      }
      if (!allowedRoles.includes(user.role)) {
        res.status(403).json({
          message: "Anda tidak memiliki izin untuk mengakses sumber daya ini.",
        });
        return;
      }
      userReq.user = {
        ...user,
        username: user.username ?? undefined,
      }; // Simpan user ke dalam request
      next();
    } catch (error) {
      res
        .status(401)
        .json({ message: "Token tidak valid atau telah kedaluwarsa." });
      return;
    }
  };
};
