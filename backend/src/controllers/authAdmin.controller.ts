// === FILE: src/controllers/authAdmin.controller.ts ===

import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { signJwt } from "../utils/jwt";

const prisma = new PrismaClient();

// === LOGIN ADMIN (SUPER_ADMIN & STORE_ADMIN) ===
export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
        data: null,
      });
      return;
    }

    const user = await prisma.users.findUnique({ where: { email } });

    if (
      !user ||
      !user.password ||
      !(await bcrypt.compare(password, user.password))
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
        data: null,
      });
      return;
    }

    const token = signJwt({ userId: user.id, role: user.role });

    res.status(200).json({
      success: true,
      message: "Login successful (Admin)",
      data: { token },
    });
  } catch (err) {
    next(err);
  }
};
