import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AcademicSemesterService } from "./academicSemester.service.js";

const createAcademicSemester = catchAsync(async (req, res) => {
  const academicSemester = await AcademicSemesterService.createAcademicSemester(
    req.body
  );
  sendResponse(res, {
    success: true,
    message: "Academic Semester Created successfully",
    data: academicSemester,
  });
});
const getAllAcademicSemesters = catchAsync(async (_req, res) => {
  const academicSemesters =
    await AcademicSemesterService.getAllAcademicSemesters();
  sendResponse(res, {
    success: true,
    message: "Academic Semesters Data Retrieve successfully",
    data: academicSemesters,
  });
});
const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const academicSemesters =
    await AcademicSemesterService.getSingleAcademicSemester(
      req.params.semesterId
    );
  sendResponse(res, {
    success: true,
    message: "Academic Semester Data Retrieve successfully",
    data: academicSemesters,
  });
});
const updateAcademicSemester = catchAsync(async (req, res) => {
  const academicSemesters =
    await AcademicSemesterService.updateAcademicSemester(
      req.params.semesterId,
      req.body
    );
  sendResponse(res, {
    success: true,
    message: "Academic Semester Data Updated successfully",
    data: academicSemesters,
  });
});
export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemesters,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
