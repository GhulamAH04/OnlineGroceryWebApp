import axios from "axios";
import prisma from "../lib/prisma";
import { API_KEY } from "../config";

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

// === Ambil Kota dari API Berdasarkan LatLong ===
async function getCity(latitude: number, longitude: number) {
  try {
    const { data } = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C+${longitude}&key=${API_KEY}`
    );
    const city: string = data.results[0].components.city;
    return city;
  } catch (err) {
    throw err;
  }
}

// === Ambil Semua Cabang di Kota Tertentu ===
async function getStoresByCity(city: string) {
  try {
    const branches = await prisma.branchs.findMany({
      where: {
        cities: { name: city },
      },
    });
    return branches;
  } catch (err) {
    throw err;
  }
}

// === Hitung Jarak Store dengan Haversine Formula ===
async function calculateStoreDistances(lat1: number, lon1: number) {
  try {
    const userCity = await getCity(lat1, lon1);
    const stores = await getStoresByCity(userCity);
    const storeDistances: { storeId: number; distance: number }[] = [];

    for (const store of stores) {
      const lat2 = Number(store.latitude);
      const lon2 = Number(store.longitude);

      const R = 6371; // Earth's radius in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      if (distance <= 15) {
        storeDistances.push({ storeId: store.id, distance });
      }
    }

    return storeDistances.sort((a, b) => a.distance - b.distance);
  } catch (err) {
    throw err;
  }
}

// === Get Produk dari Store Terdekat (User Side) ===
export async function GetNearbyProductsService(
  latitude: number,
  longitude: number
) {
  try {
    const productBranches = [];
    const storeDistances = await calculateStoreDistances(latitude, longitude);

    for (const { storeId } of storeDistances) {
      const product = await getProductBranchesByStoreId(storeId);
      productBranches.push(product);
    }

    return productBranches.flat();
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
            contains: "Jakarta",
            mode: "insensitive",
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
