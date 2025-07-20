import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { StudentService } from "./student.service.js";

const getAllStudents = catchAsync(async (_req, res) => {
  const result = await StudentService.getAllStudents();
  sendResponse(res, {
    success: true,
    message: "Students Retrieve Successfully",
    data: result,
  });
});
const getStudentById = catchAsync(async (req, res) => {
  const result = await StudentService.getStudentById(req.params.studentId);
  sendResponse(res, {
    success: true,
    message: "Student Retrieve Successfully",
    data: result,
  });
});
const updateStudent = catchAsync(async (req, res) => {
  const student = await StudentService.updateStudent(
    req.params.studentId,
    req.body.student
  );
  sendResponse(res, {
    success: true,
    message: "Student Data Updated Successfully",
    data: student,
  });
});
const deleteStudent = catchAsync(async (req, res) => {
  const result = await StudentService.deleteStudent(req.params.studentId);
  sendResponse(res, {
    success: true,
    message: "Student Data Delete Successfully",
    data: result,
  });
});
export const StudentController = {
  getAllStudents,
  getStudentById,
  deleteStudent,
  updateStudent,
};
