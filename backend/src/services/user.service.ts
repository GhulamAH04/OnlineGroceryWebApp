import prisma from "../lib/prisma";
import { FindUserByEmail, SendVerificationEmail } from "./authUser.service";
import { cloudinaryRemove, cloudinaryUploadMulter } from "../utils/cloudinary";


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

async function getMainAddressByUserId(userId: number) {
  const address = await prisma.addresses.findMany({
    where: {
      userId,
      isPrimary: true,
    },
  });

  return address;
}


export async function GetMainAddressService(userId: number) {
  try {
    const address = await getMainAddressByUserId(userId);

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

export async function getAllUsersService(
) {
  try {
    const users = await prisma.users.findMany();

    return users;
  } catch (err) {
    throw err;
  }
}

export async function UpdateAvatarService(
  file: Express.Multer.File,
  email: string
) {
  let url = "";
  try {
    const checkUser = await FindUserByEmail(email);
    if (!checkUser) throw new Error("User not found");

    await prisma.$transaction(async (t) => {
      const { secure_url } = await cloudinaryUploadMulter(file);
      url = secure_url;
      const splitUrl = secure_url.split("/");
      const fileName = splitUrl[splitUrl.length - 1];

      await t.users.update({
        where: {
          id: checkUser.id,
        },
        data: {
          image: fileName,
        },
      });
    });
  } catch (err) {
    await cloudinaryRemove(url);
    throw err;
  }
}
