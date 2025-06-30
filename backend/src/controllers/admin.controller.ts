// File: src/controllers/admin.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllAdmins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ['SUPER_ADMIN', 'STORE_ADMIN'],
        },
      },
    });
    res.json({ success: true, message: 'OK', data: users });
  } catch (err) {
    next(err);
  }
};

export const createStoreAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;
    const user = await prisma.user.create({
      data: {
        email,
        password,
        role,
      },
    });
    res.status(201).json({ success: true, message: 'Created', data: user });
  } catch (err) {
    next(err);
  }
};

export const updateStoreAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = +req.params.id;
    const { email, role } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { email, role },
    });
    res.json({ success: true, message: 'Updated', data: user });
  } catch (err) {
    next(err);
  }
};

export const deleteStoreAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = +req.params.id;
    await prisma.user.delete({ where: { id } });
    res.json({ success: true, message: 'Deleted', data: null });
  } catch (err) {
    next(err);
  }
};


/*
// File: src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { signJwt } from '../utils/jwt';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (
      !user ||
      !user.password ||
      !(await bcrypt.compare(password, user.password))
    ) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        data: null,
      });
      return;
    }

    const token = signJwt({ userId: user.id, role: user.role });

    res.json({
      success: true,
      message: 'Login successful',
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};
*/