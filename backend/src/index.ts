import express, { Express } from "express";
import cors from "cors";

// Import semua router dengan path yang benar
import adminOrderRouter from "./routes/admin.order.router";
import cartRouter from "./routes/cart.router";
import orderRouter from "./routes/order.router";

const app: Express = express();
const PORT = 8000;

// Middleware untuk CORS agar frontend bisa akses
app.use(
  cors({
    origin: "http://localhost:3000", // Sesuaikan dengan URL frontend Anda
    credentials: true,
  })
);

// Middleware untuk membaca body JSON dari request
app.use(express.json());

// Gunakan semua router
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

// Jalankan server
app.listen(PORT, () => {
  console.log(`[INFO] Server is running on http://localhost:${PORT}`);
});
