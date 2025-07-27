// File: src/controllers/admin.controller.ts

import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { genSaltSync, hash } from "bcrypt";

const prisma = new PrismaClient();

// === GET ALL ADMIN USERS (SUPER_ADMIN & STORE_ADMIN) ===
export const getAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.users.findMany({
      where: {
        role: {
          in: ["SUPER_ADMIN", "STORE_ADMIN"],
        },
      },
    });

    res.json({ success: true, message: "OK", data: users });
  } catch (err) {
    next(err);
  }
};

// === CREATE STORE ADMIN ===
export const createStoreAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password, role } = req.body;

    const branchId = parseInt(req.body.branchId);

    const existingUser = await prisma.users.findUnique({
      where: { email, role: "STORE_ADMIN" },
    });

    if (existingUser) throw new Error("Store admin already exists");

    const salt = genSaltSync(10);
    const hashedPassword = await hash(password, salt);

   const user = await prisma.$transaction(async (t) => {
     const newUser = await t.users.create({
       data: {
         username,
         email,
         password: hashedPassword,
         role,
         isVerified: true,
         updatedAt: new Date(),
       },
     });

     const branch = await t.branchs.findUnique({
       where: { id: branchId },
     });

     if (!branch) {
       throw new Error("Branch not found");
     }

     await t.branchs.update({
       where: { id: branchId },
       data: {
         users: {
           connect: { id: newUser.id },
         },
       },
     });

     return newUser;
   });

    res.status(201).json({ success: true, message: "Created", data: user });
  } catch (err) {
    next(err);
  }
};

// === UPDATE STORE ADMIN ===
export const updateStoreAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = +req.params.id;
    const { email, role } = req.body;

    const user = await prisma.users.update({
      where: { id },
      data: {
        email,
        role,
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
) => {
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
