import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { EnrolledCourseService } from "./enroll.course.service.js";

const createEnrolledCourse = catchAsync(async (req, res) => {
  const result = await EnrolledCourseService.createEnrolledCourse(
    req.user.userId,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Enrolled Course Created Successfully",
    data: result,
  });
});

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const result = await EnrolledCourseService.updateEnrolledCourseMarks(
    req.user.userId,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Enrolled Course update successfully",
    data: result,
  });
});

export const EnrolledCourseController = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
};
