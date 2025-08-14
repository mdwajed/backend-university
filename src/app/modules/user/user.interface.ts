import { TAdmin } from "../admin/admin.interface.js";
import { TUserRole } from "../auth/auth.const.js";
import { TFaculty } from "../faculty/faculty.interface.js";
import { TStudent } from "../student/student.interface.js";

export interface TUser {
  id: string;
  password: string;
  needPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: TUserRole;
  status: "in_progress" | "blocked";
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
