import { Request, Response, NextFunction } from "express";
import { CalculateShippingCostService } from "../services/shippingCost.service";
import { IShippingAddress } from "../interfaces/address.interface";
import { getDistrictId } from "../services/district.service";

export async function CalculateShippingCostController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
     const origin: IShippingAddress = req.body.origin;
     const destination: IShippingAddress = req.body.destination;
     const weight: number = req.body.weight;

     const originId = String(
       await getDistrictId(origin.province, origin.city, origin.district)
     );
     const destinationId = String(
       await getDistrictId(
         destination.province,
         destination.city,
         destination.district
       )
     );

    const shippingCost = await CalculateShippingCostService(originId, destinationId, weight);

    res.status(200).send({
      message: `Calculate shipping cost success`,
      data: shippingCost,
    });
  } catch (err) {
    next(err);
  }
}
