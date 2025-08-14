import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { CourseService } from "./course.service.js";

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseService.createCourse(req.body);
  sendResponse(res, {
    success: true,
    message: "Course Data Created successfully",
    data: result,
  });
});

const getAllCourse = catchAsync(async (req, res) => {
  const result = await CourseService.getAllCourses(req.query);
  sendResponse(res, {
    success: true,
    message: "Courses Data Retrieve successfully",
    data: result,
  });
});
const getSingleCourse = catchAsync(async (req, res) => {
  const result = await CourseService.getSingleCourse(req.params.id);
  sendResponse(res, {
    success: true,
    message: "Course Data Retrieve successfully",
    data: result,
  });
});
const updateCourse = catchAsync(async (req, res) => {
  const academicSemesters = await CourseService.updateCourse(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    message: "Course Data Updated successfully",
    data: academicSemesters,
  });
});
const deleteCourse = catchAsync(async (req, res) => {
  const academicSemesters = await CourseService.deleteCourse(req.params.id);
  sendResponse(res, {
    success: true,
    message: "Course Data Updated successfully in course",
    data: academicSemesters,
  });
});
const assignCourseFaculty = catchAsync(async (req, res) => {
  const faculties = await CourseService.assignCourseFaculty(
    req.params.courseId,
    req.body.faculties
  );
  sendResponse(res, {
    success: true,
    message: "Faculty assign successfully in course",
    data: faculties,
  });
});
const removeCourseFaculty = catchAsync(async (req, res) => {
  const faculties = await CourseService.removeCourseFaculty(
    req.params.courseId,
    req.body.faculties
  );
  sendResponse(res, {
    success: true,
    message: "Faculty remove successfully",
    data: faculties,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  deleteCourse,
  updateCourse,
  assignCourseFaculty,
  removeCourseFaculty,
};
