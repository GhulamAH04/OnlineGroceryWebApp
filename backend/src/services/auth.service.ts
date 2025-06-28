import prisma from "../lib/prisma";
import { Role } from "@prisma/client";

export interface IRegister {
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
