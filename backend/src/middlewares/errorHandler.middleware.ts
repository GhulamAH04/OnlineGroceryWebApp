// File: src/middlewares/errorHandler.middleware.ts

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('🔥 ERROR:', err.message || err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    data: null,
  });
};
