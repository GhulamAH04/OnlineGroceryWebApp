import { Request, Response, NextFunction } from "express";
import { AddNewAddressService, EditAddressByIdService, GetAllAddressByUserIdService } from "../services/address.service";

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

export async function EditAddressByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id);
    const bodyData = req.body;

    const editedAddress = await EditAddressByIdService(id, bodyData);

    res.status(200).send({
      message: `Edit address by ${id} success`,
      data: editedAddress,
    });
  } catch (err) {
    next(err);
  }
}

export async function AddNewAddressController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bodyData = req.body;

    const newAddress = await AddNewAddressService(bodyData);

    res.status(200).send({
      message: `Add new address success`,
      data: newAddress,
    });
  } catch (err) {
    next(err);
  }
}