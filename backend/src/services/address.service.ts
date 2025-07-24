import { INewAddress } from "../interfaces/address.interface";
import prisma from "../lib/prisma";

export async function GetAllAddressByUserIdService(userId: number) {
  try {
    const addresses = await prisma.addresses.findMany({
      where: { userId },
    });

    return addresses;
  } catch (err) {
    throw err;
  }
}

export async function EditAddressByIdService(
  id: number,
  bodyData: INewAddress
) {
  try {
    const { address, city, province, postalCode } = bodyData;

    const existedAddress = await prisma.addresses.findFirst({
      where: { id },
    });

    const editedAddress = await prisma.addresses.update({
      where: { id },
      data: {
        address: address || existedAddress?.address,
        city: city || existedAddress?.city,
        province: province || existedAddress?.province,
        postalCode: postalCode || existedAddress?.postalCode,
      },
    });

    return editedAddress;
  } catch (err) {
    throw err;
  }
}

export async function AddNewAddressService(bodyData: INewAddress) {
  try {
    const { name, address, city, province, postalCode, isPrimary, userId, district, phone } =
      bodyData;

      await prisma.addresses.updateMany({
        where: { userId },
        data: { isPrimary: false },
      });

    // Use Prisma to create a new address record in the database
    const newAddress = await prisma.addresses.create({
      data: {
        name,
        address,
        city,
        province,
        postalCode,
        userId,
        isPrimary,
        district,
        phone,
        updatedAt: new Date()
      },
    });

    return newAddress;
  } catch (err) {
    throw err;
  }
}
