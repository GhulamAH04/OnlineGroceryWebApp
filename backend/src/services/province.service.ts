import prisma from "../lib/prisma";

export async function GetAllProvincesService() {
  try {
    const cities = await prisma.provinces.findMany();

    return cities;
  } catch (err) {
    throw err;
  }
}
