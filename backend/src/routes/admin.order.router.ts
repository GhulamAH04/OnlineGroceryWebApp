import { Router } from "express";
import { AdminOrderController } from "../controllers/admin.order.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const adminOrderRouter = Router();
const adminOrderController = new AdminOrderController();

// Panggil verifyToken untuk membuat middleware
const adminMiddleware = verifyToken([Role.SUPER_ADMIN, Role.STORE_ADMIN]);

// Gunakan middleware yang sudah dibuat
adminOrderRouter.get("/", adminMiddleware, adminOrderController.getAllOrders);
adminOrderRouter.post(
  "/:orderId/confirm-payment",
  adminMiddleware,
  adminOrderController.confirmOrRejectPayment
);
adminOrderRouter.post(
  "/:orderId/ship",
  adminMiddleware,
  adminOrderController.shipOrder
);
adminOrderRouter.post(
  "/:orderId/cancel",
  adminMiddleware,
  adminOrderController.cancelOrder
);

export default adminOrderRouter;
