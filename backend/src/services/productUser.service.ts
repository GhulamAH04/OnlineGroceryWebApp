import prisma from "../lib/prisma";
import { getCityFromCoordinates } from "./city.service";

// === Get Produk Per Cabang ===
async function getProductBranchesByStoreId(storeId: number) {
  try {
    const productBranches = await prisma.product_branchs.findMany({
      where: {
        branchs: { id: storeId },
      },
      include: {
        products: true,
        branchs: true,
      },
    });
    return productBranches;
  } catch (err) {
    throw err;
  }
}

// === Ambil Semua Cabang di Kota Tertentu ===
async function getStoresByCity(city: string) {
  try {
    const branches = await prisma.branchs.findMany({
      where: {
        cities: {
          name: city.toUpperCase(),
        },
      },
    });
    return branches;
  } catch (err) {
    throw err;
  }
}
export async function GetNearbyProductsService(
  userCity: string
) {
  try {
    let productBranches = [];

    const stores = await getStoresByCity(userCity);
    for (let i = 0; i < stores.length; i++) {
      const storeId = stores[i].id;
      const product = await getProductBranchesByStoreId(storeId);
      productBranches.push(product);
    }

    const products = productBranches.flat();

    return { products, userCity };
  } catch (err) {
    throw err;
  }
}

// === Get Produk dari Store di Jakarta (Main Store) ===
export async function GetMainStoresProductsService() {
  try {
    const productBranches = [];

    const mainStores = await prisma.branchs.findMany({
      where: {
        cities: {
          name: {
            contains: "JAKARTA",
            mode: "insensitive"
          },
        },
      },
    });

    for (const store of mainStores) {
      const product = await getProductBranchesByStoreId(store.id);
      productBranches.push(product);
    }

    return productBranches.flat();
  } catch (err) {
    throw err;
  }
}
