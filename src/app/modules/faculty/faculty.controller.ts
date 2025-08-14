import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { FacultyService } from "./faculty.service.js";

const getAllFaculty = catchAsync(async (req, res) => {
  console.log(req.cookies);

  const result = await FacultyService.getAllFaculty(req.query);
  sendResponse(res, {
    success: true,
    message: "Faculties Data Retrieve Successfully",
    meta: result.meta,
    data: result.data,
  });
});
const getFacultyById = catchAsync(async (req, res) => {
  const result = await FacultyService.getFacultyById(req.params.id);
  sendResponse(res, {
    success: true,
    message: "Faculty Data Retrieve Successfully",
    data: result,
  });
});
const updateFaculty = catchAsync(async (req, res) => {
  const result = await FacultyService.updateFaculty(
    req.params.id,
    req.body.faculty
  );
  sendResponse(res, {
    success: true,
    message: "Faculty Data Updated Successfully",
    data: result,
  });
});

const deleteFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await FacultyService.deleteFaculty(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Faculty is deleted succesfully",
    data: result,
  });
});
export const FacultyController = {
  getAllFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
};
