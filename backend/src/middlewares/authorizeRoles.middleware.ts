// File: src/middlewares/authorizeRoles.middleware.ts
/*
import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied', data: null });
    }

    next();
  };
};
*/
// File: src/middlewares/authorizeRoles.middleware.ts

import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Access denied',
        data: null,
      });
      return;
    }

    next();
  };
};
