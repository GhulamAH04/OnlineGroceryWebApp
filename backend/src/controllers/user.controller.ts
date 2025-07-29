import { Request, Response, NextFunction } from "express";
import { EditUserByIdService, getAllUsersService, GetMainAddressService, UpdateAvatarService } from "../services/user.service";
import { IUserReqParam } from "../custom";


export async function GetAllUsersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await getAllUsersService();

    res.status(200).send({
      message: `Get all users success`,
      data: users,
    });
  } catch (err) {
    next(err);
  }
}

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

export async function UpdateAvatarController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { file } = req;
    const { email } = req.user as IUserReqParam;

    if (!file) throw new Error("File not found");
    if (!email) throw new Error("Email not found");

    const image = await UpdateAvatarService(file, email);

    res.status(200).send({
      message: `Update profile picture success`,
      data: image
    });
  } catch (err) {
    next(err);
  }
}