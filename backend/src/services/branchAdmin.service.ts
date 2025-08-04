
/*
// === FILE: services/branchAdmin.service.ts ===

import { PrismaClient, Prisma } from "@prisma/client";
import { CreateBranchInput } from "../interfaces/branchAdmin.interfaces";

const prisma = new PrismaClient();

export const branchService = {
  // === GET ALL BRANCHES ===
  getAll: async () => {
    return prisma.branchs.findMany();
  },

  // === CREATE BRANCH ===
  create: async (body: CreateBranchInput) => {
    return prisma.branchs.create({
      data: {
        name: body.name,
        address: body.address,
        postalCode: body.postalCode,
        provinceId: body.provinceId,
        cityId: body.cityId,
        districtId: body.districtId,
        latitude: new Prisma.Decimal(body.latitude),
        longitude: new Prisma.Decimal(body.longitude),
        updatedAt: new Date(),
      },
    });
  },

  // === UPDATE BRANCH ===
  update: async (id: number, body: CreateBranchInput) => {
    return prisma.branchs.update({
      where: { id },
      data: {
        name: body.name,
        address: body.address,
        postalCode: body.postalCode,
        provinceId: body.provinceId,
        cityId: body.cityId,
        districtId: body.districtId,
        latitude: new Prisma.Decimal(body.latitude),
        longitude: new Prisma.Decimal(body.longitude),
        updatedAt: new Date(),
      },
    });
  },

  // === DELETE BRANCH ===
  delete: async (id: number) => {
    return prisma.branchs.delete({ where: { id } });
  },

  // === ASSIGN STORE ADMIN TO BRANCH ===
  assignAdmin: async (branchId: number, userId: number) => {
    const user = await prisma.users.findUnique({ where: { id: userId } });

    if (!user || user.role !== "STORE_ADMIN") {
      throw new Error("User bukan STORE_ADMIN atau tidak ditemukan");
    }

    return prisma.branchs.update({
      where: { id: branchId },
      data: {
        userId,
        updatedAt: new Date(),
      },
    });
  },
};
*/