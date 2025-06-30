// File: src/services/admin.service.ts

import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { CreateUserInput } from '../interfaces/user.interface';

const prisma = new PrismaClient();

export const adminService = {
  getAllAdmins: async () => {
    return prisma.user.findMany({
      where: { role: { in: [Role.STORE_ADMIN, Role.SUPER_ADMIN] } },
      select: { id: true, email: true, username: true, role: true, image: true },
    });
  },

  createStoreAdmin: async (data: CreateUserInput) => {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new Error('Email already in use');

    if (data.password.length < 6) throw new Error('Password must be at least 6 characters');

    const hashed = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        username: data.username,
        role: Role.STORE_ADMIN,
      },
    });
  },

  updateStoreAdmin: async (id: number, data: Partial<CreateUserInput>) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.role !== Role.STORE_ADMIN) throw new Error('Admin not found');

    const updated: any = {};
    if (data.email) updated.email = data.email;
    if (data.username) updated.username = data.username;
    if (data.password) {
      if (data.password.length < 6) throw new Error('Password must be at least 6 characters');
      updated.password = await bcrypt.hash(data.password, 10);
    }

    return prisma.user.update({ where: { id }, data: updated });
  },

  deleteStoreAdmin: async (id: number) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.role !== Role.STORE_ADMIN) throw new Error('Admin not found');

    return prisma.user.delete({ where: { id } });
  },
};
