import { Request, Response, NextFunction } from "express";
import { IRegister, RegisterService } from "../services/auth.service";

export async function RegisterController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userData: IRegister = req.body;

    const newUser = await RegisterService(userData);

    res.status(200).send({
      message: `New user register success`,
      data: newUser,
    });
  } catch (err) {
    next(err);
  }
}
