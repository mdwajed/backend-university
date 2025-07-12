import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { UserService } from "./user.service.js";

const createStudent = catchAsync(async (req, res) => {
  const { password, student } = req.body;
  const result = await UserService.createStudent(student, password);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Student Created Successfully",
    data: result,
  });
});

export const UserController = {
  createStudent,
};
