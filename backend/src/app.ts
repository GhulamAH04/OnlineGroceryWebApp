import express from 'express';
import dotenv from 'dotenv';
import { authMiddleware } from './middlewares/auth.middleware';
import { authorizeRoles } from './middlewares/authorizeRoles.middleware';
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';
import discountRoutes from './routes/discount.routes';
import reportRoutes from './routes/report.routes';
import adminRoutes from './routes/admin.routes';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middlewares/errorHandler.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;


app.use(express.json()); // ✅ Harus sebelum routes

// Routes
app.use('/admin/users', authMiddleware, authorizeRoles(['SUPER_ADMIN']), adminRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/images', express.static('public/images'));
app.use('/discounts', discountRoutes);
app.use('/reports', reportRoutes);
app.use('/auth', authRoutes); // endpoint POST /auth/login

// Error handler (paling bawah)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
