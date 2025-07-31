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

async function UpdateStore(storeId: number, updatedData: INewStore) {
  try {
    const existingStore = await prisma.branchs.findUnique({
      where: { id: storeId },
    });

    if (!existingStore) {
      throw new Error("Store not found");
    }

    const updatedStore = await prisma.branchs.update({
      where: { id: storeId },
      data: {
        name: updatedData.name || existingStore.name,
        phone: updatedData.phone || existingStore.phone,
        address: updatedData.address || existingStore.address,
        provinceId: updatedData.provinceId || existingStore.provinceId,
        cityId: updatedData.cityId || existingStore.cityId,
        districtId: updatedData.districtId || existingStore.districtId,
        postalCode: updatedData.postalCode || existingStore.postalCode,
        latitude: updatedData.latitude || existingStore.latitude,
        longitude: updatedData.longitude || existingStore.longitude,
        updatedAt: new Date(),
      },
    });

    return updatedStore;
  } catch (err) {
    throw err;
  }
}

async function AssignStoreAdmin(storeId: number, userId: number) {
  try {
    const updatedStore = await prisma.branchs.update({
      where: { id: storeId },
      data: {
        userId,
        updatedAt: new Date(),
      },
    });

    return updatedStore;
  } catch (err) {
    throw err;
  }
}

export async function getAllBranchesForDropdownService() {
  return prisma.branchs.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getAllStoresService() {
  try {
    const stores = await prisma.branchs.findMany({
      include: {
        provinces: true,
        cities: true,
        districts: true,
      },
    });

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

export async function UpdateStoreService(storeId: number, updatedData: INewStore) {
  try {
    const updatedStore = await UpdateStore(storeId, updatedData);

    return updatedStore;
  } catch (err) {
    throw err;
  }
}

export async function AssignStoreAdminService(
  storeId: number,
  userId: number
) {
  try {
    const updatedStore = await AssignStoreAdmin(storeId, userId);

    return updatedStore;
  } catch (err) {
    throw err;
  }
}

export async function DeleteStoreService(storeId: number) {
  try {
    const deletedStore = await prisma.branchs.delete({
      where: { id: storeId },
    });

    return deletedStore;
  } catch (err) {
    throw err;
  }
}
