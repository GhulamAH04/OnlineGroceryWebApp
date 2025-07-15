import { Router, Request, Response, NextFunction } from "express"; // DIUBAH: Tambahkan import Request, Response, NextFunction
import { OrderController, uploadProof } from "../controllers/order.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const orderRouter = Router();
const orderController = new OrderController();
const userMiddleware = verifyToken([Role.USER]);

orderRouter.post("/", userMiddleware, orderController.createOrder);
orderRouter.get("/", userMiddleware, orderController.getMyOrders);
orderRouter.get("/:orderId", userMiddleware, orderController.getOrderDetails);

orderRouter.post(
  "/:orderId/upload",
  userMiddleware,
  // DIUBAH: Tambahkan tipe eksplisit untuk req, res, dan next
  (req: Request, res: Response, next: NextFunction) => {
    uploadProof(req, res, (err: any) => {
      if (err) {
        // DIUBAH: Hapus 'return' dari sini
        res.status(400).json({ message: err.message });
        return; // Hentikan eksekusi jika ada error
      }
      next(); // Lanjutkan ke controller jika tidak ada error
    });
  },
  orderController.uploadPaymentProof
);

orderRouter.post(
  "/:orderId/cancel",
  userMiddleware,
  orderController.cancelOrder
);
orderRouter.post(
  "/:orderId/confirm-delivery",
  userMiddleware,
  orderController.confirmDelivery
);

export default orderRouter;
