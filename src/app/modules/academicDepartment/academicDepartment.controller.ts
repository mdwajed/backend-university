import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AcademicFacultyService } from "./academicFaculty.service.js";

const createAcademicFaculty = catchAsync(async (req, res) => {
  const academicFaculty = await AcademicFacultyService.createAcademicFaculty(
    req.body
  );
  sendResponse(res, {
    success: true,
    message: "Academic Faculty Created successfully",
    data: academicFaculty,
  });
});

const getAllAcademicFaculty = catchAsync(async (_req, res) => {
  const result = await AcademicFacultyService.getAllAcademicFaculty();
  sendResponse(res, {
    success: true,
    message: "Academic Faculty Data Retrieve successfully",
    data: result,
  });
});
const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyService.getSingleAcademicFaculty(
    req.params.facultyId
  );
  sendResponse(res, {
    success: true,
    message: "Academic Faculty Data Retrieve successfully",
    data: result,
  });
});
const updateAcademicFaculty = catchAsync(async (req, res) => {
  const academicSemesters = await AcademicFacultyService.updateAcademicFaculty(
    req.params.facultyId,
    req.body
  );
  sendResponse(res, {
    success: true,
    message: "Academic Faculty Data Updated successfully",
    data: academicSemesters,
  });
});

export const AcademicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculty,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
};
