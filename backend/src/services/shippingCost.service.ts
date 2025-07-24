import axios from "axios";
import { RAJAONGKIR_API_KEY, RAJAONGKIR_BASE_URL } from "../config";

async function CalculateShippingCost(
  originId: string,
  destinationId: string,
  weight: number
) {
  try {
    // const mockData = [
    //   { id: 1, name: "jnt", cost: 10000, etd: "5 days" },
    //   { id: 2, name: "jne", cost: 15000, etd: "5 days" },
    // ];

    const data = {
      origin: originId,
      destination: destinationId,
      weight,
      courier: "jne:jnt:pos",
      price: "lowest",
    };

    const config = {
      headers: {
        accept: "application/json",
        key: RAJAONGKIR_API_KEY,
        "content-type": "application/x-www-form-urlencoded",
      },
    };

    const response = await axios.post(
      `${RAJAONGKIR_BASE_URL}/calculate/district/domestic-cost`,
      data, config
    );

    return response.data.data;
    // return mockData;
  } catch (err) {
    throw err;
  }
}

export async function CalculateShippingCostService(
  originId: string,
  destinationId: string,
  weight: number
) {
  try {
    const response = await CalculateShippingCost(
      originId,
      destinationId,
      weight
    );

    return response;
  } catch (err) {
    throw err;
  }
}
