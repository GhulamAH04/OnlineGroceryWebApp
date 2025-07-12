import prisma from "../lib/prisma";

export async function GetAllCitiesService() {
  try {
    const cities = await prisma.cities.findMany({
      include: {provinces: true}
    });

    return cities;
  } catch (err) {
    throw err;
  }
}
