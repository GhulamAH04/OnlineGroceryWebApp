import { Request, Response, NextFunction } from "express";
import { IUserReqParam } from "../custom";
import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export async function VerifyToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) throw new Error("Unauthorized");

        const verifyUser = verify(token, String(JWT_SECRET));

        if (!verifyUser) throw new Error("Invalid Token");

        req.user = verifyUser as IUserReqParam;

        next();
    } catch (err) {
        next(err);
    }
}

export async function EOGuard(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.user?.role !== "STORE ADMIN") throw new Error("Restricted");

        next();
    } catch (err) {
        next(err);
    }
}