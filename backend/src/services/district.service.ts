import axios from "axios";
import { redis } from "../lib/redis";
import { RAJAONGKIR_API_KEY, RAJAONGKIR_BASE_URL } from "../config";
import { getCityId } from "./city.service";
import prisma from "../lib/prisma";

export async function fetchDistrictsByCity(province: string, city: string) {
  try {
    const cityId = await getCityId(province, city);

    const cachedValue = await redis.get(`${city.toLowerCase()}_districts`);

    if (cachedValue) {
      const districtsData = JSON.parse(cachedValue);
      const districts = await prisma.districts.findMany({
        where: {
          cityId,
          },
        },
      );

      if (districts.length === 0) {
        for (let i = 0; i < districtsData.length; i++) {
          // 1. Call your service to get the districtData
          const data = {
            id: districtsData[i].id,
            name: districtsData[i].name,
            cityId,
          };
          // 2. Use the data to populate the database
          const result = await prisma.districts.createMany({
            data,
            skipDuplicates: true, // Useful for re-running the seed
          });
        }
      }
      return districtsData;
    }

    const response = await axios.get(
      `${RAJAONGKIR_BASE_URL}/destination/district/${cityId}`,
      {
        headers: { accept: "application/json", key: RAJAONGKIR_API_KEY },
      }
    );

    const districts = response.data.data;

    redis.set(`${city.toLowerCase()}_districts`, JSON.stringify(districts));

    for (let i = 0; i < districts.length; i++) {
      // 1. Call your service to get the data
      const data = {
        id: districts[i].id,
        name: districts[i].name,
        cityId,
      };
      console.log("running");
      // 2. Use the data to populate the database
      const result = await prisma.districts.createMany({
        data,
        skipDuplicates: true, // Useful for re-running the seed
      });
    }

    return districts;
  } catch (err) {
    throw err;
  }
}

export async function getDistrictId(
  province: string,
  city: string,
  district: string
) {
  try {
    const districts = await fetchDistrictsByCity(province, city);

    const matchingDistrict = districts.find(
      (d: { name: string }) => d.name.toLowerCase() === district.toLowerCase()
    );

    return matchingDistrict ? matchingDistrict.id : null;
  } catch (err) {
    throw err;
  }
}

export async function GetDistrictsByCityService(
  province: string,
  city: string
) {
  try {
    const districts = await fetchDistrictsByCity(province, city);

    return districts;
  } catch (err) {
    throw err;
  }
}
