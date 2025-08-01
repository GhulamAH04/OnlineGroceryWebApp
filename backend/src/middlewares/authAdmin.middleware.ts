// OnlineGroceryWebApp/backend/src/middlewares/authAdmin.middleware.ts
// File: backend/src/middlewares/authAdmin.middleware.ts
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { JwtPayload } from "../interfaces/user.interface";
import { verifyJwt } from "../utils/jwt";

const prisma = new PrismaClient();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
        data: null,
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyJwt(token); // ✅ pakai helper

    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
        data: null,
      });
      return;
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    next(error);
  }
};



/*
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { JwtPayload } from '../interfaces/user.interface';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
        data: null,
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
        data: null,
      });
      return;
    }

    req.user = { id: user.id, role: user.role };
    next(); // ✅ lanjut ke route
  } catch (error) {
    next(error); // ✅ kirim ke global error handler Express
  }
};
*/