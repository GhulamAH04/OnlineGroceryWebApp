import { Router } from "express";
import { z } from "zod";
import { CartController } from "../controllers/cart.controller";
import { verifyToken } from "../middlewares/authOrder.middleware"; // DIUBAH: Menggunakan named import
import { validate } from "../middlewares/validator.middleware";
import { Role } from "@prisma/client";

const cartRouter = Router();
const cartController = new CartController();

// Penggunaan verifyToken sudah benar, hanya cara impornya yang perlu diubah.
const userMiddleware = verifyToken([Role.USER]);

const addToCartSchema = z.object({
  productId: z.number().positive("productId harus angka positif"),
  quantity: z.number().positive("quantity harus angka positif"),
});

const updateCartSchema = z.object({
  quantity: z.number().positive("quantity harus angka positif"),
});

cartRouter.get("/", userMiddleware, cartController.getCart);
cartRouter.get("/total", userMiddleware, cartController.totalCart);

cartRouter.post(
  "/",
  userMiddleware,
  validate(addToCartSchema),
  cartController.addToCart
);

cartRouter.put(
  "/item/:productCartId",
  userMiddleware,
  validate(updateCartSchema),
  cartController.updateCartItem
);

cartRouter.delete(
  "/item/:productCartId",
  userMiddleware,
  cartController.removeCartItem
);

export default cartRouter;
