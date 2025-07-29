import { PrismaClient } from "@prisma/client";
import { fetchProvince } from "../src/services/province.service";
import { fetchCitiesByProvince } from "../src/services/city.service";
// Import your service function from the main source code

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // 1. Call your service to get the data
  const provinces = await fetchProvince();

  if (provinces.length === 0) {
    console.log("No data fetched. Aborting seed.");
    return;
  }

  for (let i = 0; i < provinces.length; i++) {
    const cities = await fetchCitiesByProvince(provinces[i].name);
    for (let j = 0; j < cities.length; j++) {
      const data = {
        id: cities[j].id,
        name: cities[j].name,
        provinceId: provinces[i].id,
      };
      const result = await prisma.cities.createMany({
        data,
        skipDuplicates: true, // Useful for re-running the seed
      });
      console.log(`Seeding finished. ${result.count} data were added. 🌱`);
    }
    // 2. Use the data to populate the database
    console.log(`Finished Seeding data from ${provinces[i].name}. 🌱`);
  }
  console.log(`Seeding finished 🌱`);
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
