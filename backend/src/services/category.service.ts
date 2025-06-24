import prisma from "../lib/prisma";

export async function GetAllCategoryService() {
  try {
    const categories = await prisma.categories.findMany();

    return categories;
  } catch (err) {
    throw err;
  }
}
