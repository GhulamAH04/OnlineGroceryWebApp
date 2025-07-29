// === FILE: src/controllers/branch.controller.ts ===
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// === GET ALL BRANCHES (UNTUK DROPDOWN) ===
export const getAllBranches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const branches = await prisma.branchs.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });

    res.json({
      success: true,
      message: "OK",
      data: branches,
    });
  } catch (error) {
    next(error);
  }
};
