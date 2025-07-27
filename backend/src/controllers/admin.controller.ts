// === FILE: src/controllers/admin.controller.ts ===

import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/bcrypt";

const prisma = new PrismaClient();

// === GET ALL ADMIN USERS (SUPER_ADMIN & STORE_ADMIN) ===
export const getAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await prisma.users.findMany({
      where: {
        role: {
          in: ["SUPER_ADMIN", "STORE_ADMIN"],
        },
      },
      include: {
        branchs: {
          select: { name: true },
        },
      },
    });

    const result = users.map((u) => ({
      id: u.id,
      email: u.email,
      username: u.username,
      branchName: u.branchs?.name || null,
      role: u.role,
    }));

    res.json({ success: true, message: "OK", data: result });
  } catch (err) {
    next(err);
  }
};

// === CREATE STORE ADMIN ===
// === CREATE STORE ADMIN ===
export const createStoreAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, role, branchId, username } = req.body;

    const branch = await prisma.branchs.findUnique({ where: { id: branchId } });
    if (!branch) {
      res.status(404).json({ success: false, message: "Cabang tidak ditemukan" });
      return;
    }
    if (branch.userId) {
      res.status(400).json({ success: false, message: "Cabang ini sudah memiliki Store Admin" });
      return;
    }

    const hashedPassword = await hashPassword(password); // ✅ hash password

    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        role,
        username,
        updatedAt: new Date(),
      },
    });

    await prisma.branchs.update({
      where: { id: branchId },
      data: {
        userId: user.id,
        updatedAt: new Date(),
      },
    });

    const createdUser = await prisma.users.findUnique({
      where: { id: user.id },
      include: {
        branchs: { select: { name: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: "User Store Admin berhasil dibuat",
      data: {
        id: createdUser?.id,
        email: createdUser?.email,
        username: createdUser?.username,
        branchName: createdUser?.branchs?.name,
      },
    });
  } catch (err) {
    next(err);
  }
};

// === UPDATE STORE ADMIN ===
export const updateStoreAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = +req.params.id;
    const { email, role, username } = req.body;

    const user = await prisma.users.update({
      where: { id },
      data: {
        email,
        role,
        username,
        updatedAt: new Date(),
      },
    });

    res.json({ success: true, message: "Updated", data: user });
  } catch (err) {
    next(err);
  }
};

// === DELETE STORE ADMIN ===
export const deleteStoreAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = +req.params.id;

    await prisma.users.delete({
      where: { id },
    });

    res.json({ success: true, message: "Deleted", data: null });
  } catch (err) {
    next(err);
  }
};

// === GET ALL BRANCHES ===
export const getAllBranches = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const branches = await prisma.branchs.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    res.json({ success: true, data: branches });
  } catch (err) {
    next(err);
  }
};
