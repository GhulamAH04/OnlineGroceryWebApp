import { INewStore } from "../interfaces/store.interface";
import prisma from "../lib/prisma";

async function AddNewStore(newStoreData: INewStore) {
  try {
    const {
      name,
      phone,
      address,
      provinceId,
      cityId,
      districtId,
      postalCode,
      latitude,
      longitude,
    } = newStoreData;

    const newStore = await prisma.branchs.create({
      data: {
        name,
        phone,
        address,
        provinceId,
        cityId,
        districtId,
        postalCode,
        latitude,
        longitude,
        updatedAt: new Date(),
      },
    });

    return newStore;
  } catch (err) {
    throw err;
  }
}

export async function getAllStoresService() {
  try {
    const stores = await prisma.branchs.findMany();

    return stores;
  } catch (err) {
    throw err;
  }
}

export async function AddNewStoreService(newStoreData: INewStore) {
  try {
    const newStore = await AddNewStore(newStoreData);

    return newStore;
  } catch (err) {
    throw err;
  }
}
