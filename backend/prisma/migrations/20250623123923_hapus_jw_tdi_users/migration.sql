/*
  Warnings:

  - You are about to drop the column `jwtToken` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'NOMINAL', 'BUY1GET1');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "jwtToken";

-- CreateTable
CREATE TABLE "Discount" (
    "id" SERIAL NOT NULL,
    "type" "DiscountType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "isPercentage" BOOLEAN NOT NULL DEFAULT true,
    "minPurchase" DOUBLE PRECISION,
    "buyX" INTEGER,
    "getY" INTEGER,
    "productId" INTEGER,
    "branchId" INTEGER NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branchs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
