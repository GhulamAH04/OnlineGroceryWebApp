import { Request, Response, NextFunction } from "express";
import { GetMainAddressService } from "../services/user.service";

export async function GetMainAddressController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = parseInt(req.params.userId);

    const address = await GetMainAddressService(userId);

    res.status(200).send({
      message: `Get address by user id success`,
      data: address,
    });
  } catch (err) {
    next(err);
  }
}