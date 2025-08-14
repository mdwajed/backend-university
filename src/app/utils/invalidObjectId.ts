import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { ApiError } from "./ApiError.js";

const invalidObjectId = (id: string, name = "ID") => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `Invalid ${name}`);
  }
};

export default invalidObjectId;
