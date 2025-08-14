import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { OfferedCourseService } from "./offerredCourse.service.js";

const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseService.createOfferedCourse(req.body);
  sendResponse(res, {
    success: true,
    message: "Offered Course Created successfully",
    data: result,
  });
});

const getAllOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseService.getAllOfferedCourse(req.query);
  sendResponse(res, {
    success: true,
    message: "Offered Courses Data Retrieve successfully",
    meta: result.meta,
    data: result.data,
  });
});
const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseService.getSingleOfferedCourse(
    req.params.id
  );
  sendResponse(res, {
    success: true,
    message: "Offered Course Data Retrieve successfully",
    data: result,
  });
});
const updateOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseService.updateOfferedCourse(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    message: "Offered Course Data Updated successfully",
    data: result,
  });
});
const deleteOfferedCourse = catchAsync(async (req, res) => {
  const academicSemesters = await OfferedCourseService.deleteOfferedCourse(
    req.params.id
  );
  sendResponse(res, {
    success: true,
    message: "Offered Course Data deleted successfully ",
    data: academicSemesters,
  });
});

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourse,
  getSingleOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
};
