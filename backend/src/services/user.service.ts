import prisma from "../lib/prisma";

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
