import { hash, genSaltSync } from "bcrypt";
import prisma from "../lib/prisma";
import { Role } from "@prisma/client";

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
    const { name, email, password, role } = userData;

    const user = await FindUserByEmail(email);

    if (user) throw new Error("Email already registered");

    //hashing password
    const salt = genSaltSync(10);
    const hashedPassword = await hash(password, salt);

    const newUser = await prisma.$transaction(async (t) => {
      const registeredUser = await t.users.create({
        data: {
          username: name,
          email: email,
          password: hashedPassword,
          role: role,
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
