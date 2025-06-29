import { Request, Response, NextFunction } from "express";
import { IGoogleRegister, IRegister, RegisterService, RegisterWithGoogleService, SetPasswordService, VerifyAccountService } from "../services/auth.service";

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

export async function RegisterWithGoogleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userData: IGoogleRegister = req.body;

    const newUser = await RegisterWithGoogleService(userData);

    res.status(200).send({
      message: `New user register success`,
      data: newUser,
    });
  } catch (err) {
    next(err);
  }
}

export async function VerifyAccountController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.body.token;
    await VerifyAccountService(token);

    res.status(200).send({
      message: `Verify account success`,
    });
  } catch (err) {
    next(err);
  }
}

export async function SetPasswordController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { password, token } = req.body;
    await SetPasswordService(password, token);

    res.status(200).send({
      message: `Set password success`,
    });
  } catch (err) {
    next(err);
  }
}