// OnlineGroceryWebApp/backend/src/services/productUser.service.ts
import axios from "axios";
import prisma from "../lib/prisma";
import { API_KEY } from "../config";

async function getProductBranchesByStoreId(storeId: number) {
  try {
    const productBranches = await prisma.product_branchs.findMany({
      where: {
        branchs: {
          id: storeId,
        },
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

async function getCity(latitude: number, longitude: number) {
  //Make API Call
  const { data } = await axios.get(
    `https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C+${longitude}&key=${API_KEY}`
  );
  try {
    const city: string = data.results[0].components.city;
    return city;
  } catch (err) {
    throw err;
  }
}

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
  latitude: number,
  longitude: number
) {
  try {
    let productBranches = [];

    const userCity = await getCity(latitude, longitude);
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

export async function GetMainStoresProductsService() {
  try {
    let productBranches = [];

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

    for (let i = 0; i < mainStores.length; i++) {
      const storeId = mainStores[i].id;
      const product = await getProductBranchesByStoreId(storeId);
      productBranches.push(product);
    }

    const allProducts = productBranches.flat();

    return allProducts;
  } catch (err) {
    throw err;
  }
}
