// === FILE: src/app.ts ===

import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Config
import { FE_URL, PORT } from "./config";

// Middlewares
import { authMiddleware } from "./middlewares/authAdmin.middleware";
import { authorizeRoles } from "./middlewares/authorizeRoles.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";

// Routes - USER
import ProductRouter from "./routes/product.router";
import CategoryRouter from "./routes/category.router";
import AuthRouter from "./routes/auth.routes";
import UserRouter from "./routes/user.router";

// Routes - ADMIN
import AdminRouter from "./routes/admin.routes";
import AuthAdminRouter from "./routes/authAdmin.routes";
import CategoryAdminRouter from "./routes/categoryAdmin.routes";
import ProductAdminRouter from "./routes/productAdmin.routes";
import DiscountAdminRouter from "./routes/discountAdmin.routes";
import ReportAdminRouter from "./routes/reportSalesAdmin";

// Load environment variables
dotenv.config();


// Express Init
const app: Application = express();
const port = PORT || 3002;

// Middleware
app.use(express.json());

// CORS
app.use(
  cors({
    origin: FE_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// === USER ROUTES ===
app.use("/api/products", ProductRouter);
app.use("/api/categories", CategoryRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/users", UserRouter);

// === ADMIN ROUTES ===
app.use("/admin/auth", AuthAdminRouter); // POST /admin/auth/login
app.use("/admin/users", authMiddleware, authorizeRoles(["SUPER_ADMIN"]), AdminRouter);
app.use("/admin/categories", CategoryAdminRouter);
app.use("/admin/products", ProductAdminRouter);
app.use("/admin/discounts", DiscountAdminRouter);
app.use("/admin/reports", ReportAdminRouter);

// === Static File
app.use("/images", express.static("public/images"));

// === Error Handler
app.use(errorHandler); // catches error thrown by `next(err)`

// === Fallback Error Middleware (if errorHandler fails)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({ success: false, message: err.message });
});

// === Start Server
app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
});


/*
======App.ts milik mas Darhan =======


import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";

import { FE_URL, PORT } from "./config";

import ProductRouter from "./routers/product.router";
import CategoryRouter from "./routers/category.router";
import AuthRouter from "./routers/auth.router"
import UserRouter from "./routers/user.router"

const port = PORT;
const app: Application = express();

app.use(express.json());

// Use CORS middleware
app.use(
  cors({
    origin: FE_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, // (if using cookies/auth)
  })
);

app.use("/api/products", ProductRouter);
app.use("/api/categories", CategoryRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/users", UserRouter);

// ERROR HANDLING MIDDLEWARE
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({
    success: false,
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
*/