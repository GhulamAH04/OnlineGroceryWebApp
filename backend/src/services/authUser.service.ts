import path from "path";
import prisma from "../lib/prisma";

import fs from "fs";
import handlebars from "handlebars";
import { FE_URL, JWT_SECRET } from "../config";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { Transporter } from "../utils/nodemailer";
import { compare, genSaltSync, hash } from "bcrypt";
import { Role } from "@prisma/client";
import {
  IGoogleLogin,
  IGoogleRegister,
  ILogin,
  IRegister,
} from "../interfaces/auth.interface";

export async function FindUserByEmail(email: string) {
  try {
    const user = await prisma.users.findFirst({
      where: {
        email,
      },
    });
    return user;
  } catch (err) {
    throw err;
  }
}

async function Register(userData: IRegister) {
  try {
    const { name, email } = userData;

    const user = await FindUserByEmail(email);

    if (user) throw new Error("Email already registered");

    const newUser = await prisma.$transaction(async (t) => {
      const registeredUser = await t.users.create({
        data: {
          username: name,
          email: email,
          updatedAt: new Date(),
        },
      });

      return registeredUser;
    });

    if (!newUser) throw new Error("Create account failed");

    SendVerificationEmail(name, email, "Welcome");

    return newUser;
  } catch (err) {
    throw err;
  }
}

export async function SendVerificationEmail(
  username: string,
  email: string,
  subject: string
) {
  try {
    //send email
    const templatePath = path.join(
      __dirname,
      "../templates",
      "register-template.hbs"
    );

    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const compiledTemplate = handlebars.compile(templateSource);

    const payload = {
      email,
    };

    const token = sign(payload, String(JWT_SECRET), { expiresIn: "1h" });
    const html = compiledTemplate({
      username,
      email,
      fe_url: `${FE_URL}/verify-email/${token}`,
    });

    await Transporter.sendMail({
      from: "EOHelper",
      to: email,
      subject: subject,
      html,
    });
  } catch (err) {
    throw err;
  }
}

async function RegisterWithGoogle(userData: IGoogleRegister) {
  try {
    const { name, email } = userData;

    const user = await FindUserByEmail(email);

    if (user) throw new Error("Email already registered");

    const newUser = await prisma.$transaction(async (t) => {
      const registeredUser = await t.users.create({
        data: {
          username: name,
          email: email,
          role: Role.USER,
          isVerified: true,
          provider: "google",
          updatedAt: new Date(),
        },
      });

      return registeredUser;
    });

    const payload = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      isVerified: newUser.isVerified,
      role: newUser.role,
      image: newUser.image,
    };

    const token = sign(payload, String(JWT_SECRET), { expiresIn: "1h" });

    return { user: payload, token };
  } catch (err) {
    throw err;
  }
}

async function Login(userData: ILogin) {
  try {
    const { email, password } = userData;

    const user = await FindUserByEmail(email);

    if (!user) throw new Error("Email does not exist");

    const checkPass = await compare(password, user.password as string);

    if (!checkPass) throw new Error("Incorrect Password");

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      isVerified: user.isVerified,
      role: user.role,
      image: user.image,
    };

    const token = sign(payload, String(JWT_SECRET), { expiresIn: "1h" });

    return { user: payload, token };
  } catch (err) {
    throw err;
  }
}

async function LoginWithGoogle(userData: IGoogleLogin) {
  try {
    const { name, email } = userData;

    const user = await FindUserByEmail(email);

    if (!user) throw new Error("Email does not exist");

    if (name !== user.username)
      await prisma.users.update({
        where: {
          email,
        },
        data: {
          username: name,
        },
      });

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      isVerified: user.isVerified,
      role: user.role,
      image: user.image,
    };

    const token = sign(payload, String(JWT_SECRET), { expiresIn: "1h" });

    return { user: payload, token };
  } catch (err) {
    throw err;
  }
}

async function VerifyReset(email: string) {
  try {
    const templatePath = path.join(
      __dirname,
      "../templates",
      "verify-reset-template.hbs"
    );

    const payload = {
      email,
    };

    const token = sign(payload, String(JWT_SECRET), { expiresIn: "1h" });

    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const compiledTemplate = handlebars.compile(templateSource);

    const html = compiledTemplate({
      email,
      fe_url: `${FE_URL}/reset-password/${token}`,
    });

    await Transporter.sendMail({
      from: "EOHelper",
      to: email,
      subject: "Reset Password",
      html,
    });
  } catch (err) {
    throw err;
  }
}

export async function RegisterService(userData: IRegister) {
  try {
    const newUser = await Register(userData);

    return newUser;
  } catch (err) {
    throw err;
  }
}

export async function RegisterWithGoogleService(userData: IGoogleRegister) {
  try {
    const newUser = await RegisterWithGoogle(userData);

    return newUser;
  } catch (err) {
    throw err;
  }
}

export async function LoginService(userData: ILogin) {
  try {
    const newUser = await Login(userData);

    return newUser;
  } catch (err) {
    throw err;
  }
}

export async function LoginWithGoogleService(userData: IGoogleLogin) {
  try {
    const newUser = await LoginWithGoogle(userData);

    return newUser;
  } catch (err) {
    throw err;
  }
}

export async function VerifyAccountService(token: string) {
  try {
    const { email } = verify(token, String(JWT_SECRET)) as JwtPayload;

    await prisma.users.update({
      where: {
        email,
      },
      data: {
        isVerified: true,
      },
    });
  } catch (err) {
    throw err;
  }
}

export async function SetPasswordService(password: string, token: string) {
  try {
    const { email } = verify(token, String(JWT_SECRET)) as JwtPayload;

    const user = await FindUserByEmail(email);

    if (!user) throw new Error("User does not exist");

    const salt = genSaltSync(10);
    const hashedPassword = await hash(password, salt);

    await prisma.users.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });
  } catch (err) {
    throw err;
  }
}

export async function VerifyResetService(email: string) {
  try {
    await VerifyReset(email);
  } catch (err) {
    throw err;
  }
}

export async function SendVerificationEmailService(
  username: string,
  email: string,
  subject: string
) {
  try {
    await SendVerificationEmail(username, email, subject);
  } catch (err) {
    throw err;
  }
}
