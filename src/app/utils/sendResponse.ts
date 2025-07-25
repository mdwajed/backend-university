import { Response } from "express";
import { StatusCodes } from "http-status-codes";
type TResponse<T> = {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data: T;
  meta?: TMeta;
};
type TMeta = {
  page: number;
  limit: number;
  total: number;
};
const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  return res.status(data.statusCode || StatusCodes.OK).json({
    success: data.success ?? true,
    message: data.message,
    data: data.data,
    ...(data.meta && { meta: data.meta }),
  });
};

export default sendResponse;
