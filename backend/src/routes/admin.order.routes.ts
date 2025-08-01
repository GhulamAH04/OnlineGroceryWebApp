import { Router, Request, Response, NextFunction } from "express";
import { AdminOrderController } from "../controllers/admin.order.controller";
import { verifyToken } from "../middlewares/authOrder.middleware";
import { Role } from "@prisma/client";

const adminOrderRouter = Router();
const adminOrderController = new AdminOrderController();

const adminMiddleware = verifyToken([Role.SUPER_ADMIN, Role.STORE_ADMIN]);

adminOrderRouter.get(
  "/",
  adminMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    adminOrderController.getAllOrders(req, res).catch(next);
  }
);

adminOrderRouter.get(
  "/branch",
  adminMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    adminOrderController.getOrdersByBranch(req, res).catch(next);
  }
);

adminOrderRouter.post(
  "/confirm-payment/:orderId",
  adminMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    adminOrderController.confirmPaymentManual(req, res).catch(next);
  }
);

adminOrderRouter.post(
  "/ship/:orderId",
  adminMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    adminOrderController.sendOrder(req, res).catch(next);
  }
);

adminOrderRouter.post(
  "/cancel/:orderId",
  adminMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    adminOrderController.adminCancelOrder(req, res).catch(next);
  }
);

export default adminOrderRouter;
