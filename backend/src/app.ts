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
app.use("/api/user", UserRouter);

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
