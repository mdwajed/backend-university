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
const createAdmin = catchAsync(async (req, res) => {
  const { password, admin } = req.body;
  const result = await UserService.createAdmin(password, admin);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Admin Created Successfully",
    data: result,
  });
});
const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty } = req.body;
  const result = await UserService.createFaculty(password, faculty);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Faculty Created Successfully",
    data: result,
  });
});

export const UserController = {
  createStudent,
  createAdmin,
  createFaculty,
};
