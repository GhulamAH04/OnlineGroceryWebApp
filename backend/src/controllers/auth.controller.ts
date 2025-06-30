// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { signJwt } from '../utils/jwt';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
        data: null,
      });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
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
  } catch (err) {
    next(err);
  }
};



/*
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { signJwt } from '../utils/jwt';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (
      !user ||
      !user.password ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        data: null,
      });
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