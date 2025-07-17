import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // DIUBAH: 'return' dihapus dari sini
        res.status(400).json({
          message: "Input tidak valid",
          errors: error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
        return; // Tambahkan return kosong untuk menghentikan eksekusi
      }
      // DIUBAH: 'return' dihapus dari sini
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
