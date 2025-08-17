import { TAdmin } from "../admin/admin.interface.js";

import { TFaculty } from "../faculty/faculty.interface.js";
import { TStudent } from "../student/student.interface.js";
import { TUserRole, TUserStatus } from "./user.constant.js";
export interface TUser {
  id: string;
  email: string;
  password: string;
  needPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: TUserRole;
  status: TUserStatus;
  isDeleted: boolean;
}

export type TCreateStudentReturn = {
  user: TUser;
  student: TStudent;
};

export type TCreateAdminReturn = {
  user: TUser;
  admin: TAdmin;
};
export type TCreateFacultyReturn = {
  user: TUser;
  faculty: TFaculty;
};
