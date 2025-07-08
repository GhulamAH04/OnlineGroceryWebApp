import { Request, Response, NextFunction } from "express";
import { EditUserByIdService, GetMainAddressService } from "../services/user.service";

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

export async function EditUserByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = parseInt(req.params.id);
    const { username, email } = req.body;
    const editedUser = await EditUserByIdService(userId, username, email);

    res.status(200).send({
      message: `Edit user by user id ${userId} success`,
      data: editedUser,
    });
  } catch (err) {
    next(err);
  }
}