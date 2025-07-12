import { Request, Response, NextFunction } from "express";
import { GetAllAddressByUserIdService } from "../services/address.service";

export async function GetAllAddressByUserIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = parseInt(req.params.userId);

    const addresses = await GetAllAddressByUserIdService(userId);

    res.status(200).send({
      message: `Get all user addresses success`,
      data: addresses,
    });
  } catch (err) {
    next(err);
  }
}
