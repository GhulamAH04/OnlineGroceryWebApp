// === FILE: src/controllers/authUser.controller.ts ===

import { Request, Response, NextFunction } from "express";
import {
  LoginService,
  LoginWithGoogleService,
  RegisterService,
  RegisterWithGoogleService,
  SendVerificationEmailService,
  SetPasswordService,
  VerifyAccountService,
  VerifyResetService,
} from "../services/authUser.service";
import { IGoogleLogin, IGoogleRegister, ILogin, IRegister } from "../interfaces/auth.interface";

// === REGISTER USER (NORMAL) ===
export async function RegisterController(req: Request, res: Response, next: NextFunction) {
  try {
    const userData: IRegister = req.body;
    const newUser = await RegisterService(userData);
    res.status(200).send({ message: `New user register success`, data: newUser });
  } catch (err) {
    next(err);
  }
}

// === REGISTER USER (GOOGLE) ===
export async function RegisterWithGoogleController(req: Request, res: Response, next: NextFunction) {
  try {
    const userData: IGoogleRegister = req.body;
    const newUser = await RegisterWithGoogleService(userData);
    res.status(200).send({ message: "Login Success", data: newUser });
  } catch (err) {
    next(err);
  }
}

// === LOGIN USER (NORMAL) ===
export async function LoginController(req: Request, res: Response, next: NextFunction) {
  try {
    const userData: ILogin = req.body;
    const user = await LoginService(userData);
    res.status(200).send({ message: "Login Success", data: user });
  } catch (err) {
    next(err);
  }
}

// === LOGIN USER (GOOGLE) ===
export async function LoginWithGoogleController(req: Request, res: Response, next: NextFunction) {
  try {
    const userData: IGoogleLogin = req.body;
    const user = await LoginWithGoogleService(userData);
    res.status(200).send({ message: "Login Success", data: user });
  } catch (err) {
    next(err);
  }
}

// === VERIFIKASI AKUN ===
export async function VerifyAccountController(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.body.token;
    await VerifyAccountService(token);
    res.status(200).send({ message: `Verify account success` });
  } catch (err) {
    next(err);
  }
}

// === SET PASSWORD (SETELAH VERIFIKASI) ===
export async function SetPasswordController(req: Request, res: Response, next: NextFunction) {
  try {
    const { password, token } = req.body;
    await SetPasswordService(password, token);
    res.status(200).send({ message: `Set password success` });
  } catch (err) {
    next(err);
  }
}

// === VERIFIKASI RESET PASSWORD VIA EMAIL ===
export async function VerifyResetController(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    await VerifyResetService(email);
    res.status(200).send({ message: `Send email success` });
  } catch (err) {
    next(err);
  }
}

// === KIRIM EMAIL VERIFIKASI ===
export async function SendVerificationEmailController(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, email, subject } = req.body;
    await SendVerificationEmailService(username, email, subject);
    res.status(200).send({ message: `Send email success` });
  } catch (err) {
    next(err);
  }
}
