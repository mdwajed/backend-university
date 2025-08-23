import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import config from "../../config/index.js";
import { ApiError } from "../../utils/ApiError.js";
import { AcademicSemester } from "../academicSemester/academicSemester.model.js";
import { TAdmin } from "../admin/admin.interface.js";
import { Admin } from "../admin/admin.model.js";
import { generateAdminId } from "../admin/admin.utils.js";
import { TStudent } from "../student/student.interface.js";
import { Student } from "../student/student.model.js";

import { JwtPayload } from "jsonwebtoken";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model.js";

import { uploadImgToCloudinary } from "../../utils/uploadImgToCloudinary.js";
import { TFaculty } from "../faculty/faculty.interface.js";
import { Faculty } from "../faculty/faculty.model.js";
import { generateFacultyId } from "../faculty/faculty.utils.js";
import { generateStudentId } from "../student/student.utils.js";
import {
  TCreateAdminReturn,
  TCreateFacultyReturn,
  TCreateStudentReturn,
  TUser,
} from "./user.interface.js";
import { User } from "./user.model.js";

const createStudent = async (
  file: any,
  payload: TStudent,
  password: string
): Promise<TCreateStudentReturn> => {
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_password as string);
  userData.role = "student";
  userData.email = payload.email;

  const semester = await AcademicSemester.findById(payload.admissionSemester);
  if (!semester) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid admission semester");
  }

  const session = await mongoose.startSession();
  let result: TCreateStudentReturn;
  try {
    await session.withTransaction(async () => {
      // generate student ia
      userData.id = await generateStudentId(semester);
      // generate imgName,path
      const imgName = `${userData.id}${payload?.name.firstName}`;
      const path = file?.path;
      // send image to cloudinary
      const { secure_url } = await uploadImgToCloudinary(imgName, path);
      // create new user transaction-1
      const newUser = await User.create([userData], { session });
      if (!newUser.length) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Create User");
      }
      payload.id = newUser[0].id;
      payload.user = newUser[0]._id;
      payload.profileImage = secure_url;
      // create new student transaction-2
      const newStudent = await Student.create([payload], { session });
      if (!newStudent.length) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Create Student");
      }
      result = { user: newUser[0], student: newStudent[0] };
    });
    return result!;
  } catch (error) {
    console.error("Create student failed:", error);
    throw error;
  } finally {
    await session.endSession();
  }
};

const createAdmin = async (
  password: string,
  payload: TAdmin
): Promise<TCreateAdminReturn> => {
  const userData: Partial<TUser> = {};
  userData.password = password || config.default_password;
  userData.role = "admin";
  userData.email = payload.email;

  const session = await mongoose.startSession();
  let result: TCreateAdminReturn;
  try {
    await session.withTransaction(async () => {
      userData.id = await generateAdminId();

      const user = await User.create([userData], { session });
      if (!user.length) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Create User");
      }
      payload.id = user[0].id;
      payload.user = user[0]._id;

      const admin = await Admin.create([payload], { session });
      if (!admin.length) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Create Admin");
      }
      result = { user: user[0], admin: admin[0] };
    });
    return result!;
  } catch (error) {
    console.error("Create admin failed:", error);
    throw error;
  } finally {
    await session.endSession();
  }
};

const createFaculty = async (
  file: any,
  password: string,
  payload: TFaculty
): Promise<TCreateFacultyReturn> => {
  const userData: Partial<TUser> = {};

  userData.password = password || config.default_password;
  userData.role = "faculty";
  userData.email = payload.email;
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment
  );
  if (!academicDepartment) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Academic Department is not Found"
    );
  }
  const session = await mongoose.startSession();

  let result: TCreateFacultyReturn;
  try {
    await session.withTransaction(async () => {
      // generate student ia
      userData.id = await generateFacultyId();
      // generate imgName,path
      const imgName = `${userData.id}${payload?.name.firstName}`;
      const path = file?.path;
      // send image to cloudinary
      const { secure_url } = await uploadImgToCloudinary(imgName, path);
      const createUser = await User.create([userData], { session });
      if (!createUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create user");
      }
      payload.id = createUser[0].id;
      payload.user = createUser[0]._id;
      payload.profileImage = secure_url;
      // create new student transaction-2
      const createFaculty = await Faculty.create([payload], { session });
      if (!createFaculty) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create faculty");
      }

      result = {
        user: createUser[0],
        faculty: createFaculty[0],
      };
    });
    return result!;
  } catch (error) {
    console.error("Create faculty failed:", error);
    throw error;
  } finally {
    await session.endSession();
  }
};

const getMe = async (user: JwtPayload) => {
  const { userId, role } = user;
  let result = null;
  if (role === "student") {
    result = await Student.findOne({ id: userId }).populate("user");
    console.log(result);
  }
  if (role === "faculty") {
    result = await Faculty.findOne({ id: userId }).populate("user");
  }
  if (role === "admin") {
    result = await Admin.findOne({ id: userId }).populate("user");
  }
  return result;
};
const changeUserStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};
export const UserService = {
  createStudent,
  createAdmin,
  createFaculty,
  getMe,
  changeUserStatus,
};
