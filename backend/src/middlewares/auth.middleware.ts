import { Request, Response, NextFunction, RequestHandler } from "express"; // Impor RequestHandler
import { PrismaClient, Role, User } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthRequest extends Request {
  user?: User;
}

/**
 * Middleware untuk memverifikasi token JWT dan peran pengguna.
 * @param allowedRoles - Array peran yang diizinkan untuk mengakses rute.
 */
export const verifyToken = (allowedRoles: Role[]) => {
  // Biarkan TypeScript menginfer tipe kembalian
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ message: "Akses ditolak. Token tidak ditemukan." });
      return; // Pastikan ada return untuk menghentikan fungsi
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Akses ditolak. Token tidak valid." });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      const user = await prisma.user.findUnique({
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
        res
          .status(403)
          .json({
            message:
              "Anda tidak memiliki izin untuk mengakses sumber daya ini.",
          });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      res
        .status(401)
        .json({ message: "Token tidak valid atau telah kedaluwarsa." });
      return;
    }
  };
};
