import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { SemesterRegistrationService } from "./semesterRegistration.service.js";

const createSemesterRegistration = catchAsync(async (req, res) => {
  const result = await SemesterRegistrationService.createSemesterRegistration(
    req.body
  );
  sendResponse(res, {
    success: true,
    message: "Semester Registration Created successfully",
    data: result,
  });
});

const getAllSemesterRegistration = catchAsync(async (req, res) => {
  const result = await SemesterRegistrationService.getAllSemesterRegistration(
    req.query
  );
  sendResponse(res, {
    success: true,
    message: "Semester Registrations Data Retrieve successfully",
    meta: result.meta,
    data: result.data,
  });
});
const getSingleSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationService.getSingleSemesterRegistration(
      req.params.id
    );
  sendResponse(res, {
    success: true,
    message: "Semester Registration Data Retrieve successfully",
    data: result,
  });
});
const updateSemesterRegistration = catchAsync(async (req, res) => {
  const result = await SemesterRegistrationService.updateSemesterRegistration(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    message: "Semester Registration Data Updated successfully",
    data: result,
  });
});
const deleteSemesterRegistration = catchAsync(async (req, res) => {
  const registeredSemesters =
    await SemesterRegistrationService.deleteSemesterRegistration(req.params.id);
  sendResponse(res, {
    success: true,
    message: "Semester Registration data deleted successfully ",
    data: registeredSemesters,
  });
});
// const assignCourseFaculty = catchAsync(async (req, res) => {
//   const faculties = await CourseService.assignCourseFaculty(
//     req.params.courseId,
//     req.body.faculties
//   );
//   sendResponse(res, {
//     success: true,
//     message: "Faculty assign successfully in course",
//     data: faculties,
//   });
// });
// const removeCourseFaculty = catchAsync(async (req, res) => {
//   const faculties = await CourseService.removeCourseFaculty(
//     req.params.courseId,
//     req.body.faculties
//   );
//   sendResponse(res, {
//     success: true,
//     message: "Faculty remove successfully",
//     data: faculties,
//   });
// });

export const SemesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  deleteSemesterRegistration,
  updateSemesterRegistration,
};
