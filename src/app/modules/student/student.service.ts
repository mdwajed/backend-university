import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../user/user.model.js";
import { studentSearchableField } from "./student.constant.js";
import { TStudent } from "./student.interface.js";
import { Student } from "./student.model.js";

const getAllStudents = async (query: Record<string, unknown>) => {
  const baseQuery = Student.find()
    .populate("user")
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
  const studentQuery = new QueryBuilder(baseQuery, query)
    .search(studentSearchableField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await studentQuery.countTotal();
  const student = await studentQuery.modelQuery;

  return {
    meta,
    student,
  };
};

const getStudentById = async (id: string) => {
  const result = await Student.findById(id)
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
  return result;
};

const updateStudent = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }
  const student = await Student.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
  });
  return student;
};

const deleteStudent = async (id: string) => {
  const session = await mongoose.startSession();
  let deletedStudent: TStudent | null;
  try {
    await session.withTransaction(async () => {
      deletedStudent = await Student.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true, session }
      );
      if (!deletedStudent) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Student can not be deleted "
        );
      }
      const userId = deletedStudent.user;
      const deletedUser = await User.findByIdAndUpdate(
        userId,
        { isDeleted: true },
        { new: true, session }
      );
      if (!deletedUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User can not be deleted ");
      }
    });

    return deletedStudent!;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const StudentService = {
  getAllStudents,
  getStudentById,
  deleteStudent,
  updateStudent,
};
