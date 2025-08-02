

import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export const getSalesPerMonth = async (branchId?: number) => {
  const branchFilter = branchId
    ? Prisma.sql`AND o."branchId" = ${branchId}`
    : Prisma.empty;

  return prisma.$queryRaw`
    SELECT 
      TO_CHAR(o."createdAt", 'Mon') AS label,
      SUM(o.total) AS "totalSales"
    FROM orders o
    WHERE o."paymentStatus" = 'PAID'
    ${branchFilter}
    GROUP BY label
    ORDER BY MIN(DATE_TRUNC('month', o."createdAt"))
  `;
};

export const getSalesByCategory = async (branchId?: number) => {
  const branchFilter = branchId
    ? Prisma.sql`AND o."branchId" = ${branchId}`
    : Prisma.empty;

  return prisma.$queryRaw`
    SELECT 
      c.name AS label,
      SUM(op.total) AS "totalSales"
    FROM order_products op
    JOIN products p ON p.id = op."productId"
    JOIN categories c ON c.id = p."categoryId"
    JOIN orders o ON o.id = op."orderId"
    WHERE o."paymentStatus" = 'PAID'
    ${branchFilter}
    GROUP BY c.name
  `;
};

export const getSalesByProduct = async (branchId?: number) => {
  const branchFilter = branchId
    ? Prisma.sql`AND o."branchId" = ${branchId}`
    : Prisma.empty;

  return prisma.$queryRaw`
    SELECT 
      p.name AS label,
      SUM(op.total) AS "totalSales"
    FROM order_products op
    JOIN products p ON p.id = op."productId"
    JOIN orders o ON o.id = op."orderId"
    WHERE o."paymentStatus" = 'PAID'
    ${branchFilter}
    GROUP BY p.name
  `;
};

export const getStockSummary = async (branchId?: number) => {
  const branchFilter = branchId
    ? Prisma.sql`WHERE jm."branchId" = ${branchId}`
    : Prisma.empty;

  return prisma.$queryRaw`
    SELECT 
      p.name AS label,
      SUM(CASE WHEN jm."transactionType" = 'IN' THEN jm.quantity ELSE 0 END) AS "totalIn",
      SUM(CASE WHEN jm."transactionType" = 'OUT' THEN jm.quantity ELSE 0 END) AS "totalOut",
      COALESCE(pb.stock, 0) AS "endingStock"
    FROM journal_mutations jm
    JOIN product_branchs pb ON pb.id = jm."productBranchId"
    JOIN products p ON p.id = pb."productId"
    ${branchFilter}
    GROUP BY p.name, pb.stock
  `;
};

export const getDiscountUsageReport = async (branchId?: number) => {
  const branchFilter = branchId
    ? Prisma.sql`AND o."branchId" = ${branchId}`
    : Prisma.empty;

  const result = await prisma.$queryRaw<
    {
      discountType: string;
      isPercentage: boolean;
      discountValue: number;
      minPurchase: number | null;
      buyX: number | null;
      getY: number | null;
      branchName: string;
      productName: string;
      timesUsed: bigint;
      totalDiscountGiven: bigint;
    }[]
  >(Prisma.sql`
    SELECT 
      d.type AS "discountType",
      d."isPercentage",
      d.value AS "discountValue",
      d."minPurchase",
      d."buyX",
      d."getY",
      b.name AS "branchName",
      p.name AS "productName",
      COUNT(op.id) AS "timesUsed",
      SUM(
        CASE 
          WHEN d."isPercentage" = TRUE THEN COALESCE(op.total, 0) * COALESCE(d.value, 0) / 100.0
          ELSE COALESCE(d.value, 0)
        END
      ) AS "totalDiscountGiven"
    FROM orders o
    JOIN order_products op ON o.id = op."orderId"
    JOIN products p ON p.id = op."productId"
    JOIN branchs b ON b.id = o."branchId"
    JOIN "Discount" d ON d."productId" = p.id AND d."branchId" = o."branchId"
      AND o."createdAt" <= d."expiredAt"
    WHERE o."paymentStatus" = 'PAID'
    ${branchFilter}
    GROUP BY d.type, d."isPercentage", d.value, d."minPurchase", d."buyX", d."getY", b.name, p.name
    ORDER BY "timesUsed" DESC
  `);

  // === Konversi bigint ke number (untuk JSON)
  const parsed = result.map((item) => {
    const newItem: any = { ...item };
    for (const key in newItem) {
      if (typeof newItem[key] === "bigint") {
        newItem[key] = Number(newItem[key]);
      }
    }
    return newItem;
  });

  return parsed;
};


export const getStockDetail = async (branchId?: number, month?: string) => {
  let filters = Prisma.sql``;

  if (branchId) {
    filters = Prisma.sql`${filters} WHERE jm."branchId" = ${branchId}`;
  }

  // === Validasi Format Month (YYYY-MM) ===
  if (month) {
    const isValidFormat = /^\d{4}-\d{2}$/.test(month);
    if (!isValidFormat) {
      throw new Error("Format bulan tidak valid. Gunakan format 'YYYY-MM'");
    }

    const start = new Date(`${month}-01`);
    const end = new Date(new Date(start).setMonth(start.getMonth() + 1));

    const dateFilter = Prisma.sql`jm."createdAt" >= ${start} AND jm."createdAt" < ${end}`;
    filters = filters.text.includes("WHERE")
      ? Prisma.sql`${filters} AND ${dateFilter}`
      : Prisma.sql`WHERE ${dateFilter}`;
  }

  return prisma.$queryRaw`
    SELECT 
      p.name AS product,
      jm."transactionType" AS action,
      jm.quantity AS amount,
      jm.description AS note,
      jm."createdAt"::DATE AS date,
      b.name AS branch
    FROM journal_mutations jm
    JOIN product_branchs pb ON pb.id = jm."productBranchId"
    JOIN products p ON p.id = pb."productId"
    JOIN branchs b ON b.id = jm."branchId"
    ${filters}
    ORDER BY jm."createdAt" DESC
  `;
};
