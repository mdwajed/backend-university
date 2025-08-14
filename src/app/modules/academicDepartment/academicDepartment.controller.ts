import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AcademicDepartmentService } from "./academicDepartment.service.js";

const createAcademicDepartment = catchAsync(async (req, res) => {
  const academicFaculty =
    await AcademicDepartmentService.createAcademicDepartment(req.body);
  sendResponse(res, {
    success: true,
    message: "Academic Department Created successfully",
    data: academicFaculty,
  });
});

const getAllAcademicDepartment = catchAsync(async (_req, res) => {
  const result = await AcademicDepartmentService.getAllAcademicDepartment();
  sendResponse(res, {
    success: true,
    message: "Academic Departments Data Retrieve successfully",
    data: result,
  });
});
const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const result = await AcademicDepartmentService.getSingleAcademicDepartment(
    req.params.departmentId
  );
  sendResponse(res, {
    success: true,
    message: "Academic Department Data Retrieve successfully",
    data: result,
  });
});
const updateAcademicDepartment = catchAsync(async (req, res) => {
  const academicSemesters =
    await AcademicDepartmentService.updateAcademicDepartment(
      req.params.departmentId,
      req.body
    );
  sendResponse(res, {
    success: true,
    message: "Academic Department Data Updated successfully",
    data: academicSemesters,
  });
});

export const AcademicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
};
