import { StatusCodes } from "http-status-codes";
import config from "../../config/index.js";
import { ApiError } from "../../utils/ApiError.js";
import { AcademicSemester } from "../academicSemester/academicSemester.model.js";
import { TStudent } from "../student/student.interface.js";
import { Student } from "../student/student.model.js";
import { TUser } from "./user.interface.js";
import { User } from "./user.model.js";
import { generateStudentId } from "./user.utils.js";

const createStudent = async (payload: TStudent, password: string) => {
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_password as string);
  userData.role = "student";

  const academicSemester = await AcademicSemester.findById(
    payload.admissionSemester
  );
  if (!academicSemester) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid admission semester");
  }
  userData.id = await generateStudentId(academicSemester);
  const result = await User.create(userData);
  if (Object.keys(result).length) {
    payload.id = result.id;
    payload.user = result._id;
    const newStudent = await Student.create(payload);
    return newStudent;
  }
  return result;
};

export const UserService = {
  createStudent,
};
