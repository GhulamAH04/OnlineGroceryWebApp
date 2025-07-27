import { PrismaClient } from "@prisma/client";
import { fetchProvince } from "../src/services/province.service";
import { fetchCitiesByProvince, getCityId } from "../src/services/city.service";
import { fetchDistrictsByCity } from "../src/services/district.service";

// Initialize the Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  const city = "Makassar";
  const province = "Sulawesi Selatan";

  const cityId = await getCityId(province, city)

  const districts = await fetchDistrictsByCity(province, city);

  for (let i = 0; i < districts.length; i++) {
      // 1. Call your service to get the data
      const data = {
        id: districts[i].id,
        name: districts[i].name,
        cityId,
      };

      // 2. Use the data to populate the database
      const result = await prisma.districts.createMany({
        data,
        skipDuplicates: true, // Useful for re-running the seed
      });

      console.log(`${result.count} data were added. 🌱`);
    }
  console.log(`Seeding data from ${city} finished. 🌱`);
}
// Execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the Prisma Client connection
    await prisma.$disconnect();
  });
