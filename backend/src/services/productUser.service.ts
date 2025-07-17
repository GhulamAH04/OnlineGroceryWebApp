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
          name: city,
        },
      },
    });
    return branches;
  } catch (err) {
    throw err;
  }
}

async function calculateStoreDistances(lat1: number, lon1: number) {
  try {
    let storeDistances = [];

    const userCity: string = await getCity(lat1, lon1);
    const stores = await getStoresByCity(userCity);

    for (let i = 0; i < stores.length; i++) {
      const lat2 = stores[i].latitude;
      const lon2 = stores[i].longitude;

      const R = 6371; // Earth's radius in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      if (R * c <= 15)
        storeDistances.push({ storeId: stores[i].id, distance: R * c });
    }
    storeDistances.sort((a, b) => a.distance - b.distance);
    return storeDistances;
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

    const storeDistances = await calculateStoreDistances(latitude, longitude);
    for (let i = 0; i < storeDistances.length; i++) {
      const storeId = storeDistances[i].storeId;
      const product = await getProductBranchesByStoreId(storeId);
      productBranches.push(product);
    }

    const allProducts = productBranches.flat();

    return allProducts;
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
            contains: "Jakarta",
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
