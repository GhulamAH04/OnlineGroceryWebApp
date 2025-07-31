import axios from "axios";
import { redis } from "../lib/redis";
import {
  API_KEY,
  JWT_SECRET,
  RAJAONGKIR_API_KEY,
  RAJAONGKIR_BASE_URL,
} from "../config";
import { getProvinceId } from "./province.service";
import { sign } from "jsonwebtoken";

export async function fetchCitiesByProvince(province: string) {
  try {
    const provinceId = await getProvinceId(province);

    const cachedValue = await redis.get(`${province.toLowerCase()}_cities`);

    if (cachedValue) {
      return JSON.parse(cachedValue);
    }

    const response = await axios.get(
      `${RAJAONGKIR_BASE_URL}/destination/city/${provinceId}`,
      {
        headers: { accept: "application/json", key: RAJAONGKIR_API_KEY },
      }
    );

    const cities = response.data.data;

    redis.set(`${province.toLowerCase()}_cities`, JSON.stringify(cities));

    return cities;
  } catch (err) {
    throw err;
  }
}

export async function getCityId(province: string, city: string) {
  try {
    const cities = await fetchCitiesByProvince(province);

    const matchingCity = cities.find(
      (c: { name: string }) => c.name.toLowerCase() === city.toLowerCase()
    );

    return matchingCity ? matchingCity.id : null;
  } catch (err) {
    throw err;
  }
}

// === Ambil Kota dari API Berdasarkan LatLong ===
export async function getCityFromCoordinates(
  latitude: number,
  longitude: number
) {
  try {
    const { data } = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C+${longitude}&key=${API_KEY}`
    );
    const city: string = data.results[0].components.city;

    const payload = {
      city,
    };

    const token = sign(payload, String(JWT_SECRET), { expiresIn: "1h" });

    return { city, token };
  } catch (err) {
    throw err;
  }
}

export async function GetCitiesByProvinceService(province: string) {
  try {
    const cities = await fetchCitiesByProvince(province);

    return cities;
  } catch (err) {
    throw err;
  }
}

export async function GetCityFromCoordinatesService(
  latitude: number,
  longitude: number
) {
  try {
    const city = await getCityFromCoordinates(latitude, longitude);

    return city;
  } catch (err) {
    throw err;
  }
}
