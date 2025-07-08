import prisma from "../lib/prisma";
import { SendVerificationEmail } from "./auth.service";

export async function FindUserById(userId: number) {
  try {
    const user = await prisma.users.findFirst({
      where: {
        id: userId,
      },
    });
    return user;
  } catch (err) {
    throw err;
  }
}

async function getAddressByUserId(userId: number) {
  const address = await prisma.addresses.findMany({
    where: {
      userId: userId,
    },
    include: {
      cities: true,
      provinces: true,
    },
  });

  return address;
}

export async function GetMainAddressService(userId: number) {
  try {
    const address = await getAddressByUserId(userId);

    return address;
  } catch (err) {
    throw err;
  }
}

async function EditUserById(userId: number, username: string, email: string) {
  try {
    const existedUser = await FindUserById(userId);

    const editedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        username: username || existedUser?.username,
        email: email || existedUser?.email,
      },
    });

    if (email) {
      await prisma.users.update({
        where: {
          email,
        },
        data: {
          isVerified: false,
        },
      });
      SendVerificationEmail(username, email, "Email Re-Verification");
    }

    return editedUser;
  } catch (err) {
    throw err;
  }
}

export async function EditUserByIdService(
  userId: number,
  username: string,
  email: string
) {
  try {
    const editedUser = await EditUserById(userId, username, email);

    return editedUser;
  } catch (err) {
    throw err;
  }
}
