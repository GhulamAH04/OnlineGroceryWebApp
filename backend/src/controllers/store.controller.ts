import { Request, Response, NextFunction } from "express";
import { AddNewStoreService, AssignStoreAdminService, DeleteStoreService, getAllStoresService, UpdateStoreService } from "../services/store.service";
import { INewStore } from "../interfaces/store.interface";

export async function getAllStoresController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const stores = await getAllStoresService();

    res.status(200).send({
      message: `get all stores success`,
      data: stores,
    });
  } catch (err) {
    next(err);
  }
}

export async function AddNewStoreController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const newStoreData: INewStore = req.body;

    const newStore = await AddNewStoreService(newStoreData);

    res.status(200).send({
      message: `create new store success`,
      data: newStore,
    });
  } catch (err) {
    next(err);
  }
}

export async function DeleteStoreController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const storeId: number = parseInt(req.params.id);

    const deletedStore = await DeleteStoreService(storeId);

    res.status(200).send({
      message: `delete store success`,
      data: deletedStore,
    });
  } catch (err) {
    next(err);
  }
}

export async function UpdateStoreController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const storeId: number = parseInt(req.params.id);

    const updatedStore = await UpdateStoreService(storeId, req.body);

    res.status(200).send({
      message: `update store success`,
      data: updatedStore,
    });
  } catch (err) {
    next(err);
  }
}

export async function AssignStoreAdminController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const storeId: number = parseInt(req.params.id);
    const { userId } = req.body;

    const updatedStore = await AssignStoreAdminService(storeId, parseInt(userId));

    res.status(200).send({
      message: `assign store admin success`,
      data: updatedStore,
    });
  } catch (err) {
    next(err);
  }
}
