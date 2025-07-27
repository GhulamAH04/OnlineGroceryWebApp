// File: backend/src/custom.d.ts

import { Role } from "@prisma/client"; // jika kamu pakai enum Role dari Prisma
import { User } from "@prisma/client";

export interface IUserReqParam {
  id: number; 
  role: Role; // atau: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'USER'
  email?: string;
  username?: string;
  branchId?: number; 
}

declare global {
  namespace Express {
    export interface Request {
      user?: IUserReqParam;
    }
  }
}

/*
export interface IUserReqParam {
  email: string;
  username: string;
  role: string;
}  

declare global {
  namespace Express {
    export interface Request {
      user?: IUserReqParam;
    }
  }
}
*/
