import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/report.service';

export const getSalesReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const { month, year } = req.query;
    const data = await reportService.getSalesReport(user, +month!, +year!);
    res.json({ success: true, message: 'OK', data });
  } catch (err) {
    next(err);
  }
};

export const getStockReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const { month, year } = req.query;
    const data = await reportService.getStockReport(user, +month!, +year!);
    res.json({ success: true, message: 'OK', data });
  } catch (err) {
    next(err);
  }
};
