import { Router, Request, Response, NextFunction } from "express"; // DIUBAH: Tambahkan import Request, Response, NextFunction
import { OrderController } from "../controllers/order.controller";
import { verifyToken } from "../middlewares/authOrder.middleware";
import { Role } from "@prisma/client";
import { upload } from "../middlewares/fileUpload.middleware";

const orderRouter = Router();
const orderController = new OrderController();
const userMiddleware = verifyToken([Role.USER]);

orderRouter.get("/", userMiddleware, orderController.getOrders);
orderRouter.post(
  "/",
  userMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    orderController.createOrder(req, res).catch(next);
  }
);
orderRouter.post(
  "/payment/:orderId",
  userMiddleware,
  upload.single("paymentProof"),
  (req: Request, res: Response, next: NextFunction) => {
    orderController.uploadPaymentProof(req, res).catch(next);
  }
);
orderRouter.put(
  "/cancel/:orderId",
  userMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    orderController.cancelOrder(req, res).catch(next);
  }
);
export default orderRouter;
