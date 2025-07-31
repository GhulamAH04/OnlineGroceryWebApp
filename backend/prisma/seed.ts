import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// === Modular Seeder Imports ===
import { seedCleanup } from "./seedCleanup";
import { seedProvinces } from "./seeds/seedProvinces";
import { seedCities } from "./seeds/seedCities";
import { seedDistricts } from "./seeds/seedDistricts";
import { seedBranches } from "./seeds/seedBranches";
import { seedUsers } from "./seeds/seedUsers";
import { seedCategories } from "./seeds/seedCategories";
import { seedProducts } from "./seeds/seedProducts";
// import { seedProductBranchs } from "./seeds/seedProductBranchs";
import { seedInventory } from "./seeds/seedInventory";
import { seedInventoryJournal } from "./seeds/seedInventoryJournal";
import { seedUserCustomers } from "./seeds/seedUserCustomers";
import { seedAddresses } from "./seeds/seedAddresses";
import { seedOrders } from "./seeds/seedOrders";
import { seedDiscounts } from "./seeds/seedDiscounts";

async function main() {
  console.log("🌱 Starting database seeding...");

  // === CLEANUP
  await seedCleanup(prisma);

  // === RajaOngkir (lokasi)
  await seedProvinces(prisma);
  await seedCities(prisma);
  await seedDistricts(prisma);

  // === Cabang dan Admin
  await seedBranches(prisma);
  await seedUsers(prisma);

  // === Kategori dan Produk
  await seedCategories(prisma);
  await seedProducts(prisma);
//  await seedProductBranchs(prisma);

  // === Stok dan Mutasi
  await seedInventory(prisma);
  await seedInventoryJournal(prisma);

  // === Dummy User dan Alamat
  await seedUserCustomers(prisma);
  await seedAddresses(prisma);

  // === Order dan Diskon
  await seedOrders(prisma);
  await seedDiscounts(prisma);

  console.log("✅ Database seeding selesai!");
}

main()
  .catch((err) => {
    console.error("❌ Error during seeding:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


  /*
  import { PrismaClient } from "@prisma/client";

export default async function seedLocation(prisma: PrismaClient) {
  // === PROVINSI
  const province = await prisma.provinces.upsert({
    where: { id: 100 },
    update: {},
    create: { id: 100, name: 'Provinsi Groceria' },
  });

  // === KOTA
  const city = await prisma.cities.upsert({
    where: { id: 200 },
    update: {},
    create: { id: 200, name: 'Kota Sayuran', provinceId: province.id },
  });

  // === DISTRIK
  const district = await prisma.districts.upsert({
    where: { id: 300 },
    update: {},
    create: { id: 300, name: 'Kecamatan Sehat', cityId: city.id },
  });

  console.log("✅ Seed lokasi berhasil: Provinsi, Kota, dan Kecamatan");
}

*/
