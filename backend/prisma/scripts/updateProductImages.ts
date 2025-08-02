import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const defaultImageUrl = "https://res.cloudinary.com/djbdfjx1d/image/upload/v1746972046/nugget_plgi8w.jpg";

  const products = await prisma.products.findMany();

  for (const p of products) {
    await prisma.products.update({
      where: { id: p.id },
      data: { image: defaultImageUrl },
    });
  }

  console.log(`✅ Updated ${products.length} product images.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
