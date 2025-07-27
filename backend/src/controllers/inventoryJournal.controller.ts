import { Request, Response, NextFunction } from "express";
import { PrismaClient, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

// === GET ALL JOURNAL MUTATIONS ===
export const getAllInventoryJournals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const journals = await prisma.journal_mutations.findMany({
      include: {
        branchs: true,
        product_branchs: {
          include: {
            products: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = journals.map((j) => ({
      id: j.id,
      productId: j.product_branchs.productId,
      productName: j.product_branchs.products.name,
      branchId: j.branchId,
      branchName: j.branchs?.name || "-",
      action: j.transactionType,
      amount: j.quantity,
      note: j.description,
      createdAt: j.createdAt,
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// === CREATE JOURNAL MUTATION + UPDATE STOCK ===
export const createInventoryJournal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, branchId, type, stock, note } = req.body;

    const productBranch = await prisma.product_branchs.findUnique({
      where: {
        productId_branchId: {
          productId: Number(productId),
          branchId: Number(branchId),
        },
      },
    });

    if (!productBranch) {
      res.status(404).json({
        success: false,
        message: "Produk pada cabang ini tidak ditemukan",
        data: null,
      });
      return;
    }

    const newStock =
      type === "IN"
        ? productBranch.stock + Number(stock)
        : productBranch.stock - Number(stock);

    if (newStock < 0) {
      res.status(400).json({
        success: false,
        message: "Stok tidak mencukupi untuk dikurangi",
        data: null,
      });
      return;
    }

    await prisma.$transaction([
      prisma.journal_mutations.create({
        data: {
          quantity: Number(stock),
          transactionType: type,
          description: note || "",
          productBranchId: productBranch.id,
          branchId: Number(branchId),
          updatedAt: new Date(), // pastikan ditambahkan
        },
      }),
      prisma.product_branchs.update({
        where: { id: productBranch.id },
        data: { stock: newStock },
      }),
    ]);

    res.json({ success: true, message: "Jurnal stok berhasil ditambahkan" });
  } catch (err) {
    next(err); // kirim error ke handler express
  }
};


// === DELETE JOURNAL (optional) ===
export const deleteInventoryJournal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await prisma.journal_mutations.delete({ where: { id } });
    res.json({ success: true, message: "Jurnal berhasil dihapus" });
  } catch (err) {
    next(err);
  }
};
