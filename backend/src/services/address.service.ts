import { IAddressReqBody } from "../interfaces/address.interface";
import prisma from "../lib/prisma";

export async function GetAllAddressByUserIdService(userId: number) {
  try {
    const addresses = await prisma.addresses.findMany({
      where: { userId },
      include: { cities: true, provinces: true },
    });

    return addresses;
  } catch (err) {
    throw err;
  }
}

export async function EditAddressByIdService(
  id: number,
  bodyData: IAddressReqBody
) {
  try {
    const { address, cityId, provinceId, postalCode } = bodyData;

    const existedAddress = await prisma.addresses.findFirst({
      where: { id },
    });

    const editedAddress = await prisma.addresses.update({
      where: { id },
      data: {
        address: address || existedAddress?.address,
        cityId: cityId || existedAddress?.cityId,
        provinceId: provinceId || existedAddress?.provinceId,
        postalCode: postalCode || existedAddress?.postalCode,
      },
    });

    return editedAddress;
  } catch (err) {
    throw err;
  }
}
