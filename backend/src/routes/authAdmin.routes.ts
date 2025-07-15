// backend/src/routes/authAdmin.routes.ts
import express from 'express';
import { loginAdmin } from '../controllers/authAdmin.controller';

const router = express.Router();

router.post('/login', loginAdmin);

export default router;
