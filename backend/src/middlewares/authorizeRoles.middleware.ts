
// File: src/middlewares/authorizeRoles.middleware.ts

import { Request, Response, NextFunction } from "express";
import { Role } from "../interfaces/user.interface";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: Role;
  };
}

export const authorizeRoles = (roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: No user in request",
        data: null,
      });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: "Forbidden: You don't have permission to access this resource",
        data: null,
      });
      return;
    }

    next();
  };
};



/*


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


// ========== NAHALIL ==========
// File: src/middlewares/authorizeRoles.middleware.ts

import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Access denied',
        data: null,
      });
    }

    next();
  };
};


// ===================NAHALIL===================
// File: src/middlewares/authorizeRoles.middleware.ts

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