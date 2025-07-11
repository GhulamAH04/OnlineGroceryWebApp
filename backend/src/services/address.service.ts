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
