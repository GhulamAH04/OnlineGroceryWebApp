import path from "path";
import prisma from "../lib/prisma";
import { Role } from "@prisma/client";
import fs from "fs";
import handlebars from "handlebars";
import { FE_URL, JWT_SECRET } from "../config";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { Transporter } from "../utils/nodemailer";
import { genSaltSync, hash } from "bcrypt";


export interface IRegister {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface IGoogleRegister {
  name: string;
  email: string;
}

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

    if (!newUser) throw new Error("Create account failed")

    //send email
    const templatePath = path.join(
      __dirname,
      "../templates",
      "register-template.hbs"
    );

    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const compiledTemplate = handlebars.compile(templateSource);

    const payload = {
      email: newUser.email,
    };

    const token = sign(payload, String(JWT_SECRET), { expiresIn: "1h" });
    const html = compiledTemplate({
      name,
      email,
      fe_url: `${FE_URL}/verify-email/${token}`,
    });

    await Transporter.sendMail({
      from: "EOHelper",
      to: email,
      subject: "Welcome",
      html,
    });

    return newUser;
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
          provider: "google",
          updatedAt: new Date(),
        },
      });

      return registeredUser;
    });

    return newUser;
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
