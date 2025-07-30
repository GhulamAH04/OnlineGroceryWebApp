// === FILE: backend/src/app.ts ===

import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

// === CONFIG & ENV ===
import { FE_URL, PORT } from "./config";
dotenv.config();

// === INIT EXPRESS ===
const app: Application = express();
const port = PORT || 8080;

// ✅ === CORS harus sebelum semua routes ===
app.use(cors({
  origin: FE_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));

// === MIDDLEWARES ===
import { authMiddleware } from "./middlewares/authAdmin.middleware";
import { authorizeRoles } from "./middlewares/authorizeRoles.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";

// === ROUTES - USER ===
import ProductRouter from "./routes/product.routes";
import CategoryRouter from "./routes/category.routes";
import AuthRouter from "./routes/auth.routes";
import UserRouter from "./routes/user.routes";
import CityRouter from "./routes/city.routes";
import ProvinceRouter from "./routes/province.routes";
import AddressRouter from "./routes/address.routes";
import DistrictRouter from "./routes/district.routes";
import StoreRouter from "./routes/store.routes";
import ShippingCostRouter from "./routes/shippingCost.routes";
import cartRouter from "./routes/cart.router";

// === ROUTES - ADMIN ===
import AdminRouter from "./routes/admin.routes";
import AuthAdminRouter from "./routes/authAdmin.routes";
import CategoryAdminRouter from "./routes/categoryAdmin.routes";
import ProductAdminRouter from "./routes/productAdmin.routes";
import DiscountAdminRouter from "./routes/discountAdmin.routes";
import ReportAdminRouter from "./routes/reportSalesAdmin";
import InventoryJournalRouter from "./routes/inventoryJournal.routes";
import InventoryRouter from "./routes/inventoryAdmin.routes";
 import BranchAdminRouter from "./routes/branchAdmin.routes";

// === BODY PARSER ===
app.use(express.json());

// === API ROUTES ===
// --- USER ---
app.use("/api/products", ProductRouter);
app.use("/api/categories", CategoryRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/users", UserRouter);
app.use("/api/cities", CityRouter);
app.use("/api/provinces", ProvinceRouter);
app.use("/api/districts", DistrictRouter);
app.use("/api/addresses", AddressRouter);
app.use("/api/stores", StoreRouter);
app.use("/api/shipping-cost", ShippingCostRouter);
app.use("/api/cart", cartRouter);

// --- ADMIN ---
app.use("/api/admin/auth", AuthAdminRouter);
app.use("/api/admin/users", authMiddleware, authorizeRoles(["SUPER_ADMIN"]), AdminRouter);
app.use("/api/admin/categories", CategoryAdminRouter);
app.use("/api/admin/products", ProductAdminRouter);
app.use("/api/admin/discounts", DiscountAdminRouter);
app.use("/api/admin/reports", ReportAdminRouter);
app.use("/api/admin/inventory", InventoryRouter);
app.use("/api/admin/inventory-journal", InventoryJournalRouter);
// app.use("/api/admin/branches", BranchAdminRouter);

// === STATIC FILES ===
app.use("/images", express.static("public/images"));

// === ERROR HANDLING ===
app.use(errorHandler);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({ success: false, message: err.message });
});

// === START SERVER ===
app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
});
