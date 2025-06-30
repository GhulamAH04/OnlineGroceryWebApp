// File: src/middlewares/auth.middleware.ts
/*
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { JwtPayload } from '../interfaces/user.interface';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided', data: null });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not found', data: null });
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token', data: null });
  }
};
*/

// File: src/middlewares/auth.middleware.ts

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
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: No token provided',
      data: null,
    });
    return; // ✅ penting
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: User not found',
        data: null,
      });
      return;
    }

    req.user = { id: user.id, role: user.role };
    next(); // ✅ tetap lanjut
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token',
      data: null,
    });
    return;
  }
};
