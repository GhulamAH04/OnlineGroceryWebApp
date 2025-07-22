import { INewAddressFormData } from "../interfaces/address.interface";
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
  bodyData: INewAddressFormData
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

export async function AddNewAddressService(bodyData: INewAddressFormData) {
  try {
    const { name, address, city, province, postalCode, userId, district } =
      bodyData;

    // Use Prisma to create a new address record in the database
    const newAddress = await prisma.addresses.create({
      data: {
        name,
        address,
        city,
        province,
        postalCode,
        userId,
        district,
        updatedAt: new Date()
      },
    });

    return newAddress;
  } catch (err) {
    throw err;
  }
}
