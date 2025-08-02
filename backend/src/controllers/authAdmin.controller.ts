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

    // === CEK ROLE HARUS ADMIN ===
    if (user.role !== "SUPER_ADMIN" && user.role !== "STORE_ADMIN") {
      res.status(403).json({
        success: false,
        message: "You are not authorized to access the admin dashboard",
        data: null,
      });
      return;
    }

    const token = signJwt({ userId: user.id, role: user.role });

    console.log(`Admin login attempt by ${user.email} with role: ${user.role}`);

    res.status(200).json({
      success: true,
      message: "Login successful (Admin)",
      data: { token, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};


/*
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

    console.log(token);

    res.status(200).json({
      success: true,
      message: "Login successful (Admin)",
      data: { token },
    });
  } catch (err) {
    next(err);
  }
};
*/